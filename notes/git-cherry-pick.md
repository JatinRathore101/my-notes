# Git Cherry-pick

- **Topic:** GIT
- **Date:** 20 Sep 2026

> Related: [Merge](./git-merge.md), [Rebase](./git-rebase.md), [Squash](./git-squash.md), [Reset/Revert](./git-reset-revert-reapply.md).

## What it is

- Applies **the changes of one specific commit** to the current branch as a **new commit**.

```text
main:     A ── B ── C
feature:  A ── B ── C ── D ── E       only D is needed on main

git checkout main
git cherry-pick D

main:     A ── B ── C ── D'
```

- `D ≠ D'` — same changes, different parent → new hash.

## Procedure

1. Check out the target branch (where the changes are needed).
2. `git cherry-pick <hash>` — Git applies the commit's diff (relative to its parent) onto HEAD and creates a new commit.

```bash
git checkout main
git cherry-pick abc123            # single commit
git cherry-pick abc123 def456     # multiple commits
```

### Conflict

```bash
# fix the files
git add <files>
git cherry-pick --continue
# or cancel
git cherry-pick --abort
```

## Use cases

- **Hotfix:** fix `D` is on release; it is also needed on main, but `E` is not.
- **Backport:** apply a fix from main to an older release branch.
- **Commit made on the wrong branch:** cherry-pick it onto the correct branch, reset it off the wrong one.

```text
main:      A ── B ── C
release:   A ── B ── C ── D ── E     D = critical fix, E = not needed

git checkout main
git cherry-pick D

main:      A ── B ── C ── D'
```

## Cherry-pick vs Merge

| | Merge | Cherry-pick |
|---|---|---|
| Brings in | The branch's **entire history** | The changes of **one commit** |
| Granularity | branch → branch | commit → branch |
| New commit | Merge commit (2 parents) or FF | Normal commit, new hash |
| Link to original | `M`'s parent is the original | **No link** — Git does not know `D'` = `D` |

> Same change in two commits (`D`, `D'`) → merging that branch later can cause conflicts/duplicates. If `D` depends on an earlier commit that is not on the target → conflict.

## Merge vs Rebase vs Squash vs Cherry-pick

| Operation | Main idea |
|---|---|
| **Merge** | Join two histories |
| **Rebase** | Replay my commits onto another base |
| **Squash** | Combine multiple commits into one |
| **Cherry-pick** | Copy the changes of selected commit(s) |

```text
Merge:        A ── B ── C ── D ─────── M
                   \                  /
                    E ── F ── G ─────┘

Rebase:       A ── B ── C ── D ── E' ── F' ── G'

Squash:       A ── B ── C ── S

Cherry-pick:  A ── B ── C
                        \
                         X        (X = new commit containing the changes of one commit)
```

- Rebase ≈ cherry-picking all of a branch's commits in sequence.

## Interview line

- Applies a specific commit's changes to the current branch as a new commit; used for hotfixes/backports when you do not want to merge the whole branch. A new hash is created.
