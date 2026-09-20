# Git Squash

- **Topic:** GIT
- **Date:** 20 Sep 2026

> Related: [Merge](./git-merge.md), [Rebase](./git-rebase.md), [Reset/Revert](./git-reset-revert-reapply.md).

## Kya hai

- Multiple commits ke changes → **ek naya single commit** target branch pe.

```text
Before:   A ── B ── D ── E          main
               \
                C ── F ── G         feature

After:    A ── B ── D ── E ── S     main   (S = C+F+G ka net result)
```

## Doubt — Individual feature commits ka kya hota hai?

- `C, F, G` **main me kabhi aate hi nahi**; main sirf `S` jaanta hai.
- `S` naya commit, parent `E` — `C/F/G` se **koi parent link nahi**.
- `C, F, G` delete nahi hote, **feature branch pe pade rehte hain** jab tak branch exist kare (isliye "hybrid": main saaf, detail feature branch pe).
- Feature branch delete → `C, F, G` unreachable.

> Koi parent link nahi → Git ke liye branch "merged" nahi; `git branch -d feature` warning dega, `-D` lagana padega.

## Tareeke

### 1. GitHub / GitLab "Squash and merge"

- Target pe **ek naya commit**, koi merge commit nahi.

```text
A ── B ── C ── S
```

### 2. `git merge --squash`

```bash
git checkout main
git merge --squash feature     # combined changes staging area me aa jaate hain
git commit                     # commit tum khud banate ho
```

> **Correction:** squash ke saath "single merge commit bhi banta hai" — galat. `S` normal 1-parent commit hai, 2-parent merge commit nahi.

### 3. Local commits squash (push se pehle)

```bash
# Option A — reset --soft
git reset --soft B        # pointer B pe, C+D+E ke changes staged rehte hain
git commit -m "Implement feature"

# Option B — interactive rebase
git rebase -i B           # commits ko pick/squash mark karo
```

## Squash vs Merge

| | Normal merge | Squash |
|---|---|---|
| Main me feature commits? | ✅ `C, F, G` reachable | ❌ Sirf `S` |
| Naya commit | Merge commit `M` (2 parents) | Normal commit `S` (1 parent) |
| Main history | Branchy | Linear |
| Feature branch se link | `M` ka parent `G` | Koi link nahi |

## Squash vs Rebase

| | Rebase | Squash |
|---|---|---|
| Individual commits preserve? | ✅ (`E' F' G'`) | ❌ (ek `S`) |
| Hashes | Naye | Ek naya commit |
| Linear? | ✅ | ✅ |
| Main me detailed history? | ✅ | ❌ |

```text
Rebase:   A ── B ── C ── D ── E' ── F' ── G'
Squash:   A ── B ── C ── D ── S
```

## Interview line

- Normal merge individual commits preserve karke merge commit se jodta hai; squash sab changes ek naye commit me daalta hai, individual feature commits target history me nahi aate.
