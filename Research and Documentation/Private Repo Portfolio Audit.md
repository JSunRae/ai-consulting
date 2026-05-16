# Private Repo Portfolio Audit

Prepared: `2026-05-08`

## Purpose

This file summarizes the visible local private-repo footprint across:

- `C:\Users\Pilot\Documents\Vs Code Projects`
- `\\wsl.localhost\Ubuntu-24.04\home\jrae\wsl_projects`

The goal is to decide what should be mentioned on GitHub and the website without overstating or using noisy vanity metrics.

## Repo count

### Raw detected repos

- `24` git repos detected across both roots

This raw count includes build checkouts, staged sub-repos, and backup artifacts, so it should not be used publicly.

### Curated repo count

After excluding build checkouts, temp staging folders, and obvious backup noise:

- `13` curated repos

Curated repo list:

- `AI_Consulting`
- `desktop-agent-automation`
- `HomeAssistant`
- `Hypertrophy53`
- `sales-challenger-trainer`
- `Trading-Win`
- `Bibliography`
- `story_project`
- `TelegramNotifications`
- `trading-system/contracts`
- `trading-system/TF`
- `trading-system/Trading`
- `Trading-WSL`

## Size metrics

### Narrower code / script view

Across the curated repos, scanning source-oriented extensions such as `py`, `js`, `ts`, `sql`, `sh`, `ps1`, and similar:

- `18,530` code / script files
- `7,090,911` lines
- `23,115,828` whitespace-delimited word tokens

These are the most defensible technical volume figures from the current scan.

### Broader written corpus view

If you include docs, markdown, config, JSON, HTML, and related text-heavy project material:

- `41,843` text/code files
- `44,777,039` lines
- `99,933,452` whitespace-delimited word tokens

This broader number is real for the visible local corpus, but it is too inflated for public self-positioning because it blends code, docs, content, and bibliography material.

## Largest visible repos by code lines

From the narrower code / script scan:

| Repo | Code/script files | Lines | Word tokens |
| --- | ---: | ---: | ---: |
| `Trading-Win` | `10,380` | `4,136,315` | `13,908,019` |
| `trading-system/Trading` | `4,711` | `1,954,215` | `6,229,628` |
| `trading-system/TF` | `1,830` | `546,658` | `1,527,301` |
| `trading-system/contracts` | `518` | `187,316` | `645,986` |
| `Bibliography` | `259` | `92,274` | `263,191` |
| `desktop-agent-automation` | `256` | `63,442` | `186,172` |
| `Trading-WSL` | `259` | `48,424` | `144,459` |
| `story_project` | `142` | `33,843` | `118,013` |
| `HomeAssistant` | `52` | `11,886` | `42,304` |
| `AI_Consulting` | `14` | `6,565` | `21,888` |

## Harry Potter comparison

The full Harry Potter series is commonly estimated at roughly `1.08 million` words.

Using the narrower code/script token count:

- `23.1 million / 1.08 million ≈ 21.3`

Using the broader text/code corpus:

- `99.9 million / 1.08 million ≈ 92.2`

### Recommendation

Do **not** publish the Harry Potter comparison on the website or GitHub profile.

Reason:

- it is catchy but methodologically weak
- code tokens are not the same thing as prose words
- it risks sounding gimmicky rather than credible at Director / Head level

If you ever use it, keep it as an offhand conversational anecdote, not a headline metric.

## Should private repos be mentioned publicly?

### Yes, but not as a raw dump

The right move is to mention the private portfolio by:

- domain
- system type
- business relevance
- selected sanitized proof points

Do **not** lead with:

- raw repo count
- raw line count
- private repo names that expose sensitive work
- vanity metrics without context

## Best public framing

### GitHub profile

Recommended addition:

```text
Additional private portfolio spans 13 applied AI, analytics, automation, and trading-system repositories, including multi-repo ML research, decision-system tooling, and production-style workflow orchestration.
```

### Website

Recommended phrasing for About / Portfolio:

```text
Beyond public proof-of-work, my private portfolio includes multi-repo applied AI systems, trading and model-governance tooling, automation frameworks, and decision-support builds developed across Python, SQL, workflow orchestration, and production-style analytics environments.
```

## Better website / GitHub proof strategy

Instead of repo-count bragging, add a short `Private Portfolio Highlights` block with sanitized themes like:

- multi-repo TensorFlow trading and model-governance systems
- desktop agent orchestration and coding-automation tooling
- workflow automation and notification infrastructure
- applied AI document / writing / retrieval pipelines
- commercial analytics and decision-support systems

## Recommended next step

Add a short private-portfolio mention to:

1. GitHub profile README draft
2. website About page
3. website Portfolio intro

Keep it concise, sober, and proof-oriented.

