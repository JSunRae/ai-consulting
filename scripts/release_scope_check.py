from __future__ import annotations

import argparse
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent

MINIMAL_RELEASE = [
    "index.html",
    "services.html",
    "contact.html",
    "about.html",
    "resume.html",
    "portfolio.html",
    "privacy.html",
    "blog/index.html",
    "blog/ai-vendor-due-diligence-checklist.html",
    "blog/build-vs-buy-ai-decision-matrix.html",
    "blog/customer-service-ai-checklist-before-chatbot.html",
    "blog/ai-cost-reduction-reality-check.html",
    "blog/social-posts.html",
    "js/main.js",
    "js/forms.js",
    "js/chatbot.js",
    "js/social-archive.js",
    "css/style.css",
    "css/components.css",
    "package.json",
    "netlify.toml",
    "assets/docs/AI-Vendor-Due-Diligence-Checklist.pdf",
    "assets/docs/Build-vs-Buy-AI-Decision-Matrix.pdf",
    "assets/data/social-posts.json",
    "assets/data/social-posts.public.json",
    "scripts/build_public_bundle.py",
    "scripts/public_social_archive.py",
    "scripts/repo_preflight.py",
    "sitemap.xml",
]

FULL_RELEASE = MINIMAL_RELEASE + [
    "assets/docs/AI-Vendor-Due-Diligence-Checklist.md",
    "assets/docs/AI-Vendor-Due-Diligence-Checklist.html",
    "assets/docs/AI-Vendor-Due-Diligence-Checklist-Printable.html",
    "assets/docs/Build-vs-Buy-AI-Decision-Matrix.md",
    "assets/docs/Build-vs-Buy-AI-Decision-Matrix-Printable.html",
    "assets/docs/CHALLENGER_PROPOSAL_TEMPLATE.md",
    "assets/docs/CHALLENGER_DISCOVERY_CALL_SCRIPT.md",
    "assets/docs/OBJECTION_HANDLING_LIBRARY.md",
    "assets/docs/POST_CALL_SUMMARY_TEMPLATE.md",
    "assets/docs/RECOMMENDATION_MEMO_TEMPLATE.md",
    "assets/docs/CHAT_VOICE_ALIGNMENT_AUDIT.md",
    "assets/docs/CHALLENGER_PAGE_AUDIT.md",
    "assets/docs/BROWSER_QA_REPORT.md",
    "assets/docs/LAUNCH_HARDENING_HANDOVER.md",
    "assets/docs/LEAD_MAGNET_TRACKING_HOOKS.md",
    "assets/data/social-guidance.json",
    "assets/data/social-sources.json",
    "assets/data/voice-intake-playbook.json",
]

IGNORED_PREFIXES = (
    ".git/",
    ".netlify/",
    "node_modules/",
    "site-dist/",
    "data/voice-summary-store/",
    "scripts/__pycache__/",
)


def read_dirty_paths() -> list[str]:
    result = subprocess.run(
        ["git", "status", "--short", "--untracked-files=all"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    paths: list[str] = []
    for line in result.stdout.splitlines():
        line = line.rstrip()
        if not line:
            continue
        paths.append(line[3:])
    return paths


def choose_scope(scope_name: str) -> list[str]:
    if scope_name == "minimal":
        return MINIMAL_RELEASE
    if scope_name == "full":
        return FULL_RELEASE
    raise ValueError(f"Unsupported scope `{scope_name}`.")


def is_ignored(path: str) -> bool:
    return path.startswith(IGNORED_PREFIXES)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Report which dirty files belong to the documented release scope.",
    )
    parser.add_argument(
        "--scope",
        choices=("minimal", "full"),
        default="minimal",
        help="Release scope to evaluate.",
    )
    args = parser.parse_args()

    scope_paths = choose_scope(args.scope)
    dirty_paths = read_dirty_paths()
    dirty_scope_paths = [path for path in scope_paths if path in dirty_paths]
    dirty_outside_scope = [
        path
        for path in dirty_paths
        if path not in scope_paths and not is_ignored(path)
    ]
    missing_scope_paths = [
        path for path in scope_paths if not (ROOT / path).exists()
    ]

    print(f"Release scope: {args.scope}")
    print(f"Dirty files inside scope: {len(dirty_scope_paths)}")
    for path in dirty_scope_paths:
        print(f"- {path}")

    print(f"Dirty files outside scope: {len(dirty_outside_scope)}")
    for path in dirty_outside_scope[:25]:
        print(f"- {path}")
    if len(dirty_outside_scope) > 25:
        remainder = len(dirty_outside_scope) - 25
        print(f"- ... plus {remainder} more outside-scope dirty paths")

    if dirty_scope_paths:
        print("Suggested staging command:")
        joined = " ".join(dirty_scope_paths)
        print(f"git add -- {joined}")
    else:
        print("Suggested staging command:")
        print("# No dirty files from the selected release scope are currently present.")

    if missing_scope_paths:
        print("Missing documented scope paths:")
        for path in missing_scope_paths:
            print(f"- {path}")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
