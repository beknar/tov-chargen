import { ABILITY_ABBR } from '../../data/abilities'
import { CLASSES } from '../../data/classes'
import { useCharacter } from '../../state/CharacterContext'

export function ClassStep() {
  const { character, patch } = useCharacter()

  return (
    <div className="card-grid" role="radiogroup" aria-label="Class">
      {CLASSES.map((cls) => {
        const selected = character.classId === cls.id
        return (
          <button
            key={cls.id}
            role="radio"
            aria-checked={selected}
            className={`choice-card ${selected ? 'selected' : ''}`}
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
  )
}
