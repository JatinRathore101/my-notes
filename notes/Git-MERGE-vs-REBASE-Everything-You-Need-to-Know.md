# Git MERGE vs REBASE: Everything You Need to Know

- **Topic:** GIT
- **Video:** [Git MERGE vs REBASE: Everything You Need to Know](https://www.youtube.com/watch?v=0chZFIZLR_0)
- **Date:** 20 Sep 2026

## Kya hai ye? (What & Why)

- Multiple branches wale project me do sawal baar baar aate hain:
  1. Feature branch ko **main ke saath up-to-date** kaise rakhein?
  2. Feature ready hone ke baad usse **main me wapas kaise laayein**?
- Dono sawalon ke teen jawab hain — `git merge`, `git rebase`, aur **squash commits**.
- Teeno ka kaam same hai (changes combine karna), farq sirf **commit history kaisi dikhegi** uska hai.

## Setup — Example Scenario

- `main` se ek naya **feature branch** banaya.
- Feature branch pe commits **A, B, C** add hue.
- Usi time `main` pe commits **D, E** add ho gaye.
- Soch lo ek ped ki do shaakhein alag-alag direction me badh rahi hain.

```text
main:     ... ──● ──● D ──● E
                 \
feature:          ● A ──● B ──● C
```

## Part 1 — Feature branch ko main ke saath sync karna

| Command | Kya karta hai | History kaisi dikhti hai |
|---------|---------------|--------------------------|
| `git merge` | `main` ke latest changes feature branch me kheench laata hai, aur ek naya **merge commit** banata hai | Do branches ko ek **knot** (gaanth) se baandh diya — history me extra commit dikhta hai |
| `git rebase` | Feature branch ka **base badal deta hai** — main ke latest commit pe le jaata hai, phir apne commits (A, B, C) uske upar dobara **replay** karta hai | Clean, seedhi (linear) history — koi extra merge commit nahi |

- Rebase ke baad A, B, C technically **naye commits** ban jaate hain (base badal gaya, isliye replay hua).
- Bahut log rebase prefer karte hain kyunki history straightforward rehti hai.

## Part 2 — Feature ko wapas main me laana (3 options)

### 1. Git Merge

- Git ek naya **merge commit** banata hai jo dono branches ki history ko jodta hai.
- Rope me ek gaanth jaisa — clearly dikhta hai ki branches kahan mili.
- ❌ Baar-baar aisa karo toh bahut saari gaanthein ban jaati hain → history messy ho jaati hai.

### 2. Git Rebase + Fast-Forward Merge

- Pehle `git rebase` se feature branch ke changes ko **main ke tip pe** move karo.
- Phir **fast-forward merge** kar do (koi merge commit nahi banta).
- Rope ko seedha kheench ke ek hi line me kar diya — poori history **linear**.

### 3. Squash Commits

- Feature branch ke **saare commits dab ke ek single commit** ban jaate hain, jo main me merge hota hai.
- Main ki history linear rehti hai (rebase jaisi), saath me ek single merge commit bhi banta hai.
- ❌ Main ki history me individual feature commits ki **fine details khatam** ho jaati hain.
- ✅ GitHub jaise platforms pe ye popular strategy hai — main saaf rehta hai, aur **detailed commit history feature branch me preserve** rehti hai.
- Isliye ise **hybrid approach** bolte hain.

## Summary Table

| Strategy | Main branch ki history | Detail preserve hoti hai? | Kab use karein |
|----------|------------------------|---------------------------|----------------|
| `git merge` | Merge commits ke saath, branch evolution poora dikhta hai | ✅ Haan, poori | Jab team ko **complete picture** chahiye — kaun si branch kab mili |
| `git rebase` (+ FF merge) | Bilkul linear, saaf | ✅ Individual commits rehte hain (naye hashes ke saath) | Jab **clean, linear history** chahiye |
| Squash commits | Linear, ek feature = ek commit | ❌ Main me nahi (feature branch me rehti hai) | Jab clean history chahiye aur main me granular commits ki parwah nahi |

## Kab kya choose karein

- Team ko **branch evolution ka complete picture** chahiye → `git merge`.
- Team ko **tidy, linear history** chahiye → `git rebase`.
- Team clean history chahti hai aur main me individual commits ka detail khone se dikkat nahi → **squash**.

> Koi **one-size-fits-all** answer nahi hai. Pros-cons tolo aur decide karo ki team ke liye kaunsa workflow sabse zyada sense banata hai.
