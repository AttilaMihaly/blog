// npm run check — content lint for src/content/blog/. Runs before build, locally
// and in CI. Exits non-zero (and prints every failure, not just the first) if any
// post fails validation.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { z } from 'zod';
import { hasNotesBlock, hasOpenTodos } from './frontmatter.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const PUBLIC_DIR = join(ROOT, 'public');

// Mirrors the `blog` collection schema in src/content.config.ts. Kept in sync by
// hand — this script runs outside the Astro content pipeline.
const SiteSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  dek: z.string().optional(),
  kicker: z.string().optional(),
  tokens: z.string().optional(),
  readTime: z.string().optional(),
  issue: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

const AUTHORING_ONLY_KEYS = ['draft', 'status'];

interface Failure {
  file: string;
  message: string;
}

function listPosts() {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => {
      const raw = readFileSync(join(BLOG_DIR, f), 'utf8');
      const parsed = matter(raw);
      return { file: f, id: basename(f, extname(f)), raw, data: parsed.data, content: parsed.content };
    });
}

function main() {
  const posts = listPosts();
  const failures: Failure[] = [];
  const ids = new Set(posts.map((p) => p.id));

  for (const post of posts) {
    // schema
    const result = SiteSchema.safeParse(post.data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        failures.push({ file: post.file, message: `schema: ${issue.path.join('.')}: ${issue.message}` });
      }
    }

    // authoring-only keys leaking into a published post
    for (const key of AUTHORING_ONLY_KEYS) {
      if (key in post.data) {
        failures.push({ file: post.file, message: `authoring-only key "${key}" present in published frontmatter` });
      }
    }

    // no unresolved NOTES / TODO / TK
    if (hasNotesBlock(post.content)) {
      failures.push({ file: post.file, message: 'contains a NOTES BEFORE PUBLISHING block' });
    }
    if (hasOpenTodos(post.content)) {
      failures.push({ file: post.file, message: 'contains an open TODO or TK marker' });
    }

    // image references resolve under public/
    for (const m of post.content.matchAll(/!\[[^\]]*]\((\/[^)\s]+)\)/g)) {
      const imgPath = join(PUBLIC_DIR, m[1]);
      if (!existsSync(imgPath) || !statSync(imgPath).isFile()) {
        failures.push({ file: post.file, message: `image reference does not resolve: ${m[1]}` });
      }
    }

    // internal /blog/<slug> links resolve to a real entry
    for (const m of post.content.matchAll(/]\(\/blog\/([^)#\s]+)[^)]*\)/g)) {
      if (!ids.has(m[1])) {
        failures.push({ file: post.file, message: `internal link to unknown post: /blog/${m[1]}` });
      }
    }
  }

  // issue numbers unique and contiguous (only posts that carry one)
  const issues = posts
    .map((p) => ({ file: p.file, issue: p.data.issue as string | undefined }))
    .filter((p): p is { file: string; issue: string } => typeof p.issue === 'string');
  const seen = new Map<string, string>();
  for (const { file, issue } of issues) {
    if (seen.has(issue)) {
      failures.push({ file, message: `duplicate issue number "${issue}" (also used by ${seen.get(issue)})` });
    } else {
      seen.set(issue, file);
    }
  }
  const nums = [...new Set(issues.map((i) => parseInt(i.issue, 10)))].sort((a, b) => a - b);
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1] + 1) {
      failures.push({
        file: 'src/content/blog',
        message: `issue numbers are not contiguous: gap between ${nums[i - 1]} and ${nums[i]}`,
      });
    }
  }

  if (failures.length === 0) {
    console.log(`OK — ${posts.length} posts checked, no issues.`);
    return;
  }

  console.log(`${failures.length} issue(s) found across ${posts.length} posts:\n`);
  for (const f of failures) {
    console.log(`  ${f.file}: ${f.message}`);
  }
  process.exitCode = 1;
}

main();
