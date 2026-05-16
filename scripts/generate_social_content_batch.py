import argparse
import json
import os
import sys
import textwrap
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv


DEFAULT_ARCHIVE_PATH = "assets/data/social-posts.json"
DEFAULT_GUIDANCE_PATH = "assets/data/social-guidance.json"
DEFAULT_OUTPUT_DIR = "Research and Documentation"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a 10-20 post social content batch.")
    parser.add_argument("--archive-path", default=DEFAULT_ARCHIVE_PATH)
    parser.add_argument("--guidance-path", default=DEFAULT_GUIDANCE_PATH)
    parser.add_argument("--output-dir", default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--count", type=int, default=12)
    parser.add_argument("--mock-openai", action="store_true")
    return parser.parse_args()


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")


def openai_headers(api_key: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


def call_openai(system_prompt: str, user_prompt: str, model: str, count: int) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set.")

    schema = {
        "name": "social_batch",
        "strict": True,
        "schema": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "batchTitle": {"type": "string"},
                "strategySummary": {"type": "string"},
                "posts": {
                    "type": "array",
                    "minItems": count,
                    "maxItems": count,
                    "items": {
                        "type": "object",
                        "additionalProperties": False,
                        "properties": {
                            "sequence": {"type": "integer"},
                            "title": {"type": "string"},
                            "pillar": {"type": "string"},
                            "contentType": {
                                "type": "string",
                                "enum": ["evergreen", "case-study", "directional", "news-reaction"],
                            },
                            "whyNow": {"type": "string"},
                            "sourceAnchor": {"type": "string"},
                            "suggestedTiming": {"type": "string"},
                            "linkedinCopy": {"type": "string"},
                            "xCopy": {"type": "string"},
                            "reviewRisk": {"type": "string"}
                        },
                        "required": [
                            "sequence",
                            "title",
                            "pillar",
                            "contentType",
                            "whyNow",
                            "sourceAnchor",
                            "suggestedTiming",
                            "linkedinCopy",
                            "xCopy",
                            "reviewRisk"
                        ]
                    }
                }
            },
            "required": ["batchTitle", "strategySummary", "posts"]
        }
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
        with urllib.request.urlopen(request, timeout=120) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI request failed: {exc.code} {body}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"OpenAI request failed: {exc}") from exc

    content = body["choices"][0]["message"]["content"]
    return json.loads(content)


def build_prompts(archive: dict[str, Any], guidance: dict[str, Any], count: int) -> tuple[str, str]:
    recent_posts = archive.get("posts", [])[:12]
    recent_summary = [
        {
            "title": post.get("title", ""),
            "pillar": post.get("pillar", ""),
            "contentType": post.get("contentType", ""),
            "summary": post.get("summary", ""),
        }
        for post in recent_posts
    ]

    system_prompt = textwrap.dedent(
        """
        You are planning Jason Rae's next batch of LinkedIn and X posts.

        Rules:
        - Jason's public label is Commercial Analytics & Applied AI Leader.
        - He should sound commercially credible, technically literate, and skeptical of hype.
        - The posts must reinforce forecasting, pricing, margin, CRM governance, reporting logic, workflow simplification, and governed AI adoption.
        - Avoid repeating the same argument from the recent archive too closely.
        - Vary the mix across evergreen, case-study, directional, and selective news-reaction style posts.
        - LinkedIn copy should be useful, structured, and senior.
        - X copy should be concise, sharp, and still sound like Jason.
        - Do not fabricate client facts, metrics, or achievements.
        - Do not use hashtags unless they add real value.
        - Return valid JSON only.
        """
    ).strip()

    user_prompt = textwrap.dedent(
        f"""
        Generate the next {count} posts for Jason Rae.

        Current guidance:
        {json.dumps(guidance, ensure_ascii=True)}

        Recent archive summary:
        {json.dumps(recent_summary, ensure_ascii=True)}

        Requirements:
        - Build a coherent batch, not random isolated ideas.
        - Include clear variety across pillars.
        - Include practical posts that could appeal to consulting buyers and hiring managers.
        - Suggested timing should be phrased simply, like "Week 1 Monday" or "After a pricing article goes live".
        - reviewRisk should be one short sentence explaining what Jason should double-check before posting.
        """
    ).strip()

    return system_prompt, user_prompt


def mock_batch(count: int) -> dict[str, Any]:
    posts = []
    for i in range(1, count + 1):
        posts.append(
            {
                "sequence": i,
                "title": f"Mock post {i}",
                "pillar": "Commercial analytics",
                "contentType": "evergreen",
                "whyNow": "Used only for local testing.",
                "sourceAnchor": "/services.html",
                "suggestedTiming": f"Week {(i - 1) // 5 + 1}",
                "linkedinCopy": f"Mock LinkedIn post {i}",
                "xCopy": f"Mock X post {i}",
                "reviewRisk": "Replace mock content before use."
            }
        )
    return {
        "batchTitle": "Mock social batch",
        "strategySummary": "Mock output for testing.",
        "posts": posts,
    }


def render_markdown(batch: dict[str, Any]) -> str:
    lines = [
        f"# {batch['batchTitle']}",
        "",
        f"Generated: {datetime.now(timezone.utc).isoformat()}",
        "",
        "## Strategy Summary",
        "",
        batch["strategySummary"],
        "",
    ]

    for post in batch["posts"]:
        lines.extend(
            [
                f"## {post['sequence']}. {post['title']}",
                "",
                f"- Pillar: `{post['pillar']}`",
                f"- Content type: `{post['contentType']}`",
                f"- Why now: {post['whyNow']}",
                f"- Source anchor: `{post['sourceAnchor']}`",
                f"- Suggested timing: {post['suggestedTiming']}",
                f"- Review risk: {post['reviewRisk']}",
                "",
                "### LinkedIn",
                "",
                post["linkedinCopy"],
                "",
                "### X",
                "",
                post["xCopy"],
                "",
            ]
        )

    return "\n".join(lines).strip() + "\n"


def main() -> int:
    load_dotenv()
    args = parse_args()

    archive = read_json(Path(args.archive_path))
    guidance = read_json(Path(args.guidance_path))
    system_prompt, user_prompt = build_prompts(archive, guidance, args.count)
    model = os.getenv("OPENAI_MODEL", "gpt-5.4")

    if args.mock_openai:
        batch = mock_batch(args.count)
    else:
        batch = call_openai(system_prompt, user_prompt, model, args.count)

    stamp = datetime.now(timezone.utc).strftime("%Y%m%d")
    output_dir = Path(args.output_dir)
    json_path = output_dir / f"Social_Content_Batch_{stamp}.json"
    md_path = output_dir / f"Social_Content_Batch_{stamp}.md"

    write_text(json_path, json.dumps(batch, indent=2, ensure_ascii=True) + "\n")
    write_text(md_path, render_markdown(batch))

    print(f"Wrote: {json_path}")
    print(f"Wrote: {md_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
