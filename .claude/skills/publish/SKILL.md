---
name: publish
description: Take a draft in authoring/<NN>-<slug>/ from "ready to review" to an open PR with a Cloudflare preview URL. Use when the user says "/publish <slug>", asks to publish a post, or asks to ship a draft that's sitting in authoring/.
---

# Publish

Turns an `authoring/<NN>-<slug>/article.md` draft into a reviewed PR. This is the
judgment layer around `scripts/publish.ts` — the script does the mechanical
frontmatter projection; this skill does the parts that need a reader.

Takes one argument: a slug or authoring sequence number (e.g. `bottleneck-was-never-the-code`
or `02`). Resolve it the same way `npm run publish` does — match against
`authoring/<NN>-<slug>/`.

## Steps

1. **Voice check.** Read `authoring/STYLE_GUIDE.md` and the draft's body. Flag any
   passage that reads as generic AI prose rather than the author's voice (see the
   style guide's "Word Patterns → Avoided" and "What Generated Posts Should Do"
   sections). Report drift; don't silently rewrite it.

2. **Walk the NOTES block.** If `article.md` has a `<!-- NOTES BEFORE PUBLISHING -->`
   block, go through every item in it — "Fill in", "Verify", and "Decide" entries
   alike. For each: is it resolved in the current body, or still open?
   **Refuse to proceed while any item is open.** Tell the user exactly which
   items are unresolved and why publishing is blocked. This is the check
   `scripts/publish.ts` cannot make — it only greps for literal `TODO`/`TK`
   markers in the body, not whether a "Decide: whether to name X" note has
   actually been decided.

3. **Propose metadata.** If the draft frontmatter is missing `dek`, `kicker`, or
   `tags`, propose values (`dek` usually mirrors `description` unless a sharper
   line exists in the body; `kicker` defaults to `"Essay"`; `tags` should be a
   short list of real topics, not padding). Show the proposal and get the
   author's approval before writing it into `article.md`.

4. **Flag figure candidates.** Look for raw HTML embeds, ASCII diagrams, or body
   text like `(See: ...)` placeholders that should become an Astro component
   under `src/components/` instead (this is what turned
   `01/scale-visualization.html` into `ScaleFigure.astro`). This is a judgment
   call — surface it, propose a component name and shape, and only build it with
   the author's go-ahead. Don't invent a component for something that reads fine
   as prose.

5. **Confirm `status: ready`.** Once 1–4 are clear, set `status: ready` in the
   draft frontmatter if it isn't already.

6. **Run the pipeline:**
   ```
   npm run publish -- <slug>
   npm run check
   npm run build
   ```
   Fix anything that fails before continuing. `npm run publish -- <slug> --check`
   is useful if you want to preview the projected diff before writing.

7. **Branch, commit, open a PR.** This pushes to the remote and opens a PR —
   confirm with the author before doing it (standard practice for anything that
   becomes visible to others). Once confirmed:
   - Create a branch (e.g. `publish/<slug>`).
   - Commit the published post, the `authoring/README.md` update, and any image
     files moved into `public/images/<slug>/`.
   - Push and `gh pr create`. `preview.yml` will comment the Cloudflare branch
     preview URL on the PR once CI runs.

8. **Stop.** Report the PR URL. Merging is the author's call — this skill does
   not merge or push to `main`.
