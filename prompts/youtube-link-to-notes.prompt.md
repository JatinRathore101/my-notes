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
  * Slug is used for the index filename: `tables/<topic-slug>.table.html`.
* **Display name** = slug with all non-alphanumeric chars replaced by a space, fully UPPERCASE.
  * `system-design` → `SYSTEM DESIGN`, `lld` → `LLD`.
  * Display name is used inside the note header, as the index file's H1 heading, and in the `Topic` column of `topics.html`.

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
* The exact working method to fetch the title and transcript is in the **HOW TO FETCH TITLE + TRANSCRIPT** section below — use that.

## HOW TO FETCH TITLE + TRANSCRIPT (known-working method — try this FIRST)

YouTube now blocks simple transcript fetching, so do not hunt for alternative methods. Follow these exact steps — verified on 20 Sep 2026.

Do all work inside the **scratchpad directory** (no temp files may land in the repo). Below, `$SCRATCHPAD` = the session's scratchpad directory path (given in the system prompt) — replace it with your actual path.

### Step 1 — Video title (from `videoDetails.title`)

```bash
cd "$SCRATCHPAD"
curl -s -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" \
  "https://www.youtube.com/watch?v=<VIDEO_ID>" -o page.html
python3 - <<'PY'
import json, re
h = open('page.html', encoding='utf-8').read()
m = re.search(r'"videoDetails":\{.*?"title":"(.*?)(?<!\\)"', h)
print(json.loads('"' + m.group(1) + '"') if m else 'TITLE NOT FOUND')
PY
```

- **Use only the `videoDetails` title.** `"title"` appears many times in the page — the first match is often a UI string like `"Download unavailable"`, not the video title.
- `json.loads` resolves escapes (`&`, `\'`) automatically — `og:title` contains HTML entities (`&#39;`), so do not use it.
- If the title is not found, the page HTML is probably a bot-check page — re-run the curl.

### Step 2 — Transcript (yt-dlp + `ios` player client)

`yt-dlp` is not installed system-wide. Reuse it if it already exists in the scratchpad, otherwise install it once:

```bash
cd "$SCRATCHPAD"
[ -d ./ytdlp ] || python3 -m pip install --quiet --target ./ytdlp yt-dlp
```

Then fetch **subtitles only** (the video is not downloaded — `--skip-download`):

```bash
PYTHONPATH=./ytdlp python3 ./ytdlp/bin/yt-dlp \
  --extractor-args "youtube:player_client=ios" \
  --skip-download --ignore-no-formats-error \
  --write-auto-subs --write-subs --sub-langs "en.*" --sub-format json3 \
  -o "cap.%(ext)s" "https://www.youtube.com/watch?v=<VIDEO_ID>"
```

- `player_client=ios` is **required** — the default client fails.
- `--ignore-no-formats-error` is also required, otherwise the whole command fails on "Requested format is not available".
- Output filenames vary per video — `cap.en.json3`, `cap.en-orig.json3`, `cap.en-US.json3`. Step 3 picks the correct file automatically.
- An extra auto-translated track (`en-en-US`) occasionally returns HTTP 429 — **ignore it**, the primary file is sufficient.
- PO-token and impersonation WARNING lines are expected and do not affect the subtitles.

### Step 3 — Convert json3 to plain text

```bash
cd "$SCRATCHPAD" && python3 - <<'PY'
import json, re, glob
files = glob.glob('cap.*.json3')
pref = ['cap.en.json3', 'cap.en-orig.json3', 'cap.en-US.json3']
f = next((x for x in pref if x in files), files[0])
d = json.load(open(f))
ev = [e for e in d.get('events', []) if e.get('segs')]
t = re.sub(r'\s+', ' ', ''.join(s.get('utf8','') for e in ev for s in e['segs'])).strip()
open('transcript.txt','w').write(t)
print('picked:', f, '|', len(t.split()), 'words | last tStartMs:', ev[-1]['tStartMs'])
PY
```

- **Sanity check:** `tStartMs` (milliseconds) should be close to the video duration. If it is much lower, the transcript is incomplete.
- Also check the word count — a 4-5 min tutorial normally yields 600+ words.
- Then read `transcript.txt` and build the notes from it.

> This whole flow completes in ~3 seconds (with yt-dlp already installed). If it takes more than 2-3 attempts, something has changed — tell me.

### These approaches FAIL — do not waste time on them

| Approach | Result |
|----------|--------|
| Curling the `captionTracks` `baseUrl` from the watch page directly | Empty response (for every `fmt` variant) |
| InnerTube `youtubei/v1/player` API (ANDROID client) | No `captions` returned |
| `youtubetotranscript.com` | HTTP 403 |
| `youtubetranscript.com` | Dummy XML saying "YouTube is currently blocking us" |
| yt-dlp default / `mweb` / `web_embedded` / `tv_embedded` client | "Video unavailable" / "page needs to be reloaded" |

Only if the `ios` client also fails, try other free/public sources. If nothing works, **stop and tell me** — never download/process the video.

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

The output should feel like **professional computer-science study notes**, suitable for revision and interview prep without re-watching the video.

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

Keep the writing **concise but sufficiently explanatory**, in precise technical English (see `CLAUDE.md`).

Use HTML to make the notes richer than plain text can: Mermaid diagrams for flows/sequences/architecture, `.cards` for side-by-side comparisons, callouts for tips/gotchas, `.flow` for short pipelines, `details` for optional deep dives, and images (`assets/img/`) when a visual is genuinely needed. Clarity first — do not decorate.

Do not add large amounts of information that was not covered in the transcript. You may add a small clarification when necessary to make an explanation technically correct or understandable, but clearly prioritize the content of the tutorial.

## HTML FILE

Create an `.html` file containing the complete study material.

The file must be created inside the `notes/` folder of this repo (flat — no topic subfolders).

The filename must be based on the **exact video title**, with:

* Spaces replaced by `-`
* `.html` extension added
* Remove characters that are invalid/problematic in filenames if necessary

For example:

```text
Video title:
"System Design Tutorial - Load Balancing Explained"

Filename:
System-Design-Tutorial---Load-Balancing-Explained.html
```

## HTML STRUCTURE

* **Start from `assets/note.template.html`** — copy its skeleton and follow the **COMPONENT CHEAT SHEET** in its top comment. Use [`notes/What-happens-when-you-type-a-URL-into-your-browser.html`](../notes/What-happens-when-you-type-a-URL-into-your-browser.html) as the reference example for quality and structure.
* All styling/behaviour comes from the shared `../assets/notes.css` and `../assets/notes.js` (theme toggle, copy buttons, auto TOC, Mermaid rendering). **Do not** inline a full stylesheet or duplicate those features per page; a small page-specific `<style>` block is allowed only for a genuinely one-off visual.
* **Remove the template's top comment** (placeholders + cheat sheet) from the generated note.
* Replace every `{{PLACEHOLDER}}`:
  * `{{TITLE}}` / `{{VIDEO_TITLE}}` — exact video title (HTML-escaped: `&` → `&amp;`, `<` → `&lt;`).
  * `{{TOPIC_DISPLAY}}` — the topic **display name** (UPPERCASE form, see INPUTS above).
  * `{{TOPIC_SLUG}}` — topic slug (used in the breadcrumb and footer back-link to `../tables/<topic-slug>.table.html`).
  * `{{VIDEO_URL}}` — YouTube URL.
  * `{{DATE}}` — today's date in `DD MMM YYYY` format.
* The header (`<header class="note-header">` with H1 + Topic / Video / Date meta pills) must always be present; content starts only after it.
* Keep the Mermaid `<script>` tag only if the page contains a `<pre class="mermaid">`. Mermaid source starts at column 0 and escapes `&`, `<`, `>` as entities.
* Escape `&`, `<`, `>` inside all code blocks and ASCII diagrams.
* Adapt the sections to the actual content. Do not force unnecessary sections.
* **Validate** before finishing: tag balance (e.g. a quick Python `html.parser` check) and no leaked markdown syntax (```` ``` ````, `**`, `|---|`).

## UPDATE THE TOPIC INDEX (`tables/<topic-slug>.table.html`)

After creating the notes file, you MUST record it in that topic's index file inside the **`tables/` folder**.

1. Look for `tables/<topic-slug>.table.html` (e.g. `tables/system-design.table.html`).
2. **If it exists** — append ONE new `<tr>` directly above the `<!-- ROWS END … -->` comment in `<tbody>`:

   ```html
   <tr><td class="num">5</td><td class="nowrap">06 Sep 2026</td><td>Video Title</td><td><a href="https://www.youtube.com/watch?v=..." target="_blank" rel="noopener">Watch</a></td><td><a href="../notes/<filename>.html" class="open">Open notes</a></td></tr>
   ```

   * `#` (`td.num`) — last row's serial number + 1.
   * `Date` — same date as in the notes file (`DD MMM YYYY`).
   * `Title` — the exact video title, HTML-escaped (`&` → `&amp;`, `<` → `&lt;`).
   * `Web link` — `<a href="<youtube-url>" target="_blank" rel="noopener">Watch</a>`.
   * `Link to file` — `<a href="../notes/<filename>.html" class="open">Open notes</a>`. The path is relative to the `tables/` folder, hence `../notes/` (NOT `./notes/`).
   * Do NOT modify, reorder, or renumber existing rows — only append.
3. **If it does not exist** — copy an existing `tables/*.table.html` as the skeleton (head, topbar, `index-page` main, table header, `ROWS END` comment), set `<title>`, the breadcrumb label and the `<h1>` to the topic display name, and put this note in as row `1`.

* Index files always live inside `tables/`, never at the repo root or inside `notes/`.
* Never create a new index file for a topic that already has one — check first.
* The header row is fixed: `# | Date | Title | Web link | Link to file`. Never add/remove/rename columns.
* **Duplicate check:** before adding the row, check whether the same YouTube URL already exists in that table. If it does, do not create the notes file — STOP and tell me it already exists at row `#N`.
* The same table may also contain **direct (unprocessed) web link** rows — their `Web link` is `<a …>Link</a>` and `Link to file` is an empty `<td></td>` (see [store-direct-link.prompt.md](./store-direct-link.prompt.md)). Notes without a video have an empty `Web link` cell.
  * The `#` serial number runs as a single sequence across all row types — take the last row's number + 1, even if it is a direct-link row.
  * Do not modify or renumber those rows.

## UPDATE `topics.html` (only for a brand-new topic)

* `topics.html` (repo root) is the table of contents of all topics — columns `# | Topic | Link to table`, one row per file in `tables/`.
* If you had to **create** the `tables/<topic-slug>.table.html` file (i.e. this is the repo's first note for that topic), append ONE `<tr>` directly above the `<!-- ROWS END … -->` comment in `topics.html`:

  ```html
  <tr><td class="num">5</td><td><strong>DBMS</strong></td><td><a class="open" href="./tables/dbms.table.html">dbms.table.html</a></td></tr>
  ```

  (illustrative — use your own `#`, display name and slug)

* Do NOT edit, reorder or renumber existing rows in `topics.html`.
* If the topic's index file already existed, **do not touch `topics.html`** at all.

## TOKEN/CREDIT EFFICIENCY

Be extremely mindful of Claude usage.

The workflow should be:

```text
YouTube URL + Topic
    ↓
Normalize topic → slug + display name
    ↓
Fetch TITLE (watch page curl + videoDetails regex)
    ↓
Fetch existing PUBLIC TRANSCRIPT/CAPTIONS (yt-dlp, ios player client)
    ↓
Claude processes ONLY the transcript
    ↓
Generate study notes (HTML)
    ↓
Save as notes/<video-title>.html (from assets/note.template.html)
    ↓
Append row to tables/<topic-slug>.table.html (create if missing)
    ↓
If topic was new → append row to topics.html
```

**Never use the video itself as input to Claude.**

**Never run git commands** — no `git add`, no commit, no stage/unstage. I handle git manually.

Do not unnecessarily reproduce the raw transcript in the conversation. The final `.html` file should contain the **cleaned study material/notes**, not the raw transcript.

After successfully creating the file, give me only:

1. A short confirmation that it was created
2. The notes file path
3. The topic slug used
4. Which index file the row was added to, and whether that index file was newly created
5. Whether `topics.html` was updated (only happens for a brand-new topic)

If the transcript cannot be obtained through a free/public source, explain the problem briefly and do not process the video.
