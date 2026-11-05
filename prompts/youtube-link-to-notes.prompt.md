Use this public YouTube video URL containing a computer science / software engineering tutorial

Your task is to turn the video's **publicly available transcript into high-quality summarized study notes** — an HTML note in `notes/` plus a row in the topic's index table.

> **Conventions:** all shared rules (topic slug, language, content quality, filename, HTML structure, local assets, validation, index tables, `topics.html`, hard rules) live in [`notes-conventions.md`](./notes-conventions.md). **Read it first** — this prompt only adds the video-specific workflow. Section refs like §3 point into that file.

For a non-YouTube URL (article, blog, docs) use [webpage-link-to-notes.prompt.md](./webpage-link-to-notes.prompt.md) instead; to only bookmark a link use [store-direct-link.prompt.md](./store-direct-link.prompt.md).

## INPUTS

I will give you two things:

1. **YouTube video URL** — the tutorial video.
2. **Topic** — which subject this note belongs to (e.g. `system-design`, `lld`, `dbms`).

* Topic missing → STOP and ask (§1). Do NOT guess it from the video title.
* Normalize the topic → slug + display name (§1).
* **Duplicate check first** (§8): if the video URL already exists in `tables/<topic-slug>.table.html`, STOP and report the row `#N` before fetching anything.

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
* The exact working method is in **HOW TO FETCH TITLE + TRANSCRIPT** below — use that.

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

## BUILD THE NOTE

Once you have the **video title and complete transcript**:

1. Read the **entire transcript** and write the note following **§2 (language)** and **§3 (content rules)** — **§3.1 brevity is STRICT**: telegraphic bullets, no prose paragraphs, then the mandatory compression pass. Video-specific removals: transcript timestamps, caption formatting artifacts, greetings and sponsor segments.
2. **Filename** (§4): exact video title, spaces → `-`, `.html` (e.g. `System-Design-Tutorial---Load-Balancing-Explained.html`).
3. **HTML** (§5): from `assets/note.template.html`; header pills **Topic / Video / Date** — `{{VIDEO_URL}}` = the YouTube URL, `{{VIDEO_TITLE}}` = exact video title.
4. **Assets** (§6): recreate diagrams shown in the video as Mermaid where useful; never download the video or its frames.
5. **Validate** (§7), including the brevity check with the transcript's word count (`wc -w transcript.txt`) — fix every flag and re-run.

## RECORD THE NOTE

* Append the row to `tables/<topic-slug>.table.html` (§8) as a **video note** row: `Web link` = `Watch` → YouTube URL, `Link to file` = `Open notes` → `../notes/<filename>.html`. Create the table page if missing.
* If the table page was newly created, append the topic row to `topics.html` (§9).

## WORKFLOW & TOKEN EFFICIENCY

Be extremely mindful of Claude usage.

```text
YouTube URL + Topic
    ↓
Normalize topic → slug + display name (§1)
    ↓
Duplicate URL check (§8) → exists → STOP
    ↓
Fetch TITLE (watch page curl + videoDetails regex)
    ↓
Fetch existing PUBLIC TRANSCRIPT/CAPTIONS (yt-dlp, ios player client)
    ↓
Claude processes ONLY the transcript
    ↓
Build note (§2-§6) → validate (§7) → save notes/<Video-Title>.html
    ↓
Append row to tables/<topic-slug>.table.html (§8, create if missing)
    ↓
If topic was new → append row to topics.html (§9)
```

* **Never use the video itself as input to Claude.**
* Hard rules (§11) apply — no git commands, no raw transcript dumps in the conversation.

After successfully creating the file, give me only:

1. A short confirmation that it was created
2. The notes file path
3. The topic slug used
4. Which index file the row was added to, and whether that index file was newly created
5. Whether `topics.html` was updated (only happens for a brand-new topic)

If the transcript cannot be obtained through a free/public source, explain the problem briefly and do not process the video.
