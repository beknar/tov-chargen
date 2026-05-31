import { BACKGROUNDS, getBackground } from '../../data/backgrounds'
import { getTalent } from '../../data/talents'
import { useCharacter } from '../../state/CharacterContext'

export function BackgroundStep() {
  const { character, patch } = useCharacter()
  const selected = getBackground(character.backgroundId)

  function chooseBackground(id: string) {
    // changing background clears a talent that no longer applies
    const bg = getBackground(id)
    const keepTalent =
      character.talentId && bg?.talentChoices.includes(character.talentId)
        ? character.talentId
        : null
    patch({ backgroundId: id, talentId: keepTalent })
  }

  return (
    <div className="background-step">
      <div className="card-grid" role="radiogroup" aria-label="Background">
        {BACKGROUNDS.map((bg) => {
          const sel = character.backgroundId === bg.id
          return (
            <button
              key={bg.id}
              role="radio"
              aria-checked={sel}
              className={`choice-card ${sel ? 'selected' : ''}`}
              onClick={() => chooseBackground(bg.id)}
            >
              <span className="choice-title">{bg.name}</span>
              <span className="choice-desc">{bg.flavor}</span>
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="detail">
          <h3>{selected.name}</h3>
          <dl className="prof-list">
            <div>
              <dt>Skills</dt>
              <dd>{selected.skills || '—'}</dd>
            </div>
            {selected.additional && (
              <div>
                <dt>Also</dt>
                <dd>{selected.additional}</dd>
              </div>
            )}
            {selected.languages && (
              <div>
                <dt>Languages</dt>
                <dd>{selected.languages}</dd>
              </div>
            )}
            <div>
              <dt>Equipment</dt>
              <dd>{selected.equipment || '—'}</dd>
            </div>
          </dl>

          <h3>Choose a talent</h3>
          <div className="talent-choices" role="radiogroup" aria-label="Talent">
            {selected.talentChoices.map((name) => {
              const sel = character.talentId === name
              return (
                <button
                  key={name}
                  role="radio"
                  aria-checked={sel}
                  className={`choice-card ${sel ? 'selected' : ''}`}
                  onClick={() => patch({ talentId: name })}
                >
                  <span className="choice-title">{name}</span>
                  <span className="choice-desc">{getTalent(name) ?? 'See the Player’s Guide.'}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
