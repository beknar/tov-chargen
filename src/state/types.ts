import type { Ability } from '../data/abilities'
import type { ScoreMethod } from '../data/abilityScoreMethods'

export type AbilityScores = Record<Ability, number>

/** The full character model. Later-step fields are placeholders for now. */
export interface Character {
  name: string
  concept: string
  classId: string | null
  scoreMethod: ScoreMethod | null
  abilityScores: AbilityScores
  /** Persisted 4d6-drop-lowest results when the rolling method is used. */
  rolledScores: number[] | null
  // Filled in by steps not yet implemented:
  lineageId: string | null
  heritageId: string | null
  backgroundId: string | null
  /** Talent chosen from the background's options (talent name). */
  talentId: string | null
  /** Starting-equipment method: take granted gear, or roll for wealth. */
  equipmentMethod: 'granted' | 'wealth' | null
  /** Starting gold (Method 2), in gp. */
  gold: number | null
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
  scoreMethod: null,
  abilityScores: { ...DEFAULT_ABILITY_SCORES },
  rolledScores: null,
  lineageId: null,
  heritageId: null,
  backgroundId: null,
  talentId: null,
  equipmentMethod: null,
  gold: null,
}
