# Git Tutorial — Learning Notes

A running record of everything covered while building this website
(`ivijayyadav.github.io`), in the order it was learned, followed by quick-reference
command tables. This site is a GitHub Pages **user site**, so whatever lands on the
`main` branch is published live at <https://ivijayyadav.github.io> — every push has a
visible consequence.

---

## The mental model (keep this in your head)

Git moves your work through **four places**. Almost every command is just moving files
between them:

```
  Working Directory  →   Staging Area   →   Local Repo   →   Remote (GitHub)
  (files you edit)       (git add)          (git commit)      (git push)
        ↑___________________ git clone / git pull ______________________|
```

- **Working directory** — the real files on disk that you edit.
- **Staging area** ("index") — a holding zone where you *choose* exactly what goes into
  the next snapshot.
- **Local repository** — the permanent history of snapshots (commits) on your machine
  (lives in the hidden `.git/` folder).
- **Remote** (`origin`) — the copy on GitHub. For this repo, `main` there *is* the live site.

---

## Module 0 — Environment, SSH & the first clone

**Goal:** get the repo onto the machine and learn to read its state.

1. **SSH authentication.** GitHub identifies you via an SSH key instead of a password.
   We tested it with `ssh -T git@github.com`.
   - Hit `Permission denied (publickey)` — the classic first-timer error. It means GitHub
     rejected every key offered, i.e. the key wasn't registered on the account.
   - Debugged with `ssh -vT git@github.com` (verbose) to see which keys were offered.
   - Fixed by copying the **public** key (`pbcopy < ~/.ssh/id_ed25519.pub`) and adding it at
     GitHub → Settings → SSH and GPG keys. Loaded it into the agent with
     `ssh-add --apple-use-keychain ~/.ssh/id_ed25519`.
   - Success message: `Hi <user>! You've successfully authenticated…`
2. **Cloned** the repo into the current empty folder: `git clone <url> .` (the trailing `.`
   means "into this directory, don't make a sub-folder"). Clone downloads the whole project
   **and its full history**, sets up the hidden `.git/`, and records GitHub as the remote
   named `origin`.
3. **Toured the repo state:** `git status`, `git log --oneline`, `git remote -v`, `git branch`.
4. **First commit:** created `.gitignore` (keeps junk like `.DS_Store` out of history) and
   `.nojekyll` (tells GitHub Pages to serve our plain HTML as-is), then ran the full loop:
   `git add` → `git commit -m` → `git push`.

> **Commit identity:** commits are stamped with `user.name` / `user.email`. GitHub links a
> commit to your profile only if that email is verified on your account.

---

## Module 1 — Home page & the core commit loop

**Goal:** build the homepage and master reviewing changes before committing.

- Rebuilt `index.html` and added `assets/css/styles.css`, `assets/js/main.js`.
- Learned to **read changes before committing** — the habit that catches mistakes:
  - `git diff` — shows un-staged changes to **tracked** files.
  - `git diff --staged` — shows what's actually queued for the next commit (including
    **new** files, which plain `git diff` does *not* show).
- Reading a diff: `---`/`+++` mark old/new versions, `@@ … @@` is a "hunk" location header,
  lines starting `-` were removed, `+` were added.
- **Real payoff:** `git diff` caught an unclosed `<p>` tag before it went live.
- **Commit message conventions:** imperative mood ("Add…", "Fix…"), ≤ ~50 chars, be specific.

---

## Module 2 — Branching

**Goal:** do work safely without touching the live `main` branch.

- A **branch** is a parallel workspace that starts as a copy of `main`. You commit freely on
  it; `main` doesn't change until you merge.

```
main:      A───B───C          ← live site (stays safe)
                    \
feature:             D───E     ← build & commit here
```

- `git switch -c feature/publications` — **c**reate and switch to a new branch.
- `git branch` — list branches (`*` marks the current one).
- **Branch isolation, proven:** after `git switch main`, the branch's new file *disappeared*
  from the folder and its commit was absent from `main`'s log — your files transform to match
  whichever branch you're on.
- `git merge feature/publications` — brought the work into `main`. Because `main` had no new
  commits, it was a **fast-forward** (git just slides `main`'s pointer up to the branch tip;
  no separate merge commit).
- `git branch -d feature/publications` — deleted the merged branch. `-d` refuses to delete a
  branch with unmerged commits (a safety net); `-D` forces it.

---

## Module 3 — The CV page & git's undo tools

**Goal:** build the CV page and learn the safety net so mistakes stop being scary.

- `git add .` — stage **all** changes below the current directory (then always `git status`
  to confirm what you grabbed).
- `git restore --staged <file>` — **un-stage** a file (pull it out of the next commit). The
  file's contents are untouched — you only changed git's *plan*.
- `git commit --amend` — **rewrite the last commit**. We committed the CV page but forgot
  `cv.pdf`, then `git add cv.pdf` + `git commit --amend --no-edit` folded it in.
  - ⚠️ Amend *replaces* the commit (new hash). Safe **only before pushing**.
    **Rule: amend freely before pushing, never after.**
- `git restore <file>` — **discard** un-staged edits, reverting the file to its last commit.
  ⚠️ This is the one undo that itself destroys work — there's no undo for it.
- **Binary files:** git shows them as `Bin 0 -> 196340 bytes` (no line diff possible).

### After Module 3 — a judgment call
Filling the site with real content (homepage, publications, CV) was **content polish, not a
risky feature**, so it was committed **directly to `main`**. Rule of thumb: *small content
updates on a solo site → `main` is fine; features/experiments → a branch (and, on a team, a
Pull Request).*

---

## Gotchas learned along the way

- **GitHub Pages build delay + cached 404.** After a push, Pages takes ~1 minute to rebuild.
  If you request a brand-new URL *before* it deploys, the CDN can **cache the 404** for a
  while. A fresh query string (`?v=123`) uses a new cache key and dodges it.
- **Stale CSS / flash-of-unstyled-content.** A browser may serve an *old* cached `styles.css`.
  If a CSS rule that sizes an inline SVG is missing from the cached file, that icon balloons to
  full size. Fixes: hard refresh (`Cmd+Shift+R`) and/or put explicit `width`/`height` on the
  SVG so it's constrained regardless of CSS.

---

## Command reference tables

### 1. Setup, identity & SSH

| Command | Example | What it does |
|---|---|---|
| `git --version` | `git --version` | Show installed git version |
| `git config --global user.name` | `git config --global user.name "Vijay Yadav"` | Set the name stamped on commits |
| `git config --global user.email` | `git config --global user.email "you@example.com"` | Set the email stamped on commits |
| `ssh -T git@github.com` | `ssh -T git@github.com` | Test SSH authentication to GitHub |
| `ssh -vT git@github.com` | `ssh -vT git@github.com` | Verbose test — shows which keys are offered (debugging) |
| `pbcopy < file` | `pbcopy < ~/.ssh/id_ed25519.pub` | (macOS) copy the public key to the clipboard |
| `ssh-add` | `ssh-add --apple-use-keychain ~/.ssh/id_ed25519` | Load a key into the ssh-agent / macOS keychain |

### 2. Getting & inspecting a repo

| Command | Example | What it does |
|---|---|---|
| `git clone <url>` | `git clone git@github.com:ivijayyadav/ivijayyadav.github.io.git` | Copy a remote repo (+ full history) into a new folder |
| `git clone <url> .` | `git clone git@github.com:…/repo.git .` | Clone into the **current** (empty) directory |
| `git status` | `git status` | Show what's changed, staged, and which branch you're on |
| `git status -sb` | `git status -sb` | Short one-line status + branch/tracking info |
| `git log --oneline` | `git log --oneline -5` | Compact commit history (last 5) |
| `git remote -v` | `git remote -v` | Show remotes (where fetch/push go) |
| `git show --stat HEAD` | `git show --stat --oneline HEAD` | Show the last commit's message + files changed |

### 3. The core loop (working → staged → committed → pushed)

| Command | Example | What it does |
|---|---|---|
| `git add <file>` | `git add index.html` | Stage a specific file for the next commit |
| `git add <dir>` | `git add assets` | Stage everything under a folder |
| `git add .` | `git add .` | Stage **all** changes below the current directory |
| `git commit -m "msg"` | `git commit -m "Add publications page"` | Snapshot the staged changes with a message |
| `git push` | `git push` | Send local commits to `origin` (publishes the site) |

### 4. Reviewing changes

| Command | Example | What it does |
|---|---|---|
| `git diff` | `git diff` | Un-staged changes to tracked files (working ↔ staging) |
| `git diff <file>` | `git diff index.html` | Same, limited to one file |
| `git diff --staged` | `git diff --staged` | What's queued for the next commit (staging ↔ last commit) |

### 5. Branching & merging

| Command | Example | What it does |
|---|---|---|
| `git branch` | `git branch` | List branches (`*` = current) |
| `git switch -c <name>` | `git switch -c feature/cv` | Create a new branch and switch to it |
| `git switch <name>` | `git switch main` | Switch to an existing branch |
| `git merge <name>` | `git merge feature/cv` | Merge another branch into the current one |
| `git branch -d <name>` | `git branch -d feature/cv` | Delete a **merged** branch (safe; refuses if unmerged) |
| `git branch -D <name>` | `git branch -D feature/cv` | Force-delete a branch (even if unmerged) |

> Older equivalent: `git checkout -b <name>` = `git switch -c <name>`;
> `git checkout <name>` = `git switch <name>`. `switch` is the newer, clearer command.

### 6. Undoing & fixing things

| Command | Example | What it does | Reversible? |
|---|---|---|---|
| `git restore --staged <file>` | `git restore --staged cv.pdf` | Un-stage a file (keeps your edits) | ✅ edits kept |
| `git restore <file>` | `git restore README.md` | Discard un-staged edits (revert to last commit) | ⚠️ **no** |
| `git commit --amend` | `git commit --amend -m "Better message"` | Rewrite the last commit's message | before push only |
| `git commit --amend --no-edit` | `git add forgot.txt && git commit --amend --no-edit` | Add a forgotten file to the last commit, keep message | before push only |

---

## Everyday workflow cheat-sheet

```bash
# 1. Start a feature safely
git switch -c feature/my-change

# 2. Edit files, then review before committing
git status
git diff                       # what changed?
git add .                      # stage it
git diff --staged              # what will I commit?

# 3. Commit
git commit -m "Describe the change in the imperative mood"

# 4. Preview locally before publishing (this project)
python3 -m http.server 8000    # then open http://localhost:8000

# 5. Merge into main and publish
git switch main
git merge feature/my-change
git push
git branch -d feature/my-change
```

## Golden rules learned

1. **Look before you leap** — run `git status` / `git diff` constantly.
2. **`main` is the live site** — keep it deployable; build features on branches.
3. **Commit small and often** — committed work can always be recovered.
4. **Amend/rewrite only before pushing, never after** — it changes history others may have.
5. **`git restore <file>` is the one destructive undo** — pause before running it.
6. **Preview locally before you push** — never publish blind.

---

*Modules 4 (merge conflicts, `git fetch`/`pull`, `git stash`, `git tag`) and 5 (`git revert`,
`git log --graph`, aliases) will be added here as we cover them.*
