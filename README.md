# My Notes 📚

- A collection of **HTML** tutorial notes on CS topics (**System Design**, **Git**, **LLD**, and anything added later) — open **[topics.html](./topics.html)** in a browser to start.
- Notes are written in **concise technical English** and rendered as styled pages: Mermaid diagrams, rich tables, comparison cards, callouts, copy buttons on code, auto table of contents, light/dark theme.
- Most notes are generated from YouTube tutorial transcripts (e.g. ByteByteGo).
- **Raw web links** (article, blog, doc, repo) can also be stored without processing — only an index table row, no notes file.

## Why HTML instead of Markdown?

- Full control over styling and rendering — consistent look, light/dark mode.
- Better tables and diagrams (Mermaid rendered in-page), embedded images.
- Interactivity — copy buttons, collapsible deep dives, section anchors, subtle animations.
- Goal: carry more knowledge with less text.

## Viewing

- Open `topics.html` directly in a browser (double-click, or `open topics.html` on macOS). No build step, no server.
- Navigation: `topics.html` → `tables/<topic>.table.html` → `notes/<note>.html` (breadcrumbs link back up).
- Mermaid diagrams load `mermaid@10.9.1` from the jsdelivr CDN — they need an internet connection; everything else works offline.

## Repo Structure

```text
my-notes/
├── assets/
│   ├── notes.css            # Shared design system (tokens, light/dark, components)
│   ├── notes.js             # Theme toggle, copy buttons, auto TOC, Mermaid rendering
│   ├── note.template.html   # Skeleton + component cheat sheet for new notes
│   └── img/                 # Images used by notes (created when first needed)
├── notes/                   # All notes (*.html, one video/topic = one file, flat folder)
├── tables/                  # Per-topic index pages — <topic>.table.html
├── prompts/                 # Reusable Claude Code prompts (markdown)
├── topics.html              # Table of contents — one row per topic
├── CLAUDE.md                # Rules for writing notes (language, content, HTML format)
└── README.md
```

- Notes never go into per-topic subfolders — everything stays in the flat `notes/` folder.
- A note's topic is determined by its **index page**: `tables/system-design.table.html`, `tables/lld.table.html`, etc.

## Topics Index

- **[topics.html](./topics.html)** lists every topic (`# | Topic | Link to table`), one row per file in `tables/`.
- A new table adds a row; a deleted table removes its row and the rest are renumbered `1..N`.
- Each topic page `tables/<topic>.table.html` has **exactly these 5 columns** — both entry types live in the same table:

| # | Date | Title | Web link | Link to file |
|---|------|-------|----------|--------------|
| 1 | 05 Sep 2026 | Processed note (generated from a video) | Watch | Open notes |
| 2 | 20 Sep 2026 | Direct link (unprocessed) | Link | *(empty)* |

- In a direct link row, `Link to file` stays **empty**, since no notes file is generated.
- `Link to file` hrefs are relative to `tables/`, hence `../notes/...`.
- Column headers never change — only cells may be empty.

## Creating a New Note

1. Take the YouTube video URL and decide which **topic** it belongs to (e.g. `system-design`, `lld`).
2. Run the [youtube-link-to-notes.prompt.md](./prompts/youtube-link-to-notes.prompt.md) prompt in Claude Code — with the URL **and** the topic name.
3. The prompt automatically:
   - Fetches the video's **title and public transcript** (the video itself is never downloaded).
   - Converts the transcript into structured study notes as `notes/<video-title>.html`, built from `assets/note.template.html`.
   - Appends a row to `tables/<topic>.table.html` (creating the page if missing).
   - Appends a row to `topics.html` if the topic is brand new.

## Storing a Direct Web Link

When an article/blog/doc only needs to be **saved**, without generating notes:

1. Decide the link, its **title** and **topic**.
2. Run the [store-direct-link.prompt.md](./prompts/store-direct-link.prompt.md) prompt in Claude Code — with link + title + topic.
3. The prompt automatically:
   - **Does not fetch/process** the link (zero token waste) — stores it as-is.
   - Appends a row to `tables/<topic>.table.html`, leaving `Link to file` empty.
   - Skips the row and reports it if the URL is a duplicate.
   - Appends a row to `topics.html` if the topic is brand new.

## Deleting an Entry

1. Note the topic and the entry's **row number** (the `#` column value).
2. Run the [delete-table-row.prompt.md](./prompts/delete-table-row.prompt.md) prompt in Claude Code — with topic + row number.
3. The prompt automatically:
   - Shows the row and asks for **confirmation** first (deletion is destructive).
   - Deletes the note file linked from the row in `notes/` (no file for a direct link row).
   - Removes the row from the table and renumbers the remaining rows `1..N`.
   - If the table becomes empty, deletes `tables/<topic>.table.html`, removes that topic's row from `topics.html` and renumbers the remaining rows `1..N`.

## Note Format

- Every note is a self-contained HTML page — one topic/video, one file — linking the shared `assets/notes.css` and `assets/notes.js`.
- Each note starts with an H1 and Topic / Video (only when generated from a video) / Date meta pills.
- See [CLAUDE.md](./CLAUDE.md) for the detailed writing and HTML rules, and [`assets/note.template.html`](./assets/note.template.html) for the component cheat sheet.
