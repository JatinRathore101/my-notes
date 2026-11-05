Use this to **delete one entry** from a topic's index table — remove the row, fix the numbering, and delete the note file attached to that row.

This flow is **destructive**. Never delete anything without confirmation.

## INPUTS

I will give you two things:

1. **Topic** — which subject's index file (e.g. `system-design`, `lld`, `dbms`).
2. **Row number** — the value in the table's `#` column (e.g. `3`).

Rules:

* **Topic** missing — STOP and ask me. Do not guess.
* **Row number** missing — STOP and ask me. **Do not look up** the row by title or link unless I explicitly give the title.
* If I give multiple row numbers (e.g. `2, 5`), handle all of them — but **renumber only once, after all deletions**.

### Topic slug + display name

* **Slug** = lowercase, non-alphanumeric chars replaced with `-`, repeated `-` collapsed, leading/trailing `-` removed.
  * `System Design` / `system_design` / `System-Design` → all become `system-design`.
  * Slug is used for the index filename: `tables/<topic-slug>.table.md`.
* **Display name** = slug with all non-alphanumeric chars replaced by a space, fully UPPERCASE.
  * `system-design` → `SYSTEM DESIGN`, `lld` → `LLD`.
  * Display name is the index file's H1 heading and the `Topic` column value in `topics.md`.

## STEP 1 — LOCATE & CONFIRM (before deleting)

1. Locate `tables/<topic-slug>.table.md` in the `tables/` folder.
   * File not found — STOP. Tell me this topic has no index file. Do nothing else.
2. Find the given `#` row in the table. Row numbers always refer to the **current table's `#` values** — use these original numbers even for multiple deletions, since renumbering happens once at the very end.
   * Row not found (number out of range) — STOP. Tell me how many rows the table has. Delete nothing.
3. **Show me for confirmation** (for each row, if multiple numbers were given):
   * The full row (date, title, web link).
   * Which note file will be deleted (or "no note file — this is a direct link row").
   * If this is the table's **last remaining row**, also state that the table file **and** that topic's row in `topics.md` will be deleted (remaining rows get renumbered).
4. Proceed to Step 2 only after my explicit **"yes / confirm"**. Delete nothing without confirmation.

## STEP 2 — DELETE THE ATTACHED NOTE FILE

* Extract the file path from the row's `Link to file` column (e.g. `[Open notes](../notes/Some-Title.md)` → `notes/Some-Title.md`; the path is relative to the table file, hence `../`).
* Column **empty** (direct link row) — no file to delete. Go straight to the table step.
* If a path exists:
  * First verify the file actually exists.
  * Exists → delete it.
  * Does not exist → skip deletion, but mention it in the report ("file already missing").
* **Delete only the file linked in this row.** Never touch any other file in `notes/` or any other folder.
* Before deleting, verify the path resolves inside `notes/`. If it points outside, STOP and tell me.

## STEP 3 — REMOVE THE ROW & FIX NUMBERING

1. Remove the row from the table.
2. **Renumber**: assign the remaining rows continuous numbers `1, 2, 3, ...` top to bottom.
   * Only the `#` column value changes — every other column (date, title, links) stays as-is.
   * **Never change the row order** — only close the gaps.
   * Example: deleting `2` from rows `1,2,3,4` → remaining rows become `1,2,3`.
3. The table header row stays exactly the same — always:

   ```markdown
   | # | Date | Title | Web link | Link to file |
   |---|------|-------|---------------|--------------|
   ```

   Never add/remove/rename columns.
4. The H1 heading (`# SYSTEM DESIGN`) must also stay unchanged.

## STEP 4 — EMPTY TABLE HANDLING

If **no data rows remain** after removing the row:

1. **Delete** the `tables/<topic-slug>.table.md` file (do not leave an empty table).
2. Remove that topic's row from `topics.md` (repo root) — the row whose `Link to table` points to `./tables/<topic-slug>.table.md`:

   ```markdown
   | 3 | LLD | [lld.table.md](./tables/lld.table.md) |
   ```

3. **Renumber** the remaining rows `1..N` (without changing order) — change only the `#` column; `Topic` and `Link to table` stay unchanged.
4. If `topics.md` becomes completely empty, keep the H1 + table header.
5. Check: row count in `topics.md` == file count in the `tables/` folder.

If rows remain, **do not touch `topics.md`**.

## HARD RULES

* **Never run git commands** — no `git add`, no `git rm`, no commit, no stage/unstage. I handle git manually.
* No file deletion without confirmation.
* One request = delete only the rows I specified. No unsolicited "cleanup".
* A note file is deleted only if it is linked in that row's `Link to file`.
* Do not touch any other topic's table file.

## WORKFLOW SUMMARY

```text
Topic + Row number
    ↓
Normalize topic → slug + display name
    ↓
Locate tables/<topic-slug>.table.md (not found → STOP)
    ↓
Extract row, show it to me → wait for CONFIRMATION
    ↓
Delete linked note file (if any)
    ↓
Remove row + renumber remaining rows 1..N
    ↓
No rows left → delete table file + delete topics.md row + renumber
```

## OUTPUT

When done, give me only:

1. The deleted row's title and its old row number
2. Whether the note file was deleted (with path), or "direct link row — no file"
3. How many rows remain in the table, and whether renumbering happened
4. Whether the table file was deleted
5. Whether `topics.md` was updated
