Use this to **delete one entry** from a topic's index table — row hatao, numbering theek karo, aur us row ka attached note file bhi delete karo.

Ye flow **destructive** hai. Isliye confirm kiye bina kuch delete mat karna.

## INPUTS

I will give you two things:

1. **Topic** — which subject's index file (e.g. `system-design`, `lld`, `dbms`).
2. **Row number** — table ke `#` column wali value (e.g. `3`).

Rules:

* **Topic** missing ho — STOP and ask me. Guess mat karo.
* **Row number** missing ho — STOP and ask me. Title ya link se row **mat dhoondo**, jab tak main khud title na doon.
* Ek se zyada row numbers doon (e.g. `2, 5`) toh sab handle karo — par **numbering ek hi baar, saari deletions ke baad** fix karna.

### Topic slug + display name

* **Slug** = lowercase, non-alphanumeric chars replaced with `-`, repeated `-` collapsed, leading/trailing `-` removed.
  * `System Design` / `system_design` / `System-Design` → all become `system-design`.
  * Slug is used for the index filename: `tables/<topic-slug>.table.md`.
* **Display name** = slug ke saare non-alphanumeric chars ko space se replace karo, poora UPPERCASE.
  * `system-design` → `SYSTEM DESIGN`, `lld` → `LLD`.

## STEP 1 — LOCATE & CONFIRM (delete se pehle)

1. `tables/` folder me `tables/<topic-slug>.table.md` dhoondo.
   * File hi na mile — STOP. Mujhe bata do ki is topic ka koi index file nahi hai. Kuch aur mat karo.
2. Table me diya hua `#` row dhoondo.
   * Row na mile (number range se bahar hai) — STOP. Table me kitni rows hain wo bata do. Kuch delete mat karo.
3. Mujhe **confirm karne ke liye dikhao**:
   * Poori row (date, title, web link).
   * Kaunsi note file delete hogi (ya "koi note file nahi — ye direct link row hai").
   * Agar ye table ki **last remaining row** hai toh ye bhi batao ki table file **aur** README ki Notes Index row bhi delete hogi.
4. Mera explicit **"haan / yes / confirm"** aane ke baad hi Step 2 karo. Bina confirmation ke kuch delete mat karo.

## STEP 2 — DELETE THE ATTACHED NOTE FILE

* Row ke `Link to file` column se file path nikalo (e.g. `[Open notes](../notes/Some-Title.md)` → `notes/Some-Title.md`; path table file ke relative hota hai, isliye `../`).
* Column **khaali** ho (direct link row) — koi file delete nahi karni. Seedha table wale step pe jao.
* Path ho toh:
  * Pehle check karo file actually exist karti hai.
  * Exist karti hai → delete kar do.
  * Exist nahi karti → delete skip karo, par mujhe report me bata dena ("file already missing").
* **Sirf wahi file delete karo jo isi row me linked hai.** `notes/` ki koi aur file, ya koi aur folder, kabhi mat chhedo.
* Delete karne se pehle confirm karo ki path `notes/` ke andar hi hai. Bahar point kare toh STOP aur mujhe batao.

## STEP 3 — REMOVE THE ROW & FIX NUMBERING

1. Table se wo row hata do.
2. **Renumber**: bachi hui rows ko upar se neeche `1, 2, 3, ...` continuous number do.
   * Sirf `#` column ki value badlegi — baaki har column (date, title, links) bilkul as-is rahega.
   * Rows ka **order kabhi mat badlo** — sirf gaps close karo.
   * Example: rows `1,2,3,4` me se `2` delete hui → bachi rows ab `1,2,3` ho jayengi.
3. Table ka header row waisa ka waisa rahega — hamesha:

   ```markdown
   | # | Date | Title | Web link | Link to file |
   |---|------|-------|---------------|--------------|
   ```

   Column kabhi add/remove/rename mat karo.
4. H1 heading (`# SYSTEM DESIGN`) bhi waise hi rehni chahiye.

## STEP 4 — EMPTY TABLE HANDLING

Agar row hatane ke baad table me **ek bhi data row nahi bachi**:

1. `tables/<topic-slug>.table.md` file ko **delete kar do** (khaali table chhodna nahi hai).
2. `README.md` ke `## Notes Index` table se us topic ki row bhi hata do:

   ```markdown
   | SYSTEM DESIGN | [system-design.table.md](./tables/system-design.table.md) |
   ```

3. Baaki topics ki rows ko mat chhedo. Agar Notes Index bilkul khaali ho jaye toh table header rehne do.

Agar rows bachi hain toh `README.md` ko **haath mat lagao**.

## HARD RULES

* **Git commands bilkul mat chalao** — na `git add`, na `git rm`, na commit, na stage/unstage. Main khud karunga.
* Bina confirmation ke koi file delete nahi.
* Ek request = sirf jo rows maine boli, unhi ko delete karo. Apni marzi se "cleanup" mat karo.
* Note file sirf tab delete hoti hai jab wo usi row ke `Link to file` me linked ho.
* Kisi doosre topic ki table file ko mat chhedo.

## WORKFLOW SUMMARY

```text
Topic + Row number
    ↓
Normalize topic → slug + display name
    ↓
Locate tables/<topic-slug>.table.md (na mile → STOP)
    ↓
Row nikalo, mujhe dikhao → CONFIRMATION ka wait
    ↓
Linked note file delete (agar hai)
    ↓
Row hatao + bachi rows ko 1..N renumber karo
    ↓
Koi row nahi bachi → table file delete + README Notes Index row delete
```

## OUTPUT

Kaam hone ke baad mujhe sirf ye do:

1. Deleted row ka title aur uska purana row number
2. Note file delete hui ya nahi (path ke saath), ya "direct link row — koi file nahi thi"
3. Table me ab kitni rows bachi hain, aur renumber hua ya nahi
4. Table file delete hui ya nahi
5. `README.md` update hua ya nahi
