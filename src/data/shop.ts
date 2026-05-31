import { ARMORS, SHIELD_COST } from './armor'

// Buyable equipment catalog with gp prices (Player's Guide, Chapter 5).
// Armor is sourced from armor.ts; weapons, packs, and gear are extracted from
// the rules reference. Prices are in gp (1 sp = 0.1 gp, 1 cp = 0.01 gp).

export interface ShopItem {
  id: string
  name: string
  costGp: number
  /** Optional note, e.g. weapon damage. */
  note?: string
}

export interface ShopCategory {
  name: string
  items: ShopItem[]
}

const ARMOR_ITEMS: ShopItem[] = [
  ...ARMORS.map((a) => ({ id: a.id, name: a.name, costGp: a.cost, note: `AC ${a.baseAC}` })),
  { id: 'shield', name: 'Shield', costGp: SHIELD_COST, note: '+2 AC' },
]

export const SHOP: ShopCategory[] = [
  { name: 'Armor', items: ARMOR_ITEMS },
  { name: "Weapons", items: [{"id": "club", "name": "Club", "costGp": 0.1, "note": "1d4 bludgeoning"}, {"id": "dagger", "name": "Dagger", "costGp": 2.0, "note": "1d4 piercing"}, {"id": "greatclub", "name": "Greatclub", "costGp": 0.2, "note": "1d8 bludgeoning"}, {"id": "handaxe", "name": "Handaxe", "costGp": 5.0, "note": "1d6 slashing"}, {"id": "javelin", "name": "Javelin", "costGp": 0.5, "note": "1d6 piercing"}, {"id": "light-hammer", "name": "Light hammer", "costGp": 0.2, "note": "1d4 bludgeoning"}, {"id": "mace", "name": "Mace", "costGp": 5.0, "note": "1d6 bludgeoning"}, {"id": "quarterstaff", "name": "Quarterstaff", "costGp": 0.2, "note": "1d6/1d8 bludgeoning"}, {"id": "sickle", "name": "Sickle", "costGp": 1.0, "note": "1d4 slashing"}, {"id": "spear", "name": "Spear", "costGp": 1.0, "note": "1d6/1d8 piercing"}, {"id": "crossbow-light", "name": "Crossbow, light", "costGp": 25.0, "note": "1d8 piercing"}, {"id": "dart", "name": "Dart", "costGp": 0.05, "note": "1d4 piercing"}, {"id": "shortbow", "name": "Shortbow", "costGp": 25.0, "note": "1d6 piercing"}, {"id": "sling", "name": "Sling", "costGp": 0.1, "note": "1d4 bludgeoning"}, {"id": "battleaxe", "name": "Battleaxe", "costGp": 10.0, "note": "1d8/1d10 slashing"}, {"id": "flail", "name": "Flail", "costGp": 10.0, "note": "1d8 bludgeoning"}, {"id": "glaive", "name": "Glaive", "costGp": 20.0, "note": "1d10 slashing"}, {"id": "greataxe", "name": "Greataxe", "costGp": 30.0, "note": "1d12 slashing"}, {"id": "greatsword", "name": "Greatsword", "costGp": 50.0, "note": "2d6 slashing"}, {"id": "halberd", "name": "Halberd", "costGp": 20.0, "note": "1d10 slashing"}, {"id": "lance", "name": "Lance", "costGp": 10.0, "note": "1d12 piercing"}, {"id": "longsword", "name": "Longsword", "costGp": 15.0, "note": "1d8/1d10 slashing"}, {"id": "maul", "name": "Maul", "costGp": 10.0, "note": "2d6 bludgeoning"}, {"id": "morningstar", "name": "Morningstar", "costGp": 15.0, "note": "1d8 piercing"}, {"id": "pike", "name": "Pike", "costGp": 5.0, "note": "1d10 piercing"}, {"id": "rapier", "name": "Rapier", "costGp": 25.0, "note": "1d8 piercing"}, {"id": "scimitar", "name": "Scimitar", "costGp": 25.0, "note": "1d6 slashing"}, {"id": "scythe", "name": "Scythe", "costGp": 20.0, "note": "2d4 slashing"}, {"id": "shortsword", "name": "Shortsword", "costGp": 10.0, "note": "1d6 piercing"}, {"id": "trident", "name": "Trident", "costGp": 5.0, "note": "1d6/1d8 piercing"}, {"id": "war-pick", "name": "War pick", "costGp": 5.0, "note": "1d8 piercing"}, {"id": "warhammer", "name": "Warhammer", "costGp": 15.0, "note": "1d8/1d10 bludgeoning"}, {"id": "whip", "name": "Whip", "costGp": 2.0, "note": "1d4 slashing"}, {"id": "blowgun", "name": "Blowgun", "costGp": 10.0, "note": "1 piercing"}, {"id": "crossbow-hand", "name": "Crossbow, hand", "costGp": 75.0, "note": "1d6 piercing"}, {"id": "crossbow-heavy", "name": "Crossbow, heavy", "costGp": 50.0, "note": "1d10 piercing"}, {"id": "longbow", "name": "Longbow", "costGp": 50.0, "note": "1d8 piercing"}] },
  { name: "Packs", items: [{"id": "burglar-s-pack", "name": "Burglar’s Pack", "costGp": 16.0}, {"id": "diplomat-s-pack", "name": "Diplomat’s Pack", "costGp": 39.0}, {"id": "dungeoneer-s-pack", "name": "Dungeoneer’s Pack", "costGp": 12.0}, {"id": "entertainer-s-pack", "name": "Entertainer’s Pack", "costGp": 40.0}, {"id": "explorer-s-pack", "name": "Explorer’s Pack", "costGp": 10.0}, {"id": "priest-s-pack", "name": "Priest’s Pack", "costGp": 19.0}, {"id": "scholar-s-pack", "name": "Scholar’s Pack", "costGp": 40.0}] },
  { name: "Adventuring Gear", items: [{"id": "abacus", "name": "Abacus", "costGp": 2.0}, {"id": "acid-vial", "name": "Acid (vial)", "costGp": 25.0}, {"id": "alchemist-s-fire-flask", "name": "Alchemist’s fire (flask)", "costGp": 50.0}, {"id": "oil-flask", "name": "Oil (flask)", "costGp": 0.1}, {"id": "arrows-20", "name": "Arrows (20)", "costGp": 1.0}, {"id": "blowgun-needles-50", "name": "Blowgun needles (50)", "costGp": 1.0}, {"id": "crossbow-bolts-20", "name": "Crossbow bolts (20)", "costGp": 1.0}, {"id": "sling-bullets-20", "name": "Sling bullets (20)", "costGp": 0.04}, {"id": "ball-bearings-bag-of-1-000", "name": "Ball bearings (bag of 1,000)", "costGp": 1.0}, {"id": "bedroll", "name": "Bedroll", "costGp": 1.0}, {"id": "bell", "name": "Bell", "costGp": 1.0}, {"id": "blanket", "name": "Blanket", "costGp": 0.5}, {"id": "block-and-tackle", "name": "Block and tackle", "costGp": 1.0}, {"id": "book", "name": "Book", "costGp": 25.0}, {"id": "caltrops-bag-of-20", "name": "Caltrops (bag of 20)", "costGp": 1.0}, {"id": "candle", "name": "Candle", "costGp": 0.01}, {"id": "case-map-or-scroll", "name": "Case, map or scroll", "costGp": 1.0}, {"id": "chain-10-feet", "name": "Chain (10 feet)", "costGp": 5.0}, {"id": "chalk-1-piece", "name": "Chalk (1 piece)", "costGp": 0.01}, {"id": "climber-s-kit", "name": "Climber’s kit", "costGp": 25.0}, {"id": "clothes-common", "name": "Clothes, common", "costGp": 0.5}, {"id": "clothes-costume", "name": "Clothes, costume", "costGp": 5.0}, {"id": "clothes-fine", "name": "Clothes, fine", "costGp": 15.0}, {"id": "component-pouch", "name": "Component pouch", "costGp": 25.0}, {"id": "backpack", "name": "Backpack", "costGp": 2.0}, {"id": "barrel", "name": "Barrel", "costGp": 2.0}, {"id": "basket", "name": "Basket", "costGp": 0.4}, {"id": "bottle-glass", "name": "Bottle, glass", "costGp": 2.0}, {"id": "chest", "name": "Chest", "costGp": 5.0}, {"id": "flask-or-tankard", "name": "Flask or tankard", "costGp": 0.02}, {"id": "jug-or-pitcher", "name": "Jug or pitcher", "costGp": 0.02}, {"id": "pot-cooking", "name": "Pot, cooking", "costGp": 2.0}, {"id": "pouch", "name": "Pouch", "costGp": 0.5}, {"id": "sack", "name": "Sack", "costGp": 0.01}, {"id": "vial", "name": "Vial", "costGp": 1.0}, {"id": "waterskin", "name": "Waterskin", "costGp": 0.2}, {"id": "crowbar", "name": "Crowbar", "costGp": 2.0}, {"id": "fishing-tackle", "name": "Fishing tackle", "costGp": 1.0}, {"id": "hammer", "name": "Hammer", "costGp": 1.0}, {"id": "healer-s-kit", "name": "Healer’s kit", "costGp": 5.0}, {"id": "antitoxin-vial", "name": "Antitoxin (vial)", "costGp": 50.0}, {"id": "perfume-vial", "name": "Perfume (vial)", "costGp": 5.0}, {"id": "poison-basic-vial", "name": "Poison, basic (vial)", "costGp": 5.0}, {"id": "poison-essence-of-ether-vial", "name": "Poison, essence of ether (vial)", "costGp": 300.0}, {"id": "poison-last-gasp-vial", "name": "Poison, last gasp (vial)", "costGp": 200.0}, {"id": "poison-midnight-tears-vial", "name": "Poison, midnight tears (vial)", "costGp": 1500.0}, {"id": "holy-water-flask", "name": "Holy water (flask)", "costGp": 25.0}, {"id": "hourglass", "name": "Hourglass", "costGp": 25.0}, {"id": "hunting-trap-basic", "name": "Hunting trap, basic", "costGp": 5.0}, {"id": "ink-1-ounce-bottle", "name": "Ink (1-ounce bottle)", "costGp": 10.0}, {"id": "ink-pen", "name": "Ink pen", "costGp": 0.02}, {"id": "ladder-10-foot", "name": "Ladder (10-foot)", "costGp": 0.1}, {"id": "lamp", "name": "Lamp", "costGp": 0.5}, {"id": "lantern-bullseye", "name": "Lantern, bullseye", "costGp": 10.0}, {"id": "lantern-hooded", "name": "Lantern, hooded", "costGp": 5.0}, {"id": "lock", "name": "Lock", "costGp": 10.0}, {"id": "magnifying-glass", "name": "Magnifying glass", "costGp": 100.0}, {"id": "manacles", "name": "Manacles", "costGp": 2.0}, {"id": "mess-kit", "name": "Mess kit", "costGp": 0.2}, {"id": "mirror-compact", "name": "Mirror, compact", "costGp": 5.0}, {"id": "net", "name": "Net", "costGp": 1.0}, {"id": "paper-one-sheet", "name": "Paper (one sheet)", "costGp": 0.2}, {"id": "pick-miner-s", "name": "Pick, miner’s", "costGp": 2.0}, {"id": "piton", "name": "Piton", "costGp": 0.05}, {"id": "pole-10-foot", "name": "Pole (10-foot)", "costGp": 0.05}, {"id": "potion-of-healing", "name": "Potion of healing", "costGp": 50.0}, {"id": "quiver", "name": "Quiver", "costGp": 1.0}, {"id": "ram-portable", "name": "Ram, portable", "costGp": 4.0}, {"id": "rations-1-day", "name": "Rations (1 day)", "costGp": 0.5}, {"id": "rope-50-feet", "name": "Rope (50 feet)", "costGp": 1.0}, {"id": "sealing-wax", "name": "Sealing wax", "costGp": 0.5}, {"id": "scale-merchant-s", "name": "Scale, merchant’s", "costGp": 5.0}, {"id": "shovel", "name": "Shovel", "costGp": 2.0}, {"id": "signal-whistle", "name": "Signal whistle", "costGp": 0.05}, {"id": "signet-ring", "name": "Signet ring", "costGp": 5.0}, {"id": "soap", "name": "Soap", "costGp": 0.02}, {"id": "spellbook", "name": "Spellbook", "costGp": 50.0}, {"id": "arcane-focus", "name": "Arcane focus", "costGp": 5.0}, {"id": "holy-symbol", "name": "Holy symbol", "costGp": 5.0}, {"id": "primordial-focus", "name": "Primordial focus", "costGp": 5.0}, {"id": "wyrd-focus", "name": "Wyrd focus", "costGp": 5.0}, {"id": "spikes-iron-10", "name": "Spikes, iron (10)", "costGp": 1.0}, {"id": "spyglass", "name": "Spyglass", "costGp": 1000.0}, {"id": "tent-two-person", "name": "Tent, two-person", "costGp": 2.0}, {"id": "tinderbox", "name": "Tinderbox", "costGp": 0.5}, {"id": "torch", "name": "Torch", "costGp": 0.01}, {"id": "whetstone", "name": "Whetstone", "costGp": 0.01}] },
]

const BY_ID: Record<string, ShopItem> = Object.fromEntries(
  SHOP.flatMap((c) => c.items).map((i) => [i.id, i]),
)

export function getShopItem(id: string): ShopItem | undefined {
  return BY_ID[id]
}

/** Format a gp price, trimming trailing zeros (e.g. 0.1 gp, 25 gp). */
export function gp(n: number): string {
  return `${Number(n.toFixed(2))} gp`
}

/**
 * Split a class starting-equipment line into selectable options.
 * "(a) chain mail or (b) leather armor, longbow" -> two options.
 * A line without "(a)/(b)" markers is a single fixed grant.
 */
export function parseEquipmentOptions(item: string): string[] {
  if (!/\([a-z]\)/i.test(item)) return [item]
  return item
    .split(/\([a-z]\)/i)
    .map((s) => s.replace(/\bor\s*$/i, '').trim())
    .filter(Boolean)
}
