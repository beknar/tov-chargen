// The full talent catalog (Player's Guide, Chapter 4), grouped by category.
// Extracted from the rules reference by font (talent names use a distinct
// heading font). Descriptions are short summaries; see the guide for full
// benefits.

export type TalentCategory = 'Magic' | 'Martial' | 'Technical'

export interface TalentDef {
  id: string
  name: string
  category: TalentCategory
  prerequisite: string | null
  description: string
}

export const TALENTS: TalentDef[] = [
  {
    "id": "arcanist",
    "name": "Arcanist",
    "category": "Magic",
    "prerequisite": "Spellcasting Class Feature",
    "description": "Your focus on magical studies yielded incredible results, granting these benefits: • Double your PB for any ability check you make that uses the Arcana skill."
  },
  {
    "id": "combat-casting",
    "name": "Combat Casting",
    "category": "Magic",
    "prerequisite": null,
    "description": "Experience on the battlefield has given you superior focus to cast your spells. You gain these benefits: • When you make a CON save to maintain concentration on a spell, treat any d20 roll of 7 or less as though you rolled an 8."
  },
  {
    "id": "elemental-savant",
    "name": "Elemental Savant",
    "category": "Magic",
    "prerequisite": "Ability to Cast at Least One Spell that Deals Damage",
    "description": "Choose one of the following elemental damage types: acid, cold, fire, lightning, or thunder. When you cast a spell that deals damage, you can convert the damage type of that spell to your chosen elemental damage type. You must decide to convert the damage type when you declare you are casting the spell."
  },
  {
    "id": "focus-death",
    "name": "Focus (Death)",
    "category": "Magic",
    "prerequisite": "Access to 2nd-Circle Spell Slots",
    "description": "Your focus on the magic of life, death, and seeing beyond grants you these benefits: • When you succeed on a death save, you can expend a spell slot of 2nd circle or higher to regain a number of hit points equal to five times the circle of the expended spell slot."
  },
  {
    "id": "focus-creation",
    "name": "Focus (Creation)",
    "category": "Magic",
    "prerequisite": "Access to 2nd-Circle Spell Slots",
    "description": "Your focus on the magic of reshaping and translocating has granted you these benefits: • When you cast a conjuration or transmutation spell, you can use your reaction to expend a spell slot of 2nd circle or higher."
  },
  {
    "id": "focus-fey",
    "name": "Focus (Fey)",
    "category": "Magic",
    "prerequisite": "Access to 2nd-Circle Spell Slots",
    "description": "Your focus on the spells of the fey have instilled in you these benefits: • When you expend a spell slot to cast an enchantment or illusion spell of 1st circle or higher, roll a d6. On a roll of 6, the spell slot isn’t expended. • You learn one 1st-circle enchantment or illusion spell from any source spell list."
  },
  {
    "id": "focus-war",
    "name": "Focus (War)",
    "category": "Magic",
    "prerequisite": "Access to 2nd-Circle Spell Slots",
    "description": "Your focus on battlefield magic, both protective and destructive, grants you these benefits: • When you or a creature within 10 feet of you takes damage, you can use your reaction to expend a spell slot of 2nd circle or higher."
  },
  {
    "id": "mental-fortitude",
    "name": "Mental Fortitude",
    "category": "Magic",
    "prerequisite": null,
    "description": "Through rigid mental exercise, you have fortified yourself against mind-altering effects. You gain these benefits: • Once per short rest, when you fail an INT, WIS, or CHA save, you can choose to reroll the save and take the new result."
  },
  {
    "id": "psycanist",
    "name": "Psycanist",
    "category": "Magic",
    "prerequisite": "INT 13 or Higher",
    "description": "Through magic, you learned to influence and manipulate the world around you with your mind. You gain one of the following benefits: • You can telepathically speak with any creature within 30 feet of you."
  },
  {
    "id": "ritualist",
    "name": "Ritualist",
    "category": "Magic",
    "prerequisite": "Spellcasting Class Feature",
    "description": "Your study of magic has unlocked the mysteries of ritual spells. When you gain this talent, you also gain a ritual book, which contains the rituals you know. To cast a ritual spell, you must have your ritual book in hand. Choose a spell source: Arcane, Divine, Primordial, or Wyrd."
  },
  {
    "id": "school-specialization",
    "name": "School Specialization",
    "category": "Magic",
    "prerequisite": null,
    "description": "Choose one of the eight schools of magic: abjuration, conjuration, divination, enchantment, evocation, illusion, necromancy, or transmutation. You gain these benefits: • When you cast spells of your chosen school, your spell attack bonus and spell save DC are both increased by 1."
  },
  {
    "id": "spell-duelist",
    "name": "Spell Duelist",
    "category": "Magic",
    "prerequisite": "Ability to Cast One or More Cantrips",
    "description": "When a creature you can see damages you with a spell, you can use your reaction to cast a cantrip targeting that creature. In addition, when you cast a spell that requires an attack roll, you gain these benefits: • Double the range of the spell. If the spell’s range is touch, its range increases to 15 feet."
  },
  {
    "id": "athletic",
    "name": "Athletic",
    "category": "Martial",
    "prerequisite": null,
    "description": "You focused on honing your athletic capabilities. You gain these benefits: • Double your PB for any ability check you make that uses the Athletics skill. • When factoring your carrying capacity, multiply your STR score by 18 instead of 15."
  },
  {
    "id": "armor-expert",
    "name": "Armor Expert",
    "category": "Martial",
    "prerequisite": "STR 13 or Higher",
    "description": "Your experience with armor allows you to weather mighty onslaughts. While you are wearing medium or heavy armor with which you are proficient, you gain these benefits: • Your AC increases by 1. • You have advantage on saves to avoid being pulled, shoved, or knocked prone."
  },
  {
    "id": "armor-training",
    "name": "Armor Training",
    "category": "Martial",
    "prerequisite": "Proficiency with Light or Medium Armor",
    "description": "You’ve trained to improve your use of armor. You gain these benefits: • If you are proficient with light armor, you gain proficiency with medium armor. If you are proficient with medium armor, you gain proficiency with heavy armor and shields."
  },
  {
    "id": "artillerist",
    "name": "Artillerist",
    "category": "Martial",
    "prerequisite": "STR 13 or Higher",
    "description": "You trained to master complex ranged weapons. You gain these benefits: • You ignore the Loading property of all weapons with which you are proficient. • You have advantage on attack rolls made with siege weapons or other Medium or larger projectile‑launching objects that you operate."
  },
  {
    "id": "combat-conditioning",
    "name": "Combat Conditioning",
    "category": "Martial",
    "prerequisite": null,
    "description": "You’ve endured extensive training to withstand the rigors of combat. You gain these benefits: • Your hit point maximum increases by 2 for each character level you have. Each time you gain a level after taking this talent, your hit point maximum increases by 2."
  },
  {
    "id": "critical-training",
    "name": "Critical Training",
    "category": "Martial",
    "prerequisite": null,
    "description": "You’ve learned to aim for vital points on your targets. You gain these benefits: • You score a critical hit on a d20 roll of 19 or 20 when attacking with a weapon. • When calculating the extra damage of a critical hit with a weapon, add the ability modifier used in the attack to the damage one additional time."
  },
  {
    "id": "furious-charge",
    "name": "Furious Charge",
    "category": "Martial",
    "prerequisite": null,
    "description": "You’ve learned to press every advantage and hammer into enemies."
  },
  {
    "id": "hand-to-hand",
    "name": "Hand to Hand",
    "category": "Martial",
    "prerequisite": null,
    "description": "You mastered techniques that allow you to efficiently fight barehanded. You gain these benefits: • The damage of your unarmed strikes increases from 1 + STR modifier to 1d6 + STR modifier. • You gain proficiency with improvised weapons."
  },
  {
    "id": "heavy-weapon-mastery",
    "name": "Heavy Weapon Mastery",
    "category": "Martial",
    "prerequisite": "Character 4th Level or Higher",
    "description": "You have great skill with two-handed weapons. While wielding a melee weapon with the Heavy property in two hands, you gain these benefits: • When you score a critical hit, you can make one additional melee weapon attack as part of that Attack action. In addition, your attacks become overpowering."
  },
  {
    "id": "opportunist",
    "name": "Opportunist",
    "category": "Martial",
    "prerequisite": null,
    "description": "You find openings in your targets’ defenses. You gain these benefits: • When you make an opportunity attack, you have advantage on the attack roll. • A creature within reach of your melee weapon provokes an opportunity attack from you when they stand up from being prone or take the Use an Object action."
  },
  {
    "id": "physical-fortitude",
    "name": "Physical Fortitude",
    "category": "Martial",
    "prerequisite": null,
    "description": "You’ve fortified yourself against physically debilitating effects. You gain these benefits: • Once per turn, when you fail a STR or CON save, you can expend one of your hit dice to reroll the save. You must take the new result. • When you start your turn blinded, deafened, restrained, or poisoned, you gain 1 Luck."
  },
  {
    "id": "ranged-weapon-mastery",
    "name": "Ranged Weapon Mastery",
    "category": "Martial",
    "prerequisite": "Character 4th Level or Higher",
    "description": "You have great skill with ranged weapons. While wielding a ranged or thrown weapon, you gain these benefits: • You don’t have disadvantage on attack rolls made at long range or when a hostile creature is within 5 feet of you. In addition, your accuracy borders on the unnatural."
  },
  {
    "id": "return-fire",
    "name": "Return Fire",
    "category": "Martial",
    "prerequisite": null,
    "description": "You are skilled at suppressing long-ranged foes in combat. When a creature you can see hits or misses you with a ranged attack, as a reaction you can make a single weapon attack against that creature with a ranged or thrown weapon if the target is within your weapon’s range (short or long)."
  },
  {
    "id": "shield-mastery",
    "name": "Shield Mastery",
    "category": "Martial",
    "prerequisite": "Character 4th Level or Higher",
    "description": "You can wield a shield as an extension of your own body. While wielding a shield, you gain these benefits: • As a bonus action, you can attempt to shove a creature within 5 feet of you with your shield."
  },
  {
    "id": "spell-hunter",
    "name": "Spell Hunter",
    "category": "Martial",
    "prerequisite": null,
    "description": "You have a penchant for overpowering even skilled spellcasters. You gain these benefits: • When a creature you can see within your reach casts a spell, as a reaction you can make a single melee attack against that creature. On a hit, the attack deals additional damage equal to the circle of the spell they are casting."
  },
  {
    "id": "two-weapon-mastery",
    "name": "Two Weapon Mastery",
    "category": "Martial",
    "prerequisite": "Character 4th Level or Higher",
    "description": "You have mastered the art of wielding two weapons simultaneously. While wielding a different melee weapon in each hand, you gain these benefits: • You can use the bonus action attack granted by two- weapon fighting even if the weapons you are wielding don’t have the Light property."
  },
  {
    "id": "vanguard",
    "name": "Vanguard",
    "category": "Martial",
    "prerequisite": null,
    "description": "You trained in capitalizing on every opening and stopping enemies in their tracks. You gain these benefits: • When a creature within reach makes a melee attack against a target other than you, as a reaction you can make a melee weapon attack against the attacking creature."
  },
  {
    "id": "weapon-discipline",
    "name": "Weapon Discipline",
    "category": "Martial",
    "prerequisite": "Proficiency with at Least One Martial Weapon",
    "description": "You seek perfection with a single weapon. Choose a simple or martial weapon (such as spear, heavy crossbow, or greataxe) you are proficient with. While wielding that weapon, you gain these benefits: • You gain a +1 bonus to attack and damage rolls made with your chosen weapon."
  },
  {
    "id": "wrestling-mastery",
    "name": "Wrestling Mastery",
    "category": "Martial",
    "prerequisite": "STR 15 or Higher, Character Level 4 or Higher",
    "description": "You excel in close-quarters combat. You gain these benefits: • You have advantage on checks made to initiate or escape a grapple and advantage on attack rolls against creatures you are grappling."
  },
  {
    "id": "aware",
    "name": "Aware",
    "category": "Technical",
    "prerequisite": null,
    "description": "You have exceptional situational awareness. When you select this talent, you gain these benefits: • When you roll for initiative, treat any d20 roll of 9 or lower as though you rolled a 10. • As long as you are conscious, you can’t be affected by the surprised condition."
  },
  {
    "id": "bottomless-luck",
    "name": "Bottomless Luck",
    "category": "Technical",
    "prerequisite": null,
    "description": "Your skill is only outmatched by your infectious lucky streak. You gain these benefits: • When you roll a 20 on a d20 roll, one ally of your choice that can see or hear you gains 1 Luck. • When you make a die roll to reset your Luck total, roll two dice and keep the result you prefer."
  },
  {
    "id": "comrade",
    "name": "Comrade",
    "category": "Technical",
    "prerequisite": null,
    "description": "You excel while helping others. You gain these benefits: • You can use the Help action as a bonus action on each of your turns. • When an ally you can see or hear within 30 feet of you spends one or more Luck, you can also spend Luck to increase their roll."
  },
  {
    "id": "covert",
    "name": "Covert",
    "category": "Technical",
    "prerequisite": "Proficiency with the Stealth Skill, DEX 13 or Higher",
    "description": "You trained in the art of espionage. You gain these benefits: • You can attempt to hide while in three-quarters cover or while lightly obscured. • Creatures that rely on darkvision can’t see you while you remain motionless in dim light or darkness."
  },
  {
    "id": "dungeoneer",
    "name": "Dungeoneer",
    "category": "Technical",
    "prerequisite": null,
    "description": "You’ve studied—or at least survived—your share of hazards and learned a thing or two about sniffing out secrets. You gain these benefits: • You can add your PB to checks made to disarm traps and open doors, even if you aren't proficient with the tools to do so."
  },
  {
    "id": "far-traveler",
    "name": "Far Traveler",
    "category": "Technical",
    "prerequisite": null,
    "description": "You have traveled the world and been to many fantastical places. You gain these benefits: • You and your allies can travel up to 10 hours each day, instead of the standard 8, before you must make a CON save for a forced march. • Traveling at a fast pace doesn’t impose the standard −5 penalty to your passive Perception."
  },
  {
    "id": "field-medic",
    "name": "Field Medic",
    "category": "Technical",
    "prerequisite": null,
    "description": "You trained to provide emergency medical assistance. When you select this talent, you gain these benefits: • When you make a WIS (Medicine) check, treat any d20 roll of 9 or lower as though you rolled a 10. • As an action, you can tend to the wounds of a creature you can see and touch."
  },
  {
    "id": "hard-target",
    "name": "Hard Target",
    "category": "Technical",
    "prerequisite": null,
    "description": "You’ve shored up weaknesses in a particular ability. You gain these benefits: • You gain proficiency in saves with one ability of your choice. • When you fail a save in that ability, you can expend one hit die, roll it, and add the number rolled to the save result."
  },
  {
    "id": "noxious-apothecary",
    "name": "Noxious Apothecary",
    "category": "Technical",
    "prerequisite": "INT 13 or Higher or Proficiency with Herbalism Tools",
    "description": "You invested countless hours in the art of poison crafting. You gain these benefits: • Double your PB when using herbalism tools to harvest a poison. • When you harvest poison from a natural source, such as a creature or plant, you harvest twice as much."
  },
  {
    "id": "polyglot",
    "name": "Polyglot",
    "category": "Technical",
    "prerequisite": null,
    "description": "You have studied language extensively. You can communicate in multiple languages and puzzle out critical information from languages you don’t know. When you select this talent, you gain these benefits: • Learn three languages of your choice."
  },
  {
    "id": "quick",
    "name": "Quick",
    "category": "Technical",
    "prerequisite": null,
    "description": "You are uncommonly agile. While not wearing medium or heavy armor, you gain these benefits: • Your speed increases by 10 feet. • When you take the Dash action, you can move along vertical surfaces during your movement."
  },
  {
    "id": "scrutinous",
    "name": "Scrutinous",
    "category": "Technical",
    "prerequisite": null,
    "description": "You have a keen eye for detail. You gain these benefits: • When a creature you can see speaks in a language that you know, you can discern what they are saying even if you can’t hear them. • You gain a +5 bonus to your passive Perception and passive Investigation."
  },
  {
    "id": "trade-skills",
    "name": "Trade Skills",
    "category": "Technical",
    "prerequisite": null,
    "description": "You honed your skills to work in a particular profession. When you select this talent, decide what that profession is and gain these benefits: • Gain proficiency with one skill and a tool or vehicle relevant to your chosen profession."
  },
  {
    "id": "touch-of-luck",
    "name": "Touch of Luck",
    "category": "Technical",
    "prerequisite": null,
    "description": "Fortune’s favor always makes its way back to you. You gain these benefits: • When you would gain 1 Luck as a result of failing an attack roll or save, you instead gain 2 Luck. • If you have 5 Luck and would gain a 6th, your Luck total resets to 1d4 + 1."
  }
]

const BY_NAME: Record<string, TalentDef> = Object.fromEntries(
  TALENTS.map((t) => [t.name, t]),
)

export const TALENT_CATEGORIES: TalentCategory[] = ['Magic', 'Martial', 'Technical']

export function talentsByCategory(cat: TalentCategory): TalentDef[] {
  return TALENTS.filter((t) => t.category === cat)
}

/** Look up a talent's short description by its display name. */
export function getTalent(name: string | null): string | undefined {
  return name ? BY_NAME[name]?.description : undefined
}

export function getTalentDef(name: string | null): TalentDef | undefined {
  return name ? BY_NAME[name] : undefined
}
