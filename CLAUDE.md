# CLAUDE.md

Guidance for working in this repository.

## What this project is

A browser-based **character creation tool for the Tales of the Valiant (ToV) RPG**. It
guides a player through building a 1st-level character and produces a finished sheet. The
game rules live in `ToV-Players-Guide.html` (see below).

The app is **scaffolded and building** (Vite + React + TypeScript). The wizard shell,
character store, and the Concept / Class / Ability Scores steps are implemented; the
remaining steps (lineage, heritage, background, equipment, review) are placeholder
components to be built out.

## Tech stack

**Vite + React 18 + TypeScript** (strict). No backend. The constraints that apply:

- **Fully client-side.** Builds to a static bundle (`npm run build` → `dist/`) deployable
  to any static host. Persistence is client-side (`localStorage`; file export later).
- **Data-driven.** Rules live as typed data in `src/data/`; components render from that
  data and never hard-code rules. New rules content goes in `src/data/`.
- **Modern evergreen browsers** are the target. Accessibility is required (see below).
- Keep the dependency footprint small. The store is plain React context + `useReducer`
  (`src/state/CharacterContext.tsx`) — don't add a state library unless it's justified.
  Prefer mainstream, well-maintained packages and get the change reviewed if it's large.

## Repository layout

```
index.html              # Vite entry point
src/
  main.tsx              # bootstrap
  App.tsx               # wizard shell + step routing (current step in local state)
  components/           # StepNav, CharacterSummary, steps/<Step>.tsx
  state/                # types.ts (Character model) + CharacterContext.tsx (store)
  data/                 # abilities, classes, abilityScoreMethods, steps (typed rules)
  styles/index.css      # global styles (parchment theme, light/dark)
ToV-Players-Guide.html  # GENERATED rules reference (~11 MB) — gitignored, do not hand-edit
ToV-Players-Guide.pdf   # original rulebook (source of the HTML) — gitignored
convert.py              # PDF → single-column HTML converter (PyMuPDF)
```

## How the app is wired

- **Store:** `src/state/CharacterContext.tsx` exposes `useCharacter()` →
  `{ character, patch, reset }`. `patch(partial)` shallow-merges into the character;
  state auto-persists to `localStorage` (key `tov-chargen:character`).
- **Character model:** `src/state/types.ts`. When adding a field, also add it to
  `INITIAL_CHARACTER`; the store shallow-merges saved data over defaults so old saves
  don't break.
- **Steps:** defined in `src/data/steps.ts`; `App.tsx` maps a step id to its component.
  New steps = add a `data/steps.ts` entry + a `components/steps/<Step>.tsx`, and wire it
  in `App.renderStep`. Follow the data-driven pattern in `ClassStep`/`AbilityScoresStep`.
- **Rules helpers:** ability modifier, point-buy costs, standard array, and 4d6 rolling
  live in `src/data/`. Reuse them; don't re-derive rules inline.

## The rules reference

`ToV-Players-Guide.html` is the **source of truth** for all game rules. It is a
single-column HTML rendering of the official Player's Guide, produced from the PDF by
`convert.py`.

- It is **generated and large (~11 MB, embedded images)**. Never edit it by hand. To
  regenerate: `python3 convert.py` (whole book) or `python3 convert.py START END` for a
  page range. Requires `pip install pymupdf`.
- **Not tracked in git.** Both `ToV-Players-Guide.pdf` and `ToV-Players-Guide.html` are
  gitignored (copyright + size). They must exist locally for `convert.py` / lookups but
  won't be in a fresh clone — the PDF has to be supplied separately.
- When you need a specific rule, **search the HTML** rather than loading the whole file.
  Headings are tagged `<h1>`–`<h4>`, tables are real `<table>` elements, sidebars are
  `<aside>`. Example: `grep -o '<h2>[^<]*</h2>' ToV-Players-Guide.html`.
- A few dense numeric tables didn't reconstruct perfectly during conversion; when in
  doubt, verify a rule against `ToV-Players-Guide.pdf`.

## Domain model (character creation)

Build the flow as an 8-step wizard mirroring the Player's Guide:

0. Gather materials  1. Concept  2. **Class**  3. **Ability scores**  4. **Lineage**
5. **Heritage**  6. **Background**  7. **Equipment**  8. Fill in the blanks / finish

Key rules constants to encode and respect:

- **Six abilities:** STR, DEX, CON, INT, WIS, CHA. Modifier = `floor((score − 10) / 2)`.
- **Ability score methods:**
  - *Rolling* — 4d6, drop the lowest, sum the rest; six times; then +2 to one score ≤16
    and +1 to one score ≤17.
  - *Point-buy* — 32 points; scores 8–18 only; cost table: 8→0, 9→1, 10→2, 11→3, 12→4,
    13→5, 14→7, 15→9, 16→11, 17→13, 18→16.
  - *Standard array* — 16, 14, 14, 13, 10, 8.
  - A starting score can't exceed 18; no PC ability score ever exceeds 20.
- **11 classes:** Bard, Cleric, Druid, Fighter, Mechanist, Monk, Paladin, Ranger, Rogue,
  Sorcerer, Warlock. Each has a hit die, key ability, saving-throw proficiencies, and
  starting proficiencies (pull exact values from the rules reference).
- **Lineage + Heritage** are chosen separately (lineage = ancestry traits; heritage =
  cultural upbringing). **Background** grants skills/talents and starting gear.
- **Derived stats:** HP (max hit die + CON mod at 1st level), proficiency bonus (+2 at
  1st level), saves, skills.

## Conventions

- Match the style and patterns of the existing code/framework once it exists. Until then,
  follow the idioms of whatever stack is chosen.
- Keep rules data separate from presentation. New rules content goes in `data/`.
- Accessibility matters for a form-heavy app: label every input, support keyboard
  navigation, use semantic elements.
- No inline secrets or analytics; this is a static, offline-capable tool.

## Running & previewing

```bash
npm install
npm run dev        # dev server with HMR
npm run build      # tsc --noEmit + vite build → dist/ (run this to verify changes compile)
npm run preview    # serve the production build
npm run typecheck  # type-check only
```

`npm run build` runs a strict type-check first — use it as the basic "did I break
anything" gate. There is no test runner or linter configured yet; if you add one, keep it
mainstream (e.g. Vitest) and wire it into a script.

## Gotchas

- `ToV-Players-Guide.html` is generated **and gitignored** — never commit it; fix
  `convert.py` and regenerate if the rendering needs work.
- This is **not a git repository** yet; don't assume git history exists.
- Game text is copyrighted (Kobold Press). Encode rules as mechanics/data rather than
  copying large passages of prose, and confirm licensing before publishing — the
  ORC-licensed reference document, not the Player's Guide, is the safe source for
  distributable rules content.
