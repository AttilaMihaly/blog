// npm run publish -- <slug>              publish authoring/<NN>-<slug>/article.md
// npm run publish -- <slug> --date YYYY-MM-DD   force pubDate (first publish only)
// npm run publish -- <slug> --check       diff the projection against the published file, don't write
// npm run publish -- --check              diff every published post that has a matching authoring dir
// npm run publish -- --backfill           recompute tokens/readTime for every post in src/content/blog
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { countTokens } from 'gpt-tokenizer';
import {
  DraftFrontmatterSchema,
  PostFrontmatterSchema,
  toPost,
  hasOpenTodos,
  stripNotesBlock,
  type PublishContext,
} from './frontmatter.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const AUTHORING_DIR = join(ROOT, 'authoring');
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const PUBLIC_IMAGES_DIR = join(ROOT, 'public', 'images');
const README_PATH = join(AUTHORING_DIR, 'README.md');

// -- authoring dir resolution -------------------------------------------------

interface AuthoringDir {
  dirName: string; // "02-bottleneck-was-never-the-code"
  num: string; // "02"
  slug: string; // "bottleneck-was-never-the-code"
}

function listAuthoringDirs(): AuthoringDir[] {
  return readdirSync(AUTHORING_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'archive')
    .map((e) => {
      const m = e.name.match(/^(\d+)-(.+)$/);
      return m ? { dirName: e.name, num: m[1], slug: m[2] } : null;
    })
    .filter((x): x is AuthoringDir => x !== null);
}

function resolveAuthoringDir(arg: string): AuthoringDir {
  const dirs = listAuthoringDirs();
  const found = dirs.find(
    (d) => d.slug === arg || d.num === arg || String(parseInt(d.num, 10)) === String(parseInt(arg, 10))
  );
  if (!found) {
    throw new Error(
      `No authoring directory matches "${arg}". Available: ${dirs.map((d) => d.dirName).join(', ') || '(none)'}`
    );
  }
  return found;
}

// -- published post helpers ---------------------------------------------------

function listPublishedFiles(): string[] {
  return readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
}

function nextIssueNumber(): string {
  const nums = listPublishedFiles()
    .map((f) => matter(readFileSync(join(BLOG_DIR, f), 'utf8')).data.issue)
    .map((issue) => parseInt(issue ?? '', 10))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return String(max + 1).padStart(3, '0');
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// -- computed fields -----------------------------------------------------------

function computeReadTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 233))} min`;
}

function computeTokens(body: string): string {
  return countTokens(body).toLocaleString('en-US');
}

function detectExtension(body: string): '.md' | '.mdx' {
  const hasJsx = /<[A-Z][A-Za-z0-9]*[\s/>]/.test(body);
  const hasImport = /^\s*import\s.+\sfrom\s+['"].+['"];?\s*$/m.test(body);
  return hasJsx || hasImport ? '.mdx' : '.md';
}

// -- images ---------------------------------------------------------------------

function publishImages(authoringDirName: string, slug: string, body: string, opts: { write: boolean }): string {
  const srcDir = join(AUTHORING_DIR, authoringDirName, 'images');
  if (!existsSync(srcDir)) return body;
  if (opts.write) {
    const destDir = join(PUBLIC_IMAGES_DIR, slug);
    mkdirSync(destDir, { recursive: true });
    cpSync(srcDir, destDir, { recursive: true });
  }
  return body.replace(
    /(!\[[^\]]*]\()(?:\.?\/)?images\/([^)]+)(\))/g,
    (_m, pre, path, post) => `${pre}/images/${slug}/${path}${post}`
  );
}

// -- frontmatter serialization ---------------------------------------------------

const FIELD_ORDER = ['title', 'description', 'dek', 'kicker', 'pubDate', 'tokens', 'readTime', 'issue', 'tags'] as const;

function yamlString(s: string): string {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function serializeFrontmatter(data: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const key of FIELD_ORDER) {
    const value = data[key];
    if (value === undefined || value === null) continue;
    if (key === 'tags') {
      const tags = value as string[];
      if (!tags.length) continue;
      lines.push(`tags: [${tags.map(yamlString).join(', ')}]`);
    } else {
      lines.push(`${key}: ${yamlString(String(value))}`);
    }
  }
  return `---\n${lines.join('\n')}\n---\n`;
}

function normalizeBody(body: string): string {
  return body.replace(/\r\n/g, '\n').replace(/^\n+/, '');
}

function renderFile(data: Record<string, unknown>, body: string): string {
  return serializeFrontmatter(data) + '\n' + normalizeBody(body);
}

// -- README.md (Backlog / In progress / Completed) --------------------------------

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function findSection(lines: string[], name: string): [number, number] | null {
  const idx = lines.findIndex((l) => l.trim() === `# ${name}`);
  if (idx === -1) return null;
  let end = lines.length;
  for (let i = idx + 1; i < lines.length; i++) {
    if (/^# /.test(lines[i])) {
      end = i;
      break;
    }
  }
  return [idx + 1, end];
}

function updateReadme(authoringDirName: string, title: string, pubDate: string) {
  const text = readFileSync(README_PATH, 'utf8');
  const linkPath = `${authoringDirName}/article.md`;
  if (text.includes(`(${linkPath})`)) return; // already recorded as Completed

  const lines = text.split('\n');
  const normTitle = normalize(title);

  const inProgress = findSection(lines, 'In progress');
  if (inProgress) {
    const [start, end] = inProgress;
    for (let i = start; i < end; i++) {
      const m = lines[i].match(/^- (.+)$/);
      if (m && normalize(m[1]) === normTitle) {
        lines.splice(i, 1);
        break;
      }
    }
  }

  const newBullet = `- [${title}](${linkPath}) — published ${pubDate}`;
  const completed = findSection(lines, 'Completed');
  if (completed) {
    const [start, end] = completed;
    let insertAt = end;
    while (insertAt > start && lines[insertAt - 1].trim() === '') insertAt--;
    lines.splice(insertAt, 0, newBullet);
  } else {
    lines.unshift('# Completed', '', newBullet, '');
  }

  writeFileSync(README_PATH, lines.join('\n'), 'utf8');
}

// -- core projection: authoring draft -> published file content -------------------

interface Projection {
  outPath: string;
  existingPath: string | null;
  content: string;
  draftTitle: string;
  pubDate: string;
}

function project(slugArg: string, opts: { date?: string; write: boolean }): Projection {
  const { dirName: authoringDirName, slug } = resolveAuthoringDir(slugArg);
  const articlePath = join(AUTHORING_DIR, authoringDirName, 'article.md');
  if (!existsSync(articlePath)) {
    throw new Error(`No article.md in authoring/${authoringDirName}`);
  }

  const parsed = matter(readFileSync(articlePath, 'utf8'));
  const draft = DraftFrontmatterSchema.parse(parsed.data);

  if (draft.status !== 'ready') {
    throw new Error(`authoring/${authoringDirName} is not marked status: ready (currently "${draft.status}")`);
  }
  // TODO/TK markers in the body (outside the NOTES block, which is stripped
  // regardless) mean the draft has unfinished prose — the NOTES block's own
  // open items are judgment calls for the /publish skill, not this script.
  if (hasOpenTodos(parsed.content)) {
    throw new Error(`authoring/${authoringDirName}/article.md still has an open TODO or TK marker`);
  }

  let body = stripNotesBlock(parsed.content);
  body = publishImages(authoringDirName, slug, body, { write: opts.write });
  body = normalizeBody(body);

  const ext = detectExtension(body);
  const outPath = join(BLOG_DIR, `${slug}${ext}`);
  const existingPath = existsSync(outPath)
    ? outPath
    : existsSync(join(BLOG_DIR, `${slug}${ext === '.md' ? '.mdx' : '.md'}`))
      ? join(BLOG_DIR, `${slug}${ext === '.md' ? '.mdx' : '.md'}`)
      : null;
  const existing = existingPath ? matter(readFileSync(existingPath, 'utf8')) : null;

  const pubDate = opts.date ?? existing?.data.pubDate ?? todayIso();
  const issue = existing?.data.issue ?? nextIssueNumber();

  const ctx: PublishContext = {
    pubDate,
    tokens: computeTokens(body),
    readTime: computeReadTime(body),
    issue,
  };

  const post = PostFrontmatterSchema.parse(toPost(draft, ctx));
  const content = renderFile(post as unknown as Record<string, unknown>, body);

  if (opts.write && existingPath && existingPath !== outPath) {
    rmSync(existingPath);
  }

  return { outPath, existingPath, content, draftTitle: draft.title, pubDate };
}

// -- diff (small, line-based; good enough for a frontmatter+prose file) -----------

function printDiff(existing: string, projected: string) {
  const a = existing.split('\n');
  const b = projected.split('\n');
  const max = Math.max(a.length, b.length);
  let shown = 0;
  for (let i = 0; i < max && shown < 30; i++) {
    if (a[i] !== b[i]) {
      if (a[i] !== undefined) console.log(`  - ${a[i]}`);
      if (b[i] !== undefined) console.log(`  + ${b[i]}`);
      shown++;
    }
  }
  if (shown === 30) console.log('  … (diff truncated)');
}

// -- commands ------------------------------------------------------------------

function cmdPublish(slugArg: string, date?: string) {
  const { outPath, content, draftTitle, pubDate } = project(slugArg, { date, write: true });
  writeFileSync(outPath, content, 'utf8');
  updateReadme(resolveAuthoringDir(slugArg).dirName, draftTitle, pubDate);
  console.log(`Published ${relative(ROOT, outPath)}`);
}

function cmdCheckOne(slugArg: string): boolean {
  const { outPath, existingPath, content } = project(slugArg, { write: false });
  if (!existingPath) {
    console.log(`NEW   ${relative(ROOT, outPath)} (not published yet)`);
    return true;
  }
  const existingRaw = readFileSync(existingPath, 'utf8');
  if (existingRaw === content) {
    console.log(`OK    ${relative(ROOT, existingPath)}`);
    return true;
  }
  console.log(`DRIFT ${relative(ROOT, existingPath)}${existingPath !== outPath ? ` (projects to ${relative(ROOT, outPath)})` : ''}`);
  printDiff(existingRaw, content);
  return false;
}

function cmdCheckAll() {
  const dirs = listAuthoringDirs();
  let ok = true;
  for (const d of dirs) {
    const mdExists = existsSync(join(BLOG_DIR, `${d.slug}.md`));
    const mdxExists = existsSync(join(BLOG_DIR, `${d.slug}.mdx`));
    if (!mdExists && !mdxExists) continue;
    try {
      ok = cmdCheckOne(d.slug) && ok;
    } catch (err) {
      ok = false;
      console.log(`ERROR ${d.slug}: ${(err as Error).message}`);
    }
  }
  if (!ok) process.exitCode = 1;
}

function cmdBackfill() {
  for (const file of listPublishedFiles()) {
    const p = join(BLOG_DIR, file);
    const parsed = matter(readFileSync(p, 'utf8'));
    const body = normalizeBody(parsed.content);
    const tokens = computeTokens(body);
    const readTime = computeReadTime(body);
    if (parsed.data.tokens === tokens && parsed.data.readTime === readTime) {
      console.log(`unchanged  ${file}`);
      continue;
    }
    const data = { ...parsed.data, tokens, readTime };
    writeFileSync(p, renderFile(data, body), 'utf8');
    console.log(`backfilled ${file}  tokens=${tokens} readTime=${readTime}`);
  }
}

// -- CLI --------------------------------------------------------------------------

function parseArgs(argv: string[]) {
  const positional: string[] = [];
  const flags: { check?: boolean; backfill?: boolean; date?: string } = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') flags.check = true;
    else if (a === '--backfill') flags.backfill = true;
    else if (a === '--date') flags.date = argv[++i];
    else positional.push(a);
  }
  return { positional, flags };
}

function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));

  if (flags.backfill) {
    cmdBackfill();
    return;
  }

  if (positional.length === 0) {
    if (flags.check) {
      cmdCheckAll();
      return;
    }
    console.error(
      'Usage:\n' +
        '  npm run publish -- <slug> [--date YYYY-MM-DD]\n' +
        '  npm run publish -- <slug> --check\n' +
        '  npm run publish -- --check\n' +
        '  npm run publish -- --backfill'
    );
    process.exitCode = 1;
    return;
  }

  if (flags.check) {
    if (!cmdCheckOne(positional[0])) process.exitCode = 1;
  } else {
    cmdPublish(positional[0], flags.date);
  }
}

main();
