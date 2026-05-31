import { ABILITY_ABBR } from '../../data/abilities'
import { CLASSES, getClass } from '../../data/classes'
import { getSubclasses } from '../../data/subclasses'
import { canMulticlass, prereqText } from '../../data/multiclass'
import { SkillPicker } from '../SkillPicker'
import { useCharacter } from '../../state/CharacterContext'

export function ClassStep() {
  const { character, patch } = useCharacter()
  const selected = getClass(character.classId)
  const subclasses = getSubclasses(character.classId)

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
              onClick={() => {
                if (cls.id === character.classId) return
                patch({
                  classId: cls.id,
                  subclassId: null,
                  classSkills: [],
                  cantrips: [],
                  spells: [],
                  multiclasses: character.multiclasses.filter((m) => m !== cls.id),
                })
              }}
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
          </dl>

          <h3>Skill proficiencies</h3>
          <SkillPicker
            text={selected.proficiencies.skills}
            selected={character.classSkills}
            taken={character.backgroundSkills}
            onChange={(s) => patch({ classSkills: s })}
          />

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
                Notable 1st-level features — see the Player's Guide for full text and options.
              </p>
            </>
          )}

          {subclasses.length > 0 && (
            <>
              <h3>Subclass</h3>
              <div className="card-grid" role="radiogroup" aria-label="Subclass">
                {subclasses.map((sc) => {
                  const sel = character.subclassId === sc.id
                  return (
                    <button
                      key={sc.id}
                      role="radio"
                      aria-checked={sel}
                      className={`choice-card ${sel ? 'selected' : ''}`}
                      onClick={() => patch({ subclassId: sc.id })}
                    >
                      <span className="choice-title">{sc.name}</span>
                      <span className="choice-desc">{sc.flavor}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          <details className="multiclass">
            <summary>
              Multiclass <span className="muted">(optional rule — {character.multiclasses.length} added)</span>
            </summary>
            <p className="muted feature-note">
              With your GM’s approval, gain levels in other classes. You qualify only if you
              meet the ability-score prerequisites of <em>both</em> {selected.name} and the new
              class.
            </p>
            <div className="mc-list">
              {CLASSES.filter((c) => c.id !== selected.id).map((c) => {
                const added = character.multiclasses.includes(c.id)
                const eligible = canMulticlass(character.abilityScores, selected.id, c.id)
                return (
                  <label key={c.id} className={`mc-row ${eligible ? '' : 'ineligible'}`}>
                    <input
                      type="checkbox"
                      checked={added}
                      disabled={!eligible && !added}
                      onChange={() =>
                        patch({
                          multiclasses: added
                            ? character.multiclasses.filter((x) => x !== c.id)
                            : [...character.multiclasses, c.id],
                        })
                      }
                    />
                    <span className="mc-name">{c.name}</span>
                    <span className="mc-prereq">{prereqText(c.id)}</span>
                  </label>
                )
              })}
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
