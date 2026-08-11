# Authoring → Deploy Automation Plan

## 1. What the manual step actually is

Diffing `authoring/02-bottleneck-was-never-the-code/article.md` against
`src/content/blog/bottleneck-was-never-the-code.md` gives the exact publish transform.
It is small and fully mechanical:

| Change | Kind |
|---|---|
| `pubDate: 2026-08-08` → `pubDate: "2026-08-08"` | quote coercion |
| `tags: [...]` dropped | field not in site schema |
| `draft: true` dropped | field not in site schema |
| `dek` added (copy of `description`) | derived / authored |
| `kicker: "Essay"` added | constant for new posts |
| `tokens: "2,501"` added | computed |
| `readTime: "9 min"` added | computed |
| `issue: "029"` added | max(existing)+1 |
| 22-line `<!-- NOTES BEFORE PUBLISHING -->` block stripped | mechanical |
| directory `02-<slug>` → file `<slug>.md` | mechanical |

Body prose: **byte-identical**. So the transform is a pure function from draft
frontmatter + body to post frontmatter + body, with three authored inputs
(`description`, `dek`, `kicker`) and everything else derived.

## 2. Findings beyond the copy step

**The frontmatter mismatch is why `/topics` cannot exist.** `tags` is the only
classification data the author writes, and it is discarded at the boundary. The
masthead links `/topics`, `/colophon`, `/about`, `/feed.xml` — none of these routes
exist (`src/pages/` has only `index.astro`, `archive.astro`, `blog/[slug].astro`).
Four 404s on every page. `archive.astro` also ships three dead filter tabs
("By topic", "By kind", "By token count", all `href="#"`) that are dead for the same
reason, plus an "Earlier years · writing in progress" stub for posts that are already
migrated and already listed above it.

**The token counts are not computed from anything.** `bottleneck` = 13,227 chars /
"2,501 tokens" = 5.3 chars/token. `who-owns-your-knowledge` = 8,673 chars /
"4,212 tokens" = 2.1 chars/token. Two different implicit ratios, so
`archive.astro`'s "Total: N tokens read" figure is currently decorative. Same for
`readTime` (1,329 words billed as "11 min").

**The archive is stored twice.** All 18 posts exist in both `authoring/archive/` and
`src/content/blog/`, differing only in frontmatter (`# Title` + `*date*` heading
becomes YAML with `kicker: "Archive"`). Images live in `authoring/archive/images/` and
`public/images/archive/`.

**Untracked drift already happened.** `authoring/bottleneck-was-never-the-code.md` and
`authoring/bottleneck-was-never-the-code_1.md` are two older full copies of the
`02/article.md` draft sitting loose at the authoring root — output from a prior
worktree session that was never cleaned up. `.claude/worktrees/lucid-bardeen-aad09d/`
is a complete second checkout, including `node_modules/`, and is not gitignored.

**`authoring/CLAUDE.md` points at a directory that does not exist.** It instructs
creating topic directories under `context/blog/`; the real location is `authoring/`.

**No gate before production.** `deploy.yml` triggers only on `push` to `main` and
builds + deploys in one job. A frontmatter error fails the deploy after the fact, and
there is no way to look at a post rendered before it is public. There is also no
draft mechanism on the site side — `draft: true` is not in the schema, so anything in
`src/content/blog/` is live.

**`cloudflare/pages-action@v1` is superseded** by `cloudflare/wrangler-action` running
`wrangler pages deploy`. Verify current guidance before changing it, but the v1 action
is no longer the maintained path.

## 3. The design fork

**Option A — transform pipeline (recommended).** `authoring/` stays the source of
truth for drafting; a script projects a draft into `src/content/blog/`. Two copies
exist, but a `--check` mode makes divergence detectable instead of silent.

**Option B — Astro reads `authoring/` directly.** A second `glob()` loader over
`authoring/*/article.md` with a `draft` filter. Zero copies; publishing is flipping a
boolean. Rejected because: MDX component imports would need `../../src/components/…`
paths reaching out of the authoring tree; the 18 archive posts still need their own
handling; post-publish typo fixes get entangled with draft history; and the site build
becomes coupled to authoring folder conventions.

Option A with a drift check gets most of B's guarantee without the coupling.

## 4. Pipeline

### Stage 0 — hygiene (prerequisite, ~15 min)

- Add `.claude/worktrees/` to `.gitignore`; remove the existing worktree.
- Delete `authoring/bottleneck-was-never-the-code.md` and `…_1.md` after confirming
  `02/article.md` is the newest (it is — 2026-08-10 vs 2026-08-08).
- Fix `authoring/CLAUDE.md`: `context/blog/` → `authoring/`.

### Stage 1 — one frontmatter contract

`scripts/frontmatter.ts` holds two zod schemas and the total function between them:

```ts
type DraftFrontmatter = {          // authored by hand in authoring/
  title: string
  description: string
  dek?: string                     // defaults to description
  kicker?: string                  // defaults to "Essay"
  tags: string[]
  status: 'draft' | 'ready'
}

type PostFrontmatter = {           // what src/content.config.ts accepts
  title, description, dek, kicker, pubDate, tokens, readTime, issue, tags
}

toPost(draft: DraftFrontmatter, body: string, ctx: PublishContext): PostFrontmatter
```

**Decided: `pubDate`, `tokens`, `readTime`, and `issue` move out of the draft
entirely** — they are publish-time facts, not authoring facts. (Today `pubDate` is
hand-typed into the draft, which is why `02/article.md` says `2026-08-08` regardless of
when it actually ships.) Accepted consequence: a draft in progress carries no date, and
`02/article.md` loses its `pubDate` line when it is migrated to the new contract.

Add `tags: z.array(z.string()).default([])` to `src/content.config.ts` so the field
survives the boundary — that unblocks `/topics` and the archive filter tabs.

### Stage 2 — `npm run publish -- <slug>`

Node script, one new dep (`gray-matter`), plus `gpt-tokenizer` for real token counts.

1. Resolve `authoring/<NN>-<slug>/` from a slug or sequence number.
2. Parse frontmatter + body; fail if `status !== 'ready'`.
3. Fail if any `<!-- NOTES … -->` block, `TODO`, or `TK` remains in the body.
4. Strip the notes block and the trailing `---` separator it leaves behind.
5. `readTime = ceil(words / 233) + " min"`; `tokens = encode(body).length`,
   thousands-separated. **Decided: backfill.** Recompute `tokens` and `readTime` for
   `bottleneck-was-never-the-code.md` and `who-owns-your-knowledge.mdx` with the same
   estimator, so every number on the site comes from one rule and the archive total is
   real. This edits two already-published posts; the visible change is the token chip
   and read time on the homepage, archive, and post pages.

   **Decided: the 18 archive posts get backfilled too.** They currently carry neither
   field, so this adds a token chip and a read time to every archive entry on
   `/archive` and on each archive post page, and makes the archive total cover the whole
   corpus rather than two essays. Implemented as a `--backfill` mode that walks
   `src/content/blog/**`, recomputes both fields from the one estimator, and rewrites
   them in place — idempotent, and re-runnable if the estimator ever changes.
6. `issue = max(existing issue numbers) + 1`, zero-padded to 3 → `"030"`.
7. `pubDate = today` unless `--date` is passed.
8. Extension: `.mdx` if the body contains JSX tags or `import` statements, else `.md`.
9. Copy `authoring/<NN>-<slug>/images/**` → `public/images/<slug>/`, rewriting
   relative image links to absolute `/images/<slug>/…` (same convention the archive
   already uses).
10. Write `src/content/blog/<slug>.md(x)`.
11. Move the topic from **In progress** to **Completed** in `authoring/README.md` with
    the publish date and link.
12. Print the resulting frontmatter and a body diff summary.

Re-running is idempotent: it rewrites the published file, so post-publish corrections
flow from `authoring/` rather than diverging.

`npm run publish -- <slug> --check` recomputes the projection and diffs it against the
file on disk without writing — the drift detector. Runs in CI over every published post
that still has a matching authoring directory.

### Stage 3 — `npm run check` (content lint)

Runs before build, locally and in CI:

- every post validates against the site schema (fails earlier than `astro build`)
- `issue` values unique and contiguous
- no `<!-- NOTES` / `TODO` / `TK` in `src/content/blog/`
- image references resolve to files under `public/`
- internal `/blog/<slug>` links resolve to real entries
- no authoring-only keys (`draft`, `status`) leaked into a post

### Stage 4 — CI gates

**Decided: the human gate is the PR merge.** `/publish` never pushes to `main`. It
opens a branch and a PR, CI runs the content checks, Cloudflare deploys a branch
preview, and the author reviews the rendered post before merging. Nothing reaches
production unseen.

Split `deploy.yml`:

- **`content.yml`** on `pull_request`: `npm ci`, `npm run check`, `npm run build`.
- **`preview.yml`** on `pull_request`: deploy the branch to Cloudflare Pages (branch
  deploys produce a preview URL) and comment the URL on the PR. This is the
  "see it before it's live" step that does not exist today.
- **`deploy.yml`** on `push` to `main`: unchanged behaviour, but gated behind
  `npm run check`. Consider migrating `cloudflare/pages-action@v1` →
  `cloudflare/wrangler-action`.

Branch protection on `main` so publishing always goes through a PR.

### Stage 5 — `/publish` skill (the judgment layer)

A Claude Code skill in `.claude/skills/publish/` for what the script cannot decide:

1. Read `STYLE_GUIDE.md` and the draft; flag voice drift.
2. Walk the `NOTES BEFORE PUBLISHING` block item by item — the block in `02/article.md`
   contains real unresolved decisions ("whether to name Morgan Stanley", "correct
   public link for Substrate") and fact-check items. Refuse to proceed while any
   remain open.
3. Propose `description`, `dek`, `kicker`, `tags`; the author approves.
4. Flag figures that should become Astro components rather than raw HTML — this is what
   turned `01/scale-visualization.html` into `ScaleFigure.astro`, and it is the one
   step that genuinely cannot be scripted.
5. Run `publish`, `check`, `build`.
6. Branch, commit, `gh pr create`, surface the preview URL.
7. Stop. The author merges; Cloudflare deploys.

A companion `/draft <topic>` skill handles the front of the pipeline: move the topic
from Backlog to In progress in `README.md`, create `authoring/<NN>-<slug>/article.md`
with a valid draft frontmatter stub. That is currently prose instructions in
`authoring/CLAUDE.md` that an agent has to interpret each time.

### Stage 6 — derived surfaces (unblocked by Stage 1)

- `src/pages/topics.astro` built from `tags` — fixes the masthead 404 and the dead
  archive filter tabs.
- `src/pages/feed.xml.ts` via `@astrojs/rss` — the masthead already links `/feed.xml`.
- `@astrojs/sitemap`.
- `src/pages/about.astro`, `src/pages/colophon.astro` — remaining masthead 404s.
- Remove the "Earlier years · writing in progress" stub from `archive.astro`; the
  migration it describes is done.
- Per-post OG images generated at build time.

## 5. Order of work

1. Stage 0 (hygiene) — independent, do first.
2. Stage 1 + 2 (contract + publish script) — the core; verify by regenerating
   `bottleneck-was-never-the-code.md` and confirming a byte-identical result.
3. Stage 3 + 4 (checks + CI gates).
4. Stage 5 (skills).
5. Stage 6 (pages) — independent of everything above once `tags` flows through.

Steps 1–3 are the automation the question was about. Steps 4–6 are what makes it safe
to run unattended.
