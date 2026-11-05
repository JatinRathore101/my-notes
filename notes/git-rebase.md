# Git Rebase

- **Topic:** GIT
- **Date:** 20 Sep 2026

> Related: [Merge](./git-merge.md), [Squash](./git-squash.md), [Reset/Revert](./git-reset-revert-reapply.md), [Cherry-pick](./git-cherry-pick.md).

## What it is

- **Changing a branch's base** — **replaying** your commits on top of a new base.

```text
Before:                 After (git rebase main, on feature):
             D ── E     feature
            /
A ── B ── C                       A ── B ── C ── F ── D' ── E'
            \                                  ↑          ↑
             F          main                  main      feature
```

- `D ≠ D'`, `E ≠ E'` — new commits. The parent is part of the hash; parent changed `C → F` → hash changed.
- Rebase = **history rewrite**, not "merge without a merge commit".

## Doubt — Which direction is correct?

```bash
git checkout feature
git rebase main
```

> **Rule:** Check out the branch whose commits you want to move; then `rebase <new base>`. `git rebase main` = "rebase the **current branch** onto main"; main is **not** modified.

| | Command | Gets modified |
|---|---|---|
| Merge | `checkout main` → `merge feature` | **main** (checkout TARGET, merge SOURCE) |
| Rebase | `checkout feature` → `rebase main` | **feature** (checkout SOURCE, rebase TARGET) |

- Shortcut: **Rebase FROM → TO** = `git checkout FROM` → `git rebase TO`.

### Result of the wrong direction

```bash
git checkout main
git rebase feature
```

```text
A ── B ── C ── D ── E ── F'
                         ↑
                        main
```

- Main's unique commits are replayed on top of feature → main **now depends on feature**, shared history is rewritten. Opposite of the intended result.

## Doubt — After rebase, how does the work get into main?

- **Rebase by itself puts nothing into main**; it only prepares feature. Two steps:

### Step 1 — Rebase (feature moves)

```bash
git checkout feature
git rebase main
```

```text
A ── B ── C ── F ── D' ── E'
               ↑          ↑
              main      feature      ← main did not move
```

### Step 2 — Fast-forward merge (main moves)

```bash
git checkout main
git merge feature
```

```text
A ── B ── C ── F ── D' ── E'
                          ↑
                     main, feature
```

- Merging directly without rebase would give:

```text
             D ── E
            /      \
A ── B ── C ── F ── M          ← with a merge commit, non-linear
```

> **Rebase = where feature sits; Merge = where main sits.** If you stop after rebase, the work is not in main.

## Standard workflow (with remote)

```bash
# working on feature
git checkout feature

# fetch the latest info from remote
git fetch origin

# put your work on top of the latest main
git rebase origin/main

# if there is a conflict
git add .
git rebase --continue

# push the rebased branch (history was rewritten, so force is required)
git push --force-with-lease
```

```bash
git checkout main
git merge feature        # fast-forward if main has not moved again
git push origin main
```

- `--force-with-lease`: fails if someone pushed to the remote in the meantime — their work is not overwritten. Safer than plain `--force`.

## Conflict handling

```bash
git status                  # which files are conflicted
# fix the files
git add <files>
git rebase --continue       # replay the next commit
```

| Command | Purpose |
|---|---|
| `git rebase --continue` | Fix and move on |
| `git rebase --abort` | Cancel, back to the pre-rebase state |
| `git rebase --skip` | Skip the current commit |

- Merge conflict: `git add` → `git commit`. Rebase conflict: `git add` → `git rebase --continue`.

### Why can conflicts repeat during a rebase?

- **Merge** = a single three-way merge (base vs main tip vs feature tip) → if a conflict occurs, it is resolved **at most once**, in one merge commit.
- **Rebase** = feature's commits are replayed onto the new base **one by one** → **each commit** is its own mini-merge.

```text
A ── B ── C ── F          main
      \
       D ── E             feature (2 commits)

Rebase:  F + D  → conflict?  resolve → D'
         D' + E → conflict?  resolve → E'
```

- If both `D` and `E` touched the same line that `F` changed, there is a conflict on replaying `D`, then **again** on replaying `E` → `--continue` each time.
- So a rebase of a 10-commit branch can run the `add` + `--continue` cycle 10 times; a merge would settle it all in one go.

## `git pull --rebase`

```text
Plain git pull (merge):          git pull --rebase:
       D                          A ── B ── C ── D'
      / \
A ── B ── C ── M
```

- Preferred on personal feature branches — no useless merge commits are created.

## Why it is preferred

```text
      /───●──●───\
 ●───●             ●──●──\
      \──●──●───/          \
          \────●────────────●
```

- A graph like this after a thousand merges vs `A ── B ── C ── D ── E ── F' ── G' ── H'`.
- `git log`, `git bisect`, and debugging become easier. But it is not inherently "better" — it is a workflow choice.

## Danger — rewriting shared history

- You pushed `D`, a teammate pulled it; you rebased → you have `D'`, they have `D`. Same code, but different to Git → painful to sync.

> **Golden rule:** Do not rebase commits that others are using (main, release, shared feature).

## Rebase vs Reset

| | Reset | Rebase |
|---|---|---|
| Purpose | Move branch pointer | Recreate commits on a new base |
| New commits? | No | Yes (`D'`, `E'`) |

## Interactive rebase

```bash
git rebase -i B     # opens a list of all commits after B
```

- `pick` / `squash` / `reword` / `drop` — local cleanup before pushing.

## Interview lines

- **Why rebase:** clean linear history, avoids unnecessary merge commits. Use on private branches; be careful on shared ones (history rewrite).
- **Feature is behind main:**

```bash
git checkout feature
git fetch origin
git rebase origin/main
# conflicts → git add . && git rebase --continue
git checkout main
git merge feature      # usually fast-forward
```

- **Which branch is rewritten:** the current (checked-out) one; the name after `rebase` = the new base.
