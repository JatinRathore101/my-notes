# Git Squash

- **Topic:** GIT
- **Date:** 20 Sep 2026

> Related: [Merge](./git-merge.md), [Rebase](./git-rebase.md), [Reset/Revert](./git-reset-revert-reapply.md).

## What it is

- Changes from multiple commits → **one new single commit** on the target branch.

```text
Before:   A ── B ── D ── E          main
               \
                C ── F ── G         feature

After:    A ── B ── D ── E ── S     main   (S = net result of C+F+G)
```

## Doubt — What happens to the individual feature commits?

- `C, F, G` **never enter main**; main only knows `S`.
- `S` is a new commit with parent `E` — **no parent link** to `C/F/G`.
- `C, F, G` are not deleted; they **stay on the feature branch** as long as the branch exists (hence "hybrid": main stays clean, detail lives on the feature branch).
- Feature branch deleted → `C, F, G` become unreachable.

> No parent link → to Git the branch is not "merged"; `git branch -d feature` will warn, you must use `-D`.

## Methods

### 1. GitHub / GitLab "Squash and merge"

- **One new commit** on the target, no merge commit.

```text
A ── B ── C ── S
```

### 2. `git merge --squash`

```bash
git checkout main
git merge --squash feature     # combined changes land in the staging area
git commit                     # you create the commit yourself
```

> **Correction:** the claim that squash "also creates a single merge commit" is wrong. `S` is a normal 1-parent commit, not a 2-parent merge commit.

### 3. Squash local commits (before pushing)

```bash
# Option A — reset --soft
git reset --soft B        # pointer at B, changes from C+D+E stay staged
git commit -m "Implement feature"

# Option B — interactive rebase
git rebase -i B           # mark commits as pick/squash
```

## Squash vs Merge

| | Normal merge | Squash |
|---|---|---|
| Feature commits in main? | ✅ `C, F, G` reachable | ❌ Only `S` |
| New commit | Merge commit `M` (2 parents) | Normal commit `S` (1 parent) |
| Main history | Branchy | Linear |
| Link to feature branch | `M`'s parent is `G` | No link |

## Squash vs Rebase

| | Rebase | Squash |
|---|---|---|
| Individual commits preserved? | ✅ (`E' F' G'`) | ❌ (one `S`) |
| Hashes | New | One new commit |
| Linear? | ✅ | ✅ |
| Detailed history in main? | ✅ | ❌ |

```text
Rebase:   A ── B ── C ── D ── E' ── F' ── G'
Squash:   A ── B ── C ── D ── S
```

## Interview line

- A normal merge preserves individual commits and joins them via a merge commit; squash puts all changes into one new commit, and individual feature commits do not enter the target history.
