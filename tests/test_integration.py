"""Integration tests: drive the real UI and assert end-to-end behavior."""
from __future__ import annotations

from helpers import (
    FIGHTER_CHARACTER,
    get_character,
    goto_step,
    set_character,
    stat_value,
    step_count,
)


def _click_card(page, text: str) -> None:
    page.evaluate(
        "(t) => [...document.querySelectorAll('.card-grid button')].find(b => b.textContent.includes(t)).click()",
        text,
    )
    page.wait_for_timeout(150)


def test_app_loads_with_ten_steps(page):
    assert step_count(page) == 10
    labels = page.eval_on_selector_all(".step-nav-label", "els => els.map(e => e.textContent)")
    assert labels == [
        "Concept", "Class", "Ability Scores", "Lineage", "Heritage",
        "Background", "Spells", "Equipment", "Review", "Combat",
    ]


def test_no_console_errors_on_load(page):
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.reload(wait_until="load")
    page.wait_for_timeout(300)
    assert errors == []


def test_choosing_class_updates_summary(page):
    goto_step(page, 2)
    _click_card(page, "Wizard")
    summary = page.inner_text(".summary")
    assert "Wizard" in summary


def test_full_character_renders_combat_sheet(page):
    set_character(page, FIGHTER_CHARACTER)
    goto_step(page, 10)  # Combat
    assert stat_value(page, "Armor Class") == "18"   # chain mail 16 + shield 2
    assert stat_value(page, "Hit Points") == "12"     # d10 max 10 + CON +2
    attacks = page.eval_on_selector_all(".attacks-table tbody th", "els => els.map(e => e.textContent)")
    joined = " ".join(attacks)
    assert "Unarmed Strike" in joined
    assert "Longsword" in joined and "Longbow" in joined


def test_character_persists_across_reload(page):
    set_character(page, {"name": "Persisted Hero", "classId": "bard"})
    page.reload(wait_until="load")
    data = get_character(page)
    assert data["name"] == "Persisted Hero"
    assert data["classId"] == "bard"


def test_corrupt_save_is_sanitized(page):
    # Malformed types must not crash the app.
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.evaluate(
        "() => localStorage.setItem('tov-chargen:character', JSON.stringify("
        "{name: 42, classId: ['oops'], abilityScores: {str: 'x'}, purchases: 'nope', multiclasses: [1,'rogue']}))"
    )
    page.reload(wait_until="load")
    page.wait_for_timeout(300)
    assert errors == []
    assert page.query_selector(".summary") is not None
    data = get_character(page)
    assert data["name"] == ""              # bad number dropped
    assert data["classId"] is None          # bad array dropped
    assert data["multiclasses"] == ["rogue"]  # non-strings filtered out


def test_every_class_is_selectable_without_error(page):
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    goto_step(page, 2)
    names = page.eval_on_selector_all(
        ".card-grid .choice-title", "els => els.map(e => e.textContent.replace('caster','').trim())"
    )
    assert len(names) == 13
    for name in names:
        _click_card(page, name)
    assert errors == []
