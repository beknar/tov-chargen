"""Scalability test: create N characters and check per-character cost stays flat.

Scale with TOV_SCALE (default 30). The test asserts the app handles a growing
number of full character builds without per-character latency degrading (i.e.
roughly linear total cost), and reports throughput.

Run a bigger sweep directly:

    TOV_SCALE=200 python -m pytest tests/test_scalability.py -s
    python tests/test_scalability.py --n 200      # convenience wrapper
"""
from __future__ import annotations

import os
import time

from helpers import goto_step, set_character, stat_value

SCALE = int(os.environ.get("TOV_SCALE", "30"))

CLASS_IDS = [
    "barbarian", "bard", "cleric", "druid", "fighter", "mechanist", "monk",
    "paladin", "ranger", "rogue", "sorcerer", "warlock", "wizard",
]


def _character(i: int) -> dict:
    return {
        "name": f"Scale {i}",
        "classId": CLASS_IDS[i % len(CLASS_IDS)],
        "scoreMethod": "standard",
        "abilityScores": {"str": 16, "dex": 14, "con": 14, "int": 12, "wis": 12, "cha": 10},
        "lineageId": "human",
        "heritageId": "cosmopolitan",
        "backgroundId": "soldier",
        "equipmentMethod": "granted",
        "armorId": "chain-mail",
        "shield": True,
        "equippedWeapons": ["longsword"],
    }


def test_scalability(page):
    latencies = []
    for i in range(SCALE):
        t0 = time.perf_counter()
        set_character(page, _character(i))     # sanitize + load + persist
        goto_step(page, 10)                    # build the full combat sheet
        assert stat_value(page, "Armor Class") == "18"
        latencies.append((time.perf_counter() - t0) * 1000)

    total_s = sum(latencies) / 1000
    throughput = SCALE / total_s if total_s else 0
    latencies_sorted = sorted(latencies)
    p50 = latencies_sorted[len(latencies_sorted) // 2]
    p95 = latencies_sorted[min(len(latencies_sorted) - 1, int(len(latencies_sorted) * 0.95))]

    # degradation: average of the last fifth vs the first fifth of builds
    fifth = max(1, SCALE // 5)
    first = sum(latencies[:fifth]) / fifth
    last = sum(latencies[-fifth:]) / fifth
    degradation = last / first if first else 1.0

    print(
        f"\n[scale] N={SCALE}  throughput={throughput:.1f} chars/s  "
        f"p50={p50:.0f}ms p95={p95:.0f}ms  degradation={degradation:.2f}x"
    )

    assert len(latencies) == SCALE
    # per-character cost should not blow up as N grows (allow some noise)
    assert degradation < 2.0, f"per-character latency degraded {degradation:.1f}x at scale"


if __name__ == "__main__":
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="Scalability sweep")
    parser.add_argument("--n", type=int, default=SCALE, help="number of characters to build")
    args = parser.parse_args()
    os.environ["TOV_SCALE"] = str(args.n)
    sys.exit(__import__("pytest").main([__file__, "-s", "-q"]))
