// The character-creation wizard mirrors the Player's Guide step sequence.
// Step 0 (gather materials) is informational and folded into the intro.

export interface StepDef {
  id: string
  title: string
  /** One-line description shown in the step header. */
  blurb: string
}

export const STEPS: StepDef[] = [
  { id: 'concept', title: 'Concept', blurb: 'Name your character and sketch the idea.' },
  { id: 'class', title: 'Class', blurb: 'Choose what your character does best.' },
  { id: 'abilities', title: 'Ability Scores', blurb: 'Determine your six ability scores.' },
  { id: 'lineage', title: 'Lineage', blurb: 'Choose your ancestry.' },
  { id: 'heritage', title: 'Heritage', blurb: 'Choose your cultural upbringing.' },
  { id: 'background', title: 'Background', blurb: 'Choose your pre-adventuring life.' },
  { id: 'equipment', title: 'Equipment', blurb: 'Take starting gear or buy your own.' },
  { id: 'review', title: 'Review', blurb: 'Check everything and finish your sheet.' },
]
