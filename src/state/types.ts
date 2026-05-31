import { ABILITIES, type Ability } from '../data/abilities'
import type { ScoreMethod } from '../data/abilityScoreMethods'

export type AbilityScores = Record<Ability, number>

/** The full character model. Later-step fields are placeholders for now. */
export interface Character {
  name: string
  concept: string
  classId: string | null
  /** Subclass chosen for the class. */
  subclassId: string | null
  /** Optional rule: additional class ids beyond the primary class. */
  multiclasses: string[]
  scoreMethod: ScoreMethod | null
  abilityScores: AbilityScores
  /** Persisted 4d6-drop-lowest results when the rolling method is used. */
  rolledScores: number[] | null
  // Filled in by steps not yet implemented:
  lineageId: string | null
  heritageId: string | null
  backgroundId: string | null
  /** Skill proficiencies chosen from the class grant (skill ids). */
  classSkills: string[]
  /** Skill proficiencies from the background grant, incl. fixed (skill ids). */
  backgroundSkills: string[]
  /** Talent chosen from the background's options (talent name). */
  talentId: string | null
  /** Chosen cantrips (spell names). */
  cantrips: string[]
  /** Chosen 1st-circle spells (spell names). */
  spells: string[]
  /** Starting-equipment method: take granted gear, or roll for wealth. */
  equipmentMethod: 'granted' | 'wealth' | null
  /** Starting gold (Method 2), in gp. */
  gold: number | null
  /** Method 1: chosen option index per class starting-equipment line. */
  equipmentChoices: Record<string, number>
  /** Method 2: purchased shop items. */
  purchases: { id: string; qty: number }[]
  /** Optional magic items added to the character (item ids). */
  magicItems: string[]
  /** Equipped armor (armor id) for AC calculation. */
  armorId: string | null
  /** Whether a shield is equipped. */
  shield: boolean
}

export const DEFAULT_ABILITY_SCORES: AbilityScores = {
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
}

export const INITIAL_CHARACTER: Character = {
  name: '',
  concept: '',
  classId: null,
  subclassId: null,
  multiclasses: [],
  scoreMethod: null,
  abilityScores: { ...DEFAULT_ABILITY_SCORES },
  rolledScores: null,
  lineageId: null,
  heritageId: null,
  backgroundId: null,
  classSkills: [],
  backgroundSkills: [],
  talentId: null,
  cantrips: [],
  spells: [],
  equipmentMethod: null,
  gold: null,
  equipmentChoices: {},
  purchases: [],
  magicItems: [],
  armorId: null,
  shield: false,
}

export function freshCharacter(): Character {
  return { ...INITIAL_CHARACTER, abilityScores: { ...DEFAULT_ABILITY_SCORES } }
}

/** Coerce arbitrary parsed data (e.g. an imported file or old save) into a
 *  valid Character, dropping anything malformed. */
export function sanitizeCharacter(data: unknown): Character {
  const out = freshCharacter()
  if (!data || typeof data !== 'object') return out
  const d = data as Record<string, unknown>
  const str = (k: keyof Character) => {
    if (typeof d[k] === 'string') (out[k] as string) = d[k] as string
  }
  str('name')
  str('concept')
  for (const k of [
    'classId', 'subclassId', 'scoreMethod', 'talentId', 'lineageId', 'heritageId',
    'backgroundId', 'armorId', 'equipmentMethod',
  ] as const) {
    if (typeof d[k] === 'string') (out[k] as string | null) = d[k] as string
  }
  for (const k of [
    'multiclasses', 'classSkills', 'backgroundSkills', 'cantrips', 'spells', 'magicItems',
  ] as const) {
    if (Array.isArray(d[k])) out[k] = (d[k] as unknown[]).filter((x): x is string => typeof x === 'string')
  }
  if (typeof d.gold === 'number') out.gold = d.gold
  if (typeof d.shield === 'boolean') out.shield = d.shield
  if (Array.isArray(d.rolledScores)) {
    out.rolledScores = (d.rolledScores as unknown[]).filter((x): x is number => typeof x === 'number')
  }
  if (d.abilityScores && typeof d.abilityScores === 'object') {
    const a = d.abilityScores as Record<string, unknown>
    for (const ab of ABILITIES) if (typeof a[ab] === 'number') out.abilityScores[ab] = a[ab] as number
  }
  if (Array.isArray(d.purchases)) {
    out.purchases = (d.purchases as unknown[])
      .filter((p): p is { id: string; qty: number } =>
        !!p && typeof p === 'object' &&
        typeof (p as Record<string, unknown>).id === 'string' &&
        typeof (p as Record<string, unknown>).qty === 'number')
      .map((p) => ({ id: p.id, qty: p.qty }))
  }
  if (d.equipmentChoices && typeof d.equipmentChoices === 'object') {
    const ec: Record<string, number> = {}
    for (const [k, v] of Object.entries(d.equipmentChoices as Record<string, unknown>)) {
      if (typeof v === 'number') ec[k] = v
    }
    out.equipmentChoices = ec
  }
  return out
}
