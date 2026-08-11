// The publish-time contract between authoring/ drafts and src/content/blog/ posts.
// Keep PostFrontmatterSchema in sync with the `blog` collection schema in
// src/content.config.ts by hand — this script runs outside the Astro content
// pipeline, so there is no way to share the zod schema directly.
import { z } from 'zod';

export const DEFAULT_KICKER = 'Essay';

export const DraftFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  dek: z.string().optional(),
  kicker: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'ready']),
});

export type DraftFrontmatter = z.infer<typeof DraftFrontmatterSchema>;

// pubDate is a plain YYYY-MM-DD string here (as it appears quoted in the
// published file); src/content.config.ts coerces it to a Date at build time.
export const PostFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  dek: z.string().optional(),
  kicker: z.string().optional(),
  pubDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'pubDate must be YYYY-MM-DD'),
  tokens: z.string().optional(),
  readTime: z.string().optional(),
  issue: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export interface PublishContext {
  pubDate: string; // YYYY-MM-DD
  tokens: string;
  readTime: string;
  issue: string;
}

// The pure projection: draft frontmatter + publish-time facts -> post frontmatter.
// Authoring-only keys (status) are dropped; pubDate/tokens/readTime/issue are
// publish-time facts and never come from the draft.
export function toPost(draft: DraftFrontmatter, ctx: PublishContext): PostFrontmatter {
  return {
    title: draft.title,
    description: draft.description,
    dek: draft.dek ?? draft.description,
    kicker: draft.kicker ?? DEFAULT_KICKER,
    pubDate: ctx.pubDate,
    tokens: ctx.tokens,
    readTime: ctx.readTime,
    issue: ctx.issue,
    tags: draft.tags,
  };
}

const NOTES_BLOCK = /\n*<!--\s*\nNOTES BEFORE PUBLISHING[\s\S]*?-->\s*$/;

export function hasNotesBlock(body: string): boolean {
  return NOTES_BLOCK.test(body);
}

export function hasOpenTodos(body: string): boolean {
  return /\bTODO\b|\bTK\b/.test(withoutNotesBlock(body));
}

function withoutNotesBlock(body: string): string {
  return body.replace(NOTES_BLOCK, '');
}

// Strips the NOTES BEFORE PUBLISHING block and the trailing `---` separator
// it leaves behind, then trims to a single trailing newline.
export function stripNotesBlock(body: string): string {
  return withoutNotesBlock(body)
    .replace(/\n*---\s*$/, '')
    .trim() + '\n';
}
