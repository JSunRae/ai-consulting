import json
import re
from pathlib import Path

from public_social_archive import build_public_social_archive, read_json


JSON_TARGETS = [
    "assets/data/resume.json",
    "assets/data/projects.json",
    "assets/data/social-posts.json",
    "assets/data/social-posts.public.json",
    "assets/data/social-guidance.json",
    "assets/data/voice-intake-playbook.json",
]

PUBLIC_SCAN_TARGETS = [
    "index.html",
    "about.html",
    "contact.html",
    "resume.html",
    "services.html",
    "portfolio.html",
    "privacy.html",
    "README.md",
    "blog",
    "portfolio",
    "js",
]

STALE_PATTERNS = {
    "Book Health Check": "Use Start Diagnostic Review instead.",
    "Commercial Analytics Health Check": "Use Commercial Analytics Diagnostic Review.",
    "jason@jasonrae.ai": "Public contact should use Jason_C_Rae@Outlook.com where migrated.",
    "18+ years": "Public positioning should use 13+ years unless explicitly about the longer sales timeline.",
}

INTENTIONAL_STALE_ALLOWLIST = {
    "js/main.js": {"Book Health Check", "Commercial Analytics Health Check"},
}

KEY_PAGE_EXPECTATIONS = {
    "index.html": ["Commercial Analytics & Applied AI Leader", "Start Diagnostic Review"],
    "about.html": ["Commercial Analytics & Applied AI Leader"],
    "resume.html": ["Commercial Analytics & Applied AI Leader", "13+ years"],
    "services.html": ["Start Diagnostic Review"],
    "contact.html": ["Jason_C_Rae@Outlook.com"],
}


def iter_files(target: str) -> list[Path]:
    path = Path(target)
    if path.is_dir():
        return [item for item in path.rglob("*") if item.is_file()]
    return [path]


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    for target in JSON_TARGETS:
        path = Path(target)
        try:
            with path.open("r", encoding="utf-8") as handle:
                json.load(handle)
        except Exception as exc:
            errors.append(f"JSON validation failed for {target}: {exc}")

    scan_files: list[Path] = []
    for target in PUBLIC_SCAN_TARGETS:
        scan_files.extend(iter_files(target))

    for file_path in scan_files:
        if file_path.suffix.lower() not in {".html", ".md", ".js", ".json", ".css"}:
            continue
        try:
            text = file_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue

        for needle, guidance in STALE_PATTERNS.items():
            if needle in text:
                allowed = INTENTIONAL_STALE_ALLOWLIST.get(file_path.as_posix(), set())
                if needle in allowed:
                    continue
                warnings.append(f"{file_path}: found stale string `{needle}`. {guidance}")

    for file_name, required_strings in KEY_PAGE_EXPECTATIONS.items():
        text = Path(file_name).read_text(encoding="utf-8")
        for required in required_strings:
            if required not in text:
                errors.append(f"{file_name}: missing expected string `{required}`.")

    try:
        internal_archive = read_json(Path("assets/data/social-posts.json"))
        public_archive = read_json(Path("assets/data/social-posts.public.json"))
        expected_public_archive = build_public_social_archive(internal_archive)
        if public_archive != expected_public_archive:
            errors.append(
                "assets/data/social-posts.public.json is out of date. Run `npm run build` to refresh the public archive export."
            )
    except Exception as exc:
        errors.append(f"Public social archive validation failed: {exc}")

    netlify_toml = Path("netlify.toml").read_text(encoding="utf-8")
    if 'publish = "."' in netlify_toml:
        errors.append("netlify.toml still publishes the repo root instead of the isolated site bundle.")
    if 'publish = "site-dist"' not in netlify_toml:
        errors.append("netlify.toml is missing the isolated `site-dist` publish target.")

    if not Path("assets/docs/REPO_FINISH_PROMPTS.md").exists():
        errors.append("assets/docs/REPO_FINISH_PROMPTS.md is missing.")

    if not Path("scripts/social_buffer_publish.py").exists():
        errors.append("scripts/social_buffer_publish.py is missing.")

    if errors:
        print("Preflight errors:")
        for error in errors:
            print(f"- {error}")
    else:
        print("No preflight errors.")

    if warnings:
        print("Preflight warnings:")
        for warning in warnings:
            print(f"- {warning}")
    else:
        print("No preflight warnings.")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
