# Git Cherry-pick

- **Topic:** GIT
- **Date:** 20 Sep 2026

> Related: [Merge](./git-merge.md), [Rebase](./git-rebase.md), [Squash](./git-squash.md), [Reset/Revert](./git-reset-revert-reapply.md).

## Kya hai

- **Ek specific commit ke changes** current branch pe **naye commit** ke roop me apply karna.

```text
main:     A ── B ── C
feature:  A ── B ── C ── D ── E       sirf D chahiye main pe

git checkout main
git cherry-pick D

main:     A ── B ── C ── D'
```

- `D ≠ D'` — changes same, parent alag → naya hash.

## Procedure

1. Target branch pe checkout (jahan changes chahiye).
2. `git cherry-pick <hash>` — Git commit ka diff (parent ke relative) HEAD pe apply karke naya commit banata hai.

```bash
git checkout main
git cherry-pick abc123            # ek commit
git cherry-pick abc123 def456     # multiple commits
```

### Conflict

```bash
# files fix karo
git add <files>
git cherry-pick --continue
# ya cancel
git cherry-pick --abort
```

## Use cases

- **Hotfix:** release pe fix `D`, main pe bhi chahiye, `E` nahi.
- **Backport:** main ka fix purane release branch pe.
- **Galat branch pe commit:** sahi branch pe cherry-pick, galat se reset.

```text
main:      A ── B ── C
release:   A ── B ── C ── D ── E     D = critical fix, E = nahi chahiye

git checkout main
git cherry-pick D

main:      A ── B ── C ── D'
```

## Cherry-pick vs Merge

| | Merge | Cherry-pick |
|---|---|---|
| Laata hai | Branch ki **poori history** | **Ek commit** ke changes |
| Granularity | branch → branch | commit → branch |
| Naya commit | Merge commit (2 parents) ya FF | Normal commit, naya hash |
| Original se link | `M` ka parent original | **Koi link nahi** — Git ko nahi pata `D'` = `D` |

> Same change do commits (`D`, `D'`) me → baad me wo branch merge karo toh conflict/duplicate possible. `D` kisi pehle commit pe depend kare jo target pe nahi → conflict.

## Merge vs Rebase vs Squash vs Cherry-pick

| Operation | Main idea |
|---|---|
| **Merge** | Do histories jodo |
| **Rebase** | Mere commits doosre base pe replay |
| **Squash** | Multiple commits ek me |
| **Cherry-pick** | Selected commit(s) ke changes copy |

```text
Merge:        A ── B ── C ── D ─────── M
                   \                  /
                    E ── F ── G ─────┘

Rebase:       A ── B ── C ── D ── E' ── F' ── G'

Squash:       A ── B ── C ── S

Cherry-pick:  A ── B ── C
                        \
                         X        (X = kisi ek commit ke changes ka naya commit)
```

- Rebase = poori branch ke commits ka series me cherry-pick jaisa.

## Interview line

- Specific commit ke changes current branch pe naye commit ke roop me apply karna; hotfix/backport ke liye jab poori branch merge nahi karni. Naya hash banta hai.
