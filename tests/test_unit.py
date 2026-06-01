"""Unit tests for the app's rules logic.

These import the actual TypeScript modules from the Vite dev server and call the
pure functions directly, asserting exact computed values.
"""
from __future__ import annotations

import json

import pytest

from helpers import eval_module


def js(value) -> str:
    """Render a Python value as a valid JS literal (None -> null, etc.)."""
    return json.dumps(value)


# ---- ability math ----

@pytest.mark.parametrize("score,expected", [(1, -5), (8, -1), (10, 0), (11, 0), (16, 3), (20, 5)])
def test_ability_modifier(page, score, expected):
    got = eval_module(page, f"const m = await import('/src/data/abilities.ts'); return m.abilityModifier({score})")
    assert got == expected


def test_format_modifier(page):
    got = eval_module(page, "const m = await import('/src/data/abilities.ts'); return [m.formatModifier(3), m.formatModifier(0), m.formatModifier(-2)]")
    assert got == ["+3", "+0", "-2"]


# ---- armor class ----

def _ac(page, scores, class_id, armor_id, shield):
    return eval_module(page, f"""
      const m = await import('/src/data/armor.ts')
      return m.computeAC({js(scores)}, {js(class_id)}, {js(armor_id)}, {js(shield)})
    """)


def test_ac_heavy_armor_ignores_dex(page):
    r = _ac(page, {"str": 16, "dex": 14, "con": 14, "int": 10, "wis": 10, "cha": 10}, "fighter", "chain-mail", False)
    assert r["ac"] == 16  # chain mail flat 16, no DEX

def test_ac_heavy_plus_shield(page):
    r = _ac(page, {"str": 16, "dex": 14, "con": 14, "int": 10, "wis": 10, "cha": 10}, "fighter", "chain-mail", True)
    assert r["ac"] == 18
    assert "= 18" in r["breakdown"]

def test_ac_light_armor_adds_full_dex(page):
    r = _ac(page, {"str": 10, "dex": 14, "con": 10, "int": 10, "wis": 10, "cha": 10}, "rogue", "leather", False)
    assert r["ac"] == 13  # leather 11 + DEX +2

def test_ac_medium_armor_caps_dex_at_2(page):
    r = _ac(page, {"str": 10, "dex": 18, "con": 10, "int": 10, "wis": 10, "cha": 10}, "ranger", "hide", False)
    assert r["ac"] == 14  # hide 12 + min(DEX +4, 2)

def test_ac_unarmored_default(page):
    r = _ac(page, {"str": 10, "dex": 16, "con": 10, "int": 10, "wis": 10, "cha": 10}, "wizard", None, False)
    assert r["ac"] == 13  # 10 + DEX +3

def test_ac_barbarian_unarmored_defense(page):
    r = _ac(page, {"str": 14, "dex": 12, "con": 16, "int": 10, "wis": 10, "cha": 10}, "barbarian", None, False)
    assert r["ac"] == 16  # 13 + CON +3 (no DEX)

def test_ac_monk_unarmored_defense(page):
    r = _ac(page, {"str": 10, "dex": 16, "con": 10, "int": 10, "wis": 14, "cha": 10}, "monk", None, False)
    assert r["ac"] == 15  # 10 + DEX +3 + WIS +2


# ---- weapon attacks ----

def _attack(page, class_id, scores, weapon_id):
    return eval_module(page, f"""
      const c = await import('/src/data/combat.ts')
      const w = await import('/src/data/weapons.ts')
      const character = {{ classId: {js(class_id)}, abilityScores: {js(scores)} }}
      return c.weaponAttack(character, w.getWeapon({js(weapon_id)}))
    """)

SCORES = {"str": 16, "dex": 14, "con": 14, "int": 10, "wis": 10, "cha": 10}

def test_melee_attack_uses_str_and_proficiency(page):
    a = _attack(page, "fighter", SCORES, "longsword")
    assert a["ability"] == "str"
    assert a["attackBonus"] == 5  # STR +3 + PB +2
    assert a["proficient"] is True
    assert "1d8+3" in a["damage"] and "1d10+3 two-handed" in a["damage"]

def test_ranged_attack_uses_dex(page):
    a = _attack(page, "fighter", SCORES, "longbow")
    assert a["ability"] == "dex"
    assert a["attackBonus"] == 4  # DEX +2 + PB +2

def test_finesse_uses_higher_ability(page):
    a = _attack(page, "rogue", SCORES, "rapier")  # finesse: max(STR+3, DEX+2) = STR
    assert a["attackBonus"] == 5

def test_non_proficient_weapon_drops_pb(page):
    # Wizard isn't proficient with a greatsword -> no proficiency bonus
    a = _attack(page, "wizard", SCORES, "greatsword")
    assert a["proficient"] is False
    assert a["attackBonus"] == 3  # STR +3 only


# ---- text parsers ----

def test_parse_skill_grant_choose_two(page):
    g = eval_module(page, "const m = await import('/src/data/skills.ts'); return m.parseSkillGrant('Choose two from Acrobatics, Athletics, or Stealth')")
    assert g["choose"] == 2
    assert set(g["options"]) == {"acrobatics", "athletics", "stealth"}

def test_parse_skill_grant_fixed_plus_choice(page):
    g = eval_module(page, "const m = await import('/src/data/skills.ts'); return m.parseSkillGrant('Survival and choose one from Athletics, Animal Handling')")
    assert g["fixed"] == ["survival"] and g["choose"] == 1

def test_parse_equipment_options(page):
    o = eval_module(page, "const m = await import('/src/data/shop.ts'); return m.parseEquipmentOptions('(a) chain mail or (b) leather armor, longbow')")
    assert o == ["chain mail", "leather armor, longbow"]

def test_parse_weapon_slots(page):
    s = eval_module(page, "const m = await import('/src/data/shop.ts'); return m.parseWeaponSlots('two martial weapons')")
    assert len(s) == 2 and all(x["category"] == "martial" for x in s)


# ---- multiclass prerequisites ----

def test_multiclass_eligible(page):
    ok = eval_module(page, """
      const m = await import('/src/data/multiclass.ts')
      const scores = {str:16,dex:14,con:14,int:10,wis:10,cha:10}
      return m.canMulticlass(scores, 'fighter', 'rogue')  // DEX 14 >= 13
    """)
    assert ok is True

def test_multiclass_blocked_by_and_requirement(page):
    ok = eval_module(page, """
      const m = await import('/src/data/multiclass.ts')
      const scores = {str:16,dex:14,con:14,int:10,wis:10,cha:10}  // WIS 10
      return m.canMulticlass(scores, 'fighter', 'monk')  // needs DEX 13 AND WIS 13
    """)
    assert ok is False


# ---- spell lookups ----

def test_spell_source_counts(page):
    counts = eval_module(page, """
      const m = await import('/src/data/spells.ts')
      return { cantrips: m.spellsFor('Arcane', 0).length, first: m.spellsFor('Arcane', 1).length }
    """)
    assert counts["cantrips"] == 14
    assert counts["first"] == 26


# ---- rituals (Ritualist talent) ----

def test_ritual_catalog_size(page):
    n = eval_module(page, "const m = await import('/src/data/rituals.ts'); return m.RITUALS.length")
    assert n == 69

def test_rituals_for_arcane_first_circle(page):
    # at 1st level a full caster unlocks 1st circle -> one 1st-circle ritual
    names = eval_module(page, """
      const m = await import('/src/data/rituals.ts')
      return m.ritualsFor('Arcane', 1).map((r) => r.name)
    """)
    # all returned rituals are 1st circle and Arcane-sourced
    assert "Identify" in names
    assert "Find Familiar" not in names  # Find Familiar's ritual is Wyrd-only
    assert names == sorted(names)  # ritualsFor sorts (circle, then name) — all circle 1 here

def test_get_ritual_sources(page):
    src = eval_module(page, "const m = await import('/src/data/rituals.ts'); return m.getRitual('Locate').sources")
    assert set(src) == {"Arcane", "Divine", "Primordial", "Wyrd"}


# ---- data integrity ----

def test_catalog_sizes(page):
    sizes = eval_module(page, """
      const [cls, lin, her, bg, tal, sk, sp, wpn, arm, mi] = await Promise.all([
        import('/src/data/classes.ts'), import('/src/data/lineages.ts'),
        import('/src/data/heritages.ts'), import('/src/data/backgrounds.ts'),
        import('/src/data/talents.ts'), import('/src/data/skills.ts'),
        import('/src/data/spells.ts'), import('/src/data/weapons.ts'),
        import('/src/data/armor.ts'), import('/src/data/magicItems.ts'),
      ])
      return {
        classes: cls.CLASSES.length, lineages: lin.LINEAGES.length,
        heritages: her.HERITAGES.length, backgrounds: bg.BACKGROUNDS.length,
        talents: tal.TALENTS.length, skills: sk.SKILLS.length,
        spells: sp.SPELLS.length, weapons: wpn.WEAPONS.length,
        armors: arm.ARMORS.length, magicItems: mi.MAGIC_ITEMS.length,
      }
    """)
    assert sizes == {
        "classes": 13, "lineages": 8, "heritages": 14, "backgrounds": 10,
        "talents": 45, "skills": 18, "spells": 324, "weapons": 36,
        "armors": 13, "magicItems": 214,
    }
