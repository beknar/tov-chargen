import { abilityModifier, type Ability } from './abilities'
import type { AbilityScores } from '../state/types'

// Armor (Player's Guide, Chapter 5). AC equations:
//   light  → baseAC + DEX
//   medium → baseAC + min(DEX, 2)
//   heavy  → baseAC (DEX does not apply)
// A shield adds +2. Values extracted from the rules reference Armor table.

export type ArmorCategory = 'light' | 'medium' | 'heavy'

export interface ArmorDef {
  id: string
  name: string
  category: ArmorCategory
  baseAC: number
  /** Minimum STR to use without penalty (heavy armor), if any. */
  strReq: number | null
  /** Stealth disadvantage ("Noisy" property). */
  stealthDisadvantage: boolean
}

export const ARMORS: ArmorDef[] = [
  { id: 'padded', name: 'Padded', category: 'light', baseAC: 11, strReq: null, stealthDisadvantage: true },
  { id: 'leather', name: 'Leather', category: 'light', baseAC: 11, strReq: null, stealthDisadvantage: false },
  { id: 'studded-leather', name: 'Studded Leather', category: 'light', baseAC: 12, strReq: null, stealthDisadvantage: false },
  { id: 'brigandine', name: 'Brigandine', category: 'light', baseAC: 13, strReq: null, stealthDisadvantage: true },
  { id: 'hide', name: 'Hide', category: 'medium', baseAC: 12, strReq: null, stealthDisadvantage: false },
  { id: 'chain-shirt', name: 'Chain Shirt', category: 'medium', baseAC: 13, strReq: null, stealthDisadvantage: false },
  { id: 'scale-mail', name: 'Scale Mail', category: 'medium', baseAC: 14, strReq: null, stealthDisadvantage: true },
  { id: 'breastplate', name: 'Breastplate', category: 'medium', baseAC: 14, strReq: null, stealthDisadvantage: false },
  { id: 'half-plate', name: 'Half Plate', category: 'medium', baseAC: 15, strReq: null, stealthDisadvantage: true },
  { id: 'ring-mail', name: 'Ring Mail', category: 'heavy', baseAC: 15, strReq: null, stealthDisadvantage: true },
  { id: 'chain-mail', name: 'Chain Mail', category: 'heavy', baseAC: 16, strReq: 13, stealthDisadvantage: true },
  { id: 'splint', name: 'Splint', category: 'heavy', baseAC: 17, strReq: 15, stealthDisadvantage: true },
  { id: 'plate', name: 'Plate', category: 'heavy', baseAC: 18, strReq: 16, stealthDisadvantage: true },
]

export const SHIELD_BONUS = 2

export function getArmor(id: string | null): ArmorDef | undefined {
  return id ? ARMORS.find((a) => a.id === id) : undefined
}

/** Classes with an Unarmored Defense feature and their AC formula abilities. */
const UNARMORED_DEFENSE: Record<string, { base: number; add: Ability[]; shieldOk: boolean }> = {
  barbarian: { base: 13, add: ['con'], shieldOk: true }, // 13 + CON (no DEX)
  monk: { base: 10, add: ['dex', 'wis'], shieldOk: false }, // 10 + DEX + WIS
}

export interface AcResult {
  ac: number
  source: string
}

/** Compute AC from armor (or unarmored defense / default) + shield. */
export function computeAC(
  scores: AbilityScores,
  classId: string | null,
  armorId: string | null,
  shield: boolean,
): AcResult {
  const dex = abilityModifier(scores.dex)
  const shieldBonus = shield ? SHIELD_BONUS : 0
  const armor = getArmor(armorId)

  if (armor) {
    let ac = armor.baseAC
    if (armor.category === 'light') ac += dex
    else if (armor.category === 'medium') ac += Math.min(dex, 2)
    return { ac: ac + shieldBonus, source: `${armor.name}${shield ? ' + shield' : ''}` }
  }

  // Unarmored
  const ud = classId ? UNARMORED_DEFENSE[classId] : undefined
  if (ud && (ud.shieldOk || !shield)) {
    const ac = ud.base + ud.add.reduce((sum, a) => sum + abilityModifier(scores[a]), 0)
    return {
      ac: ac + shieldBonus,
      source: `Unarmored Defense${shield ? ' + shield' : ''}`,
    }
  }
  return { ac: 10 + dex + shieldBonus, source: `Unarmored${shield ? ' + shield' : ''}` }
}
