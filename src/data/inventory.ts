import { WEAPONS, getWeapon } from './weapons'
import { ARMORS, getArmor } from './armor'
import { getClass } from './classes'
import { getBackground } from './backgrounds'
import { parseEquipmentOptions } from './shop'
import type { Character } from '../state/types'

export interface Inventory {
  weaponIds: string[]
  armorIds: string[]
  hasShield: boolean
  magicItemIds: string[]
}

/** Match catalog item names appearing in free-text gear, longest name first so
 *  e.g. "studded leather" wins over "leather". */
function matchNames(text: string, items: { id: string; name: string }[]): string[] {
  let t = ` ${text.toLowerCase()} `
  const found: string[] = []
  for (const it of [...items].sort((a, b) => b.name.length - a.name.length)) {
    const words = it.name.toLowerCase().replace(/[(),]/g, '').split(/\s+/).filter((w) => w.length > 2)
    if (words.length === 0) continue
    if (words.every((w) => t.includes(w) || t.includes(w.replace(/s$/, '')))) {
      found.push(it.id)
      for (const w of words) t = t.replace(new RegExp(w, 'g'), ' ') // consume so shorter names don't re-match
    }
  }
  return found
}

/** Resolve the concrete items a character owns from their chosen gear. */
export function deriveInventory(c: Character): Inventory {
  const weapons = new Set<string>()
  const armor = new Set<string>()
  let shield = false

  for (const p of c.purchases) {
    if (getWeapon(p.id)) weapons.add(p.id)
    else if (getArmor(p.id)) armor.add(p.id)
    else if (p.id === 'shield') shield = true
  }

  if (c.equipmentMethod === 'granted') {
    const lines: string[] = []
    const cls = getClass(c.classId)
    if (cls) {
      cls.startingEquipment.forEach((line, i) => {
        const opts = parseEquipmentOptions(line)
        lines.push(opts.length > 1 ? opts[c.equipmentChoices[String(i)] ?? 0] : opts[0])
      })
    }
    const bg = getBackground(c.backgroundId)
    if (bg) lines.push(bg.equipment)
    const text = lines.join(' ; ')
    matchNames(text, WEAPONS).forEach((id) => weapons.add(id))
    matchNames(text, ARMORS).forEach((id) => armor.add(id))
    if (/\bshields?\b/i.test(text)) shield = true
    // specific weapons chosen for generic slots ("a martial weapon")
    for (const ids of Object.values(c.weaponChoices)) {
      for (const id of ids) if (getWeapon(id)) weapons.add(id)
    }
  }

  // whatever is equipped for AC is also owned
  if (c.armorId) armor.add(c.armorId)
  if (c.shield) shield = true

  return {
    weaponIds: [...weapons],
    armorIds: [...armor],
    hasShield: shield,
    magicItemIds: c.magicItems,
  }
}
