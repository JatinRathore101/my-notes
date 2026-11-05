# Git Merge

- **Topic:** GIT
- **Date:** 20 Sep 2026

> Related: [Merge vs Rebase (video)](./Git-MERGE-vs-REBASE-Everything-You-Need-to-Know.md), [Squash](./git-squash.md), [Rebase](./git-rebase.md), [Cherry-pick](./git-cherry-pick.md), [Reset/Revert](./git-reset-revert-reapply.md).

## Mental model — Git history is a graph

- Merge/rebase/squash = **different ways to build/rewrite the commit graph**, not just commands that "combine changes".

### Commit

```text
Commit
├── snapshot / tree      (state of the entire project)
├── parent commit(s)     (which commit it came after)
├── author, committer
├── message
└── metadata
```

- **Parent** is the most important — it is part of the commit's identity (hash).
- Normal commit: 1 parent. **Merge commit: 2 parents.**

### Branch = movable pointer, HEAD = "where am I"

```text
A ── B ── C
          ↑
       main, feature      ← right after git checkout -b feature

A ── B ── C ── D
          ↑    ↑
        main  feature     ← after making one commit on feature
```

- A branch is not a copy of the code, just a pointer. `HEAD → main → C`; after switching, `HEAD → feature → D`.

## Ancestor / Common ancestor / Merge base

- **Ancestor:** anything reached by following parent links backwards. In `A → B → C → D → E`, the ancestors of `E` = `D, C, B, A` (not `E` itself).
- **Common ancestor:** an ancestor of both branches. **Merge base** = the most recent common ancestor.

```text
             C ── D        feature
            /
A ── B ───
            \
             E ── F        main
```

- `A`, `B` are common ancestors; `B` is the merge base.

## Three-way merge — how it works

```bash
git checkout main
git merge feature
```

1. Find the merge base (`B`).
2. What changed in `B → D` (feature)? What changed in `B → F` (main)?
3. Combine both → merge commit `M` (2 parents).

```text
             C ── D
            /      \
A ── B ───          M       ← M: parent 1 = F (main), parent 2 = D (feature)
            \      /
             E ── F
```

## Fast-forward merge

- `main` has not advanced since feature was created → no merge commit needed, the pointer just moves forward.

```text
main:     A ── B
feature:  A ── B ── C ── D
```

```text
A ── B ── C ── D
               ↑
          main, feature
```

- The rebase + FF merge combo is based on this → [Rebase](./git-rebase.md).

## Merge conflict

- The same line was changed differently in both branches → Git cannot decide.

```text
B (base):    int x = 10;
B → C:       int x = 20;    (feature)
B → D:       int x = 50;    (main)
```

```bash
# fix the conflict markers in the files
git add <files>
git commit          # this commit itself becomes the merge commit
```

- For a rebase conflict, use `git rebase --continue` instead of `git commit`.

## Doubt — After a merge, is the order in main always `<main> → <feature> → <merge>`?

**No.** Graph structure and `git log` display order are two different things.

```text
A ── B ── D ── E ── M       main
     \             /
      C ── F ── G ─┘
```

- Git only knows: `E → D → B → A`, `G → F → C → B → A`, `M`'s parents = `E, G`.
- There is **no parent-child relation** between `E` and `G` — they are parallel lines.
- Chronologically, commits can be **interleaved**:

```text
B   10:00
C   10:05   (feature)
D   10:10   (main)
F   10:15   (feature)
E   10:20   (main)
G   10:25   (feature)
M   10:30
```

- `git log` follows **parent links**, not timestamps → **topological order** (no ancestor is shown before its descendant; the rest of the order depends on Git's traversal). Both are valid:

```text
M E D G F C B A      or      M G F E D C B A
```

```bash
git log --graph --oneline --all
```

```text
*   M
|\
| * G
| * F
| * C
* | E
* | D
|/
* B
* A
```

> Git history is a **DAG**, not a list. Order is fixed within a parent chain; commits on different branches have no order relative to each other. **Parent relationship ≠ timestamp.**

## Doubt — Merge and squash both create one commit; what is the difference?

- Merge commit `M` **does not replace** the feature commits — `C, F, G` remain reachable from main; `M` just joins them.

```text
Normal merge:  A ── B ── D ── E ── M       (B D E C F G M all reachable from main)
                    \             /
                     C ── F ── G

Squash:        A ── B ── D ── E ── S       (S = combined effect of C+F+G; C F G not in main)
```

- **Merge = "bring existing commits into main"**, **Squash = "create a new commit with the final changes"** → [Squash](./git-squash.md).

## Undoing a merge commit

- 2 parents → you must specify the mainline:

```bash
git revert -m 1 M      # treat parent 1 (main side) as mainline
```

## Interview lines

- **Merge vs rebase:** Merge combines while preserving existing history (merge commit if not FF). Rebase replays commits onto a new base → linear, but hashes change.
- **Common ancestor:** an ancestor of both branches; the one used by a three-way merge = merge base.
- **Order:** commits on different branches have no order relative to each other, only within a parent chain.
