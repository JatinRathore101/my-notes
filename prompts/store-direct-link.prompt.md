Use this to **store a plain web link** (article, blog, doc, GitHub repo, tweet, video — anything) in the notes repo **without generating any notes file**.

> **Conventions:** topic slug, index-table format, row types, duplicate check, `topics.html` and hard rules live in [`notes-conventions.md`](./notes-conventions.md). **Read it first** — this prompt only adds the bookmark workflow. Section refs like §8 point into that file.

To read the page and generate a full note instead, use [webpage-link-to-notes.prompt.md](./webpage-link-to-notes.prompt.md) (YouTube: [youtube-link-to-notes.prompt.md](./youtube-link-to-notes.prompt.md)).

This is the "bookmark" flow. No transcript is fetched, no content is processed, no note file is created in `notes/` — only one row is added to the topic's HTML index table.

## INPUTS

I will give you three things:

1. **Web link** — the URL to store.
2. **Title** — the title to show in the table.
3. **Topic** — which subject this link belongs to (e.g. `system-design`, `lld`, `dbms`).

Rules:

* **Topic** missing — STOP and ask me (§1). **Do not infer** it from the URL or title.
* **Title** missing — STOP and ask me. Do not fetch the page to extract a title.
* **Link** missing — STOP and ask me.
* Normalize the topic → slug + display name (§1).

## IMPORTANT — DO NOT PROCESS THE LINK

* **DO NOT open, fetch, crawl, or download the URL.**
* **DO NOT** read the page content, transcript, captions, or any media behind the link.
* **DO NOT** summarize the link or create any notes file in `notes/`.
* **DO NOT** use Claude credits/tokens on the link's content.
* Store the URL exactly as-is — do not shorten, expand, clean or resolve redirects (only HTML-escape `&` → `&amp;` inside the `href` attribute).
* Use the title exactly as given (only trim leading/trailing whitespace), HTML-escaped.

## TASK

1. **Duplicate check** (§8) in `tables/<topic-slug>.table.html` — URL already present → do not add a row; tell me it exists at row `#N`.
2. Append ONE **direct link** row (§8) directly above the `ROWS END` comment:

   ```html
   <tr><td class="num">4</td><td class="nowrap">20 Sep 2026</td><td>Title</td><td><a href="https://example.com/..." target="_blank" rel="noopener">Link</a></td><td></td></tr>
   ```

   * `#` — last row + 1 (shared sequence across all row types).
   * `Date` — today, `DD MMM YYYY`.
   * `Web link` — `Link` → the URL.
   * `Link to file` — **empty** `<td></td>` (no note file).
3. Table page missing → create it from an existing table page with this link as row `1` (§8), then append the topic row to `topics.html` (§9).
4. Nothing else.

## WORKFLOW & TOKEN EFFICIENCY

This flow must be extremely cheap.

```text
Web link + Title + Topic
    ↓
Normalize topic → slug + display name (§1)
    ↓
Locate tables/<topic-slug>.table.html (create if missing, §8)
    ↓
Duplicate URL check (§8)
    ↓
Insert one <tr> above ROWS END (Link to file cell empty)
    ↓
If topic was new → insert row in topics.html (§9)
```

* **Never fetch or process the link's content.**
* Hard rules (§11) apply — no git commands.

After you're done, give me only:

1. A short confirmation that the row was added (or that it was a duplicate)
2. The topic slug used
3. Which index file the row was added to, and whether that index file was newly created
4. The row number assigned
5. Whether `topics.html` was updated (only happens for a brand-new topic)
