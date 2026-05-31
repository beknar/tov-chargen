import { ABILITY_ABBR } from '../data/abilities'
import { getSkill, parseSkillGrant, type SkillGrant } from '../data/skills'

interface Props {
  /** The raw grant text, e.g. "Choose two from Acrobatics, ...". */
  text: string
  /** Currently selected skill ids for this source (includes fixed). */
  selected: string[]
  /** Skills already taken by the other source (disabled here). */
  taken: string[]
  onChange: (selected: string[]) => void
}

/** Resolve "choose N from …" text into an interactive skill picker. */
export function SkillPicker({ text, selected, taken, onChange }: Props) {
  const grant: SkillGrant = parseSkillGrant(text)
  const chosen = selected.filter((id) => !grant.fixed.includes(id))
  const remaining = grant.choose - chosen.length

  function toggle(id: string) {
    if (taken.includes(id)) return
    const isOn = chosen.includes(id)
    let next: string[]
    if (isOn) next = chosen.filter((x) => x !== id)
    else if (remaining > 0) next = [...chosen, id]
    else return // at capacity
    onChange([...grant.fixed, ...next])
  }

  if (grant.choose === 0 && grant.fixed.length === 0) {
    // couldn't parse into picks — show the raw text as a fallback
    return <p className="skill-raw">{text}</p>
  }

  return (
    <div className="skill-picker">
      {grant.fixed.length > 0 && (
        <p className="skill-fixed">
          Granted: {grant.fixed.map((id) => getSkill(id)?.name).join(', ')}
        </p>
      )}
      {grant.choose > 0 && (
        <>
          <p className="skill-count">
            Choose {grant.choose} — <strong>{Math.max(0, remaining)}</strong> remaining
          </p>
          <div className="skill-options">
            {grant.options.map((id) => {
              const sk = getSkill(id)
              if (!sk) return null
              const isTaken = taken.includes(id)
              const on = chosen.includes(id)
              const disabled = isTaken || (!on && remaining <= 0)
              return (
                <button
                  key={id}
                  type="button"
                  className={`skill-chip ${on ? 'on' : ''} ${isTaken ? 'taken' : ''}`}
                  aria-pressed={on}
                  disabled={disabled}
                  title={isTaken ? 'Already taken by another source' : undefined}
                  onClick={() => toggle(id)}
                >
                  {sk.name} <span className="skill-abbr">{ABILITY_ABBR[sk.ability]}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
