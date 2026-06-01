"""Soak test: hammer the app with UI churn for ~1 minute and assert stability.

Set TOV_SOAK_SECONDS to change the duration (default 60). The test fails if any
page error or console error occurs, or if the JS heap grows unreasonably.
"""
from __future__ import annotations

import os
import time

from helpers import goto_step

SOAK_SECONDS = int(os.environ.get("TOV_SOAK_SECONDS", "60"))

CLASSES = [
    "Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Mechanist", "Monk",
    "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard",
]


def _click_card(page, text: str) -> None:
    page.evaluate(
        "(t) => { const b=[...document.querySelectorAll('.card-grid button')].find(b=>b.textContent.includes(t)); if(b) b.click() }",
        text,
    )


def _heap(page):
    return page.evaluate("() => (performance.memory && performance.memory.usedJSHeapSize) || 0")


def test_soak(page):
    errors = []
    page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
    page.on("console", lambda m: errors.append(f"console: {m.text}") if m.type == "error" else None)
    page.on("dialog", lambda d: d.accept())  # auto-accept the "Start over" confirm

    # establish a baseline character so combat actions have something to do
    goto_step(page, 2)
    _click_card(page, "Fighter")
    goto_step(page, 3)
    page.evaluate(
        "() => { const b=[...document.querySelectorAll('.method-options .choice-card')].find(x=>x.textContent.includes('Standard Array')); if(b) b.click() }"
    )

    heap_start = _heap(page)
    deadline = time.time() + SOAK_SECONDS
    cycles = 0
    while time.time() < deadline:
        cls = CLASSES[cycles % len(CLASSES)]
        goto_step(page, 2)
        _click_card(page, cls)             # churn class + dependent resets
        goto_step(page, 10)                # Combat
        # toggle calculations
        page.evaluate("() => { const c=document.querySelector('.show-calc input'); if(c) c.click() }")
        # equip then unequip the first available weapon
        page.evaluate("() => { const c=document.querySelector('.show-all input'); if(c && !c.checked) c.click() }")
        page.evaluate("() => { const w=document.querySelector('.weapon-chip'); if(w){ w.click(); w.click() } }")
        goto_step(page, 9)                 # Review (assembles full sheet)
        cycles += 1
        if errors:
            break

    heap_end = _heap(page)
    growth = (heap_end / heap_start) if heap_start else 1.0
    print(f"\n[soak] {SOAK_SECONDS}s, {cycles} cycles, heap {heap_start/1e6:.1f}MB -> {heap_end/1e6:.1f}MB ({growth:.2f}x)")

    assert not errors, f"errors during soak ({cycles} cycles): {errors[:5]}"
    assert cycles > 0
    if heap_start:  # only meaningful if the browser exposes memory
        assert growth < 4.0, f"JS heap grew {growth:.1f}x — possible leak"


if __name__ == "__main__":
    import sys
    sys.exit(__import__("pytest").main([__file__, "-s", "-q"]))
