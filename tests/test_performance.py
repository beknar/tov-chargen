"""Performance tests: load time, module import cost, and navigation latency.

Thresholds are generous (this runs against the Vite **dev** server, which
transforms modules on the fly and is slower than a production build) and are
tunable via env vars. They catch gross regressions, not micro-optimizations.
"""
from __future__ import annotations

import os
import time

from helpers import FIGHTER_CHARACTER, goto_step, set_character, stat_value

LOAD_MS = int(os.environ.get("TOV_PERF_LOAD_MS", "10000"))
IMPORT_MS = int(os.environ.get("TOV_PERF_IMPORT_MS", "4000"))
NAV_MS = int(os.environ.get("TOV_PERF_NAV_MS", "1500"))


def test_page_load_time(page, base_url):
    page.goto(base_url + "/", wait_until="load")  # warm up (compile)
    t0 = time.perf_counter()
    page.goto(base_url + "/", wait_until="load")
    elapsed_ms = (time.perf_counter() - t0) * 1000
    print(f"\n[perf] warm page load: {elapsed_ms:.0f} ms (limit {LOAD_MS})")
    assert elapsed_ms < LOAD_MS


def test_largest_module_import(page):
    # The 324-spell module is the biggest data import; force a fresh transform.
    ms = page.evaluate(
        """async () => {
            const t = performance.now()
            await import('/src/data/spells.ts?bust=' + Date.now())
            return performance.now() - t
        }"""
    )
    print(f"\n[perf] spells.ts import: {ms:.0f} ms (limit {IMPORT_MS})")
    assert ms < IMPORT_MS


def test_step_navigation_latency(page):
    set_character(page, FIGHTER_CHARACTER)
    timings = []
    for i in range(1, 11):
        t0 = time.perf_counter()
        goto_step(page, i)
        page.wait_for_selector("#step-title", state="attached")
        timings.append((time.perf_counter() - t0) * 1000)
    avg = sum(timings) / len(timings)
    worst = max(timings)
    print(f"\n[perf] step nav avg {avg:.0f} ms, worst {worst:.0f} ms (limit {NAV_MS})")
    assert worst < NAV_MS


def test_combat_sheet_render(page):
    set_character(page, FIGHTER_CHARACTER)
    t0 = time.perf_counter()
    goto_step(page, 10)
    assert stat_value(page, "Armor Class") == "18"
    elapsed_ms = (time.perf_counter() - t0) * 1000
    print(f"\n[perf] combat sheet render: {elapsed_ms:.0f} ms (limit {NAV_MS})")
    assert elapsed_ms < NAV_MS
