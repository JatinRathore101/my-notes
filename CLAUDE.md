# CLAUDE.md

## About This Repo

This is a **multi-topic notes repo** — markdown tutorial notes for whatever CS topic I am studying (`system-design`, `git`, `lld`, and anything added later). Every file is a self-contained tutorial/notes file based on one video/topic. The full topic list lives in `topics.md`.

The repo holds two entry types, both tracked in the same per-topic index table:

1. **Processed notes** — `notes/<file>.md` study notes, mostly generated from a YouTube video transcript (occasionally from another source such as a conversation or article).
2. **Direct links** — a raw web link (article, blog, doc, repo) stored without processing. No `.md` file is created; only a table row is added.

## Topics & Index Files

- Every note belongs to a **topic**. The topic slug is always **lowercase kebab-case**, no spaces — `system-design`, `lld`, `dbms`.
- If the topic input arrives in another form (`System Design`, `system_design`), normalize it: lowercase → replace non-alphanumeric chars with `-` → collapse repeated `-` → strip leading/trailing `-`.
- **Topic display name** = slug with all non-alphanumeric chars replaced by a space, fully UPPERCASE. Example: `system-design` → `SYSTEM DESIGN`.
- **Notes always live in the flat `notes/` folder** — never create per-topic subfolders.
- Each topic has its own index file in the `tables/` folder: **`tables/<topic-slug>.table.md`** (e.g. `tables/system-design.table.md`, `tables/lld.table.md`). Table files never go in the repo root or `notes/`.
- The index file format is fixed — a `# <TOPIC DISPLAY NAME>` heading, followed by this table:

  ```markdown
  # SYSTEM DESIGN

  | # | Date | Title | Web link | Link to file |
  |---|------|-------|---------------|--------------|
  | 1 | 05 Sep 2026 | <Video Title> | [Watch](<youtube-url>) | [Open notes](../notes/<filename>.md) |
  | 2 | 20 Sep 2026 | <Link Title> | [Link](<web-url>) | |
  ```

- The `Link to file` path is **relative to the `tables/` folder**, so always write `../notes/<filename>.md` (not `./notes/`).
- **Columns are identical in every topic file** — `# | Date | Title | Web link | Link to file`. Never add/remove/rename a column; values may be empty, headers may not.
- Row types (both in the same table, sharing one `#` sequence):
  - **Processed note row** — `Web link` = `[Watch](<youtube-url>)`, `Link to file` = `[Open notes](../notes/<filename>.md)`.
  - **Direct link row** — `Web link` = `[Link](<web-url>)`, `Link to file` **empty** (` | |`), since no note file was generated.
- For a new entry (note or direct link), **append exactly one new row** to that topic's table file (`#` = last row + 1). Never edit or reorder existing rows.
- Run a **duplicate check** before adding a row — if the same URL already exists in that table, do not add the row; report that it already exists at row `#N`.
- If `Title` contains a `|` character, escape it as `\|` so the markdown table does not break.
- If the topic's table file does not exist, create it — heading + table header + row `1`.
- **`topics.md`** at the repo root is the table of contents of all topics. Fixed columns: `# | Topic | Link to table`. Its row count must always equal the number of files in `tables/` — exactly one row per table file. Format:

  ```markdown
  # TOPICS

  | # | Topic | Link to table |
  |---|-------|---------------|
  | 1 | SYSTEM DESIGN | [system-design.table.md](./tables/system-design.table.md) |
  ```

- When a **new topic** is created (new table file), append one row to `topics.md` (`#` = last row + 1, `Topic` = display name, link `./tables/<topic-slug>.table.md`). For an existing topic, do not touch `topics.md`.
- When **deleting an entry** (`prompts/delete-table-row.prompt.md`): remove the row, renumber the remaining rows `1..N` (preserving order), and delete the `notes/` file linked from that row. If no rows remain, delete `tables/<topic-slug>.table.md`, remove that topic's row from `topics.md`, and renumber the remaining rows `1..N` (preserving order).

## Prompts

- The repo's standard workflows live in the `prompts/` folder — follow them; do not invent a separate process:
  - `prompts/youtube-link-to-notes.prompt.md` — YouTube video → `notes/` file + table row.
  - `prompts/store-direct-link.prompt.md` — raw web link → table row only, no notes file.
  - `prompts/delete-table-row.prompt.md` — delete one entry (after confirmation) + renumber.
- Never run git commands (add, commit, stage/unstage) yourself — I handle git manually.

## Language & Tone (MOST IMPORTANT)

- Write in **precise, technical English** using standard software-engineering terminology. No Hinglish.
- Example of the expected tone:
  - ❌ "Load balancer ka kaam simple hai — aane wali requests ko multiple servers me baant do."
  - ✅ "A load balancer distributes incoming requests across multiple servers so that no single server is overloaded."
- Be direct and concise — state the mechanism, not a story. Use correct technical terms (cache, sharding, replica, throughput, etc.) instead of informal paraphrases.
- Avoid unnecessarily dense sentences. If a less common term is required, define it in one line.

## Content Rules

- **Short, crisp bullet points** — no long story-style paragraphs. Max 1-2 lines per point.
- **Summarized but complete** — keep content short, but never skip an important detail (trade-offs, numbers, edge cases, when to use / when not to).
- No filler intro/outro text ("In this tutorial we will learn...", "Hope you enjoyed..."). Get straight to the point.
- Prefer bullets, tables, and diagrams over paragraphs. Use a paragraph only when genuinely necessary (max 2-3 lines).

## Markdown Formatting Rules

Every file must be **proper markdown**, not plain text:

- One `# H1` title at the top, then `##` / `###` for sections.
- Bullet points (`-`) for lists, numbered lists (`1.`) for steps/flows.
- **Bold** for key terms on first use, `inline code` for technical names (APIs, commands, config values).
- Tables for comparisons (e.g. SQL vs NoSQL, Push vs Pull).
- Fenced code blocks (with language tag) for code, configs, or API examples.
- ` ```mermaid ` blocks or ASCII diagrams for architecture flows where helpful.
- **ER diagrams** (` ```mermaid ` + `erDiagram`) for DB schema/relationships — only when genuinely needed and they improve the doc (e.g. the database design section of an HLD). Do not force them into every file.
- **Mermaid tables/entity blocks** for table structures (columns, types, keys) — when schema detail must be shown and a plain markdown table is not clear enough. Use only when necessary; otherwise a plain markdown table is sufficient.
- Blockquotes (`>`) for important notes / gotchas / interview tips.

## Suggested File Structure

A typical tutorial file should roughly follow (adapt as needed per topic):

```markdown
# Topic Name

## What & Why
- 2-4 crisp points

## How It Works
- Core concept points / flow / diagram

## Key Components / Types
- Bullets or table

## Trade-offs / Pros & Cons
- Table or bullets

## When to Use / When Not To
- Real-world scenarios

> Interview tip / gotcha (if relevant)
```

## File Conventions

- Note files always live in the `notes/` folder.
- File names: `kebab-case.md` (e.g. `load-balancing.md`, `cap-theorem.md`, `url-shortener-hld.md`). For a note generated from a YouTube video, a video-title-based name (spaces → `-`) is also fine.
- One topic per file. Split large topics instead of writing one giant file.
- Link related topics: `[Caching](./caching.md)`.
- Every note file's header follows this standard format — a Topic / Video / Date bullet block after the H1 title:

  ```markdown
  # <Note or Video Title>

  - **Topic:** SYSTEM DESIGN
  - **Video:** [<Video Title>](https://www.youtube.com/watch?v=...)
  - **Date:** 06 Sep 2026
  ```

  - `Topic` is always in display-name (UPPERCASE) form.
  - Include the `Video` line only when the note was generated from a video.
  - `Date` format: `DD MMM YYYY`.
