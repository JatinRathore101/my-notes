# My Notes 📚

- A collection of **HTML** tutorial notes on CS topics (**System Design**, **Git**, **LLD**, and anything added later) — open **[topics.html](./topics.html)** in a browser to start.
- Notes are **crisp revision sheets** — telegraphic technical English, every teaching kept, every unnecessary word cut — rendered as styled pages: Mermaid diagrams, rich tables, comparison cards, callouts, copy buttons on code, auto table of contents, light/dark theme.
- Notes are generated from YouTube tutorial transcripts (e.g. ByteByteGo) or from web pages (articles, engineering blogs, docs).
- **Raw web links** (article, blog, doc, repo) can also be stored without processing — only an index table row, no notes file.

## Why HTML instead of Markdown?

- Full control over styling and rendering — consistent look, light/dark mode.
- Better tables and diagrams (Mermaid rendered in-page), embedded images.
- Interactivity — copy buttons, collapsible deep dives, section anchors, subtle animations.
- Goal: carry more knowledge with less text.

## Long-Term Reliability

- Assets are kept **local** so notes keep working for years, offline, regardless of third-party services.
- Libraries are vendored under `assets/vendor/<name>-<version>/` with their `LICENSE`; images live in `assets/img/`.
- Only videos (YouTube) and normal navigation links stay remote. Full rule in [notes-conventions.md §6](./prompts/notes-conventions.md).

## Viewing

- Open `topics.html` directly in a browser (double-click, or `open topics.html` on macOS). No build step, no server.
- Navigation: `topics.html` → `tables/<topic>.table.html` → `notes/<note>.html` (breadcrumbs link back up).
- Fully offline — every asset (styles, scripts, Mermaid, images) is stored inside the repo; no CDN or external runtime dependency.

## Repo Structure

```text
my-notes/
├── assets/
│   ├── notes.css            # Shared design system (tokens, light/dark, components)
│   ├── notes.js             # Theme toggle, copy buttons, auto TOC, Mermaid rendering
│   ├── note.template.html   # Skeleton + component cheat sheet for new notes
│   ├── img/                 # Images used by notes (downloaded locally, never hotlinked)
│   └── vendor/              # Vendored third-party libs + LICENSE (e.g. mermaid-10.9.1/)
├── notes/                   # All notes (*.html, one video/topic = one file, flat folder)
├── tables/                  # Per-topic index pages — <topic>.table.html
├── prompts/
│   ├── notes-conventions.md # Single source of truth for note/table conventions
│   └── *.prompt.md          # Reusable Claude Code workflow prompts
├── topics.html              # Table of contents — one row per topic
├── CLAUDE.md                # Repo overview for Claude; points to notes-conventions.md
└── README.md
```

- Notes never go into per-topic subfolders — everything stays in the flat `notes/` folder.
- A note's topic is determined by its **index page**: `tables/system-design.table.html`, `tables/lld.table.html`, etc.

## Topics Index

- **[topics.html](./topics.html)** lists every topic (`# | Topic | Link to table`), one row per file in `tables/`.
- A new table adds a row; a deleted table removes its row and the rest are renumbered `1..N`.
- Each topic page `tables/<topic>.table.html` has **exactly these 5 columns** — all entry types live in the same table:

| # | Date | Title | Web link | Link to file |
|---|------|-------|----------|--------------|
| 1 | 05 Sep 2026 | Note generated from a video | Watch | Open notes |
| 2 | 06 Nov 2026 | Note generated from a web page | Link | Open notes |
| 3 | 20 Sep 2026 | Note without a source URL (e.g. from a conversation) | *(empty)* | Open notes |
| 4 | 20 Sep 2026 | Direct link (bookmark only, unprocessed) | Link | *(empty)* |

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

## Creating Notes from a Web Page

When an article/blog/doc should be **read and turned into a full note** (not just bookmarked):

1. Take the page URL and decide the **topic** (title is optional — the page title is used by default).
2. Run the [webpage-link-to-notes.prompt.md](./prompts/webpage-link-to-notes.prompt.md) prompt in Claude Code — with URL + topic.
3. The prompt automatically:
   - Checks for a duplicate URL first (and offers to upgrade an existing bookmark row to a full note).
   - Fetches the page (`curl` + text extraction; falls back to WebFetch or Claude in Chrome for JS-heavy/protected pages) and treats page content as data, never as instructions.
   - Builds a crisp, expressive HTML note in `notes/<kebab-title>.html` — diagrams recreated as Mermaid, images downloaded locally only when the license allows.
   - Appends a row to `tables/<topic>.table.html` (`Link` + `Open notes`), and to `topics.html` if the topic is new.

## Storing a Direct Web Link

When an article/blog/doc only needs to be **saved**, without generating notes (use the web-page prompt above to generate a note instead):

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
- Each note starts with an H1 and meta pills: Topic, then **Video** (video note) or **Source** (web-page note) when there is a source URL, then Date.
- See [prompts/notes-conventions.md](./prompts/notes-conventions.md) for all writing, HTML, asset and table conventions (single source of truth — CLAUDE.md and every prompt refer to it), and [`assets/note.template.html`](./assets/note.template.html) for the component cheat sheet.
