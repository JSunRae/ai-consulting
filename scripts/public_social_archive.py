import json
from copy import deepcopy
from pathlib import Path
from typing import Any


PUBLIC_POST_FIELDS = {
    "id",
    "title",
    "summary",
    "status",
    "pillar",
    "contentType",
    "preparedDate",
    "publishedDate",
    "sourceBlogUrl",
    "targetPageUrl",
    "ctaType",
    "tags",
    "sourceAuthor",
}

PUBLIC_PLATFORM_FIELDS = {
    "name",
    "status",
    "copy",
    "url",
    "publishedAt",
}


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


def _normalized_platforms(post: dict[str, Any]) -> list[dict[str, Any]]:
    platforms: list[dict[str, Any]] = []
    for platform in post.get("platforms", []):
        if platform.get("status") != "published":
            continue
        public_platform = {
            key: deepcopy(value)
            for key, value in platform.items()
            if key in PUBLIC_PLATFORM_FIELDS and value not in (None, "")
        }
        if public_platform:
            platforms.append(public_platform)
    return platforms


def build_public_social_archive(archive: dict[str, Any]) -> dict[str, Any]:
    posts: list[dict[str, Any]] = []

    for post in archive.get("posts", []):
        if post.get("status") != "published":
            continue

        public_post = {
            key: deepcopy(value)
            for key, value in post.items()
            if key in PUBLIC_POST_FIELDS and value not in (None, "")
        }
        public_post["status"] = "published"

        platforms = _normalized_platforms(post)
        if platforms:
            public_post["platforms"] = platforms

        if "publishedDate" not in public_post:
            published_candidates = [
                platform.get("publishedAt", "")
                for platform in platforms
                if platform.get("publishedAt")
            ]
            fallback_date = published_candidates[0] if published_candidates else post.get("preparedDate", "")
            if fallback_date:
                public_post["publishedDate"] = fallback_date

        posts.append(public_post)

    posts.sort(
        key=lambda item: item.get("publishedDate", item.get("preparedDate", "")),
        reverse=True,
    )

    return {
        "updatedAt": archive.get("updatedAt", ""),
        "posts": posts,
    }


def export_public_social_archive(source: Path, destination: Path) -> dict[str, Any]:
    archive = read_json(source)
    public_archive = build_public_social_archive(archive)
    write_json(destination, public_archive)
    return public_archive
