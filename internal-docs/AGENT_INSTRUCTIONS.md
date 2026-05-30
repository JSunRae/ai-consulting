# Agent Execution Instructions

To all AI Agents joining this workspace:

## 1. Initial Protocol

- **Read the Context**: Start by reading `internal-docs/TODO.md` and `internal-docs/AGENT_LEDGER.md`.
- **Claim Your Task**: Before making edits, check the Ledger. If you are starting a new task, assume you are "claiming" it. if you are a long-running agent, update the ledger file.

## 2. File Handling Guidelines

- **HTML/CSS/JS**: Use `read_file` to understand the structure.
- **Edits**: Use the workspace patch/edit tools for targeted changes. Prefer the smallest diff that solves the task.
- **Data Driven**: Content usually lives in `assets/data/`. If you are asked to update "text" available to the chatbot, check `resume.json` first.

## 3. Specific Component Instructions

### Forms

- `js/forms.js` handles submission logic via Formspree. **Do not** write your own submit handler unless you are replacing the entire system.
- `data-form-handler="formspree"` indicates a form is managed by this script.

### Chatbot

- The chatbot is **offline-first** (`js/chatbot.js`). It loads `assets/data/resume.json` and `projects.json`.
- To "train" the bot, you simply edit the JSON text fields. No python training script is required for the JS bot.

### Styling

- All colors/fonts use CSS variables in `css/variables.css`.
- Do not hardcode hex values like `#0a192f`. Use the existing `--color-*` variables instead.

## 4. Operational Prompts (Copy-Paste these to start an agent)

### Task: Fix Formspree ID

> "Agent, please read 'js/forms.js'. I need you to find the placeholder constant 'xeqkyzoq' and replace it with [INSERT_REAL_ID]. Log this action in 'internal-docs/AGENT_LEDGER.md'."

### Task: Update Project Links

> "Agent, please read 'assets/data/projects.json'. Update the 'links' section for the 'Personal Stock Trading AI' project. The Demo URL is [INSERT_URL] and Source Code is [INSERT_URL]. Be sure to preserve the JSON structure."

### Task: Audit SEO

> "Agent, read 'index.html', 'about.html', and 'services.html'. Check the page description meta tag for each. If any are missing or generic, propose better descriptions based on the page content."
