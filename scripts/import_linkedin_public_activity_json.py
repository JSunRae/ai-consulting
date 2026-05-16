import argparse
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Merge a structured LinkedIn public-activity JSON extract into the social archive."
    )
    parser.add_argument("--input-json", required=True)
    parser.add_argument("--archive-path", required=True)
    parser.add_argument("--output-json", default="")
    return parser.parse_args()


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")


def merge_archive(archive_path: Path, records: list[dict[str, Any]]) -> dict[str, Any]:
    archive = json.loads(archive_path.read_text(encoding="utf-8"))
    posts = archive.get("posts", [])
    post_map = {post.get("id"): post for post in posts}

    for record in records:
      post_map[record["id"]] = record

    archive["posts"] = list(post_map.values())
    archive["updatedAt"] = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    notes = archive.get("archiveNotes") or []
    note = "Structured public LinkedIn activity JSON exports can now be merged directly into the social archive."
    if note not in notes:
        notes.append(note)
    archive["archiveNotes"] = notes
    write_json(archive_path, archive)
    return archive


def main() -> int:
    args = parse_args()
    input_path = Path(args.input_json)
    archive_path = Path(args.archive_path)
    records = json.loads(input_path.read_text(encoding="utf-8"))

    if not isinstance(records, list):
        raise SystemExit("Input JSON must be a list of social post records.")

    if args.output_json:
        write_json(Path(args.output_json), records)

    archive = merge_archive(archive_path, records)
    print(f"Merged records: {len(records)}")
    print(f"Archive entries: {len(archive.get('posts', []))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
