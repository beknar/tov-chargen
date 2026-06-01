# Tests

A Python test suite that exercises the ToV Character Creator end to end. Because the app
is a client-side web app, the tests drive it in a real browser via
[Playwright](https://playwright.dev/python/). Each session automatically starts a Vite dev
server and tears it down afterward — you don't need to start anything yourself.

| Suite | File | What it covers |
|-------|------|----------------|
| **Unit** | `test_unit.py` | Pure rules logic (AC, attacks, ability mods, skill/equipment parsers, multiclass prereqs, spell counts, data integrity) — imported straight from the TypeScript modules and asserted exactly. |
| **Integration** | `test_integration.py` | The real UI: wizard loads, class selection, a full character's combat sheet, persistence, corrupt-save sanitizing, every class selectable. |
| **Performance** | `test_performance.py` | Page load time, largest-module import cost, step-navigation latency, combat-sheet render — against tunable thresholds. |
| **Soak** | `test_soak.py` | ~1 minute of continuous UI churn; fails on any page/console error or runaway heap growth. |
| **Scalability** | `test_scalability.py` | Builds N characters and asserts per-character cost stays flat as N grows; reports throughput. |

## Setup

Requires **Node + the app's npm deps** (`npm install` in the project root) and **Python 3.10+**.

```bash
cd tests
pip install -r requirements.txt      # pytest + playwright
```

The browser-driven tests use your **system Google Chrome** (`channel="chrome"`), so no
extra download is needed. If you don't have Chrome installed, use Playwright's bundled
Chromium instead:

```bash
playwright install chromium
TOV_BROWSER_CHANNEL= pytest ...      # empty channel -> bundled chromium
```

## Running

From the project root (or `tests/`):

```bash
# fast suites
python -m pytest tests/test_unit.py tests/test_integration.py -q

# performance (prints timings)
python -m pytest tests/test_performance.py -s

# soak — ~60s by default
python -m pytest tests/test_soak.py -s
TOV_SOAK_SECONDS=10 python -m pytest tests/test_soak.py -s   # quick check

# scalability — default 30 characters
python -m pytest tests/test_scalability.py -s
python tests/test_scalability.py --n 200                     # bigger sweep

# everything
python -m pytest tests -q
```

## Configuration (env vars)

| Var | Default | Meaning |
|-----|---------|---------|
| `TOV_BASE_URL` | — | Use an already-running server instead of starting one (e.g. `http://localhost:5173`). |
| `TOV_BROWSER_CHANNEL` | `chrome` | Browser channel; set empty to use bundled Chromium. |
| `TOV_SOAK_SECONDS` | `60` | Soak-test duration. |
| `TOV_SCALE` | `30` | Number of characters the scalability test builds. |
| `TOV_PERF_LOAD_MS` / `TOV_PERF_IMPORT_MS` / `TOV_PERF_NAV_MS` | `10000` / `4000` / `1500` | Performance thresholds (ms). |

## Notes

- The suite targets the Vite **dev** server (it serves the TypeScript source the unit
  tests import). Performance numbers are therefore looser than a production build.
- On WSL with the project on `/mnt/c`, the server fixture sets `CHOKIDAR_USEPOLLING=true`
  automatically.
