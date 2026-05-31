import type { StepDef } from '../data/steps'

interface Props {
  steps: StepDef[]
  current: number
  onSelect: (index: number) => void
}

export function StepNav({ steps, current, onSelect }: Props) {
  return (
    <ol className="step-nav" aria-label="Creation steps">
      {steps.map((step, i) => {
        const state = i === current ? 'current' : i < current ? 'done' : 'todo'
        return (
          <li key={step.id} className={`step-nav-item ${state}`}>
            <button
              onClick={() => onSelect(i)}
              aria-current={i === current ? 'step' : undefined}
              title={step.blurb}
            >
              <span className="step-nav-num">{i + 1}</span>
              <span className="step-nav-label">{step.title}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
