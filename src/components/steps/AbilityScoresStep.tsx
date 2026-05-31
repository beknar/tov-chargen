import {
  ABILITIES,
  ABILITY_NAME,
  abilityModifier,
  formatModifier,
  type Ability,
} from '../../data/abilities'
import {
  POINT_BUY_BUDGET,
  POINT_BUY_COST,
  POINT_BUY_MAX,
  POINT_BUY_MIN,
  SCORE_METHODS,
  STANDARD_ARRAY,
  rollAbilityArray,
  type ScoreMethod,
} from '../../data/abilityScoreMethods'
import { useCharacter } from '../../state/CharacterContext'
import type { AbilityScores } from '../../state/types'

function assignInOrder(pool: number[]): AbilityScores {
  const sorted = [...pool].sort((a, b) => b - a)
  const scores = {} as AbilityScores
  ABILITIES.forEach((a, i) => {
    scores[a] = sorted[i] ?? 10
  })
  return scores
}

export function AbilityScoresStep() {
  const { character, patch } = useCharacter()
  const { scoreMethod, abilityScores, rolledScores } = character

  function chooseMethod(method: ScoreMethod) {
    if (method === 'standard') {
      patch({ scoreMethod: method, abilityScores: assignInOrder([...STANDARD_ARRAY]) })
    } else if (method === 'pointbuy') {
      const scores = {} as AbilityScores
      ABILITIES.forEach((a) => (scores[a] = POINT_BUY_MIN))
      patch({ scoreMethod: method, abilityScores: scores })
    } else {
      // rolling — keep any prior roll, otherwise wait for the user to roll
      patch({ scoreMethod: method })
    }
  }

  return (
    <div className="abilities-step">
      <fieldset className="method-picker">
        <legend>Method</legend>
        <div className="method-options">
          {SCORE_METHODS.map((m) => (
            <button
              key={m.id}
              role="radio"
              aria-checked={scoreMethod === m.id}
              className={`choice-card compact ${scoreMethod === m.id ? 'selected' : ''}`}
              onClick={() => chooseMethod(m.id)}
            >
              <span className="choice-title">{m.label}</span>
              <span className="choice-desc">{m.blurb}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {scoreMethod === 'pointbuy' && <PointBuy scores={abilityScores} patch={patch} />}

      {(scoreMethod === 'standard' || scoreMethod === 'rolling') && (
        <ArrayAssign
          method={scoreMethod}
          scores={abilityScores}
          rolledScores={rolledScores}
          patch={patch}
        />
      )}

      {!scoreMethod && <p className="muted">Choose a method to set your ability scores.</p>}
    </div>
  )
}

// ---- Point buy ---------------------------------------------------------------

function PointBuy({
  scores,
  patch,
}: {
  scores: AbilityScores
  patch: (p: { abilityScores: AbilityScores }) => void
}) {
  const spent = ABILITIES.reduce((sum, a) => sum + (POINT_BUY_COST[scores[a]] ?? 0), 0)
  const remaining = POINT_BUY_BUDGET - spent

  function setScore(a: Ability, next: number) {
    patch({ abilityScores: { ...scores, [a]: next } })
  }

  return (
    <div className="score-editor">
      <p className={`budget ${remaining < 0 ? 'over' : ''}`}>
        Points remaining: <strong>{remaining}</strong> / {POINT_BUY_BUDGET}
      </p>
      <ul className="ability-list">
        {ABILITIES.map((a) => {
          const score = scores[a]
          const canInc =
            score < POINT_BUY_MAX &&
            remaining >= (POINT_BUY_COST[score + 1] - POINT_BUY_COST[score])
          const canDec = score > POINT_BUY_MIN
          return (
            <li key={a} className="ability-row">
              <span className="ability-name">{ABILITY_NAME[a]}</span>
              <div className="stepper">
                <button aria-label={`Decrease ${ABILITY_NAME[a]}`} disabled={!canDec} onClick={() => setScore(a, score - 1)}>
                  −
                </button>
                <span className="ability-score">{score}</span>
                <button aria-label={`Increase ${ABILITY_NAME[a]}`} disabled={!canInc} onClick={() => setScore(a, score + 1)}>
                  +
                </button>
              </div>
              <span className="ability-mod">{formatModifier(abilityModifier(score))}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ---- Standard array / rolling (assign a pool of six numbers) ------------------

function ArrayAssign({
  method,
  scores,
  rolledScores,
  patch,
}: {
  method: 'standard' | 'rolling'
  scores: AbilityScores
  rolledScores: number[] | null
  patch: (p: Partial<{ abilityScores: AbilityScores; rolledScores: number[] }>) => void
}) {
  const pool = method === 'standard' ? [...STANDARD_ARRAY] : rolledScores
  const distinctValues = pool ? [...new Set(pool)].sort((a, b) => b - a) : []

  function rerollPool() {
    const rolled = rollAbilityArray()
    patch({ rolledScores: rolled, abilityScores: assignInOrder(rolled) })
  }

  // Set ability `a` to value `v`, swapping with whichever ability holds the
  // surplus instance so the assignment stays a valid permutation of the pool.
  function setValue(a: Ability, v: number) {
    if (!pool) return
    const current = scores[a]
    if (current === v) return
    const count = pool.filter((n) => n === v).length
    const used = ABILITIES.filter((x) => scores[x] === v).length
    const next = { ...scores, [a]: v }
    if (used >= count) {
      const victim = ABILITIES.find((x) => x !== a && scores[x] === v)
      if (victim) next[victim] = current
    }
    patch({ abilityScores: next })
  }

  if (method === 'rolling' && !pool) {
    return (
      <div className="score-editor">
        <button className="primary" onClick={rerollPool}>
          🎲 Roll ability scores
        </button>
        <p className="muted">Rolls 4d6, drops the lowest, six times.</p>
      </div>
    )
  }

  return (
    <div className="score-editor">
      <p className="pool">
        Pool: {pool!.map((n, i) => <span key={i} className="pool-die">{n}</span>)}
      </p>
      {method === 'rolling' && (
        <button className="secondary" onClick={rerollPool}>
          Re-roll
        </button>
      )}
      <ul className="ability-list">
        {ABILITIES.map((a) => {
          const score = scores[a]
          return (
            <li key={a} className="ability-row">
              <span className="ability-name">{ABILITY_NAME[a]}</span>
              <select value={score} onChange={(e) => setValue(a, Number(e.target.value))}>
                {distinctValues.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <span className="ability-mod">{formatModifier(abilityModifier(score))}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
