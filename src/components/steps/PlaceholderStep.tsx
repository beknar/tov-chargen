import { STEPS } from '../../data/steps'

const NOTES: Record<string, string> = {
  lineage: 'Lineage selection (ancestry traits) will go here.',
  heritage: 'Heritage selection (cultural upbringing) will go here.',
  background: 'Background selection (skills, talents, starting gear) will go here.',
  equipment: 'Starting equipment — take class + background gear, or roll wealth and buy.',
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
