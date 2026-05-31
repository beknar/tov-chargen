import type { Ability } from './abilities'

// The 11 core classes (Player's Guide, Chapter 2).
//
// Hit die, key ability, and saving throws below are taken from the class
// "at a glance" table in the rules reference. Proficiencies, class features,
// and subclasses still need to be filled in from the Player's Guide — see the
// `proficiencies` / `features` TODOs.

export interface ClassDef {
  id: string
  name: string
  /** Short flavor description. */
  description: string
  /** Hit die size (e.g. 8 means d8). */
  hitDie: number
  /** Key / primary ability. Multiple entries mean "either one qualifies". */
  keyAbility: Ability[]
  /** Saving throw proficiencies granted by the class. */
  savingThrows: Ability[]
  /** Whether the class casts spells (approximate; verify subclass details). */
  caster: boolean
  // TODO(rules): proficiencies (armor/weapons/tools/skills), starting equipment,
  // class features per level, and subclasses — pull from ToV-Players-Guide.html.
}

export const CLASSES: ClassDef[] = [
  {
    id: 'bard',
    name: 'Bard',
    description: 'Skilled performers who inspire allies and wield Arcane magic.',
    hitDie: 8,
    keyAbility: ['cha'],
    savingThrows: ['dex', 'cha'],
    caster: true,
  },
  {
    id: 'cleric',
    name: 'Cleric',
    description: 'Faithful casters who wield Divine magic.',
    hitDie: 8,
    keyAbility: ['wis'],
    savingThrows: ['wis', 'cha'],
    caster: true,
  },
  {
    id: 'druid',
    name: 'Druid',
    description: 'Guardians of nature who wield Primordial magic.',
    hitDie: 8,
    keyAbility: ['wis'],
    savingThrows: ['int', 'wis'],
    caster: true,
  },
  {
    id: 'fighter',
    name: 'Fighter',
    description: 'Hardy adventurers who excel in combat and weapon use.',
    hitDie: 10,
    keyAbility: ['str', 'dex'],
    savingThrows: ['str', 'con'],
    caster: false,
  },
  {
    id: 'mechanist',
    name: 'Mechanist',
    description: 'Crafty engineers who sculpt mystic forces into items.',
    hitDie: 10,
    keyAbility: ['int'],
    savingThrows: ['con', 'int'],
    caster: true,
  },
  {
    id: 'monk',
    name: 'Monk',
    description: 'Martial artists who harness mystical energy.',
    hitDie: 8,
    keyAbility: ['dex', 'wis'],
    savingThrows: ['str', 'dex'],
    caster: false,
  },
  {
    id: 'paladin',
    name: 'Paladin',
    description: 'Holy warriors who smite foes with Divine power.',
    hitDie: 10,
    keyAbility: ['str', 'cha'],
    savingThrows: ['wis', 'cha'],
    caster: true,
  },
  {
    id: 'ranger',
    name: 'Ranger',
    description: 'Resourceful survivalists with a mystic connection to nature.',
    hitDie: 10,
    keyAbility: ['dex', 'wis'],
    savingThrows: ['str', 'dex'],
    caster: true,
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'Cunning adventurers who rely on agility and trickery.',
    hitDie: 8,
    keyAbility: ['dex'],
    savingThrows: ['dex', 'int'],
    caster: false,
  },
  {
    id: 'sorcerer',
    name: 'Sorcerer',
    description: 'Powerful casters who channel raw Arcane power from within.',
    hitDie: 6,
    keyAbility: ['cha'],
    savingThrows: ['con', 'cha'],
    caster: true,
  },
  {
    id: 'warlock',
    name: 'Warlock',
    description: 'Supernatural casters who draw magic from Wyrd forces.',
    hitDie: 8,
    keyAbility: ['cha'],
    savingThrows: ['wis', 'cha'],
    caster: true,
  },
]

export function getClass(id: string | null): ClassDef | undefined {
  return id ? CLASSES.find((c) => c.id === id) : undefined
}
