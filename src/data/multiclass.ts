import { ABILITY_ABBR, type Ability } from './abilities'
import type { AbilityScores } from '../state/types'

// Optional multiclassing (Player's Guide). To take a level in a class you must
// meet the ability-score prerequisites of BOTH your current class and the new
// one. A prerequisite is a list of groups: you need a 13+ in ANY ability within
// each group, and ALL groups must be satisfied (e.g. Ranger = (STR or DEX) and WIS).

export const MULTICLASS_PREREQ: Record<string, Ability[][]> = {
  "barbarian": [
    [
      "str"
    ]
  ],
  "bard": [
    [
      "cha"
    ]
  ],
  "cleric": [
    [
      "wis"
    ]
  ],
  "druid": [
    [
      "wis"
    ]
  ],
  "fighter": [
    [
      "str",
      "dex"
    ]
  ],
  "mechanist": [
    [
      "int"
    ]
  ],
  "monk": [
    [
      "dex"
    ],
    [
      "wis"
    ]
  ],
  "paladin": [
    [
      "str"
    ],
    [
      "cha"
    ]
  ],
  "ranger": [
    [
      "str",
      "dex"
    ],
    [
      "wis"
    ]
  ],
  "rogue": [
    [
      "dex"
    ]
  ],
  "sorcerer": [
    [
      "cha"
    ]
  ],
  "warlock": [
    [
      "cha"
    ]
  ],
  "wizard": [
    [
      "int"
    ]
  ]
}

const THRESHOLD = 13

export function meetsPrereq(scores: AbilityScores, classId: string): boolean {
  const groups = MULTICLASS_PREREQ[classId] ?? []
  return groups.every((group) => group.some((a) => scores[a] >= THRESHOLD))
}

/** Human-readable prerequisite, e.g. "STR or DEX 13, and WIS 13". */
export function prereqText(classId: string): string {
  const groups = MULTICLASS_PREREQ[classId] ?? []
  if (groups.length === 0) return '—'
  return groups.map((g) => g.map((a) => ABILITY_ABBR[a]).join(' or ') + ' 13').join(', and ')
}

/** Can the character (with the given primary class) multiclass into `toClassId`? */
export function canMulticlass(scores: AbilityScores, fromClassId: string | null, toClassId: string): boolean {
  if (!fromClassId) return false
  return meetsPrereq(scores, fromClassId) && meetsPrereq(scores, toClassId)
}
