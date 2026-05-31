# CLAUDE.md

Guidance for working in this repository.

## What this project is

A browser-based **character creation tool for the Tales of the Valiant (ToV) RPG**. It
guides a player through building a 1st-level character and produces a finished sheet. The
game rules live in `ToV-Players-Guide.html` (see below).

This is a **greenfield project**: as of now the repo contains the rules reference and the
PDF→HTML converter, but little or no application code yet. Expect to be creating the app
structure, not just modifying it.

## Tech stack

Use whatever modern web technologies are appropriate for a form-heavy, data-driven SPA.
Frameworks, a build step, and TypeScript are all fine. The constraints that still apply:

- **Fully client-side.** No backend or database — the app must run as a static bundle on
  any static host. Persistence is client-side (localStorage / file export).
- **Data-driven.** Encode rules as data (in `data/`) and render UI from it; don't
  hard-code rules inside view/component logic.
- **Modern evergreen browsers** are the target. Accessibility is required (see below).

**Recommended default** (confirm with the user before locking it in): Vite + TypeScript +
a component framework (React, Vue, or Svelte). TypeScript is worth it here for modeling
the rules domain (abilities, classes, etc.). If you scaffold the project, state the exact
stack you chose and why. Add dependencies as needed — but keep the footprint reasonable
and prefer well-maintained, mainstream libraries.

## Repository layout

```
index.html              # app entry point (create this)
src/                    # app source (components, state, styles) — per chosen framework
data/                   # rules as data: classes, lineages, heritages,
                        #   backgrounds, talents, equipment, spells
public/                 # static assets served as-is
ToV-Players-Guide.html  # GENERATED rules reference (~11 MB) — do not hand-edit
ToV-Players-Guide.pdf   # original rulebook (source of the HTML)
convert.py              # PDF → single-column HTML converter (PyMuPDF)
```

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

Once the app is scaffolded, use the chosen tool's dev server (e.g. `npm run dev`) and its
production build (`npm run build`). The rules reference HTML is a static file and can be
opened directly.

Set up tests/lint as appropriate for the stack. Configure them when you scaffold rather
than bolting them on later.

## Gotchas

- `ToV-Players-Guide.html` is generated **and gitignored** — never commit it; fix
  `convert.py` and regenerate if the rendering needs work.
- This is **not a git repository** yet; don't assume git history exists.
- Game text is copyrighted (Kobold Press). Encode rules as mechanics/data rather than
  copying large passages of prose, and confirm licensing before publishing — the
  ORC-licensed reference document, not the Player's Guide, is the safe source for
  distributable rules content.
