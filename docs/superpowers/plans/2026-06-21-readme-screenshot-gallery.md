# README Screenshot Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a polished, compact product screenshot gallery to the root README.

**Architecture:** Keep static PNG assets in `docs/screenshots/` and reference them from the root README using GitHub-compatible HTML. Use one full-width homepage preview followed by a two-column gallery for key public pages.

**Tech Stack:** Markdown, GitHub-flavored HTML, PNG assets

---

### Task 1: Validate screenshot assets

**Files:**
- Validate: `docs/screenshots/01_home.png`
- Validate: `docs/screenshots/02_login.png`
- Validate: `docs/screenshots/03_clubs.png`
- Validate: `docs/screenshots/04_events.png`
- Validate: `docs/screenshots/05_forum.png`
- Validate: `docs/screenshots/06_faculty.png`
- Validate: `docs/screenshots/07_announcements.png`
- Validate: `docs/screenshots/08_resources.png`

- [ ] **Step 1: Confirm all required files are present and non-empty**

Run:

```bash
for file in docs/screenshots/{01_home,02_login,03_clubs,04_events,05_forum,06_faculty,07_announcements,08_resources}.png; do test -s "$file" || exit 1; done
```

Expected: exit code `0` with no output.

- [ ] **Step 2: Visually inspect every image**

Open each PNG and confirm that it uses the same desktop viewport, has no browser chrome or personal information, and shows a stable loaded state.

### Task 2: Add the README gallery

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a Screenshots section after Key Features**

Add a full-width `01_home.png` preview and a two-column HTML table containing Login, Clubs, Events, Forum, Faculty Directory, Announcements, and Study Resources. Use descriptive `alt` text and width attributes that render cleanly on GitHub.

- [ ] **Step 2: Validate every README image reference**

Run:

```bash
rg -o 'docs/screenshots/[A-Za-z0-9_-]+\.png' README.md | while read -r file; do test -s "$file" || exit 1; done
```

Expected: exit code `0` with no output.

- [ ] **Step 3: Review the focused diff**

Run:

```bash
git diff -- README.md
```

Expected: only the new screenshot gallery is shown.

### Task 3: Final verification

**Files:**
- Verify: `README.md`
- Verify: `docs/screenshots/*.png`

- [ ] **Step 1: Check gallery structure and file inventory**

Run:

```bash
rg -n '^## Screenshots|docs/screenshots/' README.md
find docs/screenshots -maxdepth 1 -type f -name '*.png' -size +0c | sort
```

Expected: one Screenshots heading, eight README image references, and all eight required PNG files.

- [ ] **Step 2: Confirm unrelated changes were not modified**

Run:

```bash
git status --short -- README.md docs/screenshots docs/superpowers/plans/2026-06-21-readme-screenshot-gallery.md
```

Expected: only the scoped README, screenshot assets, and implementation plan appear.
