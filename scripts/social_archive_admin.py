import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_ARCHIVE_PATH = "assets/data/social-posts.json"


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, payload: Any) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


def find_post(posts: list[dict[str, Any]], post_id: str) -> dict[str, Any]:
    for post in posts:
        if post.get("id") == post_id:
            return post
    raise RuntimeError(f"Post id not found: {post_id}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Approve, schedule, and publish social archive records.")
    parser.add_argument("--archive-path", default=DEFAULT_ARCHIVE_PATH)
    subparsers = parser.add_subparsers(dest="command", required=True)

    approve = subparsers.add_parser("approve")
    approve.add_argument("--id", required=True)
    approve.add_argument("--reviewer-note", default="")
    approve.add_argument("--schedule-linkedin-at", default="")
    approve.add_argument("--schedule-x-at", default="")
    approve.add_argument("--route-linkedin", default="")
    approve.add_argument("--route-x", default="")

    publish = subparsers.add_parser("publish")
    publish.add_argument("--id", required=True)
    publish.add_argument("--platform", required=True, choices=["LinkedIn", "X"])
    publish.add_argument("--url", required=True)
    publish.add_argument("--published-at", default="")

    reject = subparsers.add_parser("reject")
    reject.add_argument("--id", required=True)
    reject.add_argument("--reviewer-note", required=True)

    return parser.parse_args()


def touch_updated(archive: dict[str, Any]) -> None:
    archive["updatedAt"] = datetime.now(timezone.utc).isoformat()


def cmd_approve(post: dict[str, Any], args: argparse.Namespace) -> None:
    post["approvalStatus"] = "approved"
    post["status"] = "scheduled" if args.schedule_linkedin_at or args.schedule_x_at else "ready"
    review = post.setdefault("reviewGuidance", {})
    if args.reviewer_note:
        review["reviewerNote"] = args.reviewer_note
    schedule = post.setdefault("schedule", {"status": "suggested", "platforms": []})
    schedule["status"] = "approved"
    platform_map = {item.get("name"): item for item in schedule.setdefault("platforms", [])}
    for name in ("LinkedIn", "X"):
        platform = platform_map.get(name)
        if not platform:
            platform = {"name": name}
            schedule["platforms"].append(platform)
            platform_map[name] = platform

    if args.schedule_linkedin_at:
        platform_map["LinkedIn"]["scheduledAt"] = args.schedule_linkedin_at
    if args.schedule_x_at:
        platform_map["X"]["scheduledAt"] = args.schedule_x_at
    if args.route_linkedin:
        platform_map["LinkedIn"]["route"] = args.route_linkedin
    if args.route_x:
        platform_map["X"]["route"] = args.route_x


def cmd_publish(post: dict[str, Any], args: argparse.Namespace) -> None:
    published_at = args.published_at or datetime.now(timezone.utc).isoformat()
    platforms = post.setdefault("platforms", [])
    target = None
    for platform in platforms:
        if platform.get("name") == args.platform:
            target = platform
            break
    if target is None:
        raise RuntimeError(f"Platform not found on post: {args.platform}")

    target["status"] = "published"
    target["url"] = args.url
    target["publishedAt"] = published_at

    if all(platform.get("status") == "published" for platform in platforms):
        post["status"] = "published"
        post["publishedDate"] = published_at


def cmd_reject(post: dict[str, Any], args: argparse.Namespace) -> None:
    post["approvalStatus"] = "rejected"
    post["status"] = "queue"
    review = post.setdefault("reviewGuidance", {})
    review["reviewerNote"] = args.reviewer_note


def main() -> int:
    args = parse_args()
    archive_path = Path(args.archive_path)
    archive = read_json(archive_path)
    posts = archive.setdefault("posts", [])
    post = find_post(posts, args.id)

    if args.command == "approve":
        cmd_approve(post, args)
    elif args.command == "publish":
        cmd_publish(post, args)
    elif args.command == "reject":
        cmd_reject(post, args)

    touch_updated(archive)
    write_json(archive_path, archive)
    print(f"Updated post: {post['id']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
