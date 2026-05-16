import shutil
import subprocess
import sys
from pathlib import Path

from public_social_archive import export_public_social_archive


ROOT = Path(__file__).resolve().parent.parent
SITE_DIST = ROOT / "site-dist"

ROOT_PUBLIC_FILES = [
    "index.html",
    "about.html",
    "contact.html",
    "portfolio.html",
    "privacy.html",
    "resume.html",
    "services.html",
    "404.html",
    "robots.txt",
    "sitemap.xml",
]

ROOT_PUBLIC_DIRS = [
    "blog",
    "css",
    "js",
    "portfolio",
]

PUBLIC_ASSET_DOCS = [
    "AI-Vendor-Due-Diligence-Checklist.pdf",
    "Build-vs-Buy-AI-Decision-Matrix.pdf",
    "Jason-Rae-Resume.pdf",
]

PUBLIC_ASSET_DATA = [
    "resume.json",
    "projects.json",
    "social-posts.public.json",
]


def run_content_build() -> None:
    subprocess.run([sys.executable, "generate_portfolio_pages.py"], cwd=ROOT, check=True)


def reset_site_dist() -> None:
    if SITE_DIST.exists():
        shutil.rmtree(SITE_DIST)
    SITE_DIST.mkdir(parents=True, exist_ok=True)


def copy_file(relative_path: str) -> None:
    source = ROOT / relative_path
    target = SITE_DIST / relative_path
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


def copy_tree(relative_path: str) -> None:
    source = ROOT / relative_path
    target = SITE_DIST / relative_path
    shutil.copytree(source, target)


def copy_public_assets() -> None:
    copy_tree("assets/images")

    for relative_name in PUBLIC_ASSET_DOCS:
        copy_file(f"assets/docs/{relative_name}")

    for relative_name in PUBLIC_ASSET_DATA:
        copy_file(f"assets/data/{relative_name}")


def build_public_social_archive_file() -> None:
    export_public_social_archive(
        ROOT / "assets/data/social-posts.json",
        ROOT / "assets/data/social-posts.public.json",
    )


def main() -> int:
    run_content_build()
    build_public_social_archive_file()
    reset_site_dist()

    for relative_path in ROOT_PUBLIC_FILES:
        copy_file(relative_path)

    for relative_path in ROOT_PUBLIC_DIRS:
        copy_tree(relative_path)

    copy_public_assets()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
