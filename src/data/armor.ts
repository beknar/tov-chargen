import { abilityModifier, ABILITY_ABBR, type Ability } from './abilities'
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
  /** Cost in gp. */
  cost: number
}

export const ARMORS: ArmorDef[] = [
  { id: 'padded', name: 'Padded', category: 'light', baseAC: 11, strReq: null, stealthDisadvantage: true, cost: 5 },
  { id: 'leather', name: 'Leather', category: 'light', baseAC: 11, strReq: null, stealthDisadvantage: false, cost: 10 },
  { id: 'studded-leather', name: 'Studded Leather', category: 'light', baseAC: 12, strReq: null, stealthDisadvantage: false, cost: 45 },
  { id: 'brigandine', name: 'Brigandine', category: 'light', baseAC: 13, strReq: null, stealthDisadvantage: true, cost: 50 },
  { id: 'hide', name: 'Hide', category: 'medium', baseAC: 12, strReq: null, stealthDisadvantage: false, cost: 10 },
  { id: 'chain-shirt', name: 'Chain Shirt', category: 'medium', baseAC: 13, strReq: null, stealthDisadvantage: false, cost: 50 },
  { id: 'scale-mail', name: 'Scale Mail', category: 'medium', baseAC: 14, strReq: null, stealthDisadvantage: true, cost: 50 },
  { id: 'breastplate', name: 'Breastplate', category: 'medium', baseAC: 14, strReq: null, stealthDisadvantage: false, cost: 400 },
  { id: 'half-plate', name: 'Half Plate', category: 'medium', baseAC: 15, strReq: null, stealthDisadvantage: true, cost: 750 },
  { id: 'ring-mail', name: 'Ring Mail', category: 'heavy', baseAC: 15, strReq: null, stealthDisadvantage: true, cost: 30 },
  { id: 'chain-mail', name: 'Chain Mail', category: 'heavy', baseAC: 16, strReq: 13, stealthDisadvantage: true, cost: 75 },
  { id: 'splint', name: 'Splint', category: 'heavy', baseAC: 17, strReq: 15, stealthDisadvantage: true, cost: 200 },
  { id: 'plate', name: 'Plate', category: 'heavy', baseAC: 18, strReq: 16, stealthDisadvantage: true, cost: 1500 },
]

export const SHIELD_BONUS = 2
export const SHIELD_COST = 10

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
  /** Human-readable formula, e.g. "Chain Mail 16 + shield 2 = 18". */
  breakdown: string
}

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`)

/** Compute AC from armor (or unarmored defense / default) + shield. */
export function computeAC(
  scores: AbilityScores,
  classId: string | null,
  armorId: string | null,
  shield: boolean,
): AcResult {
  const dex = abilityModifier(scores.dex)
  const shieldBonus = shield ? SHIELD_BONUS : 0
  const shieldPart = shield ? ' + shield 2' : ''
  const armor = getArmor(armorId)

  if (armor) {
    let ac = armor.baseAC
    let dexPart = ''
    if (armor.category === 'light') {
      ac += dex
      dexPart = ` + DEX ${sign(dex)}`
    } else if (armor.category === 'medium') {
      ac += Math.min(dex, 2)
      dexPart = ` + DEX ${sign(Math.min(dex, 2))} (max 2)`
    }
    return {
      ac: ac + shieldBonus,
      source: `${armor.name}${shield ? ' + shield' : ''}`,
      breakdown: `${armor.name} ${armor.baseAC}${dexPart}${shieldPart} = ${ac + shieldBonus}`,
    }
  }

  // Unarmored
  const ud = classId ? UNARMORED_DEFENSE[classId] : undefined
  if (ud && (ud.shieldOk || !shield)) {
    const addParts = ud.add.map((a) => ` + ${ABILITY_ABBR[a]} ${sign(abilityModifier(scores[a]))}`)
    const ac = ud.base + ud.add.reduce((sum, a) => sum + abilityModifier(scores[a]), 0)
    return {
      ac: ac + shieldBonus,
      source: `Unarmored Defense${shield ? ' + shield' : ''}`,
      breakdown: `Unarmored Defense ${ud.base}${addParts.join('')}${shieldPart} = ${ac + shieldBonus}`,
    }
  }
  return {
    ac: 10 + dex + shieldBonus,
    source: `Unarmored${shield ? ' + shield' : ''}`,
    breakdown: `10 + DEX ${sign(dex)}${shieldPart} = ${10 + dex + shieldBonus}`,
  }
}
