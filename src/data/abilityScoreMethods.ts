// The three ways to determine starting ability scores (Player's Guide, Step 3).

export type ScoreMethod = 'standard' | 'pointbuy' | 'rolling'

export const SCORE_METHODS: { id: ScoreMethod; label: string; blurb: string }[] = [
  {
    id: 'standard',
    label: 'Standard Array',
    blurb: 'Assign a fixed set of six numbers. Fast and balanced.',
  },
  {
    id: 'pointbuy',
    label: 'Point Buy',
    blurb: 'Spend 32 points to customize your scores within a budget.',
  },
  {
    id: 'rolling',
    label: 'Rolling',
    blurb: 'Roll 4d6, drop the lowest, six times. Classic and swingy.',
  },
]

/** The standard array: assign each number to one ability. */
export const STANDARD_ARRAY = [16, 14, 14, 13, 10, 8] as const

/** Point-buy: 32 points, scores 8-18, per the cost table. */
export const POINT_BUY_BUDGET = 32
export const POINT_BUY_MIN = 8
export const POINT_BUY_MAX = 18
export const POINT_BUY_COST: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
  16: 11,
  17: 13,
  18: 16,
}

/** A PC's ability score can never exceed this value. */
export const ABILITY_SCORE_CAP = 20

/** Roll 4d6 and drop the lowest die. */
export function roll4d6DropLowest(rng: () => number = Math.random): number {
  const dice = Array.from({ length: 4 }, () => 1 + Math.floor(rng() * 6))
  dice.sort((a, b) => a - b)
  return dice[1] + dice[2] + dice[3]
}

/** Generate six ability-score totals by rolling 4d6-drop-lowest. */
export function rollAbilityArray(rng: () => number = Math.random): number[] {
  return Array.from({ length: 6 }, () => roll4d6DropLowest(rng))
}
