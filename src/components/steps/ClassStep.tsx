import { ABILITY_ABBR } from '../../data/abilities'
import { CLASSES, getClass } from '../../data/classes'
import { useCharacter } from '../../state/CharacterContext'

export function ClassStep() {
  const { character, patch } = useCharacter()
  const selected = getClass(character.classId)

  return (
    <div className="class-step">
      <div className="card-grid" role="radiogroup" aria-label="Class">
        {CLASSES.map((cls) => {
          const sel = character.classId === cls.id
          return (
            <button
              key={cls.id}
              role="radio"
              aria-checked={sel}
              className={`choice-card ${sel ? 'selected' : ''}`}
              onClick={() => patch({ classId: cls.id })}
            >
              <span className="choice-title">
                {cls.name}
                {cls.caster && <span className="tag">caster</span>}
              </span>
              <span className="choice-desc">{cls.description}</span>
              <span className="choice-stats">
                <span>
                  <strong>Hit Die</strong> d{cls.hitDie}
                </span>
                <span>
                  <strong>Key</strong> {cls.keyAbility.map((a) => ABILITY_ABBR[a]).join(' / ')}
                </span>
                <span>
                  <strong>Saves</strong> {cls.savingThrows.map((a) => ABILITY_ABBR[a]).join(', ')}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="detail">
          <h3>{selected.name} — proficiencies</h3>
          <dl className="prof-list">
            <div>
              <dt>Armor</dt>
              <dd>{selected.proficiencies.armor || '—'}</dd>
            </div>
            <div>
              <dt>Weapons</dt>
              <dd>{selected.proficiencies.weapons || '—'}</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>{selected.proficiencies.tools || '—'}</dd>
            </div>
            <div>
              <dt>Saves</dt>
              <dd>{selected.savingThrows.map((a) => ABILITY_ABBR[a]).join(', ')}</dd>
            </div>
            <div>
              <dt>Skills</dt>
              <dd>{selected.proficiencies.skills || '—'}</dd>
            </div>
          </dl>

          {selected.features.length > 0 && (
            <>
              <h3>1st-level features</h3>
              <dl className="trait-list">
                {selected.features.map((f) => (
                  <div key={f.name} className="trait">
                    <dt>{f.name}</dt>
                    <dd>{f.text}</dd>
                  </div>
                ))}
              </dl>
              <p className="muted feature-note">
                Notable 1st-level features — see the Player's Guide for full text, options,
                and subclasses.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
