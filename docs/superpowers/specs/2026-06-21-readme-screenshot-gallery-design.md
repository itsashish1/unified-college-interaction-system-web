# README Screenshot Gallery Design

## Goal

Present the deployed CampusMate interface professionally in the root README using clear, consistent screenshots that help evaluators and contributors understand the product quickly.

## Scope

- Capture or validate the public Home, Login, Clubs, Events, Forum, Faculty, Notices, and Resources pages.
- Use a consistent desktop viewport and avoid browser chrome, personal information, loading states, or broken content.
- Store final PNG assets under `docs/screenshots/` with stable descriptive filenames.
- Add a `Screenshots` section to the root `README.md` after the feature overview and before detailed role/architecture documentation.

## Presentation

- Show the homepage as the primary full-width product preview.
- Present the remaining screens in a compact two-column HTML table.
- Give every image a concise title and useful alt text.
- Keep raw image dimensions large enough for detail while controlling rendered README width.

## Quality Checks

- Confirm every referenced image exists and opens correctly.
- Confirm all screenshots use the same viewport and contain complete, stable UI states.
- Check Markdown/HTML paths relative to the root README.
- Review the final diff without modifying unrelated worktree changes.

## Out of Scope

- UI redesign or application behavior changes.
- Authenticated screenshots requiring real user credentials.
- Modification or cleanup of unrelated browser-profile files already changed in the worktree.
