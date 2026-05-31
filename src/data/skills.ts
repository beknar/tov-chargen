import type { Ability } from './abilities'

// The 18 skills and their governing abilities (Player's Guide).

export interface Skill {
  id: string
  name: string
  ability: Ability
}

export const SKILLS: Skill[] = [
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dex' },
  { id: 'animal-handling', name: 'Animal Handling', ability: 'wis' },
  { id: 'arcana', name: 'Arcana', ability: 'int' },
  { id: 'athletics', name: 'Athletics', ability: 'str' },
  { id: 'deception', name: 'Deception', ability: 'cha' },
  { id: 'history', name: 'History', ability: 'int' },
  { id: 'insight', name: 'Insight', ability: 'wis' },
  { id: 'intimidation', name: 'Intimidation', ability: 'cha' },
  { id: 'investigation', name: 'Investigation', ability: 'int' },
  { id: 'medicine', name: 'Medicine', ability: 'wis' },
  { id: 'nature', name: 'Nature', ability: 'int' },
  { id: 'perception', name: 'Perception', ability: 'wis' },
  { id: 'performance', name: 'Performance', ability: 'cha' },
  { id: 'persuasion', name: 'Persuasion', ability: 'cha' },
  { id: 'religion', name: 'Religion', ability: 'int' },
  { id: 'sleight-of-hand', name: 'Sleight of Hand', ability: 'dex' },
  { id: 'stealth', name: 'Stealth', ability: 'dex' },
  { id: 'survival', name: 'Survival', ability: 'wis' },
]

const BY_ID: Record<string, Skill> = Object.fromEntries(SKILLS.map((s) => [s.id, s]))
const ALL_IDS = SKILLS.map((s) => s.id)
// Match longest names first so "Animal Handling" wins over a bare "Animal".
const NAMES = [...SKILLS].sort((a, b) => b.name.length - a.name.length)

export function getSkill(id: string): Skill | undefined {
  return BY_ID[id]
}

/** A skill proficiency grant parsed from a class/background description. */
export interface SkillGrant {
  /** Always-granted skills. */
  fixed: string[]
  /** How many more to choose. */
  choose: number
  /** The skills you may choose from. */
  options: string[]
}

const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4 }

function findSkills(text: string): string[] {
  const found: string[] = []
  for (const s of NAMES) {
    if (new RegExp(`\\b${s.name}\\b`, 'i').test(text) && !found.includes(s.id)) {
      found.push(s.id)
    }
  }
  // return in canonical order
  return ALL_IDS.filter((id) => found.includes(id))
}

/** Parse a skill-proficiency string like "Choose two from A, B, or C". */
export function parseSkillGrant(text: string): SkillGrant {
  const any = text.match(/any (\w+) skill/i)
  if (any && WORD_NUM[any[1].toLowerCase()]) {
    return { fixed: [], choose: WORD_NUM[any[1].toLowerCase()], options: [...ALL_IDS] }
  }

  const pre = text.split(/\b(?:and )?choose\b|\band one skill\b|\band \w+ skill/i)[0]
  const fixed = findSkills(pre)

  const cm = text.match(/choose (\w+)|(\w+) skills? of your choice/i)
  const word = (cm?.[1] ?? cm?.[2] ?? '').toLowerCase()
  const choose = WORD_NUM[word] ?? 0

  const fm = text.match(/from (.+)/i)
  let options = findSkills(fm ? fm[1] : text).filter((id) => !fixed.includes(id))
  if (choose && options.length === 0) {
    options = ALL_IDS.filter((id) => !fixed.includes(id))
  }
  return { fixed, choose, options }
}
