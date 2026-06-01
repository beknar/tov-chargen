import { abilityModifier, formatModifier, ABILITY_ABBR, type Ability } from './abilities'
import { getClass } from './classes'
import { hasProp, parseDamage, type Weapon } from './weapons'
import type { AbilityScores, Character } from '../state/types'

/** Proficiency bonus at 1st level. */
export const PB = 2

/** Whether the character is proficient with a weapon, from class proficiencies. */
export function weaponProficient(character: Character, weapon: Weapon): boolean {
  const cls = getClass(character.classId)
  if (!cls) return false
  const text = cls.proficiencies.weapons.toLowerCase()
  if (text.includes('all weapons')) return true
  if (weapon.category === 'simple' && text.includes('simple')) return true
  if (weapon.category === 'martial') {
    if (text.includes('finesse')) return hasProp(weapon, 'Finesse')
    if (text.includes('martial')) return true
  }
  // specific named weapons (e.g. "shortswords", "daggers, light crossbows")
  const words = weapon.name.toLowerCase().replace(/[(),]/g, '').split(/\s+/).filter((w) => w.length > 2)
  return words.length > 0 && words.every((w) => text.includes(w) || text.includes(w.replace(/s$/, '')))
}

export interface Attack {
  name: string
  /** ability used for attack/damage */
  ability: Ability
  attackBonus: number
  proficient: boolean
  damage: string
  range: string
  properties: string[]
  /** How the attack bonus was derived, e.g. "STR +3 + PB +2 = +5". */
  bonusCalc: string
  /** How the damage was derived, e.g. "1d8 + STR +3". */
  damageCalc: string
}

/** Which ability a weapon attack uses (STR melee, DEX ranged, best for finesse). */
function attackAbility(weapon: Weapon, scores: AbilityScores): Ability {
  const str = abilityModifier(scores.str)
  const dex = abilityModifier(scores.dex)
  if (weapon.kind === 'ranged') return 'dex'
  if (hasProp(weapon, 'Finesse')) return dex > str ? 'dex' : 'str'
  return 'str'
}

function rangeText(weapon: Weapon): string {
  if (weapon.range) return `${weapon.range[0]}/${weapon.range[1]} ft`
  if (hasProp(weapon, 'Reach')) return '10 ft (reach)'
  return '5 ft'
}

export function weaponAttack(character: Character, weapon: Weapon): Attack {
  const ability = attackAbility(weapon, character.abilityScores)
  const mod = abilityModifier(character.abilityScores[ability])
  const prof = weaponProficient(character, weapon)
  const abbr = ABILITY_ABBR[ability]
  const dmg = parseDamage(weapon.damage)
  const dmgMod = mod !== 0 ? formatModifier(mod) : ''
  let damage = `${dmg.base}${dmgMod} ${dmg.type}`.trim()
  if (dmg.versatile) damage += ` (${dmg.versatile}${dmgMod} two-handed)`
  const attackBonus = mod + (prof ? PB : 0)
  return {
    name: weapon.name,
    ability,
    attackBonus,
    proficient: prof,
    damage,
    range: rangeText(weapon),
    properties: weapon.properties,
    bonusCalc: `${abbr} ${formatModifier(mod)}${prof ? ' + PB +2' : ' (not proficient, no PB)'} = ${formatModifier(attackBonus)}`,
    damageCalc: `${dmg.base}${mod !== 0 ? ` + ${abbr} ${formatModifier(mod)}` : ''} ${dmg.type}`.trim(),
  }
}

/** The unarmed strike everyone has. */
export function unarmedStrike(character: Character): Attack {
  const cls = getClass(character.classId)
  const str = abilityModifier(character.abilityScores.str)
  // Monk Martial Arts lets you use DEX and a die; otherwise 1 + STR bludgeoning.
  const monk = cls?.id === 'monk'
  const dex = abilityModifier(character.abilityScores.dex)
  const useDex = monk && dex > str
  const mod = useDex ? dex : str
  const abbr = useDex ? 'DEX' : 'STR'
  const dmgMod = mod !== 0 ? formatModifier(mod) : ''
  return {
    name: 'Unarmed Strike',
    ability: useDex ? 'dex' : 'str',
    attackBonus: mod + PB,
    proficient: true,
    damage: monk ? `1d6${dmgMod} bludgeoning (Martial Arts)` : `${1 + str} bludgeoning`,
    range: '5 ft',
    properties: [],
    bonusCalc: `${abbr} ${formatModifier(mod)} + PB +2 = ${formatModifier(mod + PB)}`,
    damageCalc: monk
      ? `1d6${mod !== 0 ? ` + ${abbr} ${formatModifier(mod)}` : ''} bludgeoning`
      : `1 + STR ${formatModifier(str)} = ${1 + str} bludgeoning`,
  }
}
