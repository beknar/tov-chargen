import type { Ability } from './abilities'

// The 13 core classes (Player's Guide, Chapter 2).
//
// hitDie, savingThrows, proficiencies, 1st-level `features`, and
// `startingEquipment` are extracted from each class entry in the rules
// reference. `features` lists the named 1st-level class features and is NOT
// exhaustive of every level-1 ability — see the Player's Guide for full
// feature text, options, and subclasses. `keyAbility` (primary ability) and
// `description` are curated.

export interface ClassFeature {
  name: string
  text: string
}

export interface ClassProficiencies {
  armor: string
  weapons: string
  tools: string
  /** Skill choices, e.g. "Choose two from Acrobatics, Athletics, ...". */
  skills: string
}

export interface ClassDef {
  id: string
  name: string
  description: string
  /** Hit die size (8 means d8). */
  hitDie: number
  /** Key / primary ability. Multiple entries mean "either one qualifies". */
  keyAbility: Ability[]
  /** Saving throw proficiencies. */
  savingThrows: Ability[]
  /** Whether the class casts spells. */
  caster: boolean
  proficiencies: ClassProficiencies
  /** Named 1st-level features (not exhaustive). */
  features: ClassFeature[]
  /** Starting equipment options (Method 1). Each entry may list (a)/(b) choices. */
  startingEquipment: string[]
}

export const CLASSES: ClassDef[] = [
  {
    "id": "barbarian",
    "name": "Barbarian",
    "description": "Fierce warriors who channel a primal rage in battle.",
    "hitDie": 12,
    "keyAbility": [
      "str"
    ],
    "savingThrows": [
      "str",
      "con"
    ],
    "caster": false,
    "proficiencies": {
      "armor": "Light armor, medium armor, shields",
      "weapons": "Simple weapons, martial weapons",
      "tools": "Herbalism tools",
      "skills": "Choose two from Animal Handling, Athletics, Intimidation, Nature, Perception, and Survival"
    },
    "features": [
      {
        "name": "Rage",
        "text": "In battle, you fight with primal ferocity. On your turn, you can rage as a bonus action. While raging, you gain the following benefits if you aren’t wearing heavy armor:"
      },
      {
        "name": "Unarmored Defense",
        "text": "While you aren't wearing any armor, your AC equals 13 + your CON modifier. (DEX doesn't factor into your AC for this class feature.) You can use a shield and still gain this benefit."
      }
    ],
    "startingEquipment": [
      "(a) a greataxe or (b) any martial melee weapon",
      "(a) two handaxes or (b) any simple weapon",
      "An explorer’s pack and four javelins"
    ]
  },
  {
    "id": "bard",
    "name": "Bard",
    "description": "Skilled performers who inspire allies and wield Arcane magic.",
    "hitDie": 8,
    "keyAbility": [
      "cha"
    ],
    "savingThrows": [
      "dex",
      "cha"
    ],
    "caster": true,
    "proficiencies": {
      "armor": "Light armor",
      "weapons": "Simple weapons, martial weapons with the Finesse property",
      "tools": "One type of musical instrument and two other tools your choice",
      "skills": "Any three skills of your choice"
    },
    "features": [
      {
        "name": "Spellcasting",
        "text": "As a conduit for arcane power, you can cast Arcane spells. See Chapter 7: Spellcasting for general rules of spellcasting and the Arcane spell list."
      }
    ],
    "startingEquipment": [
      "(a) a rapier or (b) any simple weapon",
      "(a) a diplomat’s pack or (b) an entertainer’s pack",
      "(a) a musical instrument or (b) a different tool you are proficient with",
      "Leather armor and a dagger"
    ]
  },
  {
    "id": "cleric",
    "name": "Cleric",
    "description": "Faithful casters who wield Divine magic.",
    "hitDie": 8,
    "keyAbility": [
      "wis"
    ],
    "savingThrows": [
      "wis",
      "cha"
    ],
    "caster": true,
    "proficiencies": {
      "armor": "Light armor, medium armor, shields",
      "weapons": "Simple weapons",
      "tools": "None",
      "skills": "Choose two from History, Insight, Medicine, Persuasion, and Religion"
    },
    "features": [
      {
        "name": "Spellcasting",
        "text": "As a conduit for divine power, you can cast Divine spells. See Chapter 7: Spellcasting for general rules of spellcasting and the Divine spell list."
      },
      {
        "name": "Manifestation of Faith",
        "text": "Clerics demonstrate their faith in one of two primary ways, wielding it as a holy warrior or calling it as a miracle worker. Choose how you manifest your faith with one of the following. Manifest Might. You gain proficiency with heavy armor and one type of martial weapon of your choice (see Weapons in Chapter 5)."
      }
    ],
    "startingEquipment": [
      "(a) a mace or (b) a warhammer (if proficient)",
      "(a) scale mail, (b) leather armor, or (c) chain mail (if proficient)",
      "(a) light crossbow and 20 bolts or (b) any simple weapon",
      "(a) a priest’s pack or (b) an explorer’s pack",
      "A shield and a holy symbol"
    ]
  },
  {
    "id": "druid",
    "name": "Druid",
    "description": "Guardians of nature who wield Primordial magic.",
    "hitDie": 8,
    "keyAbility": [
      "wis"
    ],
    "savingThrows": [
      "int",
      "wis"
    ],
    "caster": true,
    "proficiencies": {
      "armor": "Light armor, medium armor, and shields",
      "weapons": "Simple weapons",
      "tools": "Herbalist tools",
      "skills": "Choose two from Animal Handling, Arcana, Insight, Medicine, Nature, Perception, Religion, and Survival"
    },
    "features": [
      {
        "name": "Spellcasting",
        "text": "As a conduit for primordial power, you can cast Primordial spells. See Chapter 7: Spellcasting for general rules of spellcasting and the Primordial spell list."
      },
      {
        "name": "Druidic",
        "text": "You know Druidic, the secret language of druids. You can speak the language and use a system of natural elements to leave hidden messages that only other druids will understand. You and others who know this language automatically spot such a message."
      },
      {
        "name": "Nature’s Gift",
        "text": "You have learned to harness the ambient energy of nature and can redirect that energy to encourage growth and healing. As a bonus action, choose one creature within 5"
      }
    ],
    "startingEquipment": [
      "(a) a shield or (b) any simple weapon",
      "(a) a scimitar or (b) any simple melee weapon",
      "Leather armor, an explorer’s pack, and a druidic focus"
    ]
  },
  {
    "id": "fighter",
    "name": "Fighter",
    "description": "Hardy adventurers who excel in combat and weapon use.",
    "hitDie": 10,
    "keyAbility": [
      "str",
      "dex"
    ],
    "savingThrows": [
      "str",
      "con"
    ],
    "caster": false,
    "proficiencies": {
      "armor": "All armor and shields",
      "weapons": "Simple weapons, martial weapons",
      "tools": "None",
      "skills": "Choose two from Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, and Survival"
    },
    "features": [
      {
        "name": "Last Stand",
        "text": "When you take damage that would reduce your hit points to less than half your hit point maximum (rounded down), you can use your reaction to spend hit dice, up to a number equal to your PB. Immediately roll those hit dice. You regain hit points equal to the sum of all dice rolled + your CON modifier."
      }
    ],
    "startingEquipment": [
      "(a) chain mail or (b) leather armor, longbow, and 20 arrows",
      "(a) a martial weapon and a shield or (b) two martial weapons",
      "(a) a light crossbow and 20 bolts or (b) two handaxes",
      "(a) a dungeoneer’s pack or (b) an explorer’s pack"
    ]
  },
  {
    "id": "mechanist",
    "name": "Mechanist",
    "description": "Crafty engineers who sculpt mystic forces into items.",
    "hitDie": 10,
    "keyAbility": [
      "int"
    ],
    "savingThrows": [
      "con",
      "int"
    ],
    "caster": true,
    "proficiencies": {
      "armor": "Light armor, medium armor, and shields",
      "weapons": "Simple weapons, martial weapons",
      "tools": "Tinker tools and two additional tools your choice",
      "skills": "Choose two from Arcana, History, Investigation, Perception, and Sleight of Hand"
    },
    "features": [
      {
        "name": "Eyes of the Maker",
        "text": "When you touch a magic item or some other magic-imbued object, you learn its properties and how to use it, whether it requires attunement to use, and how many charges it has"
      },
      {
        "name": "Shard of Creation",
        "text": "You learn how to craft a shard of creation, which is a Tiny magical object with many uses that appears on your person. In its base state, the shard appears as a constantly shifting, fluid-like bundle of plasma."
      }
    ],
    "startingEquipment": [
      "(a) a martial weapon and a shield or (b) two simple weapons",
      "Light crossbow and 20 bolts",
      "(a) scale mail or (b) leather armor",
      "Tinker tools and a dungeoneer’s pack"
    ]
  },
  {
    "id": "monk",
    "name": "Monk",
    "description": "Martial artists who harness mystical energy.",
    "hitDie": 8,
    "keyAbility": [
      "dex",
      "wis"
    ],
    "savingThrows": [
      "str",
      "dex"
    ],
    "caster": false,
    "proficiencies": {
      "armor": "None",
      "weapons": "Simple weapons, shortswords",
      "tools": "One of your choice",
      "skills": "Choose two from Acrobatics, Athletics, History, Insight, Religion, and Stealth"
    },
    "features": [
      {
        "name": "Martial Arts",
        "text": "You have mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don’t have the Two-handed or Heavy property. You gain the following benefits while you are unarmed or wielding only monk weapons and you aren’t wearing armor or wielding a shield:"
      },
      {
        "name": "Unarmored Defense",
        "text": "While you are wearing no armor and not wielding a shield, your AC equals 10 + your DEX modifier + your WIS modifier."
      }
    ],
    "startingEquipment": [
      "(a) any simple weapon",
      "(a) a dungeoneer’s pack or (b) an explorer’s pack",
      "(a) 10 darts or (b) a sling"
    ]
  },
  {
    "id": "paladin",
    "name": "Paladin",
    "description": "Holy warriors who smite foes with Divine power.",
    "hitDie": 10,
    "keyAbility": [
      "str",
      "cha"
    ],
    "savingThrows": [
      "wis",
      "cha"
    ],
    "caster": true,
    "proficiencies": {
      "armor": "All armor and shields",
      "weapons": "Simple weapons, martial weapons",
      "tools": "None",
      "skills": "Choose two from Athletics, Insight, Intimidation, Medicine, Persuasion, and Religion"
    },
    "features": [
      {
        "name": "Divine Sense",
        "text": "During your turn, you can open your awareness to detect the presence of supernatural forces (no action required). For 1 minute, you know the location of any Celestial, Fiend, or Undead within 60 feet of you that isn’t behind total cover."
      },
      {
        "name": "Lay on Hands",
        "text": "Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to 5 × your paladin level."
      }
    ],
    "startingEquipment": [
      "(a) a martial weapon and a shield or (b) two martial weapons",
      "(a) five javelins or (b) any simple melee weapon",
      "(a) a priest’s pack or (b) an explorer's pack",
      "Chain mail and a holy symbol"
    ]
  },
  {
    "id": "ranger",
    "name": "Ranger",
    "description": "Resourceful survivalists with a mystic connection to nature.",
    "hitDie": 10,
    "keyAbility": [
      "dex",
      "wis"
    ],
    "savingThrows": [
      "str",
      "dex"
    ],
    "caster": true,
    "proficiencies": {
      "armor": "Light armor, medium armor, and shields",
      "weapons": "Simple weapons, martial weapons",
      "tools": "Your choice of herbalist tools, navigator tools, or trapper tools",
      "skills": "Choose three from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, and Survival"
    },
    "features": [
      {
        "name": "Explorer",
        "text": "Your ability to deal with environmental challenges is unmatched. You gain the following benefits:"
      }
    ],
    "startingEquipment": [
      "(a) scale mail or (b) leather armor",
      "(a) two shortswords or (b) two simple weapons",
      "(a) a dungeoneer's pack or (b) an explorer's pack",
      "A longbow and quiver of 20 arrows"
    ]
  },
  {
    "id": "rogue",
    "name": "Rogue",
    "description": "Cunning adventurers who rely on agility and trickery.",
    "hitDie": 8,
    "keyAbility": [
      "dex"
    ],
    "savingThrows": [
      "dex",
      "int"
    ],
    "caster": false,
    "proficiencies": {
      "armor": "Light armor",
      "weapons": "Simple weapons, martial weapons with the Finesse property",
      "tools": "Thieves’ tools",
      "skills": "Choose four from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Performance, Persuasion, Sleight of Hand, and Stealth"
    },
    "features": [
      {
        "name": "Sneak Attack",
        "text": "You know how to strike subtly and exploit a foe’s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The weapon you use must have the Finesse property or be a ranged weapon."
      },
      {
        "name": "Thieves’ Cant",
        "text": "During your rogue training, you learned Thieves’ Cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature who knows Thieves’ Cant understands such messages."
      }
    ],
    "startingEquipment": [
      "(a) a rapier or (b) a shortsword",
      "(a) a shortbow and quiver of 20 arrows or (b) a shortsword",
      "(a) a burglar’s pack, (b) a dungeoneer’s pack, or (c) an explorer’s pack",
      "Leather armor, two daggers, and a set of thieves’ tools"
    ]
  },
  {
    "id": "sorcerer",
    "name": "Sorcerer",
    "description": "Powerful casters who channel raw Arcane power from within.",
    "hitDie": 6,
    "keyAbility": [
      "cha"
    ],
    "savingThrows": [
      "con",
      "cha"
    ],
    "caster": true,
    "proficiencies": {
      "armor": "None",
      "weapons": "Simple weapons",
      "tools": "None",
      "skills": "Choose two from Arcana, Deception, Insight, Intimidation, Persuasion, and Religion"
    },
    "features": [
      {
        "name": "Font of Magic",
        "text": "You begin to draw from an internal wellspring of magic. This wellspring is represented by sorcery points, which allow you to create a variety of magical effects."
      },
      {
        "name": "Spellcasting",
        "text": "As a conduit for arcane power, you can cast Arcane spells. See Chapter 7: Spellcasting for general rules of spellcasting and the Arcane spell list."
      }
    ],
    "startingEquipment": [
      "(a) a light crossbow and 20 bolts or (b) any simple weapon",
      "(a) a component pouch or (b) an arcane focus",
      "(a) a dungeoneer’s pack or (b) an explorer’s pack",
      "Two daggers"
    ]
  },
  {
    "id": "warlock",
    "name": "Warlock",
    "description": "Supernatural casters who draw magic from Wyrd forces.",
    "hitDie": 8,
    "keyAbility": [
      "cha"
    ],
    "savingThrows": [
      "wis",
      "cha"
    ],
    "caster": true,
    "proficiencies": {
      "armor": "Light armor, medium armor, shields",
      "weapons": "Simple weapons",
      "tools": "None",
      "skills": "Choose two from Arcana, Deception, History, Intimidation, Investigation, Nature, and Religion"
    },
    "features": [
      {
        "name": "Pact Boon",
        "text": "The initial pact that grants you your warlock powers is sealed with the gift of a Pact Boon. You gain one of the following boons of your choice. Pact of the Blade You can use your action to create a pact weapon in your empty hand. You can choose the form that this melee weapon takes each time you create it."
      }
    ],
    "startingEquipment": [
      "(a) a light crossbow and 20 bolts or (b) any simple weapon",
      "(a) a component pouch or (b) a wyrd focus",
      "(a) a scholar’s pack or (b) a dungeoneer’s pack",
      "Leather armor, any simple weapon, and two daggers"
    ]
  },
  {
    "id": "wizard",
    "name": "Wizard",
    "description": "Scholarly Arcane casters who master spells through study.",
    "hitDie": 6,
    "keyAbility": [
      "int"
    ],
    "savingThrows": [
      "int",
      "wis"
    ],
    "caster": true,
    "proficiencies": {
      "armor": "None",
      "weapons": "Simple weapons",
      "tools": "None",
      "skills": "Choose two from Arcana, History, Insight, Investigation, Medicine, and Religion"
    },
    "features": [
      {
        "name": "Arcane Recovery",
        "text": "You have learned to regain some of your magical energy by studying your spellbook. Once per day, when you finish a short rest, you can recover expended Arcane spell slots of your choice. Recovered spell slots can have a combined circle total equal to or less than half your wizard level (rounded up)."
      },
      {
        "name": "Spellcasting",
        "text": "As a student of Arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power. See Chapter 7: Spellcasting for general rules of spellcasting and the Arcane spell list."
      }
    ],
    "startingEquipment": [
      "(a) a quarterstaff or (b) a dagger",
      "(a) a component pouch or (b) an arcane focus",
      "(a) a scholar’s pack or (b) an explorer’s pack",
      "A spellbook"
    ]
  }
]

export function getClass(id: string | null): ClassDef | undefined {
  return id ? CLASSES.find((c) => c.id === id) : undefined
}
