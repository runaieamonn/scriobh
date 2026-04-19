export interface FM {
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
}

export function emptyFM(): FM {
  return {
    title: '',
    date: new Date().toISOString().slice(0, 10),
    excerpt: '',
    coverImage: '',
  };
}

export function parseFM(markdown: string): { fm: FM; body: string } {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { fm: emptyFM(), body: markdown };

  const fm = emptyFM();
  for (const line of match[1].split(/\r?\n/)) {
    const ci = line.indexOf(':');
    if (ci === -1) continue;
    const key = line.slice(0, ci).trim() as keyof FM;
    const val = line.slice(ci + 1).trim().replace(/^"(.*)"$/s, '$1').replace(/\\"/g, '"');
    if (key in fm) fm[key] = val;
  }
  return { fm, body: match[2] };
}

export function serializeFM(fm: FM, body: string): string {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const lines = [
    '---',
    `title: "${esc(fm.title)}"`,
    `date: ${fm.date}`,
    `excerpt: "${esc(fm.excerpt)}"`,
  ];
  if (fm.coverImage.trim()) lines.push(`coverImage: "${esc(fm.coverImage)}"`);
  lines.push('---', '');
  return lines.join('\n') + body;
}

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
