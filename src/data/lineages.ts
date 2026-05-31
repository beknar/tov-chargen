import type { Ability } from './abilities'

// The 8 lineages (Player's Guide, Chapter 3: Lineage and Heritage).
// Size, speed, and traits are taken from each lineage's "Lineage Traits" entry
// in the rules reference. All lineages have a base walking speed of 30 ft.

export interface LineageTrait {
  name: string
  text: string
}

export interface LineageDef {
  id: string
  name: string
  /** "Medium", "Small", or "Medium or Small" (player's choice). */
  size: string
  /** Base walking speed in feet. */
  speed: number
  /** Short flavor lead. */
  flavor: string
  traits: LineageTrait[]
}

export const LINEAGES: LineageDef[] = [
  {
    "id": "beastkin",
    "name": "Beastkin",
    "size": "Medium or Small",
    "speed": 30,
    "flavor": "Born between civilization and the wilds, beastkin are as varied as the animal kingdom itself.",
    "traits": [
      {
        "name": "Animal Instinct",
        "text": "You have proficiency in either the Perception or Survival skill (your choice)."
      },
      {
        "name": "Natural Weapons",
        "text": "You have claws, horns, hooves, fangs, spines, or a similar adaptation that serves as a natural weapon."
      }
    ]
  },
  {
    "id": "dwarf",
    "name": "Dwarf",
    "size": "Medium",
    "speed": 30,
    "flavor": "Dwarves are a hardy people, as sturdy and solid as stone. Most dwarves believe they were sculpted from living rock and were given life in the forge of a progenitor god.",
    "traits": [
      {
        "name": "Darkvision",
        "text": "You have darkvision to a range of 60 feet."
      },
      {
        "name": "Dwarven Resilience",
        "text": "You have advantage on saves against becoming poisoned, and you are resistant to poison damage."
      },
      {
        "name": "Dwarven Toughness",
        "text": "Your hit point maximum increases by 1, and it increases by 1 every time you gain a level."
      }
    ]
  },
  {
    "id": "elf",
    "name": "Elf",
    "size": "Medium",
    "speed": 30,
    "flavor": "Elves are a long-lived people, regarded as the first mortal beings to walk the world. They boast ancestral ties to magic realms populated by immortal creatures.",
    "traits": [
      {
        "name": "Heightened Senses",
        "text": "You have advantage on Perception checks that rely on sight or hearing. You can see through lightly obscured areas normally and areas of dim light as if it were bright light."
      },
      {
        "name": "Magic Ancestry",
        "text": "You have advantage on saves against being charmed, and magic can’t put you to sleep."
      },
      {
        "name": "Trance",
        "text": "Elves don’t need to sleep. Instead, they enter a meditative trance state, remaining semiconscious for 4 hours a day. You choose whether or not you can dream while meditating. After resting in this way, you gain the same benefit that other creatures do from 8 hours of sleep."
      }
    ]
  },
  {
    "id": "human",
    "name": "Human",
    "size": "Medium or Small",
    "speed": 30,
    "flavor": "Humans are the youngest people of the world, and their tenacity and flexibility has allowed them to quickly spread.",
    "traits": [
      {
        "name": "Ambitious",
        "text": "You gain proficiency in one skill of your choice, and you gain one talent of your choice. This talent can be from any of the talent lists, but you must meet the talent’s prerequisites if any are required (see Talents in Chapter 4)."
      }
    ]
  },
  {
    "id": "kobold",
    "name": "Kobold",
    "size": "Small",
    "speed": 30,
    "flavor": "Kobolds are a cunning people with draconic features. Many kobolds believe ancient dragons made kobolds in their likeness, to serve their draconic masters.",
    "traits": [
      {
        "name": "Darkvision",
        "text": "You have darkvision to a range of 60 feet."
      },
      {
        "name": "Tinker’s Fascination",
        "text": "Your innate fascination with how things work allows you to use tools with ease. When you make an ability check with a tool, you can roll a d8 and add the result to the check."
      },
      {
        "name": "Natural Adaptation",
        "text": "You inherited one of the following unique traits, determined by your size."
      }
    ]
  },
  {
    "id": "orc",
    "name": "Orc",
    "size": "Medium",
    "speed": 30,
    "flavor": "Orcs are a resilient people, whose origin was sudden and forceful. Indeed, many orcish priests believe they are blessed by the god of war.",
    "traits": [
      {
        "name": "Heightened Senses",
        "text": "You have advantage on Perception checks that rely on sight or hearing. You can see through lightly obscured areas normally and areas of dim light as if it were bright light."
      },
      {
        "name": "Orcish Perseverance",
        "text": "When you would die due to suffocating or gaining levels of exhaustion, you instead enter a death-like stasis. While in stasis you are incapacitated, can’t move, can’t speak, and are unaware of your surroundings. You also cease to age, and your body is protected from decay. You can remain in this state until you are restored by mundane or magical healing, or your body is completely destroyed."
      },
      {
        "name": "Stalwart",
        "text": "When you are subjected to an effect that requires you to make a save at the end of your turn, you can instead choose to make the save at the start of your turn."
      }
    ]
  },
  {
    "id": "syderean",
    "name": "Syderean",
    "size": "Medium",
    "speed": 30,
    "flavor": "Sydereans (sigh-DEER-ee-ans) are mystical beings sired by creatures or powers from a different plane of existence.",
    "traits": [
      {
        "name": "Far Sight",
        "text": "You have darkvision to a range of 60 feet and can see in magical darkness to a range of 30 feet."
      },
      {
        "name": "Otherworldly Form",
        "text": "You have resistance to necrotic damage and the amount of time you can survive without air, food, water, or sleep is double that of a typical character."
      },
      {
        "name": "Natural Adaptation",
        "text": "You have inherited one set of the following unique traits, determined by the nature of the forces that shaped you."
      }
    ]
  },
  {
    "id": "smallfolk",
    "name": "Smallfolk",
    "size": "Small",
    "speed": 30,
    "flavor": "Smallfolk are diminutive humanoids who rely on community and cleverness to survive a world of big threats.",
    "traits": [
      {
        "name": "Grounded",
        "text": "Once per day, when you fail a save, you can reroll the die and use the new roll. Regardless of whether the new roll is a success or failure, you generate 1 Luck."
      },
      {
        "name": "Small Stature",
        "text": "You can move through the space of any creature that is Medium or larger size. You can also attempt to hide when you are obscured by a creature of Medium or larger size."
      },
      {
        "name": "Natural Adaptation",
        "text": "You inherited one of the following unique traits, determined by whether your characteristics are gnomish or halfling:"
      }
    ]
  }
]

export function getLineage(id: string | null): LineageDef | undefined {
  return id ? LINEAGES.find((l) => l.id === id) : undefined
}

// `Ability` is re-exported for parity with other data modules that tie traits
// to abilities; lineage traits in ToV are descriptive rather than fixed ASIs.
export type { Ability }
