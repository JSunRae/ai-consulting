import argparse
import csv
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_ARCHIVE_PATH = "assets/data/social-posts.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Import historical social posts into the archive.")
    parser.add_argument("--input", required=True, help="Path to a CSV or JSON import file.")
    parser.add_argument("--archive-path", default=DEFAULT_ARCHIVE_PATH)
    parser.add_argument("--default-status", default="published", choices=["published", "ready", "scheduled"])
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, payload: Any) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


def slugify(value: str) -> str:
    lowered = re.sub(r"[^a-z0-9]+", "-", value.lower())
    return lowered.strip("-") or "social-post"


def parse_tags(raw_tags: str) -> list[str]:
    return [item.strip() for item in raw_tags.split("|") if item.strip()]


def read_rows(path: Path) -> list[dict[str, Any]]:
    if path.suffix.lower() == ".json":
        payload = read_json(path)
        if isinstance(payload, list):
            return payload
        if isinstance(payload, dict) and isinstance(payload.get("posts"), list):
            return payload["posts"]
        raise RuntimeError("JSON import must be a list or an object with a posts array.")

    if path.suffix.lower() != ".csv":
        raise RuntimeError("Supported import formats are .csv and .json.")

    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader)


def normalize_flat_rows(rows: list[dict[str, Any]], default_status: str) -> list[dict[str, Any]]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        row_id = (row.get("id") or "").strip()
        title = (row.get("title") or "").strip()
        date_value = (row.get("date") or row.get("preparedDate") or "").strip()
        group_key = row_id or slugify(f"{date_value}-{title}")
        grouped[group_key].append(row)

    posts: list[dict[str, Any]] = []
    for group_key, group_rows in grouped.items():
        first = group_rows[0]
        title = (first.get("title") or "").strip()
        prepared_date = (first.get("date") or first.get("preparedDate") or "").strip()
        post = {
            "id": (first.get("id") or group_key).strip(),
            "title": title,
            "summary": (first.get("summary") or title).strip(),
            "status": default_status,
            "launchWave": (first.get("launchWave") or "").strip(),
            "launchPriority": first.get("launchPriority") or None,
            "pillar": (first.get("pillar") or "Historical").strip(),
            "contentType": (first.get("contentType") or "historical").strip(),
            "preparedDate": prepared_date or datetime.now(timezone.utc).date().isoformat(),
            "sourceBlogUrl": (first.get("sourceBlogUrl") or "").strip(),
            "targetPageUrl": (first.get("targetPageUrl") or "").strip(),
            "ctaType": (first.get("ctaType") or "").strip(),
            "commercialIntent": (first.get("commercialIntent") or "").strip(),
            "offerAlignment": (first.get("offerAlignment") or "").strip(),
            "tags": parse_tags(first.get("tags", "")),
            "platforms": [],
        }
        for row in group_rows:
            platform_name = (row.get("platform") or "").strip()
            copy = (row.get("copy") or row.get("text") or "").strip()
            if not platform_name or not copy:
                continue
            platform_record = {
                "name": platform_name,
                "status": (row.get("status") or default_status).strip(),
                "copy": copy,
            }
            url = (row.get("url") or "").strip()
            if url:
                platform_record["url"] = url
            published_at = (row.get("publishedAt") or row.get("date") or prepared_date).strip()
            if published_at and platform_record["status"] == "published":
                platform_record["publishedAt"] = published_at
            post["platforms"].append(platform_record)
        posts.append(post)
    return posts


def merge_posts(existing: dict[str, Any], imported: dict[str, Any]) -> dict[str, Any]:
    merged = dict(existing)
    for key in (
        "title",
        "summary",
        "launchWave",
        "launchPriority",
        "pillar",
        "contentType",
        "preparedDate",
        "sourceBlogUrl",
        "targetPageUrl",
        "ctaType",
        "commercialIntent",
        "offerAlignment",
        "tags",
    ):
        if imported.get(key):
            merged[key] = imported[key]
    merged["status"] = imported.get("status", merged.get("status", "published"))

    platform_map = {item.get("name"): dict(item) for item in merged.get("platforms", [])}
    for platform in imported.get("platforms", []):
        current = platform_map.get(platform.get("name"), {})
        current.update({k: v for k, v in platform.items() if v not in ("", None, [])})
        platform_map[platform["name"]] = current
    merged["platforms"] = list(platform_map.values())
    return merged


def main() -> int:
    args = parse_args()
    archive_path = Path(args.archive_path)
    import_path = Path(args.input)

    archive = read_json(archive_path)
    rows = read_rows(import_path)
    normalized_posts = normalize_flat_rows(rows, args.default_status)

    existing_posts = {post.get("id"): post for post in archive.get("posts", [])}
    imported_count = 0
    for imported in normalized_posts:
        existing = existing_posts.get(imported["id"])
        if existing is None:
            archive.setdefault("posts", []).append(imported)
        else:
            merged = merge_posts(existing, imported)
            archive["posts"] = [
                merged if post.get("id") == imported["id"] else post
                for post in archive.get("posts", [])
            ]
        imported_count += 1

    archive["updatedAt"] = datetime.now(timezone.utc).isoformat()

    if not args.dry_run:
        write_json(archive_path, archive)

    print(f"Imported groups: {imported_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
