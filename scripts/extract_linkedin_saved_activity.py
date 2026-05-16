import argparse
import html
import json
import re
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any


MATCH_PATTERN = re.compile(
    r'href="https://www\.linkedin\.com/feed/update/(?P<urn>urn:li:activity:\d+)/".*?'
    r'data-testid="expandable-text-box">(?P<copy>.*?)</span>.*?'
    r'href="https://www\.linkedin\.com/analytics/post-summary/(?P=urn)/".*?'
    r'(?P<impressions>\d+) impressions',
    re.S,
)

AGE_PATTERN = re.compile(r">(\d+[hdw]|(?:\d+mo)|(?:\d+y))\s*•")
REPOST_PATTERN = re.compile(
    r'<p class="[^"]*"[^>]*><a class="[^"]*" href="https://www\.linkedin\.com/in/jason-c-rae/">'
    r'<strong>Jason Rae</strong></a><span class="_836eec6c"> </span>reposted this</p>.*?'
    r'href="https://www\.linkedin\.com/in/(?P<source_slug>[^"/]+)/".*?'
    r'<p class="[^"]*"[^>]*>(?P<source_name>[^<]+)</p>.*?'
    r'href="https://www\.linkedin\.com/feed/update/(?P<urn>urn:li:activity:\d+)/".*?'
    r'data-testid="expandable-text-box">(?P<copy>.*?)</span>',
    re.S,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract authored LinkedIn posts from a saved recent activity HTML page."
    )
    parser.add_argument("--input-html", required=True)
    parser.add_argument("--output-json", default="")
    parser.add_argument("--archive-path", default="")
    return parser.parse_args()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def write_json(path: Path, payload: Any) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


def normalize_copy(raw_copy: str) -> str:
    cleaned = html.unescape(re.sub(r"<[^>]+>", "", raw_copy))
    cleaned = cleaned.replace("\r", "")
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r" *\n *", "\n", cleaned)
    return cleaned.strip()


def estimate_date(relative_age: str, captured_at: datetime) -> str:
    if not relative_age:
        return captured_at.date().isoformat()

    if relative_age.endswith("h"):
        delta = timedelta(hours=int(relative_age[:-1]))
    elif relative_age.endswith("d"):
        delta = timedelta(days=int(relative_age[:-1]))
    elif relative_age.endswith("w"):
        delta = timedelta(weeks=int(relative_age[:-1]))
    elif relative_age.endswith("mo"):
        delta = timedelta(days=30 * int(relative_age[:-2]))
    elif relative_age.endswith("y"):
        delta = timedelta(days=365 * int(relative_age[:-1]))
    else:
        delta = timedelta(0)
    return (captured_at - delta).date().isoformat()


def derive_title(copy: str) -> str:
    lead = copy.split("\n\n", 1)[0].strip()
    if not lead:
        lead = copy.strip()
    if len(lead) <= 90:
        return lead
    trimmed = lead[:87].rstrip(" ,;:-")
    return f"{trimmed}..."


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
    if "price" in lowered or "sales rep" in lowered:
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
    ]
    tags = [label for label, needle in tag_map if needle in lowered]
    return tags or ["LinkedIn import"]


def extract_posts(text: str, captured_at: datetime, source_name: str) -> list[dict[str, Any]]:
    posts: list[dict[str, Any]] = []
    for match in MATCH_PATTERN.finditer(text):
        copy = normalize_copy(match.group("copy"))
        if not copy:
            continue

        window = text[max(0, match.start() - 2500) : match.start()]
        age_matches = list(AGE_PATTERN.finditer(window))
        relative_age = age_matches[-1].group(1) if age_matches else ""
        published_date = estimate_date(relative_age, captured_at)
        activity_id = match.group("urn").split(":")[-1]
        title = derive_title(copy)
        url = f"https://www.linkedin.com/feed/update/{match.group('urn')}/"

        posts.append(
            {
                "id": f"linkedin-activity-{activity_id}",
                "title": title,
                "summary": derive_summary(copy),
                "status": "published",
                "pillar": classify_pillar(copy),
                "contentType": "historical",
                "preparedDate": published_date,
                "publishedDate": published_date,
                "captureSource": "saved-linkedin-activity-html",
                "sourceSavedHtml": source_name,
                "relativeAgeAtCapture": relative_age,
                "capturedImpressions": int(match.group("impressions")),
                "tags": derive_tags(copy),
                "platforms": [
                    {
                        "name": "LinkedIn",
                        "status": "published",
                        "copy": copy,
                        "url": url,
                        "publishedAt": published_date,
                    }
                ],
            }
        )
    return posts


def extract_reposts(text: str, captured_at: datetime, source_name: str) -> list[dict[str, Any]]:
    reposts: list[dict[str, Any]] = []
    for match in REPOST_PATTERN.finditer(text):
        copy = normalize_copy(match.group("copy"))
        if not copy:
            continue

        window = text[max(0, match.start() - 2500) : match.start()]
        age_matches = list(AGE_PATTERN.finditer(window))
        relative_age = age_matches[-1].group(1) if age_matches else ""
        published_date = estimate_date(relative_age, captured_at)
        activity_id = match.group("urn").split(":")[-1]
        source_name_value = normalize_copy(match.group("source_name"))
        title = f"Jason reposted: {derive_title(copy)}"
        url = f"https://www.linkedin.com/feed/update/{match.group('urn')}/"

        reposts.append(
            {
                "id": f"linkedin-repost-{activity_id}",
                "title": title,
                "summary": f"Repost from {source_name_value}. {derive_summary(copy)}",
                "status": "published",
                "pillar": "LinkedIn repost",
                "contentType": "historical-repost",
                "preparedDate": published_date,
                "publishedDate": published_date,
                "captureSource": "saved-linkedin-activity-html",
                "sourceSavedHtml": source_name,
                "relativeAgeAtCapture": relative_age,
                "sourceAuthor": source_name_value,
                "sourceAuthorSlug": match.group("source_slug"),
                "tags": ["LinkedIn repost"],
                "platforms": [
                    {
                        "name": "LinkedIn",
                        "status": "published",
                        "copy": copy,
                        "url": url,
                        "publishedAt": published_date,
                    }
                ],
            }
        )
    return reposts


def merge_into_archive(archive_path: Path, imported_posts: list[dict[str, Any]]) -> None:
    archive = json.loads(archive_path.read_text(encoding="utf-8"))
    existing = {post.get("id"): post for post in archive.get("posts", [])}

    for post in imported_posts:
        existing[post["id"]] = post

    archive["posts"] = list(existing.values())
    archive["updatedAt"] = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    write_json(archive_path, archive)


def main() -> int:
    args = parse_args()
    input_path = Path(args.input_html)
    text = read_text(input_path)
    captured_at = datetime.fromtimestamp(input_path.stat().st_mtime)
    imported_posts = extract_posts(text, captured_at, input_path.name)
    imported_posts.extend(extract_reposts(text, captured_at, input_path.name))

    if args.output_json:
        write_json(Path(args.output_json), imported_posts)

    if args.archive_path:
        merge_into_archive(Path(args.archive_path), imported_posts)

    print(f"Extracted posts: {len(imported_posts)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
