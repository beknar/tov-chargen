import { getClass } from '../../data/classes'
import { spellcastingFor, spellsFor, type Spell } from '../../data/spells'
import { useCharacter } from '../../state/CharacterContext'

export function SpellStep() {
  const { character, patch } = useCharacter()
  const cls = getClass(character.classId)
  const info = spellcastingFor(character.classId)

  if (!cls) return <p className="muted">Choose a class first.</p>
  if (!info) {
    return (
      <p className="muted">
        {cls.name}s don’t cast spells at 1st level. You can skip this step.
      </p>
    )
  }

  const cantrips = spellsFor(info.source, 0)
  const firstCircle = spellsFor(info.source, 1)

  function toggle(field: 'cantrips' | 'spells', name: string) {
    const cur = character[field]
    patch({ [field]: cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name] })
  }

  return (
    <div className="spell-step">
      <p className="muted feature-note">
        {cls.name}s cast <strong>{info.source}</strong> spells. {info.note}
      </p>

      <SpellGroup
        title="Cantrips"
        target={info.cantripsKnown}
        spells={cantrips}
        selected={character.cantrips}
        onToggle={(n) => toggle('cantrips', n)}
      />
      <SpellGroup
        title="1st-Circle Spells"
        target={null}
        spells={firstCircle}
        selected={character.spells}
        onToggle={(n) => toggle('spells', n)}
      />
    </div>
  )
}

function SpellGroup({
  title,
  target,
  spells,
  selected,
  onToggle,
}: {
  title: string
  target: number | null
  spells: Spell[]
  selected: string[]
  onToggle: (name: string) => void
}) {
  const over = target !== null && selected.length > target
  return (
    <section className="spell-group">
      <h3>
        {title}{' '}
        <span className={`spell-count ${over ? 'over' : ''}`}>
          ({selected.length}
          {target !== null ? ` / ${target}` : ''} selected)
        </span>
      </h3>
      <div className="spell-list">
        {spells.map((sp) => {
          const on = selected.includes(sp.name)
          return (
            <details key={sp.name} className={`spell-item ${on ? 'on' : ''}`}>
              <summary>
                <button
                  className={`spell-select ${on ? 'on' : ''}`}
                  aria-pressed={on}
                  onClick={(e) => {
                    e.preventDefault()
                    onToggle(sp.name)
                  }}
                >
                  {on ? '✓' : '+'}
                </button>
                <span className="spell-name">{sp.name}</span>
                <span className="spell-school">{sp.school}</span>
              </summary>
              <p className="spell-text">{sp.text}</p>
            </details>
          )
        })}
      </div>
    </section>
  )
}
