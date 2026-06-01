"""Helpers shared across the browser-driven tests."""
from __future__ import annotations

import json
from typing import Any

STORAGE_KEY = "tov-chargen:character"


def eval_module(page, body: str) -> Any:
    """Dynamically import the app's source modules in the page and run `body`.

    Vite's dev server transforms TypeScript on the fly, so importing
    "/src/data/<module>.ts" gives us the real, current logic to assert against.
    `body` is the JS body of an async function and must `return` a JSON value.
    """
    return page.evaluate("async () => {\n" + body + "\n}")


def set_character(page, character: dict) -> None:
    """Seed localStorage with a (partial) character and reload.

    The app sanitizes saved data on load, filling in any missing fields, so a
    partial dict is fine.
    """
    page.evaluate(
        "(c) => localStorage.setItem('%s', JSON.stringify(c))" % STORAGE_KEY,
        character,
    )
    page.reload(wait_until="load")


def get_character(page) -> dict:
    raw = page.evaluate("() => localStorage.getItem('%s')" % STORAGE_KEY)
    return json.loads(raw) if raw else {}


def goto_step(page, index_one_based: int) -> None:
    """Click the Nth wizard step in the nav (1-based)."""
    page.evaluate(
        "(i) => document.querySelectorAll('.step-nav-item button')[i-1].click()",
        index_one_based,
    )
    page.wait_for_timeout(120)


def step_count(page) -> int:
    return page.eval_on_selector_all(".step-nav-item button", "els => els.length")


def stat_value(page, label: str) -> str:
    """Read a Combat-page stat box value by its label (AC, HP, etc.)."""
    return page.evaluate(
        """(label) => {
            const box = [...document.querySelectorAll('.stat-box')]
              .find(b => b.querySelector('.stat-label')?.textContent === label)
            return box ? box.querySelector('.stat-value').textContent : null
        }""",
        label,
    )


# A complete-enough character so derived stats render. Abilities chosen so
# modifiers are easy to reason about (STR 16/+3, DEX 14/+2, CON 14/+2).
FIGHTER_CHARACTER = {
    "name": "Test Fighter",
    "classId": "fighter",
    "scoreMethod": "standard",
    "abilityScores": {"str": 16, "dex": 14, "con": 14, "int": 10, "wis": 12, "cha": 8},
    "lineageId": "human",
    "heritageId": "cosmopolitan",
    "backgroundId": "soldier",
    "equipmentMethod": "granted",
    "armorId": "chain-mail",
    "shield": True,
    "equippedWeapons": ["longsword", "longbow"],
}
