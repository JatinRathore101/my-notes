# Git Rebase

- **Topic:** GIT
- **Date:** 20 Sep 2026

> Related: [Merge](./git-merge.md), [Squash](./git-squash.md), [Reset/Revert](./git-reset-revert-reapply.md), [Cherry-pick](./git-cherry-pick.md).

## Kya hai

- Branch ka **base badalna** — apne commits naye base ke upar **replay** karna.

```text
Before:                 After (git rebase main, feature pe):
             D ── E     feature
            /
A ── B ── C                       A ── B ── C ── F ── D' ── E'
            \                                  ↑          ↑
             F          main                  main      feature
```

- `D ≠ D'`, `E ≠ E'` — naye commits. Parent hash ka part hai; parent `C → F` badla → hash badla.
- Rebase = **history rewrite**, "merge bina merge commit" nahi.

## Doubt — Direction kaunsi sahi?

```bash
git checkout feature
git rebase main
```

> **Rule:** Jis branch ke commits move karne hain us pe checkout karo; `rebase <naya base>`. `git rebase main` = "**current branch** ko main ke upar rebase karo", main modify **nahi** hota.

| | Command | Modify hoti hai |
|---|---|---|
| Merge | `checkout main` → `merge feature` | **main** (checkout TARGET, merge SOURCE) |
| Rebase | `checkout feature` → `rebase main` | **feature** (checkout SOURCE, rebase TARGET) |

- Shortcut: **Rebase FROM → TO** = `git checkout FROM` → `git rebase TO`.

### Galat direction ka result

```bash
git checkout main
git rebase feature
```

```text
A ── B ── C ── D ── E ── F'
                         ↑
                        main
```

- Main ke unique commits feature ke upar replay → main **feature pe depend**, shared history rewrite. Ulta result.

## Doubt — Rebase ke baad kaam main me kaise aayega?

- **Rebase khud main me kuch nahi daalta**; sirf feature ko tayyar karta hai. Do steps:

### Step 1 — Rebase (feature move hoti hai)

```bash
git checkout feature
git rebase main
```

```text
A ── B ── C ── F ── D' ── E'
               ↑          ↑
              main      feature      ← main hila nahi
```

### Step 2 — Fast-forward merge (main move hoti hai)

```bash
git checkout main
git merge feature
```

```text
A ── B ── C ── F ── D' ── E'
                          ↑
                     main, feature
```

- Bina rebase seedha merge karte toh:

```text
             D ── E
            /      \
A ── B ── C ── F ── M          ← merge commit ke saath, non-linear
```

> **Rebase = feature kahan baithegi; Merge = main kahan baithegi.** Rebase pe ruk gaye toh kaam main me nahi.

## Standard workflow (remote ke saath)

```bash
# feature pe kaam kar rahe ho
git checkout feature

# remote ki latest info lao
git fetch origin

# apna kaam latest main ke upar rakho
git rebase origin/main

# conflict aaye toh
git add .
git rebase --continue

# rebased branch push karo (history rewrite hui hai, isliye force chahiye)
git push --force-with-lease
```

```bash
git checkout main
git merge feature        # main dobara nahi hila toh fast-forward
git push origin main
```

- `--force-with-lease`: remote pe beech me kisi ne push kiya ho toh fail hota hai — unka kaam overwrite nahi hota. Plain `--force` se safer.

## Conflict handling

```bash
git status                  # kaunsi files conflicted
# files fix karo
git add <files>
git rebase --continue       # next commit replay karo
```

| Command | Kaam |
|---|---|
| `git rebase --continue` | Fix karke aage badho |
| `git rebase --abort` | Cancel, rebase se pehle wali state |
| `git rebase --skip` | Current commit skip |

- Merge conflict: `git add` → `git commit`. Rebase conflict: `git add` → `git rebase --continue`.

### Rebase me conflicts baar-baar kyun aa sakte hain?

- **Merge** = ek hi three-way merge (base vs main tip vs feature tip) → conflict aaya toh **max ek baar** resolve, ek merge commit.
- **Rebase** = feature ke commits **ek-ek karke** naye base pe replay hote hain → **har commit** apna alag mini-merge hai.

```text
A ── B ── C ── F          main
      \
       D ── E             feature (2 commits)

Rebase:  F + D  → conflict?  resolve → D'
         D' + E → conflict?  resolve → E'
```

- Agar `D` aur `E` dono ne wahi line chhui jo `F` ne badli, toh `D` replay pe conflict, phir `E` replay pe **dobara** conflict → `--continue` har baar.
- Isliye 10 commits wali branch pe rebase me 10 baar `add` + `--continue` ka cycle chal sakta hai; merge me wahi sab ek baar me nipat jaata.

## `git pull --rebase`

```text
Plain git pull (merge):          git pull --rebase:
       D                          A ── B ── C ── D'
      / \
A ── B ── C ── M
```

- Personal feature branches pe prefer — bekaar merge commits nahi bante.

## Kyun prefer hota hai

```text
      /───●──●───\
 ●───●             ●──●──\
      \──●──●───/          \
          \────●────────────●
```

- Hazaar merges ke baad aisa graph vs `A ── B ── C ── D ── E ── F' ── G' ── H'`.
- `git log`, `git bisect`, debugging easy. Par inherently "better" nahi — workflow choice.

## Danger — shared history rewrite

- Tumne `D` push kiya, teammate ne pull kiya; tumne rebase kiya → tum `D'`, wo `D`. Code same, Git ke liye alag → sync painful.

> **Golden rule:** Jo commits doosre use kar rahe hain (main, release, shared feature) unhe rebase mat karo.

## Rebase vs Reset

| | Reset | Rebase |
|---|---|---|
| Kaam | Branch pointer move | Commits naye base pe recreate |
| Naye commits? | Nahi | Haan (`D'`, `E'`) |

## Interactive rebase

```bash
git rebase -i B     # B ke baad ke saare commits ki list khulegi
```

- `pick` / `squash` / `reword` / `drop` — push se pehle local cleanup.

## Interview lines

- **Why rebase:** clean linear history, unnecessary merge commits avoid. Private branches pe; shared pe careful (history rewrite).
- **Feature main se peeche hai:**

```bash
git checkout feature
git fetch origin
git rebase origin/main
# conflicts → git add . && git rebase --continue
git checkout main
git merge feature      # usually fast-forward
```

- **Kaunsi branch rewrite hoti hai:** current (checked out); `rebase` ke baad ka naam = naya base.
