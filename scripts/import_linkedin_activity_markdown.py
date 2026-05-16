import argparse
import json
import re
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any


META_PATTERN = re.compile(r"- \*\*(?P<key>.+?):\*\*\s*(?P<value>.+)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import LinkedIn activity posts from a structured markdown export."
    )
    parser.add_argument("--input-md", required=True)
    parser.add_argument("--output-json", default="")
    parser.add_argument("--archive-path", default="")
    return parser.parse_args()


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")


def parse_relative_age(relative_age: str, captured_at: datetime) -> str:
    value = (relative_age or "").strip().lower()
    if not value:
        return captured_at.date().isoformat()

    if value.endswith("h"):
        delta = timedelta(hours=int(value[:-1]))
    elif value.endswith("d"):
        delta = timedelta(days=int(value[:-1]))
    elif value.endswith("w"):
        delta = timedelta(weeks=int(value[:-1]))
    elif value.endswith("mo"):
        delta = timedelta(days=30 * int(value[:-2]))
    elif value.endswith("y"):
        delta = timedelta(days=365 * int(value[:-1]))
    else:
        delta = timedelta(0)
    return (captured_at - delta).date().isoformat()


def slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "-", value.lower())
    return cleaned.strip("-")


def derive_summary(copy: str) -> str:
    summary = re.sub(r"\s+", " ", copy).strip()
    if len(summary) <= 220:
        return summary
    return f"{summary[:217].rstrip(' ,;:-')}..."


def classify_pillar(copy: str) -> str:
    lowered = copy.lower()
    if "copilot" in lowered or "document" in lowered:
        return "Applied AI governance"
    if "agent" in lowered or "workflow" in lowered or "decision-system" in lowered:
        return "Applied AI strategy"
    if "price" in lowered or "sales rep" in lowered or "pricing" in lowered:
        return "Pricing"
    if "forecast" in lowered or "market sizing" in lowered:
        return "Forecasting"
    if "customer" in lowered or "analytics" in lowered:
        return "Commercial analytics"
    return "LinkedIn thought leadership"


def derive_tags(copy: str) -> list[str]:
    lowered = copy.lower()
    tag_map = [
        ("AI agents", "agent"),
        ("Workflow design", "workflow"),
        ("Pricing", "price"),
        ("Customer targeting", "customer"),
        ("Forecasting", "forecast"),
        ("Copilot", "copilot"),
        ("Decision systems", "decision-system"),
        ("Commercial analytics", "analytics"),
        ("Leadership", "leadership"),
    ]
    tags = [label for label, needle in tag_map if needle in lowered]
    return tags or ["LinkedIn import"]


def normalize_context(raw_context: str) -> str:
    context = raw_context.replace("\r", "").strip()
    context = re.sub(r"\n{3,}", "\n\n", context)
    return context


def parse_entries(markdown_text: str) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    for section in markdown_text.split("\n---\n"):
        if not section.strip().startswith("## "):
            continue

        lines = section.strip().splitlines()
        if not lines:
            continue

        title_line = lines[0].strip()
        title = re.sub(r"^##\s+\d+\.\s+", "", title_line).strip()

        metadata: dict[str, str] = {}
        context_start = None
        for index, line in enumerate(lines[1:], start=1):
            stripped = line.strip()
            if stripped == "**Context**":
                context_start = index + 1
                break

            meta_match = META_PATTERN.match(stripped)
            if meta_match:
                metadata[meta_match.group("key").strip()] = meta_match.group("value").strip()

        if context_start is None:
            continue

        context_lines = lines[context_start:]
        while context_lines and not context_lines[0].strip():
            context_lines.pop(0)

        entries.append(
            {
                "title": title,
                "context": normalize_context("\n".join(context_lines)),
                "metadata": metadata,
            }
        )
    return entries


def match_existing_post(entry: dict[str, Any], existing_posts: list[dict[str, Any]]) -> dict[str, Any] | None:
    title = entry["title"]
    entry_type = entry["metadata"].get("Type", "")
    if entry_type == "Repost":
        candidates: list[dict[str, Any]] = []
        source_author = entry["metadata"].get("Author", "")
        for post in existing_posts:
            platforms = post.get("platforms") or []
            linkedin_copy = ""
            for platform in platforms:
                if platform.get("name") == "LinkedIn":
                    linkedin_copy = platform.get("copy", "")
                    break

            if not linkedin_copy.startswith(title):
                continue

            if post.get("sourceAuthor") and source_author and post.get("sourceAuthor") != source_author:
                continue

            candidates.append(post)

        if candidates:
            candidates.sort(
                key=lambda post: (
                    0 if re.fullmatch(r"linkedin-repost-\d+", str(post.get("id", ""))) else 1,
                    0
                    if any(platform.get("url") for platform in post.get("platforms", []))
                    else 1,
                )
            )
            return candidates[0]

    for post in existing_posts:
        platforms = post.get("platforms") or []
        linkedin_copy = ""
        for platform in platforms:
            if platform.get("name") == "LinkedIn":
                linkedin_copy = platform.get("copy", "")
                break

        if linkedin_copy.startswith(title):
            return post

        if post.get("title") == title:
            return post

        if entry_type == "Repost" and title in str(post.get("title", "")):
            return post
    return None


def build_record(
    entry: dict[str, Any],
    matched_post: dict[str, Any] | None,
    source_name: str,
    captured_at: datetime,
) -> dict[str, Any]:
    title = entry["title"]
    context = entry["context"]
    metadata = entry["metadata"]
    full_copy = title if not context else f"{title}\n\n{context}"
    existing_platform = {}
    if matched_post:
        for platform in matched_post.get("platforms", []):
            if platform.get("name") == "LinkedIn":
                existing_platform = dict(platform)
                break

    published_date = (
        matched_post.get("publishedDate")
        if matched_post and matched_post.get("publishedDate")
        else parse_relative_age(metadata.get("Date shown", ""), captured_at)
    )

    if metadata.get("Type") == "Repost":
        record_id = matched_post.get("id") if matched_post else f"linkedin-repost-{slugify(title)[:64]}"
        content_type = "historical-repost"
        pillar = "LinkedIn repost"
        tags = ["LinkedIn repost"]
    else:
        record_id = matched_post.get("id") if matched_post else f"linkedin-activity-{slugify(title)[:64]}"
        content_type = "historical"
        pillar = classify_pillar(full_copy)
        tags = derive_tags(full_copy)

    if content_type == "historical":
        resolved_title = title
    elif matched_post:
        resolved_title = matched_post.get("title", f"Jason reposted: {title}")
    else:
        resolved_title = f"Jason reposted: {title}"

    record: dict[str, Any] = dict(matched_post or {})
    record.update(
        {
            "id": record_id,
            "title": resolved_title,
            "summary": derive_summary(full_copy),
            "status": "published",
            "pillar": pillar,
            "contentType": content_type,
            "preparedDate": published_date,
            "publishedDate": published_date,
            "captureSource": "linkedin-activity-markdown-export",
            "sourceMarkdownFile": source_name,
            "sourceSnapshotDateShown": metadata.get("Date shown", ""),
            "activityType": metadata.get("Type", ""),
            "relativeAgeAtCapture": metadata.get("Date shown", matched_post.get("relativeAgeAtCapture", "") if matched_post else ""),
            "tags": tags,
        }
    )

    if metadata.get("Author"):
        record["author"] = metadata.get("Author")
    if metadata.get("Original author context"):
        record["sourceAuthorContext"] = metadata.get("Original author context")
    if metadata.get("Author") and metadata.get("Type") == "Repost":
        record["sourceAuthor"] = metadata.get("Author")

    platform = {
        "name": "LinkedIn",
        "status": "published",
        "copy": full_copy,
        "url": existing_platform.get("url", ""),
        "publishedAt": published_date,
    }
    record["platforms"] = [platform]
    return record


def merge_into_archive(archive_path: Path, records: list[dict[str, Any]]) -> dict[str, Any]:
    archive = json.loads(archive_path.read_text(encoding="utf-8"))
    existing_posts = archive.get("posts", [])
    post_map = {post.get("id"): post for post in existing_posts}
    for record in records:
        post_map[record["id"]] = record

    deduped_posts: list[dict[str, Any]] = []
    seen_keys: dict[tuple[str, str], dict[str, Any]] = {}

    def linkedin_copy(post: dict[str, Any]) -> str:
        for platform in post.get("platforms", []):
            if platform.get("name") == "LinkedIn":
                return (platform.get("copy") or "").strip()
        return ""

    def ranking(post: dict[str, Any]) -> tuple[int, int]:
        has_url = 0 if any(platform.get("url") for platform in post.get("platforms", [])) else 1
        canonical_id = 0 if re.fullmatch(r"linkedin-(?:activity|repost|share|like)-\d+", str(post.get("id", ""))) else 1
        return (has_url, canonical_id)

    for post in post_map.values():
        copy = linkedin_copy(post)
        if not copy:
            deduped_posts.append(post)
            continue

        dedupe_key = (copy, str(post.get("sourceAuthor", "")))
        existing = seen_keys.get(dedupe_key)
        if not existing or ranking(post) < ranking(existing):
            seen_keys[dedupe_key] = post

    copied_ids = {id(post) for post in seen_keys.values()}
    for post in post_map.values():
        copy = linkedin_copy(post)
        if not copy:
            continue
        if id(post) in copied_ids:
            deduped_posts.append(post)

    archive["posts"] = deduped_posts
    archive["updatedAt"] = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    notes = archive.get("archiveNotes") or []
    note = "Structured markdown exports can now be imported directly into the social archive."
    if note not in notes:
        notes.append(note)
    archive["archiveNotes"] = notes
    write_json(archive_path, archive)
    return archive


def main() -> int:
    args = parse_args()
    input_path = Path(args.input_md)
    markdown_text = input_path.read_text(encoding="utf-8", errors="ignore")
    captured_at = datetime.fromtimestamp(input_path.stat().st_mtime)
    entries = parse_entries(markdown_text)

    existing_posts: list[dict[str, Any]] = []
    if args.archive_path:
        archive = json.loads(Path(args.archive_path).read_text(encoding="utf-8"))
        existing_posts = archive.get("posts", [])

    records = [
        build_record(entry, match_existing_post(entry, existing_posts), input_path.name, captured_at)
        for entry in entries
    ]

    if args.output_json:
        write_json(Path(args.output_json), records)

    if args.archive_path:
        archive = merge_into_archive(Path(args.archive_path), records)
        print(f"Merged records: {len(records)}")
        print(f"Archive entries: {len(archive.get('posts', []))}")
    else:
        print(f"Parsed records: {len(records)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
