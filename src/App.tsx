import { useState } from 'react'
import { STEPS } from './data/steps'
import { useCharacter } from './state/CharacterContext'
import { StepNav } from './components/StepNav'
import { CharacterSummary } from './components/CharacterSummary'
import { ConceptStep } from './components/steps/ConceptStep'
import { ClassStep } from './components/steps/ClassStep'
import { AbilityScoresStep } from './components/steps/AbilityScoresStep'
import { LineageStep } from './components/steps/LineageStep'
import { HeritageStep } from './components/steps/HeritageStep'
import { BackgroundStep } from './components/steps/BackgroundStep'
import { EquipmentStep } from './components/steps/EquipmentStep'
import { ReviewStep } from './components/steps/ReviewStep'

function renderStep(stepId: string) {
  switch (stepId) {
    case 'concept':
      return <ConceptStep />
    case 'class':
      return <ClassStep />
    case 'abilities':
      return <AbilityScoresStep />
    case 'lineage':
      return <LineageStep />
    case 'heritage':
      return <HeritageStep />
    case 'background':
      return <BackgroundStep />
    case 'equipment':
      return <EquipmentStep />
    case 'review':
      return <ReviewStep />
    default:
      return <ReviewStep />
  }
}

export function App() {
  const [stepIndex, setStepIndex] = useState(0)
  const { reset } = useCharacter()
  const step = STEPS[stepIndex]

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tales of the Valiant — Character Creator</h1>
        <button
          className="ghost"
          onClick={() => {
            if (confirm('Start over? This clears the current character.')) {
              reset()
              setStepIndex(0)
            }
          }}
        >
          Start over
        </button>
      </header>

      <div className="layout">
        <main className="main-panel">
          <StepNav steps={STEPS} current={stepIndex} onSelect={setStepIndex} />

          <section className="step" aria-labelledby="step-title">
            <header className="step-head">
              <p className="step-counter">
                Step {stepIndex + 1} of {STEPS.length}
              </p>
              <h2 id="step-title">{step.title}</h2>
              <p className="step-blurb">{step.blurb}</p>
            </header>

            {renderStep(step.id)}
          </section>

          <nav className="step-controls" aria-label="Step navigation">
            <button
              className="secondary"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            >
              ← Back
            </button>
            <button
              className="primary"
              disabled={stepIndex === STEPS.length - 1}
              onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
            >
              Next →
            </button>
          </nav>
        </main>

        <aside className="summary-panel" aria-label="Character summary">
          <CharacterSummary />
        </aside>
      </div>
    </div>
  )
}
