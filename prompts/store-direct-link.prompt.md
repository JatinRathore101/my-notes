Use this to **store a plain web link** (article, blog, doc, GitHub repo, tweet, video — anything) in the notes repo **without generating any notes file**.

This is the "bookmark" flow. No transcript is fetched, no content is processed, no `.md` note is created — only one row is added to the topic's index table.

## INPUTS

I will give you three things:

1. **Web link** — the URL to store.
2. **Title** — the title to show in the table.
3. **Topic** — which subject this link belongs to (e.g. `system-design`, `lld`, `dbms`).

Rules:

* If the **topic** is missing — STOP and ask me. **Do not infer** the topic from the URL or title.
* If the **title** is missing — STOP and ask me. Do not fetch the page to extract a title.
* If the **link** is missing — STOP and ask me.

### Topic slug + display name

* **Slug** = lowercase, non-alphanumeric chars replaced with `-`, repeated `-` collapsed, leading/trailing `-` removed.
  * `System Design` / `system_design` / `System-Design` → all become `system-design`.
  * Slug is used for the index filename: `tables/<topic-slug>.table.md`.
* **Display name** = slug with all non-alphanumeric chars replaced by a space, fully UPPERCASE.
  * `system-design` → `SYSTEM DESIGN`, `lld` → `LLD`.
  * Display name is used as the index file's H1 heading and in the `Topic` column of `topics.md`.

## IMPORTANT — DO NOT PROCESS THE LINK

* **DO NOT open, fetch, crawl, or download the URL.**
* **DO NOT** read the page content, transcript, captions, or any media behind the link.
* **DO NOT** summarize the link or create any notes file in `notes/`.
* **DO NOT** use Claude credits/tokens on the link's content.
* Store the URL exactly as-is — do not shorten, expand, clean or resolve redirects.
* Use the title exactly as given (only trim leading/trailing whitespace).
* If the title contains a `|` character, escape it as `\|` so the markdown table does not break.

## TASK

1. Normalize the topic → slug + display name.
2. Locate `tables/<topic-slug>.table.md` in the `tables/` folder.
3. If found, **append exactly one new row**. If not found, create the file.
4. Nothing else.

## TABLE FORMAT (same for all topics)

Every topic index file has **exactly these 5 columns** — YouTube-note rows and direct-link rows live in the same table, in this order:

```markdown
| # | Date | Title | Web link | Link to file |
|---|------|-------|---------------|--------------|
```

In a direct-link row the `Link to file` column is **empty** (no note file was generated) — do not remove the column, only leave the value blank:

```markdown
| 4 | 20 Sep 2026 | <Title> | [Link](<web-url>) | |
```

* `#` — last row's serial number + 1 (YouTube-note and direct-link rows share one sequence).
* `Date` — today's date, `DD MMM YYYY` format (e.g. `20 Sep 2026`).
* `Title` — exactly the title I gave.
* `Web link` — `[Link](<web-url>)`. (YouTube-note rows use `[Watch](...)`; leave them unchanged.)
* `Link to file` — **empty** (` | |` — nothing between the two pipes except a single space).

## UPDATE THE TOPIC INDEX (`tables/<topic-slug>.table.md`)

1. Look for `tables/<topic-slug>.table.md` inside the **`tables/` folder** (e.g. `tables/system-design.table.md`).
2. **If it exists** — append ONE new row at the very end of the table.
   * Do not edit, reorder or renumber existing rows.
   * Do not change the table header row — it must already be `# | Date | Title | Web link | Link to file`.
   * If an older table has a different header (e.g. `Link to video`), fix it to these 5 standard columns and keep existing row values unchanged.
3. **If it does not exist** — create it with the topic display name as H1, the standard table header, and this link as row `1`:

   ```markdown
   # SYSTEM DESIGN

   | # | Date | Title | Web link | Link to file |
   |---|------|-------|---------------|--------------|
   | 1 | 20 Sep 2026 | <Title> | [Link](<web-url>) | |
   ```

* Index files always live inside `tables/`, never at the repo root or inside `notes/`.
* Never create a new index file for a topic that already has one — check first.

## DUPLICATE CHECK

* Before adding the row, check whether the same URL already exists in the table.
* If it exists, **do not add the row** — tell me the link already exists at row `#N`.

## UPDATE `topics.md` (only for a brand-new topic)

* `topics.md` (repo root) is the table of contents of all topics — columns `# | Topic | Link to table`, one row per file in `tables/`.
* If you had to **create** `tables/<topic-slug>.table.md` (i.e. this is the topic's first entry in the repo), append one row at the end of `topics.md`:
  * `#` — last row + 1.
  * `Topic` — topic display name (UPPERCASE).
  * `Link to table` — `[<topic-slug>.table.md](./tables/<topic-slug>.table.md)`.

  Example (illustrative — use your own `#`, display name and slug):

  ```markdown
  | 5 | DBMS | [dbms.table.md](./tables/dbms.table.md) |
  ```

* Do not edit, reorder or renumber existing rows.
* If the topic's index file already existed, **do not touch `topics.md`**.

## TOKEN/CREDIT EFFICIENCY

This flow must be extremely cheap. Workflow:

```text
Web link + Title + Topic
    ↓
Normalize topic → slug + display name
    ↓
Locate tables/<topic-slug>.table.md (create if missing)
    ↓
Duplicate URL check
    ↓
Append one row (Link to file column empty)
    ↓
If topic was new → append row to topics.md
```

**Never fetch or process the link's content.**

**Never run git commands** — no `git add`, no commit, no stage/unstage. I handle git manually.

After you're done, give me only:

1. A short confirmation that the row was added (or that it was a duplicate)
2. The topic slug used
3. Which index file the row was added to, and whether that index file was newly created
4. The row number assigned
5. Whether `topics.md` was updated (only happens for a brand-new topic)
