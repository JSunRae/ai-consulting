#!/usr/bin/env python3
"""Block accidental publication of private consulting and job-search materials."""

from __future__ import annotations

import importlib.util
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
BUILD_SCRIPT = REPO_ROOT / "scripts" / "build_public_bundle.py"

PATH_RULES: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("private env", re.compile(r"(^|/)\.env($|[./])")),
    ("private docs", re.compile(r"(^|/)assets/docs/private/")),
    ("application packet", re.compile(r"(^|/)assets/docs/applications/")),
    ("application tracker", re.compile(r"(^|/)assets/docs/APPLICATION_TRACKER\.md$", re.IGNORECASE)),
)


@dataclass(frozen=True)
class Finding:
    kind: str
    path: str
    detail: str


def tracked_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "-z"],
        cwd=REPO_ROOT,
        check=True,
        capture_output=True,
    )
    raw_paths = [entry for entry in result.stdout.decode("utf-8", errors="ignore").split("\0") if entry]
    return [REPO_ROOT / entry for entry in raw_paths]


def load_bundle_module():
    spec = importlib.util.spec_from_file_location("build_public_bundle", BUILD_SCRIPT)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load {BUILD_SCRIPT}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def scan() -> list[Finding]:
    findings: list[Finding] = []

    for path in tracked_files():
        rel = path.relative_to(REPO_ROOT).as_posix()
        lowered = rel.lower()
        for label, pattern in PATH_RULES:
            if pattern.search(rel) and not lowered.endswith(".env.example"):
                findings.append(Finding("path", rel, label))
                break

    bundle = load_bundle_module()
    public_docs = getattr(bundle, "PUBLIC_DOC_FILES", [])
    for entry in public_docs:
        normalized = str(entry).replace("\\", "/")
        if "private/" in normalized or "applications/" in normalized or normalized.endswith("APPLICATION_TRACKER.md"):
            findings.append(Finding("bundle", "scripts/build_public_bundle.py", f"unsafe public doc selection: {entry}"))

    return findings


def main() -> int:
    findings = scan()
    if not findings:
        print("Public safety check passed.")
        return 0

    print("Public safety check failed:")
    for finding in findings:
        print(f"- [{finding.kind}] {finding.path}: {finding.detail}")
    print("\nMove private content to assets/docs/private/ on private-main before publishing.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
