import argparse
import json
import os
import re
import sys
import textwrap
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from dotenv import load_dotenv


QUALITY_THRESHOLD = 70
DEFAULT_ARCHIVE_PATH = "assets/data/social-posts.json"
DEFAULT_SOURCES_PATH = "assets/data/social-sources.json"
DEFAULT_APPROVAL_DIR = "artifacts/social-approval"
DEFAULT_GUIDANCE_PATH = "assets/data/social-guidance.json"


@dataclass
class Candidate:
    kind: str
    title: str
    summary: str
    source: str
    url: str
    published_at: str
    pillar: str | None = None
    content_type: str | None = None
    tags: list[str] | None = None
    source_blog_url: str | None = None
    score: float = 0.0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate secure social drafts and sync the public archive.")
    parser.add_argument("--archive-path", default=os.getenv("SOCIAL_ARCHIVE_PATH", DEFAULT_ARCHIVE_PATH))
    parser.add_argument("--sources-path", default=DEFAULT_SOURCES_PATH)
    parser.add_argument("--approval-dir", default=DEFAULT_APPROVAL_DIR)
    parser.add_argument("--guidance-path", default=os.getenv("SOCIAL_GUIDANCE_PATH", DEFAULT_GUIDANCE_PATH))
    parser.add_argument("--mock-openai", action="store_true")
    parser.add_argument("--limit", type=int, default=1)
    return parser.parse_args()


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, payload: Any) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


def read_optional_json(path: Path) -> Any:
    if not path.exists():
        return {}
    return read_json(path)


def fetch_url(url: str) -> bytes:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "JasonRaeSocialDraftBot/1.0 (+https://jasonrae.ai)",
            "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml",
        },
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.read()


def element_text(parent: ET.Element, *names: str) -> str:
    for name in names:
        element = parent.find(name)
        if element is not None and element.text:
            return element.text.strip()
    return ""


def normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def sanitize_summary(value: str) -> str:
    summary = re.sub(r"<[^>]+>", " ", value or "")
    return normalize_whitespace(summary)[:420]


def parse_published(value: str) -> str:
    if not value:
        return ""

    try:
        return parsedate_to_datetime(value).astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError, IndexError, OverflowError):
        pass

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc).isoformat()
    except ValueError:
        return value


def parse_feed(feed: dict[str, Any]) -> list[Candidate]:
    try:
        xml_bytes = fetch_url(feed["url"])
    except (urllib.error.URLError, TimeoutError):
        return []

    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return []

    candidates: list[Candidate] = []
    entries = root.findall("./channel/item")
    if not entries:
        atom_entries = root.findall("{http://www.w3.org/2005/Atom}entry")
        for entry in atom_entries:
            title = element_text(entry, "{http://www.w3.org/2005/Atom}title")
            summary = element_text(
                entry,
                "{http://www.w3.org/2005/Atom}summary",
                "{http://www.w3.org/2005/Atom}content",
            )
            link_element = entry.find("{http://www.w3.org/2005/Atom}link")
            url = link_element.attrib.get("href", "").strip() if link_element is not None else ""
            published_at = parse_published(
                element_text(
                    entry,
                    "{http://www.w3.org/2005/Atom}updated",
                    "{http://www.w3.org/2005/Atom}published",
                )
            )
            if title and url:
                candidates.append(
                    Candidate(
                        kind="news",
                        title=title,
                        summary=sanitize_summary(summary),
                        source=feed["name"],
                        url=url,
                        published_at=published_at,
                    )
                )
        return candidates

    for item in entries:
        title = element_text(item, "title")
        summary = element_text(item, "description", "content:encoded")
        url = element_text(item, "link")
        published_at = parse_published(element_text(item, "pubDate", "dc:date"))
        if title and url:
            candidates.append(
                Candidate(
                    kind="news",
                    title=title,
                    summary=sanitize_summary(summary),
                    source=feed["name"],
                    url=url,
                    published_at=published_at,
                )
            )
    return candidates


def slugify(value: str) -> str:
    lowered = re.sub(r"[^a-z0-9]+", "-", value.lower())
    return lowered.strip("-") or "social-draft"


def title_signature(value: str) -> str:
    return slugify(value.replace("llm", "ai"))


def score_news_candidate(candidate: Candidate, recent_titles: list[str], feed_weight: float) -> float:
    text = f"{candidate.title} {candidate.summary}".lower()
    keywords = {
        "pricing": 16,
        "forecast": 16,
        "margin": 16,
        "crm": 14,
        "analytics": 12,
        "data": 8,
        "decision": 10,
        "workflow": 10,
        "governance": 14,
        "revenue": 10,
        "sales": 8,
        "finance": 8,
        "ai": 6,
        "llm": 8,
        "automation": 8,
    }
    score = feed_weight * 25
    for keyword, weight in keywords.items():
        if keyword in text:
            score += weight

    if any(signature == title_signature(candidate.title) for signature in recent_titles):
        score -= 40

    if len(candidate.summary) > 80:
        score += 8

    if candidate.published_at:
        score += 6

    return round(score, 2)


def choose_candidate(
    archive: dict[str, Any],
    sources: dict[str, Any],
    guidance: dict[str, Any],
) -> Candidate:
    recent_titles = [title_signature(post.get("title", "")) for post in archive.get("posts", [])[:8]]
    ranked: list[Candidate] = []
    pinned_slug = normalize_whitespace(guidance.get("pinnedEvergreenSlug", ""))

    for feed in sources.get("feeds", []):
        for candidate in parse_feed(feed)[:6]:
            candidate.score = score_news_candidate(candidate, recent_titles, float(feed.get("weight", 1.0)))
            ranked.append(candidate)

    ranked.sort(key=lambda item: item.score, reverse=True)
    if ranked and ranked[0].score >= 52:
        return ranked[0]

    evergreen_pool = sources.get("evergreen", [])
    if pinned_slug:
        evergreen_pool = sorted(
            evergreen_pool,
            key=lambda item: 0 if item.get("slug") == pinned_slug else 1,
        )

    for fallback in evergreen_pool:
        if title_signature(fallback["title"]) in recent_titles:
            continue
        return Candidate(
            kind="evergreen",
            title=fallback["title"],
            summary=fallback["summary"],
            source="Evergreen bank",
            url="",
            published_at="",
            pillar=fallback.get("pillar"),
            content_type=fallback.get("contentType", "evergreen"),
            tags=fallback.get("tags", []),
            source_blog_url=fallback.get("sourceBlogUrl"),
            score=50,
        )

    raise RuntimeError("No suitable news or evergreen candidate was available.")


def build_prompt(candidate: Candidate, archive: dict[str, Any], guidance: dict[str, Any]) -> tuple[str, str]:
    recent = archive.get("posts", [])[:6]
    recent_titles = [post.get("title", "") for post in recent if post.get("title")]
    operator_notes = guidance.get("operatorNotes", [])
    priority_topics = guidance.get("priorityTopics", [])
    avoid_topics = guidance.get("avoidTopics", [])
    pinned_angles = guidance.get("pinnedAngles", [])
    system_prompt = textwrap.dedent(
        """
        You are drafting Jason Rae's social content.

        Brand rules:
        - Lead with commercial analytics, decision systems, forecasting, pricing, margin, CRM governance, workflow simplification, and executive reporting.
        - Avoid hype, generic AI commentary, emojis, and startup language.
        - Keep the voice practical, operator-led, skeptical of weak process, and focused on measurable business value.
        - X copy should be concise and sharp.
        - LinkedIn copy should be more structured and useful, but still direct.
        - If the input is a news item, react with Jason's angle instead of summarizing the press release.
        - If the input is evergreen, turn it into a strong opinion backed by operating logic.
        - Return valid JSON only.
        """
    ).strip()

    user_prompt = textwrap.dedent(
        f"""
        Candidate type: {candidate.kind}
        Candidate title: {candidate.title}
        Candidate source: {candidate.source}
        Candidate url: {candidate.url or 'N/A'}
        Candidate published_at: {candidate.published_at or 'N/A'}
        Candidate summary: {candidate.summary}

        Known positioning:
        - Jason Rae: commercial operator -> analytics architect -> applied AI leader
        - He emphasizes governed workflows, auditability, messy real-world data, and decision quality
        - He should sound credible to commercial leaders, not like a generic AI creator

        Current operator notes:
        {json.dumps(operator_notes, ensure_ascii=True)}

        Priority topics to favor when relevant:
        {json.dumps(priority_topics, ensure_ascii=True)}

        Topics or angles to avoid:
        {json.dumps(avoid_topics, ensure_ascii=True)}

        Pinned angles if a strong fit exists:
        {json.dumps(pinned_angles, ensure_ascii=True)}

        Recent archive titles to avoid repeating too closely:
        {json.dumps(recent_titles, ensure_ascii=True)}

        Return a JSON object with this shape:
        {{
          "title": "string",
          "summary": "string",
          "pillar": "string",
          "contentType": "news|evergreen|case-study|directional",
          "tags": ["string", "string", "string"],
          "qualityScore": 0,
          "approvalReason": "string",
          "evidenceNote": "string",
          "riskFlags": ["string"],
          "linkedinCopy": "string",
          "xCopy": "string"
        }}

        Requirements:
        - qualityScore must reflect whether this is strong enough for manual review and archive sync
        - approvalReason should explain why the draft is worth reviewing now
        - evidenceNote should explain the factual basis or source logic for the post
        - riskFlags should be an empty array unless there is a real review concern
        - xCopy should stay within roughly 280 characters
        - Do not mention hashtags unless they add real value
        - Do not fabricate metrics or facts
        """
    ).strip()
    return system_prompt, user_prompt


def openai_headers(api_key: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


def call_openai(system_prompt: str, user_prompt: str, model: str) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set.")

    schema = {
        "name": "social_draft",
        "strict": True,
        "schema": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "title": {"type": "string"},
                "summary": {"type": "string"},
                "pillar": {"type": "string"},
                "contentType": {
                    "type": "string",
                    "enum": ["news", "evergreen", "case-study", "directional"],
                },
                "tags": {
                    "type": "array",
                    "items": {"type": "string"},
                    "minItems": 2,
                    "maxItems": 5,
                },
                "qualityScore": {"type": "integer", "minimum": 0, "maximum": 100},
                "approvalReason": {"type": "string"},
                "evidenceNote": {"type": "string"},
                "riskFlags": {
                    "type": "array",
                    "items": {"type": "string"},
                    "maxItems": 5,
                },
                "linkedinCopy": {"type": "string"},
                "xCopy": {"type": "string"},
            },
            "required": [
                "title",
                "summary",
                "pillar",
                "contentType",
                "tags",
                "qualityScore",
                "approvalReason",
                "evidenceNote",
                "riskFlags",
                "linkedinCopy",
                "xCopy",
            ],
        },
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": schema,
        },
    }

    request = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers=openai_headers(api_key),
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI request failed: {exc.code} {body}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"OpenAI request failed: {exc}") from exc

    content = body["choices"][0]["message"]["content"]
    return json.loads(content)


def mock_openai_response(candidate: Candidate) -> dict[str, Any]:
    if candidate.kind == "news":
        return {
            "title": f"{candidate.title}: the workflow angle leaders should care about",
            "summary": "A draft reaction that converts a news item into a Jason Rae-style commercial analytics viewpoint instead of repeating the headline.",
            "pillar": "Applied AI engineering",
            "contentType": "news",
            "tags": ["AI", "Workflow design", "Commercial analytics"],
            "qualityScore": 84,
            "approvalReason": "The topic is current, commercially relevant, and gives Jason a differentiated operator-led angle.",
            "evidenceNote": "Anchored in the linked news item, but reframed around workflow control and commercial decision quality rather than repeating the announcement.",
            "riskFlags": [],
            "linkedinCopy": "The useful question is not whether this AI announcement is impressive. It is whether it improves a real workflow without weakening control.\n\nThat is the filter I use in commercial analytics: clearer ownership, faster decisions, and better trust in the number. If the workflow is still fragile, the model mostly scales confusion faster.\n\nThe opportunity is real. The operating discipline matters more.",
            "xCopy": "The question is not whether the AI announcement is impressive. It is whether it improves a real workflow without weakening control.\n\nIf the process is still fragile, the model mostly scales confusion faster.",
        }

    return {
        "title": candidate.title,
        "summary": candidate.summary,
        "pillar": candidate.pillar or "Commercial analytics",
        "contentType": candidate.content_type or "evergreen",
        "tags": candidate.tags or ["Commercial analytics", "Decision systems"],
        "qualityScore": 82,
        "approvalReason": "The news cycle is weak, so this evergreen angle is a better fit for Jason's positioning and still useful to the audience.",
        "evidenceNote": "Derived from an internal evergreen pillar already grounded in Jason's published site content.",
        "riskFlags": [],
        "linkedinCopy": "Forecast quality usually fails before the math. It breaks in stage discipline, ownership, and review cadence.\n\nThat is why I do not start with a model when leaders say the forecast is unreliable. I start with the decision system underneath it.\n\nWhen the operating logic gets stronger, better analytics actually have something stable to work with.",
        "xCopy": "Forecast quality usually fails before the math.\n\nIt breaks in stage discipline, ownership, and review cadence.\n\nFix the decision system first. Then the analytics can actually help.",
    }


def next_weekday_slot(timezone_name: str, hour: int, minute: int) -> str:
    tz = ZoneInfo(timezone_name)
    now = datetime.now(tz)
    target = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    if target <= now:
        target = target + timedelta(days=1)
    while target.weekday() >= 5:
        target = target + timedelta(days=1)
    return target.astimezone(timezone.utc).isoformat()


def build_schedule_plan(guidance: dict[str, Any], draft: dict[str, Any]) -> dict[str, Any]:
    workflow = guidance.get("workflow", {})
    timezone_name = workflow.get("timezone", os.getenv("SOCIAL_TIMEZONE", "Europe/Berlin"))
    linkedin_route = workflow.get("preferredPostingRoute", {}).get("linkedin", "buffer")
    x_route = workflow.get("preferredPostingRoute", {}).get("x", "buffer")
    manual_threshold = int(workflow.get("manualReviewThreshold", QUALITY_THRESHOLD))
    auto_threshold = int(workflow.get("autoScheduleThreshold", 85))
    score = int(draft["qualityScore"])
    if score >= auto_threshold and not draft.get("riskFlags"):
        schedule_status = "suggested"
    elif score >= manual_threshold:
        schedule_status = "needs-review"
    else:
        schedule_status = "hold"

    return {
        "status": schedule_status,
        "timezone": timezone_name,
        "platforms": [
            {
                "name": "LinkedIn",
                "route": linkedin_route,
                "suggestedAt": next_weekday_slot(timezone_name, 8, 30),
            },
            {
                "name": "X",
                "route": x_route,
                "suggestedAt": next_weekday_slot(timezone_name, 12, 30),
            },
        ],
    }


def build_post_record(candidate: Candidate, draft: dict[str, Any], report_name: str, guidance: dict[str, Any]) -> dict[str, Any]:
    today = datetime.now(timezone.utc).date().isoformat()
    title = normalize_whitespace(draft["title"])
    return {
        "id": slugify(f"{today}-{title}")[:80],
        "title": title,
        "summary": normalize_whitespace(draft["summary"]),
        "status": "queue",
        "approvalStatus": "needs-review",
        "launchWave": "ongoing-social-pipeline",
        "launchPriority": None,
        "pillar": normalize_whitespace(draft["pillar"]),
        "contentType": draft["contentType"],
        "preparedDate": today,
        "sourceBlogUrl": candidate.source_blog_url,
        "targetPageUrl": candidate.source_blog_url or "",
        "ctaType": "",
        "commercialIntent": "authority-builder",
        "offerAlignment": "",
        "tags": draft["tags"],
        "sourceEvidence": {
            "source": candidate.source,
            "url": candidate.url,
            "publishedAt": candidate.published_at,
            "summary": candidate.summary,
            "evidenceNote": normalize_whitespace(draft["evidenceNote"]),
        },
        "reviewGuidance": {
            "approvalReason": normalize_whitespace(draft["approvalReason"]),
            "riskFlags": draft.get("riskFlags", []),
            "operatorNotesApplied": guidance.get("operatorNotes", []),
        },
        "schedule": build_schedule_plan(guidance, draft),
        "draftOrigin": {
            "kind": candidate.kind,
            "source": candidate.source,
            "report": report_name,
            "generatedBy": "github-actions-or-local-pipeline",
        },
        "qualityScore": int(draft["qualityScore"]),
        "platforms": [
            {
                "name": "LinkedIn",
                "status": "draft",
                "copy": draft["linkedinCopy"],
            },
            {
                "name": "X",
                "status": "draft",
                "copy": draft["xCopy"],
            },
        ],
    }


def upsert_archive_post(archive: dict[str, Any], post: dict[str, Any]) -> bool:
    posts = archive.setdefault("posts", [])
    post_signature = title_signature(post["title"])
    for index, existing in enumerate(posts):
        if title_signature(existing.get("title", "")) == post_signature:
            posts[index] = post
            return True
    posts.insert(0, post)
    return True


def ensure_archive_metadata(archive: dict[str, Any]) -> None:
    workflow = archive.setdefault("workflow", {})
    workflow.setdefault("timezone", os.getenv("SOCIAL_TIMEZONE", "Europe/Berlin"))
    workflow.setdefault("morningResearchTime", "06:30")
    workflow["approvalMode"] = os.getenv(
        "SOCIAL_APPROVAL_MODE",
        workflow.get("approvalMode", "Manual review first, auto-post only after quality thresholds are proven"),
    )
    workflow["runtime"] = "GitHub Actions"
    workflow["draftPipeline"] = "OpenAI draft generation -> approval artifact -> archive sync"
    workflow["autoPostEnabled"] = os.getenv("SOCIAL_AUTO_POST_ENABLED", "false").lower() == "true"
    archive["updatedAt"] = datetime.now(timezone.utc).isoformat()

    notes = archive.setdefault("archiveNotes", [])
    note = "Morning draft runs generate a private approval artifact and only sync high-enough scoring drafts into the public archive."
    if note not in notes:
        notes.append(note)


def write_approval_files(
    approval_dir: Path,
    candidate: Candidate,
    draft: dict[str, Any],
    archive_post: dict[str, Any] | None,
) -> tuple[str, Path]:
    approval_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    slug = slugify(draft["title"])
    base_name = f"{stamp}-{slug}"
    markdown_path = approval_dir / f"{base_name}.md"
    json_path = approval_dir / f"{base_name}.json"

    markdown = "\n".join(
        [
            "# Social Draft Approval Packet",
            "",
            f"- Generated at: {datetime.now(timezone.utc).isoformat()}",
            f"- Candidate type: {candidate.kind}",
            f"- Candidate source: {candidate.source}",
            f"- Candidate URL: {candidate.url or 'N/A'}",
            f"- Candidate published_at: {candidate.published_at or 'N/A'}",
            f"- Quality score: {draft['qualityScore']}",
            f"- Archive sync: {'queued' if archive_post else 'skipped'}",
            f"- Risk flags: {', '.join(draft.get('riskFlags', [])) or 'none'}",
            "",
            "## Why review this",
            "",
            draft["approvalReason"],
            "",
            "## Evidence note",
            "",
            draft["evidenceNote"],
            "",
            "## Candidate summary",
            "",
            candidate.summary,
            "",
            "## Draft title",
            "",
            draft["title"],
            "",
            "## Draft summary",
            "",
            draft["summary"],
            "",
            "## LinkedIn",
            "",
            draft["linkedinCopy"],
            "",
            "## X",
            "",
            draft["xCopy"],
            "",
        ]
    )

    markdown_path.write_text(markdown, encoding="utf-8", newline="\n")
    json_path.write_text(
        json.dumps(
            {
                "candidate": candidate.__dict__,
                "draft": draft,
                "archivePost": archive_post,
            },
            indent=2,
            ensure_ascii=True,
        ) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    return markdown_path.name, markdown_path


def main() -> int:
    load_dotenv()
    args = parse_args()

    archive_path = Path(args.archive_path)
    sources_path = Path(args.sources_path)
    approval_dir = Path(args.approval_dir)
    guidance_path = Path(args.guidance_path)

    archive = read_json(archive_path)
    sources = read_json(sources_path)
    guidance = read_optional_json(guidance_path)
    candidate = choose_candidate(archive, sources, guidance)
    system_prompt, user_prompt = build_prompt(candidate, archive, guidance)
    model = os.getenv("OPENAI_MODEL", "gpt-5.4")

    if args.mock_openai:
        draft = mock_openai_response(candidate)
    else:
        draft = call_openai(system_prompt, user_prompt, model)

    archive_post = None
    report_name = "pending"
    if int(draft["qualityScore"]) >= QUALITY_THRESHOLD:
        archive_post = build_post_record(candidate, draft, report_name, guidance)

    report_name, markdown_path = write_approval_files(approval_dir, candidate, draft, archive_post)

    if archive_post is not None:
        archive_post["draftOrigin"]["report"] = report_name
        ensure_archive_metadata(archive)
        upsert_archive_post(archive, archive_post)
        write_json(archive_path, archive)

    print(f"Approval report: {markdown_path}")
    if archive_post is None:
        print("Archive sync skipped because the draft scored below the quality threshold.")
    else:
        print(f"Archive synced with draft id: {archive_post['id']}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # pragma: no cover - CLI surface
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
