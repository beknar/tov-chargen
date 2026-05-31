import { getClass } from '../../data/classes'
import { classSpellSource, spellsFor, type Spell } from '../../data/spells'
import { useCharacter } from '../../state/CharacterContext'

export function SpellStep() {
  const { character, patch } = useCharacter()
  const cls = getClass(character.classId)
  const source = classSpellSource(character.classId)

  if (!cls) {
    return <p className="muted">Choose a class first.</p>
  }
  if (!source) {
    return (
      <p className="muted">
        {cls.name}s don’t cast spells at 1st level. You can skip this step.
      </p>
    )
  }

  const cantrips = spellsFor(source, 0)
  const firstCircle = spellsFor(source, 1)

  function toggle(field: 'cantrips' | 'spells', name: string) {
    const cur = character[field]
    patch({ [field]: cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name] })
  }

  return (
    <div className="spell-step">
      <p className="muted feature-note">
        {cls.name}s cast <strong>{source}</strong> spells. Select your cantrips and 1st-circle
        spells below — check your class’s Spellcasting feature for how many you know or prepare
        at 1st level.
      </p>

      <SpellGroup
        title="Cantrips"
        spells={cantrips}
        selected={character.cantrips}
        onToggle={(n) => toggle('cantrips', n)}
      />
      <SpellGroup
        title="1st-Circle Spells"
        spells={firstCircle}
        selected={character.spells}
        onToggle={(n) => toggle('spells', n)}
      />
    </div>
  )
}

function SpellGroup({
  title,
  spells,
  selected,
  onToggle,
}: {
  title: string
  spells: Spell[]
  selected: string[]
  onToggle: (name: string) => void
}) {
  return (
    <section className="spell-group">
      <h3>
        {title} <span className="spell-count">({selected.length} selected)</span>
      </h3>
      <ul className="spell-list">
        {spells.map((sp) => {
          const on = selected.includes(sp.name)
          return (
            <li key={sp.name}>
              <button
                className={`spell-chip ${on ? 'on' : ''}`}
                aria-pressed={on}
                onClick={() => onToggle(sp.name)}
              >
                <span className="spell-name">{sp.name}</span>
                <span className="spell-school">{sp.school}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
