import { LINEAGES, getLineage } from '../../data/lineages'
import { useCharacter } from '../../state/CharacterContext'

export function LineageStep() {
  const { character, patch } = useCharacter()
  const selected = getLineage(character.lineageId)

  return (
    <div className="lineage-step">
      <div className="card-grid" role="radiogroup" aria-label="Lineage">
        {LINEAGES.map((l) => {
          const sel = character.lineageId === l.id
          return (
            <button
              key={l.id}
              role="radio"
              aria-checked={sel}
              className={`choice-card ${sel ? 'selected' : ''}`}
              onClick={() => patch({ lineageId: l.id })}
            >
              <span className="choice-title">{l.name}</span>
              <span className="choice-desc">{l.flavor}</span>
              <span className="choice-stats">
                <span>
                  <strong>Size</strong> {l.size}
                </span>
                <span>
                  <strong>Speed</strong> {l.speed} ft
                </span>
              </span>
              <span className="choice-traits">{l.traits.map((t) => t.name).join(' · ')}</span>
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
          </dl>
        </div>
      )}
    </div>
  )
}
