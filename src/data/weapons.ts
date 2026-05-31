// Weapon catalog with combat data (Player's Guide, Chapter 5), extracted from
// the weapon table: category (simple/martial), kind (melee/ranged), damage,
// properties, and thrown/ammunition range.

export type WeaponCategory = 'simple' | 'martial'
export type WeaponKind = 'melee' | 'ranged'

export interface Weapon {
  id: string
  name: string
  costGp: number
  category: WeaponCategory
  kind: WeaponKind
  /** e.g. "1d8 slashing" or "1d8/1d10 slashing" (versatile). */
  damage: string
  properties: string[]
  /** [normal, long] thrown/ammunition range in feet, if any. */
  range: [number, number] | null
}

export const WEAPONS: Weapon[] = [{"id":"club","name":"Club","costGp":0.1,"category":"simple","kind":"melee","damage":"1d4 bludgeoning","properties":["Light"],"range":null},{"id":"dagger","name":"Dagger","costGp":2.0,"category":"simple","kind":"melee","damage":"1d4 piercing","properties":["Finesse","Light","Thrown"],"range":null},{"id":"greatclub","name":"Greatclub","costGp":0.2,"category":"simple","kind":"melee","damage":"1d8 bludgeoning","properties":["Two-handed"],"range":null},{"id":"handaxe","name":"Handaxe","costGp":5.0,"category":"simple","kind":"melee","damage":"1d6 slashing","properties":["Light","Thrown"],"range":[20,60]},{"id":"javelin","name":"Javelin","costGp":0.5,"category":"simple","kind":"melee","damage":"1d6 piercing","properties":["Thrown"],"range":[30,120]},{"id":"light-hammer","name":"Light hammer","costGp":0.2,"category":"simple","kind":"melee","damage":"1d4 bludgeoning","properties":["Light","Thrown"],"range":[20,60]},{"id":"mace","name":"Mace","costGp":5.0,"category":"simple","kind":"melee","damage":"1d6 bludgeoning","properties":[],"range":null},{"id":"quarterstaff","name":"Quarterstaff","costGp":0.2,"category":"simple","kind":"melee","damage":"1d6/1d8 bludgeoning","properties":["Versatile"],"range":null},{"id":"sickle","name":"Sickle","costGp":1.0,"category":"simple","kind":"melee","damage":"1d4 slashing","properties":["Light"],"range":null},{"id":"spear","name":"Spear","costGp":1.0,"category":"simple","kind":"melee","damage":"1d6/1d8 piercing","properties":["Thrown","Versatile"],"range":[20,60]},{"id":"crossbow-light","name":"Crossbow, light","costGp":25.0,"category":"simple","kind":"ranged","damage":"1d8 piercing","properties":["Ammunition"],"range":[80,320]},{"id":"dart","name":"Dart","costGp":0.05,"category":"simple","kind":"ranged","damage":"1d4 piercing","properties":["Finesse","Thrown"],"range":[20,60]},{"id":"shortbow","name":"Shortbow","costGp":25.0,"category":"simple","kind":"ranged","damage":"1d6 piercing","properties":["Ammunition"],"range":[80,320]},{"id":"battleaxe","name":"Battleaxe","costGp":10.0,"category":"martial","kind":"melee","damage":"1d8/1d10 slashing","properties":["Versatile"],"range":null},{"id":"flail","name":"Flail","costGp":10.0,"category":"martial","kind":"melee","damage":"1d8 bludgeoning","properties":[],"range":null},{"id":"glaive","name":"Glaive","costGp":20.0,"category":"martial","kind":"melee","damage":"1d10 slashing","properties":["Heavy","Two-handed","Reach"],"range":null},{"id":"greataxe","name":"Greataxe","costGp":30.0,"category":"martial","kind":"melee","damage":"1d12 slashing","properties":["Heavy","Two-handed"],"range":null},{"id":"greatsword","name":"Greatsword","costGp":50.0,"category":"martial","kind":"melee","damage":"2d6 slashing","properties":["Heavy","Two-handed"],"range":null},{"id":"halberd","name":"Halberd","costGp":20.0,"category":"martial","kind":"melee","damage":"1d10 slashing","properties":["Heavy","Two-handed","Reach"],"range":null},{"id":"lance","name":"Lance","costGp":10.0,"category":"martial","kind":"melee","damage":"1d12 piercing","properties":["Reach","Special"],"range":null},{"id":"longsword","name":"Longsword","costGp":15.0,"category":"martial","kind":"melee","damage":"1d8/1d10 slashing","properties":["Versatile"],"range":null},{"id":"maul","name":"Maul","costGp":10.0,"category":"martial","kind":"melee","damage":"2d6 bludgeoning","properties":["Heavy","Two-handed"],"range":null},{"id":"morningstar","name":"Morningstar","costGp":15.0,"category":"martial","kind":"melee","damage":"1d8 piercing","properties":[],"range":null},{"id":"pike","name":"Pike","costGp":5.0,"category":"martial","kind":"melee","damage":"1d10 piercing","properties":["Heavy","Two-handed","Reach"],"range":null},{"id":"rapier","name":"Rapier","costGp":25.0,"category":"martial","kind":"melee","damage":"1d8 piercing","properties":["Finesse"],"range":null},{"id":"scimitar","name":"Scimitar","costGp":25.0,"category":"martial","kind":"melee","damage":"1d6 slashing","properties":["Finesse","Light"],"range":null},{"id":"scythe","name":"Scythe","costGp":20.0,"category":"martial","kind":"melee","damage":"2d4 slashing","properties":["Two-handed","Reach"],"range":null},{"id":"shortsword","name":"Shortsword","costGp":10.0,"category":"martial","kind":"melee","damage":"1d6 piercing","properties":["Finesse","Light"],"range":null},{"id":"trident","name":"Trident","costGp":5.0,"category":"martial","kind":"melee","damage":"1d6/1d8 piercing","properties":["Thrown","Versatile"],"range":[20,60]},{"id":"war-pick","name":"War pick","costGp":5.0,"category":"martial","kind":"melee","damage":"1d8 piercing","properties":[],"range":null},{"id":"warhammer","name":"Warhammer","costGp":15.0,"category":"martial","kind":"melee","damage":"1d8/1d10 bludgeoning","properties":["Versatile"],"range":null},{"id":"whip","name":"Whip","costGp":2.0,"category":"martial","kind":"melee","damage":"1d4 slashing","properties":["Finesse","Reach"],"range":null},{"id":"blowgun","name":"Blowgun","costGp":10.0,"category":"martial","kind":"ranged","damage":"1 piercing","properties":["Ammunition"],"range":[25,100]},{"id":"crossbow-hand","name":"Crossbow, hand","costGp":75.0,"category":"martial","kind":"ranged","damage":"1d6 piercing","properties":["Ammunition"],"range":[30,120]},{"id":"crossbow-heavy","name":"Crossbow, heavy","costGp":50.0,"category":"martial","kind":"ranged","damage":"1d10 piercing","properties":["Ammunition"],"range":[100,400]},{"id":"longbow","name":"Longbow","costGp":50.0,"category":"martial","kind":"ranged","damage":"1d8 piercing","properties":["Ammunition"],"range":[150,600]}]

const BY_ID: Record<string, Weapon> = Object.fromEntries(WEAPONS.map((w) => [w.id, w]))

export function getWeapon(id: string): Weapon | undefined {
  return BY_ID[id]
}

export function hasProp(w: Weapon, prop: string): boolean {
  return w.properties.some((p) => p.toLowerCase() === prop.toLowerCase())
}

/** Parse "1d8/1d10 slashing" -> { base, versatile, type }. */
export function parseDamage(damage: string): { base: string; versatile: string | null; type: string } {
  const m = damage.match(/^(\d+d?\d*)(?:\/(\d+d\d+))?\s+(\w+)/)
  if (!m) return { base: damage, versatile: null, type: '' }
  return { base: m[1], versatile: m[2] ?? null, type: m[3] }
}
