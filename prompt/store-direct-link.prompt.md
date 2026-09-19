Use this to **store a plain web link** (article, blog, doc, GitHub repo, tweet, video — kuch bhi) in the notes repo **without generating any notes file**.

This is the "bookmark" flow. Koi transcript fetch nahi hoga, koi content process nahi hoga, koi `.md` note nahi banega — sirf topic ki index table me ek row add hogi.

## INPUTS

I will give you three things:

1. **Web link** — the URL to store.
2. **Title** — the title to show in the table.
3. **Topic** — which subject this link belongs to (e.g. `system-design`, `lld`, `dbms`).

Rules:

* Agar **topic** missing ho — STOP and ask me. Topic ko URL ya title se **guess mat karo**.
* Agar **title** missing ho — STOP and ask me. Page ko fetch karke title nikalne ki koshish mat karo.
* Agar **link** missing ho — STOP and ask me.

### Topic slug + display name

* **Slug** = lowercase, non-alphanumeric chars replaced with `-`, repeated `-` collapsed, leading/trailing `-` removed.
  * `System Design` / `system_design` / `System-Design` → all become `system-design`.
  * Slug is used for the index filename: `<topic-slug>.table.md`.
* **Display name** = slug ke saare non-alphanumeric chars ko space se replace karo, poora UPPERCASE.
  * `system-design` → `SYSTEM DESIGN`, `lld` → `LLD`.
  * Display name is used as the index file's H1 heading.

## IMPORTANT — DO NOT PROCESS THE LINK

* **DO NOT open, fetch, crawl, or download the URL.**
* **DO NOT** read the page content, transcript, captions, or any media behind the link.
* **DO NOT** summarize the link or create any notes file in `notes/`.
* **DO NOT** use Claude credits/tokens on the link's content.
* URL ko bilkul as-is store karo — shorten, expand, clean ya redirect-resolve mat karo.
* Title bhi exactly wahi use karo jo maine diya hai (bas leading/trailing spaces trim kar do).
* Agar title me `|` character ho toh use `\|` likh do, taaki markdown table na tootay.

## TASK

1. Topic ko normalize karo → slug + display name.
2. Repo root pe `<topic-slug>.table.md` dhoondo.
3. File mile toh usme **sirf ek nayi row append** karo. Na mile toh nayi file banao.
4. Bas. Aur kuch nahi.

## TABLE FORMAT (same for all topics)

Har topic ki index file me **exactly ye 5 columns** hote hain — YouTube-notes rows aur direct-link rows dono isi ek table me, isi order me rehte hain:

```markdown
| # | Date | Title | Web link | Link to file |
|---|------|-------|---------------|--------------|
```

Direct link row me `Link to file` column **khaali** rehta hai (kyunki koi note file generate nahi hui) — column hataana nahi hai, sirf value blank rakhni hai:

```markdown
| 4 | 20 Sep 2026 | <Title> | [Link](<web-url>) | |
```

* `#` — last row ka serial number +1 (row YouTube-note ki ho ya direct-link ki, dono ek hi sequence me count hote hain).
* `Date` — aaj ki date, `DD MMM YYYY` format (e.g. `20 Sep 2026`).
* `Title` — jo title maine diya, exactly wahi.
* `Web link` — `[Link](<web-url>)`. (YouTube-notes rows `[Watch](...)` use karti hain, unhe waisa hi rehne do.)
* `Link to file` — **empty** (` | |` — do pipes ke beech kuch nahi, bas ek space).

## UPDATE THE TOPIC INDEX (`<topic-slug>.table.md`)

1. Look for `<topic-slug>.table.md` at the **repo root** (e.g. `system-design.table.md`).
2. **If it exists** — append ONE new row at the very end of the table.
   * Existing rows ko na edit karo, na reorder karo, na renumber karo.
   * Table ka header row change mat karo — wo already `# | Date | Title | Web link | Link to file` hona chahiye.
   * Agar kisi purani table ka header alag ho (e.g. `Link to video`), toh usko in 5 standard columns me fix kar do aur existing rows ke values waise hi rakho.
3. **If it does not exist** — create it with the topic display name as H1, the standard table header, and this link as row `1`:

   ```markdown
   # SYSTEM DESIGN

   | # | Date | Title | Web link | Link to file |
   |---|------|-------|---------------|--------------|
   | 1 | 20 Sep 2026 | <Title> | [Link](<web-url>) | |
   ```

* Index files always live at the repo root, never inside `notes/`.
* Never create a new index file for a topic that already has one — check first.

## DUPLICATE CHECK

* Row add karne se pehle table me check karo ki same URL pehle se toh nahi hai.
* Already exist karta ho toh **row add mat karo** — mujhe bata do ki ye link pehle se row `#N` pe maujood hai.

## UPDATE THE README (only for a brand-new topic)

* Agar tumhe `<topic-slug>.table.md` **banana** pada (yaani is topic ki repo me pehli entry hai), toh `README.md` ke `## Notes Index` table me bhi ek row add kar do:

  ```markdown
  | SYSTEM DESIGN | [system-design.table.md](./system-design.table.md) |
  ```

* Topic ki index file pehle se exist karti thi toh `README.md` ko **haath mat lagao**.

## TOKEN/CREDIT EFFICIENCY

Ye flow bilkul sasta hona chahiye. Workflow:

```text
Web link + Title + Topic
    ↓
Normalize topic → slug + display name
    ↓
Locate <topic-slug>.table.md at repo root (create if missing)
    ↓
Duplicate URL check
    ↓
Append one row (Link to file column empty)
    ↓
If topic was new → add row to README Notes Index
```

**Never fetch or process the link's content.**

After you're done, give me only:

1. A short confirmation that the row was added (ya duplicate tha toh wo bata do)
2. The topic slug used
3. Which index file the row was added to, and whether that index file was newly created
4. The row number assigned
5. Whether `README.md` was updated (only happens for a brand-new topic)
