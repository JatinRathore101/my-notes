# My Notes 📚

- Ye repo alag-alag CS topics (**System Design**, **LLD**, aur aage jo bhi add ho) ke markdown tutorial notes ka collection hai.
- Notes **simple Hinglish** me likhe gaye hain — friend ko samjhane wale style me, short crisp bullet points ke saath.
- Zyada tar notes YouTube tutorials (jaise ByteByteGo) ke transcripts se bane hain.
- Saath hi **raw web links** (article, blog, doc, repo) bhi bina process kiye store kar sakte hain — sirf index table me row, koi notes file nahi.

## Repo Structure

```text
my-notes/
├── notes/               # Saare tutorial notes (ek video = ek file, sab topics ek hi folder me)
├── prompt/              # Reusable prompts (video → notes, direct link store, entry delete)
├── <topic>.table.md     # Per-topic index (date, title, web link, file link)
└── CLAUDE.md            # Notes likhne ke rules (language, tone, formatting)
```

- Notes kabhi topic-wise subfolder me nahi jaate — sab flat `notes/` me rehte hain.
- Topic ka alag hona sirf **index file** se pata chalta hai: `system-design.table.md`, `lld.table.md`, waghairah.

## Notes Index

Har topic ka apna index file hai — usme us topic ki saari entries (date, title, web link, file link) milengi.

| Topic | Index |
|-------|-------|
| SYSTEM DESIGN | [system-design.table.md](./system-design.table.md) |
| GIT | [git.table.md](./git.table.md) |
| LLD | [lld.table.md](./lld.table.md) |
| REACT MACHINE CODING | [react-machine-coding.table.md](./react-machine-coding.table.md) |

Har index file me **exactly ye 5 columns** hote hain — dono tarah ki entries ek hi table me rehti hain:

| # | Date | Title | Web link | Link to file |
|---|------|-------|---------------|--------------|
| 1 | 05 Sep 2026 | Processed note (video se bana) | [Watch](https://youtube.com/...) | [Open notes](./notes/file.md) |
| 2 | 20 Sep 2026 | Direct link (unprocessed) | [Link](https://example.com/...) | |

- Direct link wali row me `Link to file` **khaali** rehta hai, kyunki uska koi notes file nahi banti.
- Column headers kabhi change nahi hote — sirf values khaali ho sakti hain.

## Naya Note Kaise Banate Hain?

1. YouTube video ka URL lo aur decide karo ye kis **topic** ka hai (e.g. `system-design`, `lld`).
2. [youtube-link-to-notes.prompt.md](./prompt/youtube-link-to-notes.prompt.md) wala prompt Claude Code me use karo — URL **aur** topic name ke saath.
3. Prompt automatically:
   - Video ka **title aur public transcript** fetch karta hai (video download nahi hota).
   - Transcript ko clean, structured study notes me convert karta hai.
   - `notes/` folder me `<video-title>.md` file banata hai.
   - `<topic>.table.md` me nayi row add karta hai (file na ho toh nayi bana deta hai).
   - Topic bilkul naya ho toh upar wale **Notes Index** table me bhi ek row add kar deta hai.

## Direct Web Link Kaise Store Karein?

Jab koi article/blog/doc bas **save** karna ho, notes banane ki zarurat na ho:

1. Link, uska **title** aur **topic** decide karo.
2. [store-direct-link.prompt.md](./prompt/store-direct-link.prompt.md) wala prompt Claude Code me use karo — link + title + topic ke saath.
3. Prompt automatically:
   - Link ko **fetch/process nahi karta** (zero token waste) — sirf as-is store karta hai.
   - `<topic>.table.md` me nayi row add karta hai, `Link to file` column khaali chhod kar.
   - Duplicate URL ho toh row add nahi karta, bata deta hai.
   - Topic bilkul naya ho toh **Notes Index** table me bhi row add kar deta hai.

## Koi Entry Delete Kaise Karein?

1. Topic aur us entry ka **row number** (`#` column wali value) note kar lo.
2. [delete-table-row.prompt.md](./prompt/delete-table-row.prompt.md) wala prompt Claude Code me use karo — topic + row number ke saath.
3. Prompt automatically:
   - Row dikha kar pehle **confirmation maangta hai** (delete destructive hai).
   - Row se linked note file `notes/` se delete karta hai (direct link row ho toh koi file nahi).
   - Table se row hata kar bachi rows ko `1..N` renumber kar deta hai.
   - Table khaali ho jaye toh `<topic>.table.md` file aur **Notes Index** ki us topic wali row bhi hata deta hai.

## Notes ka Format

- Har file self-contained hai — ek video, ek file.
- File ke top pe topic, video link aur date hota hai:

  ```markdown
  # <Video Title>

  - **Topic:** SYSTEM DESIGN
  - **Video:** [<Video Title>](https://www.youtube.com/watch?v=...)
  - **Date:** 06 Sep 2026
  ```

- Style: short bullets, tables for comparisons, mermaid/ASCII diagrams jahan helpful ho.
- Detailed writing rules ke liye [CLAUDE.md](./CLAUDE.md) dekho.
