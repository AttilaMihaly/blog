# Repo notes (for future sessions)

Working notes on how this repo is actually built, as of implementing
[AUTOMATION_PLAN.md](AUTOMATION_PLAN.md). Read that file for the design
rationale; this file is the "what's actually true right now" companion —
update it when things drift, don't let it go stale.

## Stack

Astro 6 (static output), React 19 islands, MDX, Tailwind v4, Giscus comments
(GitHub Discussions), Cloudflare Pages, GitHub Actions. `site` in
`astro.config.mjs` is `https://attilamihaly.dev` — needed for RSS/sitemap/OG
absolute URLs; if the real domain ever changes, update it there.

## Content pipeline

`authoring/<NN>-<slug>/article.md` is hand-written; `npm run publish -- <slug>`
projects it into `src/content/blog/<slug>.md(x)`. The contract lives in
[scripts/frontmatter.ts](../scripts/frontmatter.ts) (draft schema, post schema,
the `toPost()` projection); the CLI logic is in
[scripts/publish.ts](../scripts/publish.ts).

Draft frontmatter shape:
```yaml
---
title: "..."
description: "..."
dek: "..."      # optional, defaults to description
kicker: "..."   # optional, defaults to "Essay"
tags: ["..."]
status: draft | ready
---
```
`pubDate`, `tokens`, `readTime`, and `issue` are **not** authored — they're
computed at publish time (see AUTOMATION_PLAN.md's "Decided" notes on why).

Commands:
- `npm run publish -- <slug>` — publish (or re-publish; idempotent — reuses the
  existing `pubDate`/`issue` if the file already exists, always recomputes
  `tokens`/`readTime`).
- `npm run publish -- <slug> --check` — dry-run diff, no write. Exit 1 on drift.
- `npm run publish -- --check` — check every authoring dir with a matching
  published file.
- `npm run publish -- --backfill` — recompute `tokens`/`readTime` for every
  post in `src/content/blog/`, in place.
- `npm run check` — content lint (`scripts/check.ts`): schema validity, no
  leaked `draft`/`status` keys, no unresolved NOTES/TODO/TK, issue numbers
  unique & contiguous, image/internal-link references resolve.

### Known limitation: `who-owns-your-knowledge`

The published `.mdx` has two hand-added Astro components
(`<ScaleFigure />`, `<DecisionTable />`) that replaced placeholder text
(`*(See: scale visualization)*`) during editorial polish. Its authoring draft
(`authoring/01-who-owns-your-knowledge/article.md`) was never updated to
match — this is exactly the Stage 5 "flag figures that should become
components" step, done once by hand, pre-automation.

**Do not run `npm run publish -- who-owns-your-knowledge`** — the draft has no
JSX, so it projects to a `.md` file and would blow away the components and the
`.mdx` extension. `npm run publish -- --check` correctly reports this as
`DRIFT` (not "new") — that's expected and not a bug to fix; it's a real
standing divergence until someone reconciles the draft with the components. Use
`--backfill` for this post (tokens/readTime only, safe) instead of a full
publish.

### Two authoring frontmatter eras

`authoring/archive/*.md` (18 posts, 2010–2019) predates the draft contract
entirely — no `status` field, imported as-is originally. They're already fully
migrated into `src/content/blog/` by hand; the publish pipeline doesn't touch
them (no matching `authoring/<NN>-slug/` dir), only `--backfill` recomputes
their `tokens`/`readTime`. Frontmatter field order across all posts is now
canonicalized to `title, description, dek, kicker, pubDate, tokens, readTime,
issue, tags` (`scripts/publish.ts`'s `FIELD_ORDER`) — archive posts originally
had `pubDate` before `kicker`; that got reordered by the first `--backfill` run
as a harmless side effect.

## CI

- `.github/workflows/content.yml` — PR: `npm run check` + `npm run build`.
- `.github/workflows/preview.yml` — PR: build, deploy a Cloudflare Pages branch
  preview via `cloudflare/wrangler-action@v4`, comment/update the preview URL
  on the PR.
- `.github/workflows/deploy.yml` — push to `main`: `npm run check` + build +
  deploy via `cloudflare/wrangler-action@v4` (migrated off the deprecated
  `cloudflare/pages-action@v1`).

All three need `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secrets (same
ones the old `deploy.yml` used). **Branch protection on `main` has not been
configured** — that's a GitHub repo setting (Settings → Branches), not
something in this repo's files. Set it up so `main` can't be pushed to
directly, to make the PR-gate in the plan actually load-bearing.

## Skills

`.claude/skills/publish/SKILL.md` and `.claude/skills/draft/SKILL.md` — the
judgment layer around the scripts (voice check against `STYLE_GUIDE.md`,
walking the NOTES block, proposing metadata, flagging figure→component
candidates). Invoked as `/publish <slug>` / `/draft <topic>`.

## OG images

`src/pages/open-graph/[...route].ts` uses `astro-og-canvas` to render a PNG
per post at build time, linked from `og:image`/`twitter:image` meta tags in
`BlogPost.astro`. It fetches a font from `api.fontsource.org` during the
build — needs network access, which GitHub Actions runners have by default. If
that ever becomes a problem (offline builds, rate limits), pin a local font
file instead of the default remote fetch.

## Housekeeping still pending

- `.claude/worktrees/lucid-bardeen-aad09d/` — detached from git
  (`git worktree remove` ran successfully) but the directory itself couldn't be
  deleted from this sandboxed session (permission denied on `rm -rf`, blocked
  by the auto-mode classifier as a bulk delete). It's harmless and now
  gitignored (`.claude/worktrees/` added to `.gitignore`); delete it manually
  when convenient.
- Original archive posts had CRLF line endings after their frontmatter block;
  `scripts/publish.ts` normalizes to LF on every write (`normalizeBody()`), so
  this self-heals as posts get touched by the pipeline.
