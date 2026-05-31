import {
  ABILITIES,
  ABILITY_ABBR,
  abilityModifier,
  formatModifier,
} from '../data/abilities'
import { getClass } from '../data/classes'
import { getLineage } from '../data/lineages'
import { getHeritage } from '../data/heritages'
import { getBackground } from '../data/backgrounds'
import { useCharacter } from '../state/CharacterContext'

/** Proficiency bonus is +2 at 1st level. */
const PROFICIENCY_BONUS = 2

export function CharacterSummary() {
  const { character } = useCharacter()
  const cls = getClass(character.classId)
  const lineage = getLineage(character.lineageId)
  const heritage = getHeritage(character.heritageId)
  const background = getBackground(character.backgroundId)
  const conMod = abilityModifier(character.abilityScores.con)
  const startingHp = cls ? cls.hitDie + conMod : null

  return (
    <div className="summary">
      <h2>Summary</h2>

      <dl className="summary-meta">
        <div>
          <dt>Name</dt>
          <dd>{character.name || <span className="muted">—</span>}</dd>
        </div>
        <div>
          <dt>Class</dt>
          <dd>{cls ? cls.name : <span className="muted">—</span>}</dd>
        </div>
        <div>
          <dt>Lineage</dt>
          <dd>{lineage ? lineage.name : <span className="muted">—</span>}</dd>
        </div>
        <div>
          <dt>Heritage</dt>
          <dd>{heritage ? heritage.name : <span className="muted">—</span>}</dd>
        </div>
        <div>
          <dt>Speed</dt>
          <dd>{lineage ? `${lineage.speed} ft` : <span className="muted">—</span>}</dd>
        </div>
        <div>
          <dt>Background</dt>
          <dd>{background ? background.name : <span className="muted">—</span>}</dd>
        </div>
        <div>
          <dt>Talent</dt>
          <dd>{character.talentId ?? <span className="muted">—</span>}</dd>
        </div>
        <div>
          <dt>Hit Points</dt>
          <dd>{startingHp !== null ? startingHp : <span className="muted">—</span>}</dd>
        </div>
        <div>
          <dt>Proficiency</dt>
          <dd>{formatModifier(PROFICIENCY_BONUS)}</dd>
        </div>
      </dl>

      <table className="summary-abilities">
        <thead>
          <tr>
            <th scope="col">Ability</th>
            <th scope="col">Score</th>
            <th scope="col">Mod</th>
          </tr>
        </thead>
        <tbody>
          {ABILITIES.map((a) => {
            const score = character.abilityScores[a]
            return (
              <tr key={a}>
                <th scope="row">{ABILITY_ABBR[a]}</th>
                <td>{score}</td>
                <td>{formatModifier(abilityModifier(score))}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <p className="summary-note muted">
        HP shown is a 1st-level estimate (max hit die + CON modifier).
      </p>
    </div>
  )
}
