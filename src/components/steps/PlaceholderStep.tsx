import { STEPS } from '../../data/steps'

const NOTES: Record<string, string> = {
  review: 'Final review and character sheet export will go here.',
}

export function PlaceholderStep({ stepId }: { stepId: string }) {
  const step = STEPS.find((s) => s.id === stepId)
  return (
    <div className="placeholder">
      <p>{NOTES[stepId] ?? 'This step is not built yet.'}</p>
      <p className="muted">
        Not yet implemented. The rules for “{step?.title}” live in the Player's Guide
        reference; this step will be data-driven like Class and Ability Scores.
      </p>
    </div>
  )
}
