import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv


BUFFER_API_URL = "https://api.buffer.com"
DEFAULT_ARCHIVE_PATH = "assets/data/social-posts.json"
PLATFORM_ENV_MAP = {
    "LinkedIn": "BUFFER_LINKEDIN_CHANNEL_ID",
    "X": "BUFFER_X_CHANNEL_ID",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Schedule approved social posts through Buffer and sync archive state."
    )
    parser.add_argument("--archive-path", default=os.getenv("SOCIAL_ARCHIVE_PATH", DEFAULT_ARCHIVE_PATH))
    parser.add_argument("--post-id", default="")
    parser.add_argument("--platform", choices=["LinkedIn", "X", "all"], default="all")
    parser.add_argument("--schedule-offset-minutes", type=int, default=15)
    parser.add_argument("--publish", action="store_true", help="Schedule eligible approved posts.")
    parser.add_argument("--sync", action="store_true", help="Sync scheduled/sent state back from Buffer.")
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, payload: Any) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def parse_iso8601(value: str) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
    except ValueError:
        return None


def isoformat_utc(value: datetime) -> str:
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def ensure_future_time(raw_value: str, fallback_offset_minutes: int) -> str:
    parsed = parse_iso8601(raw_value)
    minimum = now_utc() + timedelta(minutes=fallback_offset_minutes)
    if parsed is None or parsed < minimum:
        return isoformat_utc(minimum)
    return isoformat_utc(parsed)


def buffer_request(token: str, query: str, variables: dict[str, Any] | None = None) -> dict[str, Any]:
    payload = json.dumps({"query": query, "variables": variables or {}}, ensure_ascii=True).encode("utf-8")
    request = urllib.request.Request(
        BUFFER_API_URL,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Buffer API HTTP error {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Buffer API request failed: {exc}") from exc

    parsed = json.loads(body)
    if parsed.get("errors"):
        raise RuntimeError(f"Buffer API GraphQL error: {parsed['errors']}")
    return parsed["data"]


def find_schedule_platform(post: dict[str, Any], platform_name: str) -> dict[str, Any] | None:
    schedule = post.get("schedule", {})
    for item in schedule.get("platforms", []):
        if item.get("name") == platform_name:
            return item
    return None


def find_platform_record(post: dict[str, Any], platform_name: str) -> dict[str, Any] | None:
    for item in post.get("platforms", []):
        if item.get("name") == platform_name:
            return item
    return None


def channel_id_for(platform_name: str) -> str:
    env_name = PLATFORM_ENV_MAP.get(platform_name, "")
    return os.getenv(env_name, "").strip()


def iter_publish_targets(
    archive: dict[str, Any],
    target_post_id: str,
    target_platform: str,
) -> list[tuple[dict[str, Any], dict[str, Any], dict[str, Any]]]:
    items: list[tuple[dict[str, Any], dict[str, Any], dict[str, Any]]] = []
    for post in archive.get("posts", []):
        if target_post_id and post.get("id") != target_post_id:
            continue
        if post.get("approvalStatus") != "approved":
            continue

        for platform_record in post.get("platforms", []):
            platform_name = platform_record.get("name")
            if target_platform != "all" and platform_name != target_platform:
                continue
            schedule_platform = find_schedule_platform(post, platform_name)
            if not schedule_platform:
                continue
            if schedule_platform.get("route", "buffer") != "buffer":
                continue
            if platform_record.get("status") in {"scheduled", "published"} and platform_record.get("bufferPostId"):
                continue
            if not channel_id_for(platform_name):
                continue
            items.append((post, platform_record, schedule_platform))
    return items


def create_buffer_post(
    token: str,
    channel_id: str,
    text: str,
    scheduled_at: str,
) -> dict[str, Any]:
    query = """
mutation CreateScheduledPost($channelId: ChannelId!, $text: String!, $dueAt: DateTime!) {
  createPost(input: {
    text: $text,
    channelId: $channelId,
    schedulingType: automatic,
    mode: customScheduled,
    dueAt: $dueAt,
    source: "jasonrae.ai-social-automation",
    aiAssisted: true
  }) {
    ... on PostActionSuccess {
      post {
        id
        status
        dueAt
        createdAt
        channelId
        shareMode
      }
    }
    ... on MutationError {
      message
    }
  }
}
""".strip()
    data = buffer_request(
        token,
        query,
        {"channelId": channel_id, "text": text, "dueAt": scheduled_at},
    )
    result = data["createPost"]
    if "message" in result:
        raise RuntimeError(result["message"])
    return result["post"]


def query_buffer_posts(token: str, organization_id: str, channel_ids: list[str], statuses: list[str]) -> list[dict[str, Any]]:
    query = """
query GetPosts($organizationId: OrganizationId!, $channelIds: [ChannelId!], $statuses: [PostStatus!]) {
  posts(
    input: {
      organizationId: $organizationId,
      sort: [{ field: dueAt, direction: desc }, { field: createdAt, direction: desc }],
      filter: { channelIds: $channelIds, status: $statuses }
    }
  ) {
    edges {
      node {
        id
        status
        dueAt
        createdAt
        channelId
      }
    }
  }
}
""".strip()
    data = buffer_request(
        token,
        query,
        {"organizationId": organization_id, "channelIds": channel_ids, "statuses": statuses},
    )
    return [edge["node"] for edge in data["posts"]["edges"]]


def get_buffer_organization_ids(token: str) -> list[str]:
    explicit = os.getenv("BUFFER_ORGANIZATION_ID", "").strip()
    if explicit:
        return [explicit]

    query = """
query GetOrganizations {
  account {
    organizations {
      id
    }
  }
}
""".strip()
    data = buffer_request(token, query)
    organizations = data.get("account", {}).get("organizations", [])
    return [item["id"] for item in organizations if item.get("id")]


def update_post_rollup(post: dict[str, Any]) -> None:
    statuses = {platform.get("status") for platform in post.get("platforms", [])}
    if statuses and statuses == {"published"}:
        post["status"] = "published"
        if "publishedDate" not in post:
            post["publishedDate"] = isoformat_utc(now_utc())
    elif "scheduled" in statuses:
        post["status"] = "scheduled"
    elif "ready" in statuses:
        post["status"] = "ready"


def cmd_publish(args: argparse.Namespace, archive: dict[str, Any]) -> int:
    token = os.getenv("BUFFER_ACCESS_TOKEN", "").strip()
    if not token and not args.dry_run:
        raise RuntimeError("Missing BUFFER_ACCESS_TOKEN.")

    changed = 0
    for post, platform_record, schedule_platform in iter_publish_targets(archive, args.post_id, args.platform):
        text = (platform_record.get("copy") or "").strip()
        if not text:
            continue
        channel_id = channel_id_for(platform_record["name"])
        scheduled_at = ensure_future_time(schedule_platform.get("scheduledAt", ""), args.schedule_offset_minutes)

        if args.dry_run:
            print(f"[dry-run] Would schedule {post['id']} on {platform_record['name']} at {scheduled_at}")
            continue

        created = create_buffer_post(token, channel_id, text, scheduled_at)
        platform_record["status"] = "scheduled"
        platform_record["bufferPostId"] = created["id"]
        platform_record["bufferChannelId"] = created["channelId"]
        platform_record["scheduledAt"] = created.get("dueAt", scheduled_at)
        schedule_platform["scheduledAt"] = created.get("dueAt", scheduled_at)
        schedule_platform["route"] = "buffer"
        post["approvalStatus"] = "approved"
        update_post_rollup(post)
        changed += 1
        print(f"Scheduled {post['id']} on {platform_record['name']} ({created['id']})")
    return changed


def cmd_sync(args: argparse.Namespace, archive: dict[str, Any]) -> int:
    token = os.getenv("BUFFER_ACCESS_TOKEN", "").strip()
    if not token:
        if args.dry_run:
            print("[dry-run] Skipping Buffer sync because BUFFER_ACCESS_TOKEN is not set.")
            return 0
        raise RuntimeError("Missing BUFFER_ACCESS_TOKEN.")

    channel_ids = [value for value in (os.getenv("BUFFER_LINKEDIN_CHANNEL_ID", ""), os.getenv("BUFFER_X_CHANNEL_ID", "")) if value]
    if not channel_ids:
        if args.dry_run:
            print("[dry-run] Skipping Buffer sync because channel ids are not set.")
            return 0
        raise RuntimeError("Missing Buffer channel ids for sync.")

    organization_ids = get_buffer_organization_ids(token)
    changed = 0
    remote_posts: dict[str, dict[str, Any]] = {}
    for organization_id in organization_ids:
        for remote in query_buffer_posts(token, organization_id, channel_ids, ["scheduled", "sent"]):
            remote_posts[remote["id"]] = remote

    for post in archive.get("posts", []):
        if args.post_id and post.get("id") != args.post_id:
            continue
        for platform_record in post.get("platforms", []):
            if args.platform != "all" and platform_record.get("name") != args.platform:
                continue
            buffer_post_id = platform_record.get("bufferPostId", "")
            if not buffer_post_id or buffer_post_id not in remote_posts:
                continue
            remote = remote_posts[buffer_post_id]
            if remote["status"] == "scheduled" and platform_record.get("status") != "scheduled":
                platform_record["status"] = "scheduled"
                platform_record["scheduledAt"] = remote.get("dueAt", platform_record.get("scheduledAt", ""))
                changed += 1
            elif remote["status"] == "sent" and platform_record.get("status") != "published":
                platform_record["status"] = "published"
                platform_record["publishedAt"] = remote.get("dueAt") or remote.get("createdAt") or isoformat_utc(now_utc())
                changed += 1
        update_post_rollup(post)
    return changed


def main() -> int:
    load_dotenv()
    args = parse_args()
    if not args.publish and not args.sync:
        args.publish = True

    archive_path = Path(args.archive_path)
    archive = read_json(archive_path)
    changed = 0

    if args.publish:
        changed += cmd_publish(args, archive)
    if args.sync:
        changed += cmd_sync(args, archive)

    if changed and not args.dry_run:
        archive["updatedAt"] = datetime.now(timezone.utc).isoformat()
        write_json(archive_path, archive)

    print(f"Changes applied: {changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
