"""Shared pytest fixtures: a Vite dev server and a Chromium page.

The ToV Character Creator is a client-side web app, so the tests drive it in a
real browser via Playwright. The Vite **dev** server is used (not a production
build) because it serves the TypeScript source modules, which the unit tests
import and call directly.
"""
from __future__ import annotations

import os
import socket
import subprocess
import time
import urllib.request
from pathlib import Path

import pytest
from playwright.sync_api import sync_playwright

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def _free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def _wait_for(url: str, timeout: float = 60.0) -> None:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2) as resp:
                if resp.status == 200:
                    return
        except Exception:
            time.sleep(0.3)
    raise RuntimeError(f"dev server did not become ready at {url}")


@pytest.fixture(scope="session")
def base_url() -> str:
    """Start `vite dev` for the test session and return its URL.

    Reuse an already-running server via TOV_BASE_URL to skip startup.
    """
    existing = os.environ.get("TOV_BASE_URL")
    if existing:
        yield existing.rstrip("/")
        return

    port = _free_port()
    env = {**os.environ, "CHOKIDAR_USEPOLLING": "true"}  # needed on /mnt/c (WSL)
    proc = subprocess.Popen(
        ["npm", "run", "dev", "--", "--port", str(port), "--strictPort"],
        cwd=PROJECT_ROOT,
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    url = f"http://localhost:{port}"
    try:
        _wait_for(url + "/")
        yield url
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            proc.kill()


@pytest.fixture(scope="session")
def _playwright():
    with sync_playwright() as pw:
        yield pw


@pytest.fixture(scope="session")
def browser(_playwright):
    # Use the system Chrome (channel="chrome") so no `playwright install` is needed.
    # Set TOV_BROWSER_CHANNEL="" to fall back to a bundled chromium if installed.
    channel = os.environ.get("TOV_BROWSER_CHANNEL", "chrome") or None
    browser = _playwright.chromium.launch(
        channel=channel,
        headless=True,
        args=["--no-sandbox", "--disable-setuid-sandbox"],
    )
    yield browser
    browser.close()


@pytest.fixture()
def page(browser, base_url):
    context = browser.new_context(viewport={"width": 1280, "height": 1400})
    page = context.new_page()
    page.goto(base_url + "/", wait_until="load")
    page.evaluate("() => localStorage.clear()")
    page.reload(wait_until="load")
    yield page
    context.close()
