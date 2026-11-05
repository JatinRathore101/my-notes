# CLAUDE.md

## About This Repo

This is a **multi-topic notes repo** — HTML tutorial notes for whatever CS topic I am studying (`system-design`, `git`, `lld`, and anything added later). Every note is a self-contained HTML page based on one video/topic. The full topic list lives in `topics.html`.

Notes are **HTML, not markdown**, on purpose: richer styling, Mermaid diagrams, better tables, copy buttons, images, light/dark theme and subtle animations — so the notes can carry more knowledge with less text.

The repo holds two entry types, both tracked in the same per-topic index table:

1. **Processed notes** — `notes/<file>.html` study notes, generated from a YouTube video transcript, from a web page's content (article, blog, docs), or occasionally from another source such as a conversation.
2. **Direct links** — a raw web link (article, blog, doc, repo) stored without processing. No note file is created; only a table row is added.

Only `README.md`, `CLAUDE.md` and the files in `prompts/` stay markdown (they are instructions, not notes).

## Repo Layout

```text
my-notes/
├── assets/
│   ├── notes.css            # Shared design system (tokens, light/dark, components)
│   ├── notes.js             # Shared behaviour (theme toggle, copy buttons, TOC, Mermaid)
│   ├── note.template.html   # Skeleton + component cheat sheet for new notes
│   ├── img/                 # Images embedded by notes (create when first needed)
│   └── vendor/              # Vendored third-party libs, <name>-<version>/ + LICENSE
│       └── mermaid-10.9.1/  #   mermaid.min.js (lazy-loaded by notes.js) + LICENSE
├── notes/                   # All notes, flat, *.html
├── tables/                  # Per-topic index pages, <topic-slug>.table.html
├── prompts/
│   ├── notes-conventions.md # ★ Single source of truth for all note/table conventions
│   └── *.prompt.md          # Workflow prompts
└── topics.html              # Table of contents of all topics
```

## Notes Conventions (STRICT)

- **All conventions live in [`prompts/notes-conventions.md`](prompts/notes-conventions.md)** — topic slug/display name, language & tone, content rules, filenames, HTML structure & components, long-term reliability (local assets), validation, index tables, `topics.html`, deleting/renumbering, hard rules.
- **Read it before creating or editing any note, table row or `topics.html` row** — whether via a prompt or an ad-hoc request. Do not duplicate its rules elsewhere; update that file instead.
- Non-negotiables (details in the conventions file):
  - Notes are **HTML** in the flat `notes/` folder, built from `assets/note.template.html`, using the shared `assets/notes.css` / `assets/notes.js`.
  - **Crisp, short and clean above all (STRICT)** — notes are revision sheets, not articles. Keep every fact and teaching (**completeness beats brevity**), cut every unnecessary word: telegraphic bullets (1 fact, ≤ ~20 words), no paragraphs of jargon, tables/diagrams over prose. **No cap on total note length** — long sources may yield long notes; reduce words per idea, never ideas. Follow §3.1 brevity rules and run the §7 brevity check before finishing.
  - Precise **technical English** — no Hinglish, no filler, no jargon stacking.
  - **Keep assets local** — no CDN / external runtime URLs; vendor libs into `assets/vendor/`, download license-permitted images into `assets/img/`; only `<a href>` links may point outside.
  - Index rows go into `tables/<topic-slug>.table.html` (fixed 5 columns, append above `ROWS END`, duplicate check first); new topics also get a `topics.html` row.

## Prompts

- The repo's standard workflows live in the `prompts/` folder — follow them; do not invent a separate process:
  - `prompts/youtube-link-to-notes.prompt.md` — YouTube video → `notes/` HTML file + table row.
  - `prompts/webpage-link-to-notes.prompt.md` — web page (article, blog, docs) → read the page → `notes/` HTML file + table row.
  - `prompts/store-direct-link.prompt.md` — raw web link → table row only, no notes file.
  - `prompts/delete-table-row.prompt.md` — delete one entry (after confirmation) + renumber.
- Never run git commands (add, commit, stage/unstage) yourself — I handle git manually.
