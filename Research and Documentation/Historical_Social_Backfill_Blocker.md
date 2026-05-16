# Historical Social Backfill Status

Prepared: `2026-05-09`

## Current state

The LinkedIn historical backfill is now materially improved.

First-party source path used:

- saved LinkedIn activity page:
  - [Activity _ Jason Rae _ LinkedIn.html](</C:/Users/Pilot/Downloads/Activity _ Jason Rae _ LinkedIn.html>)
- structured markdown export:
  - [linkedin_activity_posts_extracted.md](</C:/Users/Pilot/Downloads/linkedin_activity_posts_extracted.md>)
- public LinkedIn recent activity page:
  - [https://www.linkedin.com/in/jason-c-rae/recent-activity/all/](https://www.linkedin.com/in/jason-c-rae/recent-activity/all/)

Repo tooling now used:

- [extract_linkedin_saved_activity.py](/C:/Users/Pilot/Documents/Vs%20Code%20Projects/AI_Consulting/scripts/extract_linkedin_saved_activity.py)
- [import_linkedin_activity_markdown.py](/C:/Users/Pilot/Documents/Vs%20Code%20Projects/AI_Consulting/scripts/import_linkedin_activity_markdown.py)
- [social_archive_import.py](/C:/Users/Pilot/Documents/Vs%20Code%20Projects/AI_Consulting/scripts/social_archive_import.py)
- [social-history-template.csv](/C:/Users/Pilot/Documents/Vs%20Code%20Projects/AI_Consulting/assets/data/social-history-template.csv)

## Result

Imported from the saved LinkedIn activity page:

- `10` LinkedIn activity entries total
- `9` authored LinkedIn posts
- `1` repost, clearly labeled in the archive

Imported from the structured markdown export:

- `10` LinkedIn activity entries total
- `9` authored LinkedIn posts
- `1` repost
- cleaner post bodies and displayed relative dates preserved

Imported from the public LinkedIn recent activity page:

- `15` LinkedIn activity entries total
- `11` authored posts
- `2` shared items
- `2` liked items

Output artifact:

- [LinkedIn_Activity_Extract_20260905.json](</C:/Users/Pilot/Documents/Vs%20Code%20Projects/AI_Consulting/Research%20and%20Documentation/LinkedIn_Activity_Extract_20260905.json>)
- [LinkedIn_Markdown_Activity_Extract_20260509.json](</C:/Users/Pilot/Documents/Vs%20Code%20Projects/AI_Consulting/Research%20and%20Documentation/LinkedIn_Markdown_Activity_Extract_20260509.json>)

Archive destination updated:

- [social-posts.json](/C:/Users/Pilot/Documents/Vs%20Code%20Projects/AI_Consulting/assets/data/social-posts.json)

## Source ceiling from the current file

The saved HTML page currently contains `10` unique LinkedIn activity URLs.

That means the current HTML file has now been exhausted as a trustworthy backfill source. The live public recent-activity page provided a deeper layer, but pulling materially more history from LinkedIn will still require another saved page with deeper scrolling or another first-party export path.

## What still remains

The X / Twitter side is still not backfilled.

Also, any older LinkedIn posts not present in the saved activity page would still need one of:

1. another saved activity page or a longer scroll capture
2. a CSV or JSON export
3. a list of post URLs
4. raw post text with date and platform

## Fastest next path

If you save another deeper LinkedIn activity page after more scrolling, run:

```bash
python scripts/extract_linkedin_saved_activity.py --input-html "C:\path\to\saved-linkedin-activity.html" --output-json "Research and Documentation\LinkedIn_Activity_Extract_MORE.json" --archive-path assets/data/social-posts.json
```

If you want to backfill X manually, populate:

- [social-history-template.csv](/C:/Users/Pilot/Documents/Vs%20Code%20Projects/AI_Consulting/assets/data/social-history-template.csv)

Then run:

```bash
python scripts/social_archive_import.py --input assets/data/social-history-template.csv
```
