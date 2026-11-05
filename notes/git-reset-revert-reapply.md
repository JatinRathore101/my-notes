# Git Reset, Revert & Re-apply

- **Topic:** GIT
- **Date:** 20 Sep 2026

> Related: [Merge](./git-merge.md), [Rebase](./git-rebase.md), [Squash](./git-squash.md), [Cherry-pick](./git-cherry-pick.md).

## Git can change 3 things

```text
1. Commit history            (which commits are in the graph)
2. Branch pointer / HEAD     (which commit my branch points to)
3. Staging area + Working directory   (my actual files and staged changes)
```

```text
Working Directory      ← your actual files
       ↓ git add
Staging Area (INDEX)   ← what goes into the next commit
       ↓ git commit
Commit History         ← permanent record
```

- For each command, ask: which of the three changed?

## `git revert` — create an undo commit

```text
A ── B ── C ── D          C has a bug
              ↑
             main

git revert C

A ── B ── C ── D ── R     R = inverse of C (reverses C's changes)
                    ↑
                   main
```

- `C` continues to exist; no history rewrite → **safe on shared branches**.
- Do not `reset --hard B` on shared main (breaks everyone's history); do `revert C` → everyone pulls `R`.

### Reverting a merge commit

```bash
git revert -m 1 M      # parent 1 = the branch that was merged into (main side)
```

- 2 parents → you must specify the mainline; the merge's changes are reversed relative to that parent.

## `git reset` — move the branch pointer

```text
A ── B ── C ── D          git reset B
              ↑
             main

A ── B                    main moved back
     ↑
    main
     C ── D               (now unreachable from main)
```

- Rewrites local history. The mode decides what happens to **staging + working dir**.

### `--soft` — move pointer, changes staged

```bash
git reset --soft B
```

```text
A ── B ── C ── D     "C and D should have been one commit"

git reset --soft B   → pointer at B, C+D changes STAGED
git commit -m "Implement feature"

A ── B ── X          C+D replaced by X
```

```bash
git reset --soft HEAD~1     # forgot a file in the last commit
git add forgotten_file
git commit                  # creates corrected C'
```

### `--mixed` (default) — move pointer, changes unstaged

```text
Commit history:     B
Staging area:       empty
Working directory:  changes from C + D
```

- Now selectively `git add <files>` and create new commits.

### `--hard` — move pointer, discard changes

```bash
git reset --hard B
```

- Staging + working dir also match `B`. Changes from `C, D` and uncommitted work are **gone**.

### Table

| Command | Branch pointer | Staging (INDEX) | Working files |
|---|---|---|---|
| `reset --soft B` | at `B` | **kept** (staged) | kept |
| `reset --mixed B` | at `B` | **reset** (unstaged) | kept |
| `reset --hard B` | at `B` | **reset** | **reset** (changes gone) |

```text
             HEAD    INDEX    WORKTREE
--soft        ✓      KEEP      KEEP
--mixed       ✓      RESET     KEEP
--hard        ✓      RESET     RESET
```

## Reset vs Revert

```text
Reset:   A ── B ── C ── D   →   A ── B              (pointer moved back, history rewritten)
Revert:  A ── B ── C ── D   →   A ── B ── C ── D ── R  (history intact, undo commit added)
```

| | Reset | Revert |
|---|---|---|
| Purpose | Move pointer | New undo commit |
| History | Rewritten | Intact |
| Old commit | Unreachable | Still exists |
| Where | **Local / private** | **Shared / public** |

## Reset vs Rebase

| | Reset | Rebase |
|---|---|---|
| Purpose | Point the pointer elsewhere | **Replay** commits onto another base |
| New commits | No | Yes (`D'`, `E'`) |

## `git reflog` — recovery

- `git log` = reachable commits; `git reflog` = **everywhere HEAD has pointed**.

```bash
git reflog
```

```text
abc123 HEAD@{0}: reset: moving to HEAD~3
def456 HEAD@{1}: commit: Add payment API
ghi789 HEAD@{2}: commit: Add validation
```

```bash
git reset --hard def456     # recovered
```

## `git commit --amend` — replace the last commit

```bash
git add forgotten_file
git commit --amend
```

```text
Before:  A ── B ── C
After:   A ── B ── C'      (C ≠ C', commit was replaced)
```

- Only on an **unpushed** commit; on a pushed one = history rewrite.

## `git restore` / `git switch`

```text
git switch   → change branches
git restore  → restore / unstage files
```

| Task | Old | New |
|---|---|---|
| Switch branch | `git checkout feature` | `git switch feature` |
| Discard a file's local changes | `git checkout -- foo.cpp` | `git restore foo.cpp` |
| Unstage a file (keep changes) | `git reset foo.cpp` | `git restore --staged foo.cpp` |

- `restore --staged`: HEAD unchanged, working dir modified, staging clean.

## "Re-apply"

- `git reapply` is not a command. Two meanings:
  - **Apply a commit again** → `git cherry-pick <commit>` → [Cherry-pick](./git-cherry-pick.md).
  - **Replaying commits in a rebase** → [Rebase](./git-rebase.md):

```text
Before:  A ── B ── C          After rebase:  A ── B ── C ── D' ── E'
              \
               D ── E
```

## Cheat sheet

| Operation | Mental model |
|---|---|
| `revert` | Create a commit that undoes another commit |
| `reset` | Move branch pointer |
| `reset --soft` | Move pointer, changes staged |
| `reset --mixed` | Move pointer, changes unstaged |
| `reset --hard` | Move pointer, discard changes |
| `restore` | Restore / unstage files |
| `amend` | Replace the latest commit |
| `reflog` | Previous positions of HEAD |
| `switch` / `checkout` | Change branch |

## Scenarios

1. **Bad commit `C` on shared main** → `git revert C`.
2. **Combine local `C, D, E` into one commit** → `git reset --soft B && git commit` or `git rebase -i B`.
3. **Forgot a file in the unpushed last commit** → `git commit --amend`.
4. **Staged a file by mistake** → `git restore --staged <file>`.
5. **Wiped out local history** → `git reflog` → `git reset --hard <commit>`.

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

> `reset` and `rebase` **rewrite** history; `revert` **preserves** history (adds a new commit). On shared main, this distinction matters most.
