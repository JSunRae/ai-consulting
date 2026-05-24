from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DIST_DIR = BASE_DIR / "site-dist"
ASSETS_DIR = BASE_DIR / "assets"
DATA_DIR = ASSETS_DIR / "data"
DOCS_DIR = ASSETS_DIR / "docs"

ROOT_FILES = [
    "404.html",
    "about.html",
    "contact.html",
    "favicon.svg",
    "index.html",
    "portfolio.html",
    "privacy.html",
    "resume.html",
    "robots.txt",
    "services.html",
    "sitemap.xml",
]

TREE_DIRS = [
    "blog",
    "css",
    "js",
    "portfolio",
]

PUBLIC_DOC_FILES = [
    "AI-Vendor-Due-Diligence-Checklist-Printable.html",
    "AI-Vendor-Due-Diligence-Checklist.html",
    "AI-Vendor-Due-Diligence-Checklist.md",
    "AI-Vendor-Due-Diligence-Checklist.pdf",
    "Build-vs-Buy-AI-Decision-Matrix-Printable.html",
    "Build-vs-Buy-AI-Decision-Matrix.md",
    "Build-vs-Buy-AI-Decision-Matrix.pdf",
    "Jason-Rae-Resume.pdf",
]

PUBLIC_DATA_FILES = [
    "projects.json",
    "resume.json",
    "social-posts.public.json",
]

PRIVATE_DOC_MARKERS = (
    "private/",
    "applications/",
    "APPLICATION_TRACKER.md",
)


def run_portfolio_generation() -> None:
    subprocess.run(
        [sys.executable, "generate_portfolio_pages.py"],
        cwd=BASE_DIR,
        check=True,
    )


def build_public_social_archive() -> None:
    internal_path = DATA_DIR / "social-posts.json"
    public_path = DATA_DIR / "social-posts.public.json"

    if internal_path.exists():
        payload = json.loads(internal_path.read_text(encoding="utf-8"))
        posts = payload.get("posts", [])
        public_payload = {
            "updatedAt": payload.get("updatedAt"),
            "posts": [post for post in posts if post.get("status") == "published"],
        }
    elif public_path.exists():
        # Do not rewrite the checked-in public archive when the private source file
        # is absent; the bundle can consume the existing public-safe file as-is.
        return
    else:
        raise FileNotFoundError(
            "Neither assets/data/social-posts.json nor assets/data/social-posts.public.json exists.",
        )

    public_path.write_text(
        json.dumps(public_payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def ensure_dist_root() -> None:
    if DIST_DIR.exists():
        shutil.rmtree(DIST_DIR)
    DIST_DIR.mkdir(parents=True, exist_ok=True)


def copy_file(relative_path: str) -> None:
    source = BASE_DIR / relative_path
    target = DIST_DIR / relative_path
    if not source.exists():
        raise FileNotFoundError(f"Missing required public file: {relative_path}")
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


def copy_tree(relative_path: str) -> None:
    source = BASE_DIR / relative_path
    target = DIST_DIR / relative_path
    if not source.exists():
        raise FileNotFoundError(f"Missing required public directory: {relative_path}")
    shutil.copytree(source, target, dirs_exist_ok=True)


def copy_public_assets() -> None:
    copy_tree("assets/images")

    for file_name in PUBLIC_DATA_FILES:
        copy_file(str(Path("assets") / "data" / file_name))

    for file_name in PUBLIC_DOC_FILES:
        copy_file(str(Path("assets") / "docs" / file_name))


def assert_public_manifest_safe() -> None:
    for file_name in PUBLIC_DOC_FILES:
        normalized = file_name.replace("\\", "/")
        if any(marker in normalized for marker in PRIVATE_DOC_MARKERS):
            raise RuntimeError(f"Private document leaked into PUBLIC_DOC_FILES: {file_name}")


def assert_dist_safe() -> None:
    for marker in PRIVATE_DOC_MARKERS:
        if list(DIST_DIR.rglob(f"*{marker.split('/')[-1]}*")) and marker.endswith("APPLICATION_TRACKER.md"):
            raise RuntimeError("Private application tracker leaked into site-dist")

    for forbidden_dir in (DIST_DIR / "assets" / "docs" / "private", DIST_DIR / "assets" / "docs" / "applications"):
        if forbidden_dir.exists():
            raise RuntimeError(f"Private docs leaked into public bundle: {forbidden_dir}")


def main() -> None:
    run_portfolio_generation()
    build_public_social_archive()
    assert_public_manifest_safe()
    ensure_dist_root()

    for relative_path in ROOT_FILES:
        copy_file(relative_path)

    for relative_path in TREE_DIRS:
        copy_tree(relative_path)

    copy_public_assets()
    assert_dist_safe()
    print(f"Public bundle built at {DIST_DIR}")


if __name__ == "__main__":
    main()
