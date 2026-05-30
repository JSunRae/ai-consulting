from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]

REQUIRED_PATHS = [
    BASE_DIR / "scripts" / "build_public_bundle.py",
    BASE_DIR / "about.html",
    BASE_DIR / "blog" / "social-posts.html",
    BASE_DIR / "js" / "social-archive.js",
    BASE_DIR / "assets" / "images" / "jason-profile-photo.jpg",
    BASE_DIR / "assets" / "data" / "projects.json",
    BASE_DIR / "assets" / "data" / "resume.json",
    BASE_DIR / "assets" / "data" / "social-posts.public.json",
]

PUBLIC_TEXT_PATHS = [
    BASE_DIR / "404.html",
    BASE_DIR / "about.html",
    BASE_DIR / "contact.html",
    BASE_DIR / "index.html",
    BASE_DIR / "portfolio.html",
    BASE_DIR / "privacy.html",
    BASE_DIR / "resume.html",
    BASE_DIR / "services.html",
    BASE_DIR / "blog" / "index.html",
    BASE_DIR / "blog" / "social-posts.html",
]

PUBLIC_JSON_PATHS = [
    BASE_DIR / "assets" / "data" / "projects.json",
    BASE_DIR / "assets" / "data" / "resume.json",
    BASE_DIR / "assets" / "data" / "social-posts.public.json",
]

PUBLIC_RUNTIME_PATHS = [*PUBLIC_TEXT_PATHS, *PUBLIC_JSON_PATHS]

IGNORED_PRIVATE_PATHS = [
    "Research and Documentation/",
    "test_notification.py",
]

PUBLIC_DOC_FILES = {
    "AI-Vendor-Due-Diligence-Checklist.pdf",
    "Build-vs-Buy-AI-Decision-Matrix.pdf",
    "Jason-Rae-Resume.pdf",
}

SECRET_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9_-]{20,}"),
    re.compile(r"cfk_[A-Za-z0-9_-]{20,}"),
    re.compile(r"(?:OPENAI_API_KEY|CLOUDFLARE_API_TOKEN|NETLIFY_AUTH_TOKEN|TBS_REPO_SHARED_SECRET)\s*="),
]

FORBIDDEN_PUBLIC_STRINGS = [
    "Commercial Analytics Health Check",
    "jason@jasonrae.ai",
]


def fail(message: str) -> None:
    print(f"ERROR: {message}")


def warn(message: str) -> None:
    print(f"WARNING: {message}")


def validate_required_paths(errors: list[str]) -> None:
    for path in REQUIRED_PATHS:
        if not path.exists():
            errors.append(f"Missing required path: {path}")


def validate_json(path: Path, errors: list[str]) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        errors.append(f"Missing JSON file: {path}")
    except json.JSONDecodeError as exc:
        errors.append(f"Invalid JSON in {path}: {exc}")
    return None


def validate_public_strings(errors: list[str]) -> None:
    for path in PUBLIC_RUNTIME_PATHS:
        if not path.exists():
            continue

        content = path.read_text(encoding="utf-8")
        for token in FORBIDDEN_PUBLIC_STRINGS:
            if token in content:
                errors.append(f'Forbidden public string "{token}" found in {path}')


def validate_about_page(errors: list[str]) -> None:
    about_path = BASE_DIR / "about.html"
    content = about_path.read_text(encoding="utf-8")

    if "assets/images/jason-profile-photo.jpg" not in content:
        errors.append("about.html is not using the current profile image asset.")

    if "profile-placeholder.svg" in content:
        errors.append("about.html still references the old profile placeholder.")


def validate_social_archive(errors: list[str], warnings: list[str]) -> None:
    public_path = BASE_DIR / "assets" / "data" / "social-posts.public.json"
    payload = validate_json(public_path, errors)
    if not payload:
        return

    posts = payload.get("posts", [])
    if not isinstance(posts, list) or not posts:
        errors.append("social-posts.public.json contains no public posts.")
        return

    non_published = [post.get("id", "<unknown>") for post in posts if post.get("status") != "published"]
    if non_published:
        errors.append(
            "social-posts.public.json contains non-published entries: "
            + ", ".join(non_published),
        )

    linkedin_posts = 0
    for post in posts:
        for platform in post.get("platforms", []):
            if platform.get("name") == "LinkedIn":
                linkedin_posts += 1
                break

    if linkedin_posts == 0:
        warnings.append("No LinkedIn entries detected in the public social archive.")


def validate_social_archive_defaults(errors: list[str]) -> None:
    js_path = BASE_DIR / "js" / "social-archive.js"
    content = js_path.read_text(encoding="utf-8")
    if 'kind: "post"' not in content:
        errors.append("social-archive.js is not defaulting to authored posts.")


def validate_netlify_config(errors: list[str]) -> None:
    netlify_path = BASE_DIR / "netlify.toml"
    content = netlify_path.read_text(encoding="utf-8")
    if 'command = "python scripts/build_public_bundle.py"' not in content:
        errors.append("netlify.toml is not pointing at scripts/build_public_bundle.py.")


def validate_gitignore_coverage(errors: list[str]) -> None:
    gitignore_path = BASE_DIR / ".gitignore"
    content = gitignore_path.read_text(encoding="utf-8")

    for ignored_path in IGNORED_PRIVATE_PATHS:
        if ignored_path not in content:
            errors.append(f'.gitignore is missing the private path rule "{ignored_path}".')


def validate_runtime_secret_patterns(errors: list[str]) -> None:
    for path in PUBLIC_RUNTIME_PATHS:
        if not path.exists():
            continue

        content = path.read_text(encoding="utf-8")
        for pattern in SECRET_PATTERNS:
            if pattern.search(content):
                errors.append(
                    f"Secret-like value or assignment pattern found in public runtime file: {path}",
                )
                break


def validate_site_dist_scope(errors: list[str], warnings: list[str]) -> None:
    dist_dir = BASE_DIR / "site-dist"
    if not dist_dir.exists():
        warnings.append("site-dist is missing; bundle-scope checks were skipped.")
        return

    sensitive_dirs = [
        dist_dir / "Research and Documentation",
        dist_dir / "assets" / "docs" / "private",
    ]

    for path in sensitive_dirs:
        if path.exists():
            errors.append(f"Sensitive directory should not exist in site-dist: {path}")

    docs_dir = dist_dir / "assets" / "docs"
    if docs_dir.exists():
        unexpected_docs = sorted(
            child.name for child in docs_dir.iterdir() if child.is_file() and child.name not in PUBLIC_DOC_FILES
        )
        if unexpected_docs:
            errors.append(
                "site-dist/assets/docs contains unexpected public documents: "
                + ", ".join(unexpected_docs),
            )


def validate_assets_docs_boundary(warnings: list[str]) -> None:
    docs_dir = BASE_DIR / "assets" / "docs"
    if not docs_dir.exists():
        return

    internal_candidates = sorted(
        child.name
        for child in docs_dir.iterdir()
        if child.is_file() and child.name not in PUBLIC_DOC_FILES and child.suffix.lower() != ".pdf"
    )
    if internal_candidates:
        warnings.append(
            "assets/docs still contains non-public operational files in a web-facing tree: "
            + ", ".join(internal_candidates[:8])
            + ("..." if len(internal_candidates) > 8 else ""),
        )


def validate_tracked_private_paths(warnings: list[str]) -> None:
    try:
        result = subprocess.run(
            ["git", "ls-files", "--", "Research and Documentation", "test_notification.py"],
            cwd=BASE_DIR,
            check=True,
            capture_output=True,
            text=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        warnings.append("Unable to inspect tracked private paths with git ls-files.")
        return

    tracked_paths = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    if not tracked_paths:
        return

    tracked_existing: list[str] = []
    tracked_deleted: list[str] = []
    for raw_path in tracked_paths:
        if (BASE_DIR / raw_path).exists():
            tracked_existing.append(raw_path)
        else:
            tracked_deleted.append(raw_path)

    if tracked_existing:
        warnings.append(
            "Private or dev-only paths are still tracked in git and present in the working tree: "
            + ", ".join(tracked_existing[:8])
            + ("..." if len(tracked_existing) > 8 else ""),
        )

    if tracked_deleted:
        warnings.append(
            "Private or dev-only paths have been removed locally but are still tracked until the deletion is committed: "
            + ", ".join(tracked_deleted[:8])
            + ("..." if len(tracked_deleted) > 8 else ""),
        )


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    validate_required_paths(errors)
    validate_json(BASE_DIR / "assets" / "data" / "projects.json", errors)
    validate_json(BASE_DIR / "assets" / "data" / "resume.json", errors)
    validate_public_strings(errors)
    validate_about_page(errors)
    validate_social_archive(errors, warnings)
    validate_social_archive_defaults(errors)
    validate_netlify_config(errors)
    validate_gitignore_coverage(errors)
    validate_runtime_secret_patterns(errors)
    validate_site_dist_scope(errors, warnings)
    validate_assets_docs_boundary(warnings)
    validate_tracked_private_paths(warnings)

    for message in warnings:
        warn(message)

    if errors:
        for message in errors:
            fail(message)
        return 1

    print("Repo preflight passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
