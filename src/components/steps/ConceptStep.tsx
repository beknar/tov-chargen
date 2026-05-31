import { useCharacter } from '../../state/CharacterContext'

export function ConceptStep() {
  const { character, patch } = useCharacter()

  return (
    <div className="form-grid">
      <label className="field">
        <span className="field-label">Character name</span>
        <input
          type="text"
          value={character.name}
          placeholder="e.g. Maela Stormwhistle"
          onChange={(e) => patch({ name: e.target.value })}
        />
      </label>

      <label className="field">
        <span className="field-label">Concept</span>
        <textarea
          rows={4}
          value={character.concept}
          placeholder="A one-line idea: a disgraced knight seeking redemption, a curious tinkerer, ..."
          onChange={(e) => patch({ concept: e.target.value })}
        />
        <span className="field-help">
          What kind of character do you want to play? This guides the choices ahead.
        </span>
      </label>
    </div>
  )
}
