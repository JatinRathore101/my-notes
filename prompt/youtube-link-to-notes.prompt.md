Use this public YouTube video URL containing a computer science / software engineering tutorial

Your task is to turn the video's **publicly available transcript into high-quality summarized study notes**.

## INPUTS

I will give you two things:

1. **YouTube video URL** — the tutorial video.
2. **Topic** — which subject this note belongs to (e.g. `system-design`, `lld`, `dbms`).

If I forget to give the **topic**, STOP and ask me for it. Do NOT guess the topic from the video title.

### Topic slug + display name

* **Slug** = lowercase, non-alphanumeric chars replaced with `-`, repeated `-` collapsed, leading/trailing `-` removed.
  * `System Design` / `system_design` / `System-Design` → all become `system-design`.
  * Slug is used for the index filename: `<topic-slug>.table.md`.
* **Display name** = slug ke saare non-alphanumeric chars ko space se replace karo, poora UPPERCASE.
  * `system-design` → `SYSTEM DESIGN`, `lld` → `LLD`.
  * Display name is used inside the note header and as the index file's H1 heading.

## IMPORTANT — DO NOT PROCESS THE VIDEO

* **DO NOT download the video.**
* **DO NOT watch or analyze the video.**
* **DO NOT download or process the video's audio.**
* **DO NOT perform speech-to-text transcription yourself.**
* **DO NOT use Claude credits/tokens to process the actual video.**
* Only obtain the video's **title** and **existing publicly available transcript/captions**.
* Prefer YouTube's existing transcript/captions, including auto-generated captions.
* If YouTube's transcript is inaccessible, use a free/public transcript source if available.
* If no free transcript is available, stop and tell me rather than downloading/processing the video.

## TASK

Once you have obtained the **video title and complete transcript**:

1. Read the **entire transcript**.
2. Understand the concepts being taught.
3. Convert the entire tutorial into **crisp, clean, structured study material**.
4. Do NOT merely summarize the video at a high level. The resulting notes should contain the actual knowledge and explanations necessary to study the topic later without watching the video.
5. Remove:

   * filler words
   * greetings/intros/outros
   * repeated statements
   * unnecessary conversational language
   * irrelevant tangents
   * transcript timestamps
   * caption formatting artifacts
6. Preserve all important technical information, concepts, terminology, examples, algorithms, trade-offs, and explanations from the transcript.
7. Correct obvious transcript errors when the intended technical meaning is clear.
8. Organize the material logically rather than blindly following the transcript's sentence-by-sentence structure.

## NOTE QUALITY

The output should feel like **professional computer-science study notes**, suitable for:

Use:

* Clear headings and subheadings
* Bullet points
* Numbered steps for processes/algorithms
* Tables where comparisons are useful
* Code blocks when the transcript contains code or when a short code example significantly improves understanding
* Definitions of important concepts
* Key takeaways
* Examples where they are present in the tutorial
* Time/space complexity where relevant
* Pros/cons and trade-offs where relevant

Keep the writing **concise but sufficiently explanatory**.

Do not add large amounts of information that was not covered in the transcript. You may add a small clarification when necessary to make an explanation technically correct or understandable, but clearly prioritize the content of the tutorial.

## MARKDOWN FILE

Create a `.md` file containing the complete study material.

The file must be created inside the `/notes` directory of this repo.

The filename must be based on the **exact video title**, with:

* Spaces replaced by `-`
* `.md` extension added
* Remove characters that are invalid/problematic in filenames if necessary

For example:

```text
Video title:
"System Design Tutorial - Load Balancing Explained"

Filename:
System-Design-Tutorial---Load-Balancing-Explained.md
```

## MARKDOWN STRUCTURE

The file must start with an H1 title followed by this exact header block:

```markdown
# <Exact Video Title>

- **Topic:** SYSTEM DESIGN
- **Video:** [<Exact Video Title>](https://www.youtube.com/watch?v=...)
- **Date:** 06 Sep 2026
```

- `Topic` — the topic **display name** (UPPERCASE form, see INPUTS above).
- `Video` — exact video title as link text, YouTube URL as target.
- `Date` — today's date in `DD MMM YYYY` format.
- Header block ke baad hi content start ho.
- Adapt the rest of the structure to the actual content. Do not force unnecessary sections.

## UPDATE THE TOPIC INDEX (`<topic-slug>.table.md`)

After creating the notes file, you MUST record it in that topic's index file at the **repo root**.

1. Look for `<topic-slug>.table.md` at the repo root (e.g. `system-design.table.md`).
2. **If it exists** — append ONE new row at the end of the table:
   * `#` — last row ka serial number +1.
   * `Date` — same date as in the notes file (`DD MMM YYYY`).
   * `Title` — the exact video title.
   * `Web link` — `[Watch](<youtube-url>)`.
   * `Link to file` — clickable relative link, e.g. `[Open notes](./notes/<filename>.md)`.
   * Do NOT modify, reorder, or renumber existing rows — only append.
3. **If it does not exist** — create it with the topic display name as H1, the table header, and this note as row `1`:

   ```markdown
   # SYSTEM DESIGN

   | # | Date | Title | Web link | Link to file |
   |---|------|-------|---------------|--------------|
   | 1 | 06 Sep 2026 | <Video Title> | [Watch](<youtube-url>) | [Open notes](./notes/<filename>.md) |
   ```

* Index files always live at the repo root, never inside `notes/`.
* Never create a new index file for a topic that already has one — check first.
* Ek hi table me **direct (unprocessed) web link** wali rows bhi ho sakti hain — unka `Web link` `[Link](...)` hota hai aur `Link to file` khaali hota hai (dekho [store-direct-link.prompt.md](./store-direct-link.prompt.md)).
  * Serial number `#` dono tarah ki rows ko milakar ek hi sequence me chalta hai — last row ka number +1 lo, chahe wo direct-link row ho.
  * Un rows ko na chhedo, na renumber karo. Columns hamesha `# | Date | Title | Web link | Link to file` hi rahenge.

## UPDATE THE README (only for a brand-new topic)

* If you had to **create** the `<topic-slug>.table.md` file (i.e. this is the repo's first note for that topic), also add a row for it in the `## Notes Index` table inside `README.md`:

  ```markdown
  | SYSTEM DESIGN | [system-design.table.md](./system-design.table.md) |
  ```

* If the topic's index file already existed, **do not touch `README.md`** at all.

## TOKEN/CREDIT EFFICIENCY

Be extremely mindful of Claude usage.

The workflow should be:

```text
YouTube URL + Topic
    ↓
Normalize topic → slug + display name
    ↓
Fetch TITLE
    ↓
Fetch existing PUBLIC TRANSCRIPT/CAPTIONS
    ↓
Claude processes ONLY the transcript
    ↓
Generate study notes
    ↓
Save as notes/<video-title>.md
    ↓
Append row to <topic-slug>.table.md (create if missing)
    ↓
If topic was new → add row to README Notes Index
```

**Never use the video itself as input to Claude.**

Do not unnecessarily reproduce the raw transcript in the conversation. The final `.md` file should contain the **cleaned study material/notes**, not the raw transcript.

After successfully creating the file, give me only:

1. A short confirmation that it was created
2. The notes file path
3. The topic slug used
4. Which index file the row was added to, and whether that index file was newly created
5. Whether `README.md` was updated (only happens for a brand-new topic)

If the transcript cannot be obtained through a free/public source, explain the problem briefly and do not process the video.
