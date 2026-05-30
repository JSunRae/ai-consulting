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
    "assets/images",
]

BLOG_FILES = [
    "5-ways-gpt4-transforms-business-analytics.html",
    "5-ways-llm-workflows-transform-business-analytics.html",
    "ai-cost-reduction-reality-check.html",
    "ai-vendor-due-diligence-checklist.html",
    "build-vs-buy-ai-decision-matrix.html",
    "customer-service-ai-checklist-before-chatbot.html",
    "deterministic-llm-programming-production-ai.html",
    "enterprise-ai-adoption-commercial-analytics.html",
    "how-to-evaluate-ai-projects-roi.html",
    "index.html",
    "pl-attribution-fx-errors-data-analytics.html",
    "power-bi-vs-tableau-2024-comparison.html",
    "reducing-report-volume-95-percent-case-study.html",
    "social-posts.html",
]

CSS_FILES = [
    "components.css",
    "print.css",
    "responsive.css",
    "style.css",
    "variables.css",
]

JS_FILES = [
    "animations.js",
    "blog-index.js",
    "chatbot.js",
    "decision-network.js",
    "forms.js",
    "main.js",
    "portfolio.js",
    "social-archive.js",
    "theme-init.js",
]

PORTFOLIO_FILES = [
    "ai-desktop-agent-orchestrator.html",
    "ai-memoir-narrative-pipeline.html",
    "algorithmic-trading-ai.html",
    "multilingual-travel-authorization-saas.html",
]

PUBLIC_DOC_FILES = [
    "AI-Vendor-Due-Diligence-Checklist.pdf",
    "Build-vs-Buy-AI-Decision-Matrix.pdf",
    "Jason-Rae-Resume.pdf",
]

PUBLIC_DATA_FILES = [
    "projects.json",
    "resume.json",
    "social-posts.public.json",
]


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
        public_payload = json.loads(public_path.read_text(encoding="utf-8"))
    else:
        raise FileNotFoundError(
            "Neither assets/data/social-posts.json nor assets/data/social-posts.public.json exists.",
        )

    public_path.write_text(
        json.dumps(public_payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def ensure_dist_root() -> None:
    DIST_DIR.mkdir(parents=True, exist_ok=True)

    for child in DIST_DIR.iterdir():
        if child.is_dir():
            shutil.rmtree(child)
        else:
            child.unlink()


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
    for file_name in PUBLIC_DATA_FILES:
        copy_file(str(Path("assets") / "data" / file_name))

    for file_name in PUBLIC_DOC_FILES:
        copy_file(str(Path("assets") / "docs" / file_name))


def copy_public_runtime_files() -> None:
    for file_name in BLOG_FILES:
        copy_file(str(Path("blog") / file_name))

    for file_name in CSS_FILES:
        copy_file(str(Path("css") / file_name))

    for file_name in JS_FILES:
        copy_file(str(Path("js") / file_name))

    for file_name in PORTFOLIO_FILES:
        copy_file(str(Path("portfolio") / file_name))


def main() -> None:
    run_portfolio_generation()
    build_public_social_archive()
    ensure_dist_root()

    for relative_path in ROOT_FILES:
        copy_file(relative_path)

    for relative_path in TREE_DIRS:
        copy_tree(relative_path)

    copy_public_runtime_files()
    copy_public_assets()
    print(f"Public bundle built at {DIST_DIR}")


if __name__ == "__main__":
    main()
