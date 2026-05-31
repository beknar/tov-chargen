import { HERITAGES, getHeritage } from '../../data/heritages'
import { useCharacter } from '../../state/CharacterContext'

export function HeritageStep() {
  const { character, patch } = useCharacter()
  const selected = getHeritage(character.heritageId)

  return (
    <div className="heritage-step">
      <div className="card-grid" role="radiogroup" aria-label="Heritage">
        {HERITAGES.map((hr) => {
          const sel = character.heritageId === hr.id
          return (
            <button
              key={hr.id}
              role="radio"
              aria-checked={sel}
              className={`choice-card ${sel ? 'selected' : ''}`}
              onClick={() => patch({ heritageId: hr.id })}
            >
              <span className="choice-title">{hr.name}</span>
              <span className="choice-desc">{hr.flavor}</span>
              <span className="choice-traits">{hr.traits.map((t) => t.name).join(' · ')}</span>
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="detail">
          <h3>{selected.name} traits</h3>
          <dl className="trait-list">
            {selected.traits.map((t) => (
              <div key={t.name} className="trait">
                <dt>{t.name}</dt>
                <dd>{t.text}</dd>
              </div>
            ))}
            {selected.languages && (
              <div className="trait">
                <dt>Languages</dt>
                <dd>{selected.languages}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  )
}
