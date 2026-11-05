Use this to **delete one entry** from a topic's HTML index table — remove the row, fix the numbering, and delete the note file attached to that row.

> **Conventions:** topic slug, index-table format, `topics.html`, renumbering and hard rules live in [`notes-conventions.md`](./notes-conventions.md) (§1, §8-§11). **Read it first** — this prompt adds the delete workflow and its confirmation gate.

This flow is **destructive**. Never delete anything without confirmation.

## INPUTS

I will give you two things:

1. **Topic** — which subject's index file (e.g. `system-design`, `lld`, `dbms`).
2. **Row number** — the value in the table's `#` column (e.g. `3`).

Rules:

* **Topic** missing — STOP and ask me. Do not guess.
* **Row number** missing — STOP and ask me. **Do not look up** the row by title or link unless I explicitly give the title.
* If I give multiple row numbers (e.g. `2, 5`), handle all of them — but **renumber only once, after all deletions**.
* Normalize the topic → slug + display name (§1).

## STEP 1 — LOCATE & CONFIRM (before deleting)

1. Locate `tables/<topic-slug>.table.html`.
   * File not found — STOP. Tell me this topic has no index file. Do nothing else.
2. Find the `<tr>` whose `<td class="num">` equals the given number. Row numbers always refer to the **current table's `#` values** — use these original numbers even for multiple deletions, since renumbering happens once at the very end.
   * Row not found (number out of range) — STOP. Tell me how many rows the table has. Delete nothing.
3. **Show me for confirmation** (for each row, if multiple numbers were given):
   * The full row (date, title, web link).
   * Which note file will be deleted (or "no note file — this is a direct link row").
   * If this is the table's **last remaining row**, also state that the table file **and** that topic's row in `topics.html` will be deleted (remaining rows get renumbered).
4. Proceed only after my explicit **"yes / confirm"**. Delete nothing without confirmation.

## STEP 2 — DELETE THE ATTACHED NOTE FILE

* Extract the path from the row's `Link to file` cell (e.g. `<a href="../notes/Some-Title.html" class="open">` → `notes/Some-Title.html`; relative to the table file, hence `../`).
* Cell **empty** (direct link row) — no file to delete. Go to Step 3.
* If a path exists:
  * Verify the path resolves **inside `notes/`** — if it points outside, STOP and tell me.
  * File exists → delete it. Missing → skip, and report "file already missing".
* **Delete only the file linked in this row.** Never touch other `notes/` files or shared `assets/` (§10).
* If the deleted note referenced `assets/img/` files that no other page references, list them in the report — do not delete them unless I confirm.

## STEP 3 — REMOVE THE ROW & RENUMBER

* Remove the `<tr>`, then renumber the remaining rows `1..N` top-to-bottom, preserving order (§10). Only the `#` cell changes.
* `<thead>`, `ROWS END` comment, `<title>`, breadcrumb and `<h1>` stay unchanged (§8).

## STEP 4 — EMPTY TABLE HANDLING

If **no data rows remain**:

1. **Delete** `tables/<topic-slug>.table.html` (do not leave an empty table).
2. Remove that topic's `<tr>` from `topics.html` (the row linking `./tables/<topic-slug>.table.html`) and renumber the remaining rows `1..N`, preserving order (§9, §10).
3. If `topics.html` ends up with no rows, keep the page, `<thead>` and `ROWS END` comment.
4. Check: row count in `topics.html` == file count in `tables/`.

If rows remain, **do not touch `topics.html`**.

## HARD RULES

* §11 applies — **no git commands** (no `git add`, `git rm`, commit, stage/unstage).
* No file deletion without confirmation.
* One request = delete only the rows I specified. No unsolicited "cleanup".
* Do not touch any other topic's table file.

## WORKFLOW SUMMARY

```text
Topic + Row number
    ↓
Normalize topic → slug + display name (§1)
    ↓
Locate tables/<topic-slug>.table.html (not found → STOP)
    ↓
Extract row, show it to me → wait for CONFIRMATION
    ↓
Delete linked note file (if any, inside notes/ only)
    ↓
Remove <tr> + renumber remaining rows 1..N (§10)
    ↓
No rows left → delete table file + delete topics.html row + renumber
```

## OUTPUT

When done, give me only:

1. The deleted row's title and its old row number
2. Whether the note file was deleted (with path), or "direct link row — no file"
3. How many rows remain in the table, and whether renumbering happened
4. Whether the table file was deleted
5. Whether `topics.html` was updated
