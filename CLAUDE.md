# CLAUDE.md

## About This Repo

This is a **multi-topic notes repo** — HTML tutorial notes for whatever CS topic I am studying (`system-design`, `git`, `lld`, and anything added later). Every note is a self-contained HTML page based on one video/topic. The full topic list lives in `topics.html`.

Notes are **HTML, not markdown**, on purpose: richer styling, Mermaid diagrams, better tables, copy buttons, images, light/dark theme and subtle animations — so the notes can carry more knowledge with less text.

The repo holds two entry types, both tracked in the same per-topic index table:

1. **Processed notes** — `notes/<file>.html` study notes, mostly generated from a YouTube video transcript (occasionally from another source such as a conversation or article).
2. **Direct links** — a raw web link (article, blog, doc, repo) stored without processing. No note file is created; only a table row is added.

Only `README.md`, `CLAUDE.md` and `prompts/*.prompt.md` stay markdown (they are instructions, not notes).

## Repo Layout

```text
my-notes/
├── assets/
│   ├── notes.css            # Shared design system (tokens, light/dark, components)
│   ├── notes.js             # Shared behaviour (theme toggle, copy buttons, TOC, Mermaid)
│   ├── note.template.html   # Skeleton + component cheat sheet for new notes
│   └── img/                 # Images embedded by notes (create when first needed)
├── notes/                   # All notes, flat, *.html
├── tables/                  # Per-topic index pages, <topic-slug>.table.html
├── prompts/                 # Workflow prompts (markdown)
└── topics.html              # Table of contents of all topics
```

## Topics & Index Files

- Every note belongs to a **topic**. The topic slug is always **lowercase kebab-case**, no spaces — `system-design`, `lld`, `dbms`.
- If the topic input arrives in another form (`System Design`, `system_design`), normalize it: lowercase → replace non-alphanumeric chars with `-` → collapse repeated `-` → strip leading/trailing `-`.
- **Topic display name** = slug with all non-alphanumeric chars replaced by a space, fully UPPERCASE. Example: `system-design` → `SYSTEM DESIGN`.
- **Notes always live in the flat `notes/` folder** — never create per-topic subfolders.
- Each topic has its own HTML index page in the `tables/` folder: **`tables/<topic-slug>.table.html`** (e.g. `tables/system-design.table.html`). Table files never go in the repo root or `notes/`.
- Index page format is fixed — copy an existing `tables/*.table.html`: shared head, topbar breadcrumb, `<h1>` = display name, and one `<table class="index-table">` with this header and row format:

  ```html
  <thead><tr><th class="num">#</th><th>Date</th><th>Title</th><th>Web link</th><th>Link to file</th></tr></thead>
  <tbody>
    <tr><td class="num">1</td><td class="nowrap">05 Sep 2026</td><td>Video Title</td><td><a href="<youtube-url>" target="_blank" rel="noopener">Watch</a></td><td><a href="../notes/<filename>.html" class="open">Open notes</a></td></tr>
    <tr><td class="num">2</td><td class="nowrap">20 Sep 2026</td><td>Link Title</td><td><a href="<web-url>" target="_blank" rel="noopener">Link</a></td><td></td></tr>
    <!-- ROWS END: append new <tr> rows directly above this line -->
  </tbody>
  ```

- The `Link to file` href is **relative to the `tables/` folder**, so always `../notes/<filename>.html` (not `./notes/`).
- **Columns are identical in every topic page** — `# | Date | Title | Web link | Link to file`. Never add/remove/rename a column; cells may be empty, headers may not.
- Row types (both in the same table, sharing one `#` sequence):
  - **Processed note row** — `Web link` = `Watch` link to the video (empty cell if the note did not come from a video), `Link to file` = `Open notes` link.
  - **Direct link row** — `Web link` = `Link` link, `Link to file` **empty** `<td></td>`, since no note file was generated.
- For a new entry, **insert exactly one new `<tr>` directly above the `ROWS END` comment** (`#` = last row + 1). Never edit or reorder existing rows.
- Run a **duplicate check** before adding a row — if the same URL already exists in that table, do not add the row; report that it already exists at row `#N`.
- HTML-escape titles (`&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`).
- If the topic's table page does not exist, create it from an existing one — title/breadcrumb/`<h1>` + header + row `1`.
- **`topics.html`** at the repo root is the table of contents of all topics. Fixed columns: `# | Topic | Link to table`. Its row count must always equal the number of files in `tables/` — exactly one row per table page. Row format:

  ```html
  <tr><td class="num">1</td><td><strong>SYSTEM DESIGN</strong></td><td><a class="open" href="./tables/system-design.table.html">system-design.table.html</a></td></tr>
  ```

- When a **new topic** is created (new table page), insert one row in `topics.html` above its `ROWS END` comment (`#` = last row + 1). For an existing topic, do not touch `topics.html`.
- When **deleting an entry** (`prompts/delete-table-row.prompt.md`): remove the row, renumber the remaining rows `1..N` (preserving order), and delete the `notes/` file linked from that row. If no rows remain, delete `tables/<topic-slug>.table.html`, remove that topic's row from `topics.html`, and renumber the remaining rows `1..N` (preserving order).

## Prompts

- The repo's standard workflows live in the `prompts/` folder — follow them; do not invent a separate process:
  - `prompts/youtube-link-to-notes.prompt.md` — YouTube video → `notes/` HTML file + table row.
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
- Prefer bullets, tables, diagrams and visual components over paragraphs. Use a paragraph only when genuinely necessary (max 2-3 lines).
- Let visuals carry the knowledge: a good diagram or comparison grid beats a paragraph of text.

## HTML Formatting Rules

- **Start every note from `assets/note.template.html`** and follow the **component cheat sheet** in its top comment; remove that comment from the final note. Reference example: `notes/What-happens-when-you-type-a-URL-into-your-browser.html`.
- Every page links the shared `../assets/notes.css` and `../assets/notes.js` (`./assets/…` from `topics.html`). **Never** inline a full stylesheet or re-implement theme/copy/TOC per page; a small page-specific `<style>` is allowed only for a genuinely one-off visual.
- Structure: one `<h1>` in `<header class="note-header">`, then `<section>`s with `<h2>` / `<h3>`. The TOC and heading anchors are generated automatically.
- Semantic HTML: `<ul>`/`<ol>` for lists, `<ol class="steps">` for processes, `<strong>` for key terms on first use, `<code>` for technical names (APIs, commands, config values).
- Comparisons → `.table-wrap` tables or `.cards` (good/bad/accent).
- Code/config/commands → `<div class="code" data-lang="…"><pre><code>…</code></pre></div>` (copy button is automatic). Escape `&`, `<`, `>`.
- Diagrams → Mermaid (`<figure class="diagram"><pre class="mermaid">`) for flows, sequences, architecture, git graphs; `<pre class="ascii">` when ASCII is clearer. Load the Mermaid CDN script (`mermaid@10.9.1` from jsdelivr) only when the page has a Mermaid block.
- **ER diagrams** (Mermaid `erDiagram`) for DB schema/relationships — only when genuinely needed and they improve the doc (e.g. the database design section of an HLD). Do not force them into every file.
- Callouts (`.callout tip|warn|danger|info|key`) for interview tips, gotchas, destructive operations, side notes and key takeaways.
- Images → `assets/img/<note-name>-<n>.<ext>`, embedded with `<figure><img alt="…"><figcaption>`. Only when a visual genuinely adds information.
- Animations (`.flow`, `.reveal`) — subtle and purposeful only; they must respect `prefers-reduced-motion` (handled by the CSS).
- Every page must work in light and dark mode — use the CSS tokens/classes, never hard-coded colors.
- Validate before finishing: balanced tags, no leaked markdown syntax (```` ``` ````, `**`, `|---|`).

## Suggested Note Structure

A typical note roughly follows (adapt as needed per topic):

```html
<section><h2>What &amp; Why</h2>            <!-- 2-4 crisp points --></section>
<section><h2>How It Works</h2>              <!-- concept points + diagram / flow --></section>
<section><h2>Key Components / Types</h2>    <!-- bullets, table or cards --></section>
<section><h2>Trade-offs / Pros &amp; Cons</h2> <!-- table or good/bad cards --></section>
<section><h2>When to Use / When Not To</h2> <!-- real-world scenarios --></section>
<div class="callout tip">…</div>             <!-- interview tip / gotcha (if relevant) -->
```

## File Conventions

- Note files always live in the `notes/` folder as `.html`.
- File names: `kebab-case.html` (e.g. `load-balancing.html`, `cap-theorem.html`). For a note generated from a YouTube video, a video-title-based name (spaces → `-`) is also fine.
- One topic per file. Split large topics instead of writing one giant file.
- Link related notes: `<a href="./caching.html">Caching</a>`.
- Every note's header has the H1 title plus Topic / Video / Date meta pills:

  ```html
  <header class="note-header">
    <h1>Note or Video Title</h1>
    <ul class="meta">
      <li><b>Topic</b>SYSTEM DESIGN</li>
      <li><b>Video</b><a href="https://www.youtube.com/watch?v=...">Video Title</a></li>
      <li><b>Date</b>06 Sep 2026</li>
    </ul>
  </header>
  ```

  - `Topic` is always in display-name (UPPERCASE) form.
  - Include the `Video` pill only when the note was generated from a video.
  - `Date` format: `DD MMM YYYY`.
- The topbar breadcrumb and footer back-link point to `../tables/<topic-slug>.table.html`.
