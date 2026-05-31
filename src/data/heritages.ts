// The 14 heritages (Player's Guide, Chapter 3: Lineage and Heritage).
// A heritage represents cultural upbringing; it is chosen independently of
// lineage. Traits and starting languages are taken from the rules reference.

export interface HeritageTrait {
  name: string
  text: string
}

export interface HeritageDef {
  id: string
  name: string
  /** Short flavor lead. */
  flavor: string
  /** Starting languages granted by the heritage. */
  languages: string
  traits: HeritageTrait[]
}

export const HERITAGES: HeritageDef[] = [
  {
    "id": "anointed",
    "name": "Anointed",
    "flavor": "Anointed heritage characters have accepted a supernatural connection to extraplanar creatures or cosmic forces.",
    "languages": "You know Common and two additional languages of your choice. Typical anointed heritage characters choose an esoteric language aligned with their guiding power: Abyssal, Celestial, or Infernal.",
    "traits": [
      {
        "name": "Favored Disciple",
        "text": "You know the thaumaturgy cantrip and you have advantage on death saves."
      },
      {
        "name": "Occult Studies",
        "text": "You have proficiency in the History or Religion skill. When you make a check to recall or interpret information about Celestials, Fiends, or creatures with the Outsider tag, you can make a skill check with advantage."
      }
    ]
  },
  {
    "id": "cloud",
    "name": "Cloud",
    "flavor": "Cloud heritage characters come from communities deeply entwined with Arcane magic.",
    "languages": "You know Common and two additional languages of your choice. Typical cloud heritage characters choose Elvish and Draconic.",
    "traits": [
      {
        "name": "Touch of Magic",
        "text": "Choose a school of magic and learn a cantrip of your choice from that school. When you reach 3rd level, choose a 1st-circle spell from that school to learn. You can cast it at its lowest circle without expending a spell slot."
      },
      {
        "name": "World of Wonders",
        "text": "You have proficiency in the Arcana skill."
      }
    ]
  },
  {
    "id": "cosmopolitan",
    "name": "Cosmopolitan",
    "flavor": "Cosmopolitan characters are citizens of the world whose values, interests, and ideas are influenced by exposure to many different peoples and cultures.",
    "languages": "You know Common and three additional languages of your choice. Typical cosmopolitan heritage characters choose Dwarvish and Elvish.",
    "traits": [
      {
        "name": "Street Smarts",
        "text": "While in a city or other urban environment, you have advantage on ability checks made to avoid getting lost and checks made to find a particular kind of business or other destination open to the public."
      },
      {
        "name": "Worldly Wisdom",
        "text": "You have proficiency with the History skill. When you make a check related to understanding the purpose or significance of a building, rite, or object from a culture you aren’t familiar with, you can add your PB to the roll."
      }
    ]
  },
  {
    "id": "cottage",
    "name": "Cottage",
    "flavor": "Characters from this heritage were raised with the skills and practicality of an organized, integrated, agricultural community.",
    "languages": "You know Common and one additional language of your choice. Typical cottage heritage characters choose Halfling or Gnomish.",
    "traits": [
      {
        "name": "Comforts of Home",
        "text": "As part of a long rest, you can cook a meal, tell stories, or perform some other activity that comforts your allies. Choose a number of creatures who participated in the long rest equal to your PB (this can include you). Those creatures gain temporary HP equal to twice your PB."
      },
      {
        "name": "Homesteader",
        "text": "You have proficiency in either the Animal Handling or Nature skill."
      }
    ]
  },
  {
    "id": "diaspora",
    "name": "Diaspora",
    "flavor": "Diaspora heritage characters were raised in a displaced community dedicated to the legacy of a lost ancestral empire.",
    "languages": "You know Common and one additional language of your choice. Many diaspora communities learn the languages most common to soldiers, mercenaries, and traders near the area in which they reside, most often Orcish or Dwarven.",
    "traits": [
      {
        "name": "Preserved Traditions",
        "text": "You gain proficiency with the History skill. You also gain proficiency with one type of martial weapon of your choice (see Weapons in Chapter 5)."
      },
      {
        "name": "Timeless Resolve",
        "text": "When you or an allied creature within 5 feet of you makes a save against becoming frightened, you and the ally have advantage on the save."
      }
    ]
  },
  {
    "id": "fireforge",
    "name": "Fireforge",
    "flavor": "Fireforge heritage characters were raised with the values and traditions of crafting communities dependent on the resources found in fiery—and often inhospitable—locales.",
    "languages": "You know Common and one additional language of your choice. Typical fireforge heritage characters choose Dwarvish.",
    "traits": [
      {
        "name": "Forgecraft",
        "text": "You gain proficiency with Smithing tools (see Tools in Chapter 5). Double your PB for any ability check you make that uses them. In addition, you know the mending cantrip."
      },
      {
        "name": "Heat Resilience",
        "text": "Lifelong exposure has made you resilient to the effects of severe heat. You are resistant to fire damage."
      }
    ]
  },
  {
    "id": "grove",
    "name": "Grove",
    "flavor": "Grove heritage characters grow in the values and traditions of forest communities dedicated to living in harmony with nature.",
    "languages": "You know Common and one additional language of your choice. Typical grove heritage characters choose Elvish.",
    "traits": [
      {
        "name": "Canopy Walker",
        "text": "You have a climbing speed equal to your walking speed."
      },
      {
        "name": "Nature’s Camouflage",
        "text": "You have advantage on DEX (Stealth) checks made while you are lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena. While in such conditions, you can always attempt to take the Hide action, even if circumstances would not normally allow you to do so."
      }
    ]
  },
  {
    "id": "nomadic",
    "name": "Nomadic",
    "flavor": "Nomadic heritage characters hail from a tight-knit community that regularly moves to and from different areas.",
    "languages": "You know Common and one additional language of your choice. Depending on the regions your people frequent or the kinds of communities your people trade with, typical nomadic heritage characters choose Dwarvish or Elvish.",
    "traits": [
      {
        "name": "Resilient",
        "text": "You have advantage on checks or saves made to resist debilitating weather effects, such as those caused by extreme heat or cold. In addition, when you complete a short rest, you can reduce your exhaustion level by one."
      },
      {
        "name": "Traveler",
        "text": "You have proficiency in the Survival skill."
      }
    ]
  },
  {
    "id": "salvager",
    "name": "Salvager",
    "flavor": "Characters who choose this heritage were raised with the skills and tenacity of making do with what’s at hand.",
    "languages": "You know Common and one additional language of your choice. Typical scavenger heritage characters choose Draconic or Gnomish.",
    "traits": [
      {
        "name": "Repurpose",
        "text": "You can create Tiny nonmagical items using materials from your surroundings. An item takes 1 minute to create and can be anything of 25 gp value or less from the Adventuring Gear table (see Adventuring Gear in Chapter 5). When done, it must sit or float on a surface within 5 feet of you."
      },
      {
        "name": "Tinkerer",
        "text": "You have proficiency with tinker’s tools or one other kind of tool of your choice (see Tools in Chapter 5). When you make a check to create, identify, or disarm a magical or nonmagical object, trap, or device, where you have a relevant proficiency, double your PB for the roll."
      }
    ]
  },
  {
    "id": "slayer",
    "name": "Slayer",
    "flavor": "Members of a slayer heritage were raised in a society of like- minded people dedicated to hunting monsters.",
    "languages": "You know Common and one additional language of your choice. Typical slayer heritage characters choose Primordial or Sylvan.",
    "traits": [
      {
        "name": "Natural Predator",
        "text": "You have proficiency in the Intimidation skill. You have advantage on Intimidation checks to influence Beasts and creatures with the Animal tag."
      },
      {
        "name": "Tracker",
        "text": "When you make a check to locate, spot, or track a creature, you can add your PB to the roll. If you have proficiency in the skill or tool being used, double your PB for the roll."
      }
    ]
  },
  {
    "id": "stone",
    "name": "Stone",
    "flavor": "Stone heritage characters were raised in a subterranean community of miners and stoneworkers.",
    "languages": "You know Common and one additional language of your choice. Typical stone heritage characters choose Dwarvish.",
    "traits": [
      {
        "name": "Ancestral Arts",
        "text": "You gain proficiency with Construction tools (see Tools in Chapter 5). Double your PB for any ability check you make that uses them. You also gain proficiency with one type of martial weapon of your choice (see Weapons in Chapter 5)."
      },
      {
        "name": "Eye for Quality",
        "text": "When you make an ability check related to the origin or purpose of an object or structure made of metal or stone, you can add your PB to the roll. If you have proficiency in a relevant skill or tool, double your PB for the roll."
      }
    ]
  },
  {
    "id": "supplicant",
    "name": "Supplicant",
    "flavor": "Characters of this heritage were raised in a community bound to serve a monstrous overlord. Monstrous creatures of fearsome might and intelligence have always sought dominion.",
    "languages": "You know Common and one additional language of your choice, typically the language favored by your current or previous overlord (such as Draconic, Giant, or Undercommon).",
    "traits": [
      {
        "name": "Scurry",
        "text": "As a bonus action, you can move up to 10 feet without provoking opportunity attacks. This movement doesn't trigger traps or hazards that you are aware of, even if they are armed."
      },
      {
        "name": "Supplicant",
        "text": "You have proficiency in either the Insight or Persuasion skill. When a creature within 30 feet of you spends Doom, you have advantage on ability checks and saves until the beginning of your next turn."
      }
    ]
  },
  {
    "id": "vexed",
    "name": "Vexed",
    "flavor": "The lives of vexed heritage characters are defined by their defiance of a supernatural connection to extraplanar creatures or cosmic forces.",
    "languages": "You know Common and one additional language of your choice. To better avoid an unwanted destiny, typical vexed heritage characters choose an esoteric language most closely aligned with their pursing power or force: Abyssal, Celestial, or Infernal.",
    "traits": [
      {
        "name": "Prodigal Disciple",
        "text": "When you make a save to resist becoming charmed or possessed, you can treat any d20 die roll of 9 or lower as though you rolled a 10."
      },
      {
        "name": "Quarry’s Cunning",
        "text": "You have proficiency in either the Deception or Insight skill."
      }
    ]
  },
  {
    "id": "wildlands",
    "name": "Wildlands",
    "flavor": "Wildlands heritage characters were raised in communities deeply entwined with Primordial magic. Some wild places well up with magic.",
    "languages": "You know Common and one additional language of your choice. Typical wildlands heritage characters choose Sylvan.",
    "traits": [
      {
        "name": "Beast Affinity",
        "text": "Using gestures and sounds, you can communicate simple ideas with Beasts and creatures with the Animal tag, and you have advantage on checks made to interact with such creatures."
      },
      {
        "name": "Shepherd’s Gift",
        "text": "You have proficiency in the Animal Handling skill. Any Beast or creature with the Animal tag whose CR is equal to or less than your PB that targets you with an attack must first make a WIS check contested by your WIS (Animal Handling)."
      }
    ]
  }
]

export function getHeritage(id: string | null): HeritageDef | undefined {
  return id ? HERITAGES.find((x) => x.id === id) : undefined
}
