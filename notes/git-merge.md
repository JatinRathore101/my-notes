# Git Merge

- **Topic:** GIT
- **Date:** 20 Sep 2026

> Related: [Merge vs Rebase (video)](./Git-MERGE-vs-REBASE-Everything-You-Need-to-Know.md), [Squash](./git-squash.md), [Rebase](./git-rebase.md), [Cherry-pick](./git-cherry-pick.md), [Reset/Revert](./git-reset-revert-reapply.md).

## Mental model — Git history ek graph hai

- Merge/rebase/squash = **commit graph banane/rewrite karne ke alag tareeke**, sirf "changes combine" karne wali commands nahi.

### Commit

```text
Commit
├── snapshot / tree      (poore project ki state)
├── parent commit(s)     (kis commit ke baad aaya)
├── author, committer
├── message
└── metadata
```

- **Parent** sabse important — commit ki identity (hash) ka part hai.
- Normal commit: 1 parent. **Merge commit: 2 parents.**

### Branch = movable pointer, HEAD = "main kahan hoon"

```text
A ── B ── C
          ↑
       main, feature      ← git checkout -b feature ke turant baad

A ── B ── C ── D
          ↑    ↑
        main  feature     ← feature pe ek commit karne ke baad
```

- Branch code ki copy nahi, bas pointer. `HEAD → main → C`; switch karo toh `HEAD → feature → D`.

## Ancestor / Common ancestor / Merge base

- **Ancestor:** parent links follow karke peeche jo bhi mile. `A → B → C → D → E` me `E` ke ancestors = `D, C, B, A` (`E` khud nahi).
- **Common ancestor:** dono branches ka ancestor. **Merge base** = sabse latest common ancestor.

```text
             C ── D        feature
            /
A ── B ───
            \
             E ── F        main
```

- `A`, `B` common ancestors; `B` merge base.

## Three-way merge — kaise kaam karta hai

```bash
git checkout main
git merge feature
```

1. Merge base dhundo (`B`).
2. `B → D` me kya badla (feature)? `B → F` me kya badla (main)?
3. Dono combine karo → merge commit `M` (2 parents).

```text
             C ── D
            /      \
A ── B ───          M       ← M: parent 1 = F (main), parent 2 = D (feature)
            \      /
             E ── F
```

## Fast-forward merge

- `main` feature banne ke baad aage nahi badha → merge commit ki zaroorat nahi, pointer bas aage khiskta hai.

```text
main:     A ── B
feature:  A ── B ── C ── D
```

```text
A ── B ── C ── D
               ↑
          main, feature
```

- Rebase + FF merge combo isi pe based hai → [Rebase](./git-rebase.md).

## Merge conflict

- Same line dono branches me alag badli → Git decide nahi kar sakta.

```text
B (base):    int x = 10;
B → C:       int x = 20;    (feature)
B → D:       int x = 50;    (main)
```

```bash
# files me conflict markers fix karo
git add <files>
git commit          # ye commit hi merge commit ban jaata hai
```

- Rebase conflict me `git commit` ki jagah `git rebase --continue`.

## Doubt — Merge ke baad main me order `<main> → <feature> → <merge>` hi hota hai?

**Nahi.** Graph structure aur `git log` ka display order do alag cheezein hain.

```text
A ── B ── D ── E ── M       main
     \             /
      C ── F ── G ─┘
```

- Git ko sirf ye pata: `E → D → B → A`, `G → F → C → B → A`, `M` ke parents = `E, G`.
- `E` aur `G` ke beech **koi parent-child relation nahi** — parallel lines.
- Chronologically commits **mix** ho sakte hain:

```text
B   10:00
C   10:05   (feature)
D   10:10   (main)
F   10:15   (feature)
E   10:20   (main)
G   10:25   (feature)
M   10:30
```

- `git log` timestamp nahi, **parent links** follow karta hai → **topological order** (descendant se pehle ancestor nahi dikhega, baaki order Git ke traversal pe). Dono valid:

```text
M E D G F C B A      ya      M G F E D C B A
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

> Git history **DAG** hai, list nahi. Parent chain ke andar order fixed; alag branches ke commits ka aapas me koi order nahi. **Parent relationship ≠ timestamp.**

## Doubt — Merge aur squash dono ek commit banate hain, farq kya?

- Merge commit `M` feature commits ko **replace nahi karta** — `C, F, G` main me reachable rehte hain, `M` bas jodta hai.

```text
Normal merge:  A ── B ── D ── E ── M       (main me B D E C F G M sab reachable)
                    \             /
                     C ── F ── G

Squash:        A ── B ── D ── E ── S       (S = C+F+G ka combined effect, C F G main me nahi)
```

- **Merge = "existing commits main me le aao"**, **Squash = "final changes ka naya commit banao"** → [Squash](./git-squash.md).

## Merge commit undo

- 2 parents → mainline batana padta hai:

```bash
git revert -m 1 M      # parent 1 (main side) ko mainline maano
```

## Interview lines

- **Merge vs rebase:** Merge existing history preserve karke combine karta hai (FF na ho toh merge commit). Rebase commits naye base pe replay karta hai → linear, par hashes badalte hain.
- **Common ancestor:** dono branches ka ancestor; three-way merge jo use karta hai = merge base.
- **Order:** alag branches ke commits ka aapas me order nahi hota, sirf parent chain me.
