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
  * Slug is used for the index filename: `tables/<topic-slug>.table.md`.
* **Display name** = slug ke saare non-alphanumeric chars ko space se replace karo, poora UPPERCASE.
  * `system-design` → `SYSTEM DESIGN`, `lld` → `LLD`.
  * Display name is used inside the note header, as the index file's H1 heading, and in the `Topic` column of `topics.md`.

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
* Title aur transcript fetch karne ka exact working tareeka neeche **HOW TO FETCH TITLE + TRANSCRIPT** section me diya hai — wahi use karo.

## HOW TO FETCH TITLE + TRANSCRIPT (known-working method — try this FIRST)

YouTube ab simple transcript fetching block karta hai, isliye method hunting mat karo. Ye exact steps follow karo — 20 Sep 2026 ko verified.

Saara kaam **scratchpad directory** me karo (repo me koi temp file nahi jaani chahiye). Neeche `$SCRATCHPAD` = session ki scratchpad directory ka path (system prompt me diya hota hai) — use apne path se replace karo.

### Step 1 — Video title (`videoDetails.title` se)

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

- **Sirf `videoDetails` wala title use karo.** Page me `"title"` bahut baar aata hai — pehla match aksar `"Download unavailable"` jaisa UI string hota hai, video title nahi.
- `json.loads` escapes (`\u0026`, `\'`) apne aap theek kar deta hai — `og:title` me HTML entities (`&#39;`) aate hain, isliye wo mat use karo.
- Title na mile toh page HTML shayad bot-check page hai — curl dobara chalao.

### Step 2 — Transcript (yt-dlp + `ios` player client)

`yt-dlp` system me installed nahi hota. Scratchpad me pehle se ho toh reuse karo, warna ek baar install:

```bash
cd "$SCRATCHPAD"
[ -d ./ytdlp ] || python3 -m pip install --quiet --target ./ytdlp yt-dlp
```

Phir **sirf subtitles** fetch karo (video download nahi hota — `--skip-download`):

```bash
PYTHONPATH=./ytdlp python3 ./ytdlp/bin/yt-dlp \
  --extractor-args "youtube:player_client=ios" \
  --skip-download --ignore-no-formats-error \
  --write-auto-subs --write-subs --sub-langs "en.*" --sub-format json3 \
  -o "cap.%(ext)s" "https://www.youtube.com/watch?v=<VIDEO_ID>"
```

- `player_client=ios` **zaroori hai** — default client fail hota hai.
- `--ignore-no-formats-error` bhi zaroori hai, warna "Requested format is not available" pe poora command fail ho jaata hai.
- Output files video ke hisaab se alag-alag naam le sakti hain — `cap.en.json3`, `cap.en-orig.json3`, `cap.en-US.json3`. Step 3 khud sahi file chun leta hai.
- Kabhi-kabhi ek extra auto-translated track (`en-en-US`) pe HTTP 429 aata hai — **ignore karo**, primary file kaafi hai.
- PO-token aur impersonation wali WARNING lines normal hain, inse subtitles pe koi farq nahi padta.

### Step 3 — json3 ko plain text me convert karo

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

- **Sanity check:** `tStartMs` (milliseconds) video duration ke aas-paas hona chahiye. Bahut kam ho toh transcript adhoora hai.
- Word count bhi dekho — 4-5 min tutorial me normally 600+ words aate hain.
- Phir `transcript.txt` padho aur usi se notes banao.

> Ye poora flow ~3 second me complete ho jaata hai (yt-dlp pehle se installed ho toh). Agar 2-3 attempt se zyada lag rahe hain, matlab kuch badal gaya hai — mujhe bata do.

### Ye approaches FAIL hote hain — inme time waste mat karo

| Approach | Kya hota hai |
|----------|--------------|
| Watch page se `captionTracks` ka `baseUrl` direct curl karna | Empty response (har `fmt` variant pe) |
| InnerTube `youtubei/v1/player` API (ANDROID client) | `captions` hi nahi aate |
| `youtubetotranscript.com` | HTTP 403 |
| `youtubetranscript.com` | "YouTube is currently blocking us" wala dummy XML |
| yt-dlp default / `mweb` / `web_embedded` / `tv_embedded` client | "Video unavailable" / "page needs to be reloaded" |

Agar `ios` client bhi fail ho jaaye, tab hi doosre free/public sources try karo. Kuch bhi kaam na kare toh **ruk jao aur mujhe batao** — video download/process bilkul mat karna.

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

Keep the writing **concise but sufficiently explanatory**.

Do not add large amounts of information that was not covered in the transcript. You may add a small clarification when necessary to make an explanation technically correct or understandable, but clearly prioritize the content of the tutorial.

## MARKDOWN FILE

Create a `.md` file containing the complete study material.

The file must be created inside the `notes/` folder of this repo (flat — no topic subfolders).

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

## UPDATE THE TOPIC INDEX (`tables/<topic-slug>.table.md`)

After creating the notes file, you MUST record it in that topic's index file inside the **`tables/` folder**.

1. Look for `tables/<topic-slug>.table.md` (e.g. `tables/system-design.table.md`).
2. **If it exists** — append ONE new row at the end of the table:
   * `#` — last row ka serial number +1.
   * `Date` — same date as in the notes file (`DD MMM YYYY`).
   * `Title` — the exact video title. Title me `|` ho toh `\|` likho, taaki table na tootay.
   * `Web link` — `[Watch](<youtube-url>)`.
   * `Link to file` — clickable relative link, e.g. `[Open notes](../notes/<filename>.md)`. Path `tables/` folder ke relative hai, isliye `../notes/` (NOT `./notes/`).
   * Do NOT modify, reorder, or renumber existing rows — only append.
3. **If it does not exist** — create it with the topic display name as H1, the table header, and this note as row `1`:

   ```markdown
   # SYSTEM DESIGN

   | # | Date | Title | Web link | Link to file |
   |---|------|-------|---------------|--------------|
   | 1 | 06 Sep 2026 | <Video Title> | [Watch](<youtube-url>) | [Open notes](../notes/<filename>.md) |
   ```

* Index files always live inside `tables/`, never at the repo root or inside `notes/`.
* Never create a new index file for a topic that already has one — check first.
* **Duplicate check:** row add karne se pehle dekho ki same YouTube URL us table me pehle se toh nahi hai. Ho toh notes file mat banao, STOP karo aur mujhe batao ki row `#N` pe already hai.
* Ek hi table me **direct (unprocessed) web link** wali rows bhi ho sakti hain — unka `Web link` `[Link](...)` hota hai aur `Link to file` khaali hota hai (dekho [store-direct-link.prompt.md](./store-direct-link.prompt.md)).
  * Serial number `#` dono tarah ki rows ko milakar ek hi sequence me chalta hai — last row ka number +1 lo, chahe wo direct-link row ho.
  * Un rows ko na chhedo, na renumber karo. Columns hamesha `# | Date | Title | Web link | Link to file` hi rahenge.

## UPDATE `topics.md` (only for a brand-new topic)

* `topics.md` (repo root) is the table of contents of all topics — columns `# | Topic | Link to table`, one row per file in `tables/`.
* If you had to **create** the `tables/<topic-slug>.table.md` file (i.e. this is the repo's first note for that topic), append ONE row at the end of `topics.md`:
  * `#` — last row +1.
  * `Topic` — the topic display name (UPPERCASE).
  * `Link to table` — `[<topic-slug>.table.md](./tables/<topic-slug>.table.md)`.

  Example (illustrative — apna `#`, display name aur slug use karo):

  ```markdown
  | 5 | DBMS | [dbms.table.md](./tables/dbms.table.md) |
  ```

* Do NOT edit, reorder or renumber existing rows in `topics.md`.
* If the topic's index file already existed, **do not touch `topics.md`** at all.

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
Generate study notes
    ↓
Save as notes/<video-title>.md
    ↓
Append row to tables/<topic-slug>.table.md (create if missing)
    ↓
If topic was new → append row to topics.md
```

**Never use the video itself as input to Claude.**

**Git commands bilkul mat chalao** — na `git add`, na commit, na stage/unstage. Main khud karunga.

Do not unnecessarily reproduce the raw transcript in the conversation. The final `.md` file should contain the **cleaned study material/notes**, not the raw transcript.

After successfully creating the file, give me only:

1. A short confirmation that it was created
2. The notes file path
3. The topic slug used
4. Which index file the row was added to, and whether that index file was newly created
5. Whether `topics.md` was updated (only happens for a brand-new topic)

If the transcript cannot be obtained through a free/public source, explain the problem briefly and do not process the video.
