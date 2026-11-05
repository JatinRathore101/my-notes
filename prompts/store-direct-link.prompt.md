Use this to **store a plain web link** (article, blog, doc, GitHub repo, tweet, video — anything) in the notes repo **without generating any notes file**.

This is the "bookmark" flow. No transcript is fetched, no content is processed, no note file is created in `notes/` — only one row is added to the topic's HTML index table.

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
  * Slug is used for the index filename: `tables/<topic-slug>.table.html`.
* **Display name** = slug with all non-alphanumeric chars replaced by a space, fully UPPERCASE.
  * `system-design` → `SYSTEM DESIGN`, `lld` → `LLD`.
  * Display name is used as the index file's `<title>`, breadcrumb label and `<h1>`, and in the `Topic` column of `topics.html`.

## IMPORTANT — DO NOT PROCESS THE LINK

* **DO NOT open, fetch, crawl, or download the URL.**
* **DO NOT** read the page content, transcript, captions, or any media behind the link.
* **DO NOT** summarize the link or create any notes file in `notes/`.
* **DO NOT** use Claude credits/tokens on the link's content.
* Store the URL exactly as-is — do not shorten, expand, clean or resolve redirects (only HTML-escape `&` → `&amp;` inside the `href` attribute).
* Use the title exactly as given (only trim leading/trailing whitespace), HTML-escaped (`&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`).

## TASK

1. Normalize the topic → slug + display name.
2. Locate `tables/<topic-slug>.table.html` in the `tables/` folder.
3. If found, **append exactly one new row**. If not found, create the file.
4. Nothing else.

## TABLE FORMAT (same for all topics)

Every topic index file is an HTML page (styled by `../assets/notes.css`) with **exactly these 5 columns** — note rows and direct-link rows live in the same `<table class="index-table">`, in this order:

```html
<thead><tr><th class="num">#</th><th>Date</th><th>Title</th><th>Web link</th><th>Link to file</th></tr></thead>
```

A direct-link row has an **empty** `Link to file` cell (no note file was generated) — never remove the cell, only leave it empty:

```html
<tr><td class="num">4</td><td class="nowrap">20 Sep 2026</td><td>Title</td><td><a href="https://example.com/..." target="_blank" rel="noopener">Link</a></td><td></td></tr>
```

* `#` (`td.num`) — last row's serial number + 1 (note rows and direct-link rows share one sequence).
* `Date` (`td.nowrap`) — today's date, `DD MMM YYYY` format (e.g. `20 Sep 2026`).
* `Title` — exactly the title I gave (HTML-escaped).
* `Web link` — `<a href="<web-url>" target="_blank" rel="noopener">Link</a>`. (YouTube-note rows use `Watch`; leave them unchanged.)
* `Link to file` — **empty** `<td></td>`.

## UPDATE THE TOPIC INDEX (`tables/<topic-slug>.table.html`)

1. Look for `tables/<topic-slug>.table.html` inside the **`tables/` folder** (e.g. `tables/system-design.table.html`).
2. **If it exists** — insert ONE new `<tr>` directly above the `<!-- ROWS END: append new <tr> rows directly above this line -->` comment in `<tbody>`.
   * Do not edit, reorder or renumber existing rows.
   * Do not change the `<thead>` row — it must already be `# | Date | Title | Web link | Link to file`.
   * If an older table has a different header, fix it to these 5 standard columns and keep existing row values unchanged.
3. **If it does not exist** — copy an existing `tables/*.table.html` as the skeleton (head, topbar, `index-page` main, `<thead>`, `ROWS END` comment), set `<title>`, the breadcrumb label and `<h1>` to the topic display name, and put this link in as row `1`.

* Index files always live inside `tables/`, never at the repo root or inside `notes/`.
* Never create a new index file for a topic that already has one — check first.

## DUPLICATE CHECK

* Before adding the row, check whether the same URL already exists in the table (`href` values).
* If it exists, **do not add the row** — tell me the link already exists at row `#N`.

## UPDATE `topics.html` (only for a brand-new topic)

* `topics.html` (repo root) is the table of contents of all topics — columns `# | Topic | Link to table`, one row per file in `tables/`.
* If you had to **create** `tables/<topic-slug>.table.html` (i.e. this is the topic's first entry in the repo), insert one `<tr>` directly above the `ROWS END` comment in `topics.html`:

  ```html
  <tr><td class="num">5</td><td><strong>DBMS</strong></td><td><a class="open" href="./tables/dbms.table.html">dbms.table.html</a></td></tr>
  ```

  (illustrative — use your own `#`, display name and slug)

* Do not edit, reorder or renumber existing rows.
* If the topic's index file already existed, **do not touch `topics.html`**.

## TOKEN/CREDIT EFFICIENCY

This flow must be extremely cheap. Workflow:

```text
Web link + Title + Topic
    ↓
Normalize topic → slug + display name
    ↓
Locate tables/<topic-slug>.table.html (create if missing)
    ↓
Duplicate URL check
    ↓
Insert one <tr> above ROWS END (Link to file cell empty)
    ↓
If topic was new → insert row in topics.html
```

**Never fetch or process the link's content.**

**Never run git commands** — no `git add`, no commit, no stage/unstage. I handle git manually.

After you're done, give me only:

1. A short confirmation that the row was added (or that it was a duplicate)
2. The topic slug used
3. Which index file the row was added to, and whether that index file was newly created
4. The row number assigned
5. Whether `topics.html` was updated (only happens for a brand-new topic)
