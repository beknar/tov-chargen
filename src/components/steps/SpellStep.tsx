import { abilityModifier, ABILITY_ABBR } from '../../data/abilities'
import { getClass } from '../../data/classes'
import {
  spellcastingFor,
  spellsFor,
  type FirstCircleMode,
  type Spell,
  type SpellSource,
} from '../../data/spells'
import { getRitual, ritualsFor } from '../../data/rituals'
import { useCharacter } from '../../state/CharacterContext'
import type { AbilityScores } from '../../state/types'

const LEVEL = 1 // this is a 1st-level character creator
const RITUAL_SOURCES: SpellSource[] = ['Arcane', 'Divine', 'Primordial', 'Wyrd']

function firstCircleSpec(mode: FirstCircleMode, scores: AbilityScores) {
  switch (mode.mode) {
    case 'known':
      return { title: 'Spells known', target: mode.count, note: '' }
    case 'prepared': {
      const target = Math.max(1, abilityModifier(scores[mode.ability]) + LEVEL)
      return {
        title: 'Prepared spells',
        target,
        note: `Prepare ${ABILITY_ABBR[mode.ability]} modifier + level = ${target} spell(s) from the whole list.`,
      }
    }
    case 'spellbook':
      return {
        title: 'Spellbook',
        target: mode.count,
        note: `Record ${mode.count} spells; each day you prepare ${ABILITY_ABBR[mode.prepareAbility]} modifier + level of them.`,
      }
    case 'none':
      return null
  }
}

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

  const spec = firstCircleSpec(info.firstCircle, character.abilityScores)
  const fc = info.firstCircle

  function toggle(field: 'cantrips' | 'spells' | 'preparedSpells' | 'ritualSpells', name: string) {
    const cur = character[field]
    if (field === 'spells' && cur.includes(name)) {
      // Removing a spellbook entry also un-prepares it.
      patch({
        spells: cur.filter((n) => n !== name),
        preparedSpells: character.preparedSpells.filter((n) => n !== name),
      })
      return
    }
    patch({ [field]: cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name] })
  }

  // Wizards prepare a daily subset from their spellbook.
  const preparedTarget =
    fc.mode === 'spellbook'
      ? Math.max(1, abilityModifier(character.abilityScores[fc.prepareAbility]) + LEVEL)
      : null
  const spellbookSpells = spellsFor(info.source, 1).filter((sp) => character.spells.includes(sp.name))

  // Ritualist talent: a ritual book. At 1st level you add one ritual of each
  // spell circle you have already unlocked — full casters have 1st-circle slots
  // (one ritual); classes with no 1st-circle spells at L1 unlock none yet.
  const hasRitualist = character.talentId === 'Ritualist'
  const ritualUnlockedCircle = info.firstCircle.mode !== 'none' ? 1 : 0
  const ritualSource = (character.ritualSource as SpellSource | null) ?? info.source

  function chooseRitualSource(src: SpellSource) {
    if (src === ritualSource) return
    // Drop any recorded rituals not available from the new source.
    const kept = character.ritualSpells.filter((n) => getRitual(n)?.sources.includes(src))
    patch({ ritualSource: src, ritualSpells: kept })
  }

  return (
    <div className="spell-step">
      <p className="muted feature-note">
        {cls.name}s cast <strong>{info.source}</strong> spells. {info.note}
      </p>

      {info.cantripsKnown ? (
        <SpellGroup
          title="Cantrips"
          target={info.cantripsKnown}
          spells={spellsFor(info.source, 0)}
          selected={character.cantrips}
          onToggle={(n) => toggle('cantrips', n)}
        />
      ) : null}

      {spec ? (
        <SpellGroup
          title={spec.title}
          subtitle={spec.note}
          target={spec.target}
          spells={spellsFor(info.source, 1)}
          selected={character.spells}
          onToggle={(n) => toggle('spells', n)}
        />
      ) : (
        <p className="muted feature-note">No 1st-circle spells to choose at 1st level.</p>
      )}

      {fc.mode === 'spellbook' ? (
        spellbookSpells.length ? (
          <SpellGroup
            title="Prepared today"
            subtitle={`Prepare ${ABILITY_ABBR[fc.prepareAbility]} modifier + level = ${preparedTarget} spell(s) from your spellbook. You can swap which spells are prepared after a long rest.`}
            target={preparedTarget}
            spells={spellbookSpells}
            selected={character.preparedSpells}
            onToggle={(n) => toggle('preparedSpells', n)}
          />
        ) : (
          <p className="muted feature-note">
            Record spells in your spellbook above, then choose which to prepare for the day.
          </p>
        )
      ) : null}

      {hasRitualist ? (
        <section className="ritual-book">
          <h3>Ritual Book — Ritualist talent</h3>
          <p className="muted feature-note">
            Choose a spell source for your rituals (it need not match your class), then record
            one ritual of each spell circle you have already unlocked. You cast these from the
            ritual book without using a spell slot.
          </p>
          <div className="ritual-source-pick" role="group" aria-label="Ritual spell source">
            {RITUAL_SOURCES.map((src) => (
              <button
                key={src}
                className={`ritual-source ${src === ritualSource ? 'selected' : ''}`}
                aria-pressed={src === ritualSource}
                onClick={() => chooseRitualSource(src)}
              >
                {src}
              </button>
            ))}
          </div>
          {ritualUnlockedCircle >= 1 ? (
            <SpellGroup
              title={`${ritualSource} rituals`}
              subtitle={`Record ${ritualUnlockedCircle} ritual (one 1st-circle ritual) at 1st level. You add more as you unlock higher circles.`}
              target={ritualUnlockedCircle}
              spells={ritualsFor(ritualSource, ritualUnlockedCircle)}
              selected={character.ritualSpells}
              onToggle={(n) => toggle('ritualSpells', n)}
            />
          ) : (
            <p className="muted feature-note">
              {cls.name}s have no spell-circle slots at 1st level, so you record your first
              ritual once you unlock 1st-circle spells (2nd level).
            </p>
          )}
        </section>
      ) : null}
    </div>
  )
}

function SpellGroup({
  title,
  subtitle,
  target,
  spells,
  selected,
  onToggle,
}: {
  title: string
  subtitle?: string
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
      {subtitle && <p className="muted feature-note">{subtitle}</p>}
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
