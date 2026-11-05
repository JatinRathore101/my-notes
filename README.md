# My Notes 📚

- A collection of markdown tutorial notes on CS topics (**System Design**, **Git**, **LLD**, and anything added later) — full list in [topics.md](./topics.md).
- Notes are written in **concise technical English** — short, crisp bullet points using standard software terminology.
- Most notes are generated from YouTube tutorial transcripts (e.g. ByteByteGo).
- **Raw web links** (article, blog, doc, repo) can also be stored without processing — only an index table row, no notes file.

## Repo Structure

```text
my-notes/
├── notes/               # All tutorial notes (one video = one file, all topics in one flat folder)
├── prompts/             # Reusable prompts (video → notes, store direct link, delete entry)
├── tables/              # Per-topic index files — <topic>.table.md (date, title, web link, file link)
├── topics.md            # Table of contents — one row per topic, linking to its table file
└── CLAUDE.md            # Rules for writing notes (language, tone, formatting)
```

- Notes never go into per-topic subfolders — everything stays in the flat `notes/` folder.
- A note's topic is determined only by its **index file**: `tables/system-design.table.md`, `tables/lld.table.md`, etc.

## Topics Index

- The full topic list is in **[topics.md](./topics.md)** — one row per topic, linking to its table file (`# | Topic | Link to table`).
- `topics.md` rows always match the files in the `tables/` folder — a new table adds a row; a deleted table removes its row and the rest are renumbered `1..N`.
- Each topic has its own index file `tables/<topic>.table.md` — it lists all entries for that topic (date, title, web link, file link).

Every index file has **exactly these 5 columns** — both entry types live in the same table:

| # | Date | Title | Web link | Link to file |
|---|------|-------|---------------|--------------|
| 1 | 05 Sep 2026 | Processed note (generated from a video) | [Watch](https://youtube.com/...) | [Open notes](../notes/file.md) |
| 2 | 20 Sep 2026 | Direct link (unprocessed) | [Link](https://example.com/...) | |

- In a direct link row, `Link to file` stays **empty**, since no notes file is generated.
- The `Link to file` path is relative to the table file (inside `tables/`), hence `../notes/...`.
- Column headers never change — only values may be empty.

## Creating a New Note

1. Take the YouTube video URL and decide which **topic** it belongs to (e.g. `system-design`, `lld`).
2. Run the [youtube-link-to-notes.prompt.md](./prompts/youtube-link-to-notes.prompt.md) prompt in Claude Code — with the URL **and** the topic name.
3. The prompt automatically:
   - Fetches the video's **title and public transcript** (the video itself is never downloaded).
   - Converts the transcript into clean, structured study notes.
   - Creates `notes/<video-title>.md`.
   - Appends a row to `tables/<topic>.table.md` (creating the file if missing).
   - Appends a row to `topics.md` if the topic is brand new.

## Storing a Direct Web Link

When an article/blog/doc only needs to be **saved**, without generating notes:

1. Decide the link, its **title** and **topic**.
2. Run the [store-direct-link.prompt.md](./prompts/store-direct-link.prompt.md) prompt in Claude Code — with link + title + topic.
3. The prompt automatically:
   - **Does not fetch/process** the link (zero token waste) — stores it as-is.
   - Appends a row to `tables/<topic>.table.md`, leaving `Link to file` empty.
   - Skips the row and reports it if the URL is a duplicate.
   - Appends a row to `topics.md` if the topic is brand new.

## Deleting an Entry

1. Note the topic and the entry's **row number** (the `#` column value).
2. Run the [delete-table-row.prompt.md](./prompts/delete-table-row.prompt.md) prompt in Claude Code — with topic + row number.
3. The prompt automatically:
   - Shows the row and asks for **confirmation** first (deletion is destructive).
   - Deletes the note file linked from the row in `notes/` (no file for a direct link row).
   - Removes the row from the table and renumbers the remaining rows `1..N`.
   - If the table becomes empty, deletes `tables/<topic>.table.md`, removes that topic's row from `topics.md` and renumbers the remaining rows `1..N`.

## Note Format

- Every file is self-contained — one topic/video, one file.
- The top of each file holds the topic, video link (only when the note was generated from a video) and date:

  ```markdown
  # <Video Title>

  - **Topic:** SYSTEM DESIGN
  - **Video:** [<Video Title>](https://www.youtube.com/watch?v=...)
  - **Date:** 06 Sep 2026
  ```

- Style: short bullets, tables for comparisons, mermaid/ASCII diagrams where helpful.
- See [CLAUDE.md](./CLAUDE.md) for the detailed writing rules.
