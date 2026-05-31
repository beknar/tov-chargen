// Subclasses per class (Player's Guide, Chapter 2). A character chooses a
// subclass as they advance (typically 3rd level); offered here at creation.
// Extracted from the rules reference (name + flavor lead).

export interface SubclassDef {
  id: string
  name: string
  flavor: string
}

export const SUBCLASSES: Record<string, SubclassDef[]> = {
  "barbarian": [
    {
      "id": "berserker",
      "name": "Berserker",
      "flavor": "Through primal rite or natural bloodthirst, some barbarians can work themselves into a rage so ferocious and explosively violent that it risks breaking their bodies."
    },
    {
      "id": "wild-fury",
      "name": "Wild Fury",
      "flavor": "Barbarians that travel the path of Wild Fury share an affinity and connection with the most ferocious and cunning animals of the natural world."
    }
  ],
  "bard": [
    {
      "id": "lore",
      "name": "Lore",
      "flavor": "Bards who align with the college of Lore value knowledge most highly."
    },
    {
      "id": "victory",
      "name": "Victory",
      "flavor": "Bards who align with the college of Victory are tacticians who thrive in the heat of battle."
    }
  ],
  "cleric": [
    {
      "id": "life-domain",
      "name": "Life Domain",
      "flavor": "Gods of the Life domain celebrate natural cycles of life and death, exemplifying health and vitality."
    },
    {
      "id": "light-domain",
      "name": "Light Domain",
      "flavor": "Gods of the Light domain dedicate themselves to bringing light and warmth to the people of the world, burning away darkness and the evils that it hides."
    },
    {
      "id": "war-domain",
      "name": "War Domain",
      "flavor": "Gods of the War domain celebrate strength, the glory of victory, and the thrill of competition."
    }
  ],
  "druid": [
    {
      "id": "leaf",
      "name": "Leaf",
      "flavor": "Druids who align with the ring of the Leaf feel a deep connection to plants. Leaf druids are drawn to the quiet, natural spaces of the world."
    },
    {
      "id": "shifter",
      "name": "Shifter",
      "flavor": "Druids that align with the ring of the Shifter feel a deep connection to the animals that walk the world."
    }
  ],
  "fighter": [
    {
      "id": "spell-blade",
      "name": "Spell Blade",
      "flavor": "Fighters of the Spell Blade discipline view fighting with swords and sorcery as a logical marriage of power. For you,."
    },
    {
      "id": "weapon-master",
      "name": "Weapon Master",
      "flavor": "Most fighters feel a deep connection to their weapons, but none more so than the Weapon Master."
    }
  ],
  "mechanist": [
    {
      "id": "metallurgist",
      "name": "Metallurgist",
      "flavor": "Mechanists who pursue the Metallurgist’s craft delight in the thrill of combat and engineered armaments."
    },
    {
      "id": "spellwright",
      "name": "Spellwright",
      "flavor": "Mechanists who pursue the Spellwright’s craft are fascinated by the intricacies of magic and its potential to enhance their creations."
    }
  ],
  "monk": [
    {
      "id": "flickering-dark",
      "name": "Flickering Dark",
      "flavor": "Those few monks who coax and feed the shadows from beyond the veil may bond with the all-consuming darkness."
    },
    {
      "id": "open-hand",
      "name": "Open Hand",
      "flavor": "Monks of the Open Hand hone their bodies to physical perfection."
    }
  ],
  "paladin": [
    {
      "id": "devotion",
      "name": "Devotion",
      "flavor": "Swearing an oath of Devotion binds a paladin to the principles of duty, honor, justice, and order."
    },
    {
      "id": "justice",
      "name": "Justice",
      "flavor": "Swearing an oath of Justice binds a paladin to the purpose of bringing great evil to justice."
    }
  ],
  "ranger": [
    {
      "id": "hunter",
      "name": "Hunter",
      "flavor": "Rangers who heed the calling of the Hunter are no mere trappers or furriers. They are the last line of defense between."
    },
    {
      "id": "pack-master",
      "name": "Pack Master",
      "flavor": "Pack masters rarely choose this calling, rather they are chosen by it. Rangers who heed the call of the Pack Master are the appointed guardians of wild creatures."
    }
  ],
  "rogue": [
    {
      "id": "enforcer",
      "name": "Enforcer",
      "flavor": "Enforcers excel at practical violence."
    },
    {
      "id": "thief",
      "name": "Thief",
      "flavor": "You have a reputation for quick thinking and quicker fingers. Leave throat-cutting and con-running to lesser scoundrels."
    }
  ],
  "sorcerer": [
    {
      "id": "chaos",
      "name": "Chaos",
      "flavor": "Be it a blessing or a curse, your innate magic stems from the churning chaos that spawned reality."
    },
    {
      "id": "draconic",
      "name": "Draconic",
      "flavor": "Through lineage, bargain, or unrequited gift, the origins of your magic lie in the preternatural power of dragons."
    }
  ],
  "warlock": [
    {
      "id": "fiend",
      "name": "Fiend",
      "flavor": "Your patron is a greater fiend who holds dominion over lesser demons or devils."
    },
    {
      "id": "reaper",
      "name": "Reaper",
      "flavor": "Your patron is a formless entity given life by an endless hunger for death."
    }
  ],
  "wizard": [
    {
      "id": "battle-mage",
      "name": "Battle Mage",
      "flavor": "Wizards who follow the Battle Mage tradition aren't interested in theoretical musings or tedious experiments."
    },
    {
      "id": "cantrip-adept",
      "name": "Cantrip Adept",
      "flavor": "It’s easy to dismiss the cantrip as an unsophisticated afterthought plied by hedge wizards. But clever, cautious wizards sometimes specialize in these humble magics."
    }
  ]
}

export function getSubclasses(classId: string | null): SubclassDef[] {
  return classId ? (SUBCLASSES[classId] ?? []) : []
}

export function getSubclass(classId: string | null, subclassId: string | null): SubclassDef | undefined {
  if (!classId || !subclassId) return undefined
  return (SUBCLASSES[classId] ?? []).find((s) => s.id === subclassId)
}
