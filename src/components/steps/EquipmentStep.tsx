import { rollStartingGold } from '../../data/abilityScoreMethods'
import { getClass } from '../../data/classes'
import { getBackground } from '../../data/backgrounds'
import { useCharacter } from '../../state/CharacterContext'

export function EquipmentStep() {
  const { character, patch } = useCharacter()
  const cls = getClass(character.classId)
  const background = getBackground(character.backgroundId)
  const method = character.equipmentMethod

  return (
    <div className="equipment-step">
      <fieldset className="method-picker">
        <legend>Method</legend>
        <div className="method-options">
          <button
            role="radio"
            aria-checked={method === 'granted'}
            className={`choice-card compact ${method === 'granted' ? 'selected' : ''}`}
            onClick={() => patch({ equipmentMethod: 'granted' })}
          >
            <span className="choice-title">Take starting gear</span>
            <span className="choice-desc">Use the equipment from your class and background.</span>
          </button>
          <button
            role="radio"
            aria-checked={method === 'wealth'}
            className={`choice-card compact ${method === 'wealth' ? 'selected' : ''}`}
            onClick={() => patch({ equipmentMethod: 'wealth' })}
          >
            <span className="choice-title">Roll for wealth</span>
            <span className="choice-desc">Roll 5d4 × 10 gp and buy your own gear.</span>
          </button>
        </div>
      </fieldset>

      {method === 'granted' && (
        <div className="score-editor">
          {!cls && !background && (
            <p className="muted">Choose a class and background first to see your starting gear.</p>
          )}
          {cls && (
            <>
              <h3>{cls.name} equipment</h3>
              <ul className="gear-list">
                {cls.startingEquipment.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {background && (
            <>
              <h3>{background.name} equipment</h3>
              <p>{background.equipment}</p>
            </>
          )}
          {(cls?.startingEquipment.some((s) => s.includes('(a)')) ?? false) && (
            <p className="muted feature-note">
              Where an item lists (a)/(b) choices, pick one option for your sheet.
            </p>
          )}
        </div>
      )}

      {method === 'wealth' && (
        <div className="score-editor">
          {character.gold === null ? (
            <button className="primary" onClick={() => patch({ gold: rollStartingGold() })}>
              🎲 Roll starting gold (5d4 × 10 gp)
            </button>
          ) : (
            <>
              <p className="gold-result">
                Starting gold: <strong>{character.gold} gp</strong>
              </p>
              <button className="secondary" onClick={() => patch({ gold: rollStartingGold() })}>
                Re-roll
              </button>
              <p className="muted feature-note">
                Spend it on gear from Chapter 5 of the Player's Guide; note any leftover gp.
              </p>
            </>
          )}
        </div>
      )}

      {!method && <p className="muted">Choose how to get your starting equipment.</p>}
    </div>
  )
}
