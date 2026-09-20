# Git Reset, Revert & Re-apply

- **Topic:** GIT
- **Date:** 20 Sep 2026

> Related: [Merge](./git-merge.md), [Rebase](./git-rebase.md), [Squash](./git-squash.md), [Cherry-pick](./git-cherry-pick.md).

## Git 3 cheezein badal sakta hai

```text
1. Commit history            (graph me kya commits hain)
2. Branch pointer / HEAD     (meri branch kis commit pe hai)
3. Staging area + Working directory   (meri actual files aur staged changes)
```

```text
Working Directory      ← tumhari actual files
       ↓ git add
Staging Area (INDEX)   ← next commit me kya jaayega
       ↓ git commit
Commit History         ← permanent record
```

- Har command ke liye socho: teeno me se kya badla?

## `git revert` — undo commit banao

```text
A ── B ── C ── D          C me bug hai
              ↑
             main

git revert C

A ── B ── C ── D ── R     R = C ka ulta (C ke changes reverse)
                    ↑
                   main
```

- `C` exist karta rehta hai; history rewrite nahi → **shared branches pe safe**.
- Shared main pe `reset --hard B` mat karo (sabki history tootegi); `revert C` karo → sab `R` pull kar lenge.

### Merge commit revert

```bash
git revert -m 1 M      # parent 1 = jis branch pe merge kiya tha (main side)
```

- 2 parents → mainline batana padta hai; us parent ke relative merge ke changes reverse hote hain.

## `git reset` — branch pointer move karo

```text
A ── B ── C ── D          git reset B
              ↑
             main

A ── B                    main peeche gaya
     ↑
    main
     C ── D               (ab main se unreachable)
```

- Local history rewrite. Mode decide karta hai **staging + working dir** ka kya hoga.

### `--soft` — pointer move, changes staged

```bash
git reset --soft B
```

```text
A ── B ── C ── D     "C aur D ek commit hona chahiye tha"

git reset --soft B   → pointer B pe, C+D changes STAGED
git commit -m "Implement feature"

A ── B ── X          C+D replaced by X
```

```bash
git reset --soft HEAD~1     # last commit me file bhool gaye
git add forgotten_file
git commit                  # corrected C' banta hai
```

### `--mixed` (default) — pointer move, changes unstaged

```text
Commit history:     B
Staging area:       empty
Working directory:  C + D ke changes
```

- Ab selectively `git add <files>` karke naye commits banao.

### `--hard` — pointer move, changes discard

```bash
git reset --hard B
```

- Staging + working dir bhi `B` jaisi. `C, D` ke changes aur uncommitted kaam **gaya**.

### Table

| Command | Branch pointer | Staging (INDEX) | Working files |
|---|---|---|---|
| `reset --soft B` | `B` pe | **kept** (staged) | kept |
| `reset --mixed B` | `B` pe | **reset** (unstaged) | kept |
| `reset --hard B` | `B` pe | **reset** | **reset** (changes gaye) |

```text
             HEAD    INDEX    WORKTREE
--soft        ✓      KEEP      KEEP
--mixed       ✓      RESET     KEEP
--hard        ✓      RESET     RESET
```

## Reset vs Revert

```text
Reset:   A ── B ── C ── D   →   A ── B              (pointer peeche, history rewrite)
Revert:  A ── B ── C ── D   →   A ── B ── C ── D ── R  (history intact, undo commit add)
```

| | Reset | Revert |
|---|---|---|
| Kaam | Pointer move | Naya undo commit |
| History | Rewrite | Intact |
| Purana commit | Unreachable | Exist karta hai |
| Kahan | **Local / private** | **Shared / public** |

## Reset vs Rebase

| | Reset | Rebase |
|---|---|---|
| Kaam | Pointer kahin aur | Commits doosre base pe **replay** |
| Naye commits | Nahi | Haan (`D'`, `E'`) |

## `git reflog` — recovery

- `git log` = reachable commits; `git reflog` = HEAD **kahan-kahan point kar chuka**.

```bash
git reflog
```

```text
abc123 HEAD@{0}: reset: moving to HEAD~3
def456 HEAD@{1}: commit: Add payment API
ghi789 HEAD@{2}: commit: Add validation
```

```bash
git reset --hard def456     # wapas aa gaye
```

## `git commit --amend` — last commit replace

```bash
git add forgotten_file
git commit --amend
```

```text
Before:  A ── B ── C
After:   A ── B ── C'      (C ≠ C', commit replace hua)
```

- Sirf **unpushed** commit pe; pushed pe = history rewrite.

## `git restore` / `git switch`

```text
git switch   → branches change karo
git restore  → files restore / unstage karo
```

| Kaam | Purana | Naya |
|---|---|---|
| Branch switch | `git checkout feature` | `git switch feature` |
| File ke local changes discard | `git checkout -- foo.cpp` | `git restore foo.cpp` |
| File unstage (changes rakho) | `git reset foo.cpp` | `git restore --staged foo.cpp` |

- `restore --staged`: HEAD unchanged, working dir modified, staging clean.

## "Re-apply"

- `git reapply` koi command nahi. Do matlab:
  - **Ek commit dobara apply** → `git cherry-pick <commit>` → [Cherry-pick](./git-cherry-pick.md).
  - **Rebase me commits replay** → [Rebase](./git-rebase.md):

```text
Before:  A ── B ── C          After rebase:  A ── B ── C ── D' ── E'
              \
               D ── E
```

## Cheat sheet

| Operation | Mental model |
|---|---|
| `revert` | Commit banao jo doosre commit ko undo kare |
| `reset` | Branch pointer move |
| `reset --soft` | Pointer move, changes staged |
| `reset --mixed` | Pointer move, changes unstaged |
| `reset --hard` | Pointer move, changes discard |
| `restore` | Files restore / unstage |
| `amend` | Latest commit replace |
| `reflog` | HEAD ki purani positions |
| `switch` / `checkout` | Branch badlo |

## Scenarios

1. **Shared main pe bad commit `C`** → `git revert C`.
2. **Local `C, D, E` ek commit** → `git reset --soft B && git commit` ya `git rebase -i B`.
3. **Unpushed last commit me file bhool gaye** → `git commit --amend`.
4. **Galti se file stage** → `git restore --staged <file>`.
5. **Local history uda di** → `git reflog` → `git reset --hard <commit>`.

```text
                  WHAT AM I TRYING TO DO?
                            │
           ┌────────────────┼─────────────────┐
           ↓                ↓                 ↓
     Change history    Undo changes      Copy changes
           │                │                 │
     ┌─────┴─────┐          │          ┌──────┴──────┐
     ↓           ↓          ↓          ↓             ↓
   reset       rebase     revert    cherry-pick     merge
```

> `reset` aur `rebase` history **rewrite**; `revert` history **preserve** (naya commit add). Shared main pe ye distinction sabse important.
