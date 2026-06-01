# CLAUDE.md

Guidance for working in this repository.

## What this project is

A browser-based **character creation tool for the Tales of the Valiant (ToV) RPG**. It
guides a player through building a 1st-level character and produces an exportable/printable
sheet. The game rules live in `ToV-Players-Guide.html` (see below).

The app is **feature-complete for 1st-level creation** (Vite + React + TypeScript). All ten
wizard steps are implemented: Concept, Class, Ability Scores, Lineage, Heritage,
Background, Spells, Equipment, Review, and Combat. Work now is refinement, rules accuracy,
and edge cases rather than building missing steps.

## Tech stack

**Vite + React 18 + TypeScript** (strict). No backend. Constraints that apply:

- **Fully client-side.** Builds to a static bundle (`npm run build` → `dist/`) deployable
  to any static host. Persistence is client-side (`localStorage`; JSON export/import).
- **Data-driven.** Rules live as typed data in `src/data/`; components render from that
  data and never hard-code rules. New rules content goes in `src/data/`.
- **Modern evergreen browsers** are the target. Accessibility is required (see Conventions).
- Keep the dependency footprint small. The store is plain React context + `useReducer`
  (`src/state/CharacterContext.tsx`); no extra state library. There is no runtime
  dependency beyond React.

## Repository layout

```
index.html              # Vite entry point
src/
  main.tsx              # bootstrap
  App.tsx               # wizard shell + step routing (current step in local state)
  components/
    StepNav.tsx, CharacterSummary.tsx, SkillPicker.tsx, MagicItemPicker.tsx
    steps/              # one component per wizard step (10)
  state/
    types.ts            # Character model + freshCharacter() + sanitizeCharacter()
    CharacterContext.tsx# store: useCharacter() -> { character, patch, reset }
  data/                 # typed rules data + pure helpers (see table below)
  styles/index.css      # global styles (parchment theme, light/dark, print)
ToV-Players-Guide.html  # GENERATED rules reference (~11 MB) — gitignored, do not hand-edit
ToV-Players-Guide.pdf   # original rulebook (source of the HTML) — gitignored
convert.py              # PDF → single-column HTML converter (PyMuPDF)
```

### `src/data/` modules

| Module | Contents |
|--------|----------|
| `abilities.ts` | six abilities, `abilityModifier`, `formatModifier`, `ABILITY_ABBR` |
| `abilityScoreMethods.ts` | standard array, point-buy cost table, `roll4d6DropLowest`, `rollStartingGold` |
| `classes.ts` | 13 classes (hit die, key ability, saves, proficiencies, 1st-level features, starting equipment) + `getClass` |
| `subclasses.ts` | 27 subclasses — **data only; not used in 1st-level creation** (subclass is chosen at 3rd level in ToV) |
| `lineages.ts`, `heritages.ts`, `backgrounds.ts` | lineage/heritage/background data + getters |
| `talents.ts` | full 45-talent catalog (category, prerequisite, description) + `getTalent` |
| `skills.ts` | 18 skills + `parseSkillGrant` ("choose N from …") |
| `spells.ts` | 324 spells (circle/source/school/text) + `SPELLCASTING` per class + `spellsFor` |
| `armor.ts` | armor table, `computeAC` (returns ac/source/breakdown), Unarmored Defense |
| `weapons.ts` | weapon table (category/kind/damage/properties/range) + `parseDamage` |
| `shop.ts` | priced catalog (`SHOP`) + `parseEquipmentOptions` + `parseWeaponSlots` |
| `magicItems.ts` | 214 magic items + `getMagicItem` |
| `combat.ts` | `weaponAttack`, `unarmedStrike`, `weaponProficient`, `PB`; attacks carry `bonusCalc`/`damageCalc` |
| `inventory.ts` | `deriveInventory` — concrete owned items from granted gear + purchases |
| `multiclass.ts` | prereq table + `meetsPrereq` / `canMulticlass` / `prereqText` |
| `steps.ts` | the wizard step list |

## How the app is wired

- **Store:** `src/state/CharacterContext.tsx` exposes `useCharacter()` →
  `{ character, patch, reset }`. `patch(partial)` shallow-merges into the character; state
  auto-persists to `localStorage` (key `tov-chargen:character`).
- **Character model:** `src/state/types.ts`. When adding a field: add it to
  `INITIAL_CHARACTER` **and** to `sanitizeCharacter()` (which coerces imported files and
  old saves into a valid Character and is used by both the store's initial load and the
  Review JSON import). `freshCharacter()` returns a clean character with a fresh
  `abilityScores` object.
- **Steps:** defined in `src/data/steps.ts`; `App.renderStep` maps a step id to its
  component. A new step = a `steps.ts` entry + a `components/steps/<Step>.tsx` + a case in
  `App.renderStep`. Follow the data-driven pattern in existing steps.
- **Derived values are computed from data helpers, never hard-coded:** AC via
  `computeAC` (armor.ts), attacks via `weaponAttack`/`unarmedStrike` (combat.ts), owned
  items via `deriveInventory` (inventory.ts), skill grants via `parseSkillGrant`
  (skills.ts). Reuse these; don't re-derive rules inline.
- **Class change resets dependent choices** (subclass/skills/spells/multiclass/equipment
  choices) in `ClassStep`'s class-select handler — keep that in mind when adding
  class-dependent fields.

## Dev / WSL note

This project is typically checked out on a Windows drive under WSL (`/mnt/c/...`). Linux
inotify file-watching does **not** fire for Windows-mounted drives, so Vite HMR won't pick
up edits and the dev server appears "stuck" on old code. Start it with polling:

```bash
CHOKIDAR_USEPOLLING=true npm run dev
```

If you change source and the running app doesn't update, this is almost always why —
restart the dev server with polling (or just rebuild).

## The rules reference

`ToV-Players-Guide.html` is the **source of truth** for all game rules — a single-column
HTML rendering of the Player's Guide produced from the PDF by `convert.py`.

- It is **generated and large (~11 MB, embedded images)**. Never edit it by hand. To
  regenerate: `python3 convert.py` (whole book) or `python3 convert.py START END` for a
  page range. Requires `pip install pymupdf` (`--break-system-packages` on some systems).
- **Not tracked in git.** Both `ToV-Players-Guide.pdf` and `ToV-Players-Guide.html` are
  gitignored (copyright + size). They must exist locally for `convert.py` / lookups but
  won't be in a fresh clone — the PDF has to be supplied separately.
- When you need a specific rule, **search the HTML** (or, for tricky tables/dense pages,
  the PDF). Headings are `<h1>`–`<h4>`, tables are `<table>`, sidebars are `<aside>`.
- The single-column conversion garbles some dense, multi-column content (spell lists,
  talents). For those, extract from the **PDF** directly via PyMuPDF — entries often share
  a distinct font (e.g. spell names use `SegoeUIBlack`, talents `FranklinGothic-Book`,
  magic-item names `SegoeUI-Semibold`), which makes font-based extraction reliable. Several
  data modules were built this way; verify against the PDF when in doubt.

## Domain model (ToV rules to respect)

Ten-step wizard: Concept → Class → Ability Scores → Lineage → Heritage → Background →
Spells → Equipment → Review → Combat.

- **Six abilities:** STR, DEX, CON, INT, WIS, CHA. Modifier = `floor((score − 10) / 2)`.
- **Ability score methods:** rolling (4d6 drop lowest ×6); point-buy (32 points, scores
  8–18, cost table 8→0…14→7…18→16); standard array 16/14/14/13/10/8. Starting score ≤ 18;
  no PC score ever exceeds 20.
- **13 classes:** Barbarian, Bard, Cleric, Druid, Fighter, Mechanist, Monk, Paladin,
  Ranger, Rogue, Sorcerer, Warlock, Wizard. (Note: not 11 — Barbarian and Wizard are easy
  to miss; both exist.)
- **Subclasses are chosen at 3rd level**, so 1st-level creation does **not** pick one. The
  `subclasses.ts` data exists but is intentionally unused by the UI.
- **Spell sources:** Arcane (Bard, Mechanist, Sorcerer, Wizard), Divine (Cleric, Paladin),
  Primordial (Druid, Ranger), Wyrd (Warlock). Paladin/Ranger are half-casters (no 1st-level
  spells). Spell circles, not levels; cantrip = circle 0.
- **AC:** armor base + DEX (light), + min(DEX,2) (medium), or flat (heavy); shield +2.
  Unarmored Defense: Barbarian 13 + CON (no DEX), Monk 10 + DEX + WIS.
- **Derived:** HP = max hit die + CON mod at 1st level; proficiency bonus +2; saves = mod +
  PB if proficient; skills = mod + PB if proficient; attacks = ability mod + PB (if
  proficient).
- **Multiclassing** (optional rule): meet the ability-score prerequisites of both the
  current and new class.

## Conventions

- Match the style and patterns of the existing code.
- Keep rules data in `src/data/` and out of components; components render from data.
- Accessibility matters for a form-heavy app: label every input, support keyboard
  navigation, use semantic elements.
- No inline secrets or analytics; this is a static, offline-capable tool.

## Running & verifying

```bash
npm install
npm run dev        # dev server with HMR (use CHOKIDAR_USEPOLLING=true on /mnt/c)
npm run build      # tsc --noEmit + vite build → dist/ (the "did I break it" gate)
npm run preview    # serve the production build
npm run typecheck  # type-check only
```

`npm run build` runs a strict type-check first. There is no test runner or linter
configured; if you add one, keep it mainstream (e.g. Vitest) and wire it into a script. To
verify UI changes visually, build and `npm run preview`, then drive it with a headless
browser (the system Chrome at `/usr/bin/google-chrome` works with puppeteer-core) — note
Vite's dev server keeps a websocket open, so use `waitUntil: 'load'`, not `networkidle0`.

## Gotchas

- `ToV-Players-Guide.html` is generated **and gitignored** — never commit it; fix
  `convert.py` and regenerate if the rendering needs work.
- The repo is **`beknar/tov-chargen`** on GitHub (remote `origin`, branch `main`).
- The bundle is on the larger side (~440 KB / ~125 KB gzipped) because spell and magic-item
  effect text is embedded as data. Fine for a static app; code-split if it ever matters.
- Game text is copyrighted (Kobold Press). Encode rules as mechanics/data rather than
  copying large passages of prose, and confirm licensing before publishing — the
  ORC-licensed reference document, not the Player's Guide, is the safe source for
  distributable rules content.
