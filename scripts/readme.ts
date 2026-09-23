// authoring/README.md bookkeeping (Backlog / In progress / Completed).
// Pure text -> text so it can be exercised without touching the real README.
//
// In progress entries come in two shapes, both accepted:
//   - <Title>
//   - [<Title>](<NN>-<slug>/article.md) — <any trailing note>
// The /draft skill writes the linked form.

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

// Matches either `- [Title](path) …` or `- Title`; returns the title and link path (if any).
function parseBullet(line: string): { title: string; link?: string } | null {
  const linked = line.match(/^\s*- \[([^\]]+)\]\(([^)]+)\)/);
  if (linked) return { title: linked[1], link: linked[2] };
  const plain = line.match(/^\s*- (.+?)\s*$/);
  return plain ? { title: plain[1] } : null;
}

export function recordPublished(text: string, authoringDirName: string, title: string, pubDate: string): string {
  const linkPath = `${authoringDirName}/article.md`;
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);

  const completed = findSection(lines, 'Completed');
  if (completed && lines.slice(...completed).some((l) => parseBullet(l)?.link === linkPath)) {
    return text;
  }

  const normTitle = normalize(title);
  const inProgress = findSection(lines, 'In progress');
  if (inProgress) {
    const [start, end] = inProgress;
    for (let i = start; i < end; i++) {
      const b = parseBullet(lines[i]);
      if (b && (b.link === linkPath || normalize(b.title) === normTitle)) {
        lines.splice(i, 1);
        break;
      }
    }
  }

  const newBullet = `- [${title}](${linkPath}) — published ${pubDate}`;
  const section = findSection(lines, 'Completed');
  if (section) {
    const [start, end] = section;
    let insertAt = end;
    while (insertAt > start && lines[insertAt - 1].trim() === '') insertAt--;
    lines.splice(insertAt, 0, newBullet);
  } else {
    lines.unshift('# Completed', '', newBullet, '');
  }

  return lines.join(eol);
}
