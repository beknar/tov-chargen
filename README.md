# ToV Character Creator

A web-based character creation tool for the **Tales of the Valiant (ToV)** roleplaying
game. It walks a player through building a 1st-level character step by step — picking a
class, generating ability scores, choosing lineage, heritage, and background, buying
equipment, and producing a finished character sheet — entirely in the browser.

> **Status:** early development. The game rules have been imported (see
> [`ToV-Players-Guide.html`](#the-rules-reference)); the application UI is being built on
> top of them.

## What it does

The tool follows the official 8-step character creation sequence from the Player's Guide:

| Step | What the player does |
|------|----------------------|
| 0 | Gather materials |
| 1 | Create a character concept |
| 2 | Choose a class (Bard, Cleric, Druid, Fighter, Mechanist, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock) |
| 3 | Determine ability scores — by **rolling** (4d6 drop lowest), **point-buy** (32 points), or the **standard array** (16, 14, 14, 13, 10, 8) |
| 4 | Choose a lineage |
| 5 | Choose a heritage |
| 6 | Choose a background |
| 7 | Take starting equipment (class + background) or roll starting wealth and buy gear |
| 8 | Fill in the blanks — derive HP, proficiency bonus, modifiers, and finish the sheet |

Spellcasting classes additionally select spells.

## Tech stack

**[Vite](https://vitejs.dev) + [React](https://react.dev) + TypeScript.** The app is
fully **client-side** (no backend) and builds to a static bundle deployable to any static
host (GitHub Pages, Netlify, Vercel, S3, etc.). Character state lives in a React context
store and is persisted to `localStorage`. Game rules are encoded as typed data modules in
`src/data/` so the UI renders from data rather than hard-coded rules.

## Getting started

```bash
npm install
npm run dev        # dev server with HMR (http://localhost:5173)
npm run build      # typecheck + produce the static bundle in dist/
npm run preview    # serve the production build locally
npm run typecheck  # type-check without emitting
```

The rules reference (`ToV-Players-Guide.html`) is a plain static file you can open
directly in a browser, independent of the app.

## Project structure

```
.
├── index.html                  # Vite entry point
├── src/
│   ├── main.tsx                # app bootstrap (mounts <App/> in the store provider)
│   ├── App.tsx                 # wizard shell + step routing
│   ├── components/
│   │   ├── StepNav.tsx         # step navigation
│   │   ├── CharacterSummary.tsx# live derived-stats panel
│   │   └── steps/              # one component per creation step
│   ├── state/                  # character model (types.ts) + context store
│   ├── data/                   # rules as typed data: abilities, classes,
│   │                           #   ability-score methods, step definitions
│   └── styles/                 # global stylesheet
├── ToV-Players-Guide.html      # rules reference (generated; gitignored)
├── ToV-Players-Guide.pdf       # original source rulebook (gitignored)
└── convert.py                  # PDF → single-column HTML converter
```

### What's implemented

- Step wizard shell with navigation and a live character summary
- **Concept**, **Class** (all 11 classes), **Ability Scores** (standard array, point-buy
  with the full 32-point cost table, and 4d6-drop-lowest rolling), and **Lineage** (all 8
  lineages with size, speed, and traits) steps
- Character state persisted to `localStorage`

Heritage, background, equipment, and review are stubbed placeholders — see the
[roadmap](#roadmap).

## The rules reference

`ToV-Players-Guide.html` is a single-column, readable HTML version of the official
Player's Guide, generated from `ToV-Players-Guide.pdf` by `convert.py`. It is the source
of truth when encoding rules data (classes, ability-score methods, equipment, spells,
etc.).

It is a **generated file (~11 MB, with embedded images)** — do not hand-edit it.

> **Not tracked in git.** The PDF and the generated HTML are copyrighted Kobold Press
> material and are excluded via `.gitignore`. Obtain `ToV-Players-Guide.pdf` separately,
> place it in the project root, and regenerate the HTML:

```bash
pip install pymupdf
python3 convert.py            # whole book
python3 convert.py 13 19      # optional page range, for testing
```

## Roadmap

- [ ] App shell (`index.html`) and step-wizard navigation
- [ ] Ability score generator (all three methods, with the point-buy cost table)
- [ ] Class, lineage, heritage, and background selection screens
- [ ] Equipment / starting wealth
- [ ] Spell selection for casters
- [ ] Derived stats (HP, proficiency bonus, saves, skills)
- [ ] Character sheet view + save/load (export to JSON, print)

## Attribution & licensing

*Tales of the Valiant* is published by **Kobold Press**. The PDF and the HTML rendered
from it are included here for reference and are © their respective rights holders. The
core ToV mechanics are also published in the ORC-licensed reference document — before
distributing any rules text or data with this app, confirm what you ship is sourced from
ORC-licensed material rather than copied from the Player's Guide. (Verify the specific
license terms before publishing.)
