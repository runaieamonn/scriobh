import { useEffect, useState } from 'react';
import { listBlogFiles, getFile, fromBase64 } from './github';
import type { Creds } from './AuthScreen';

interface FileEntry {
  name: string;
  path: string;
  sha: string;
  date: Date;
}

interface Props {
  creds: Creds;
  onEdit: (slug: string) => void;
  onNew: () => void;
  onSignOut: () => void;
}

const CACHE_KEY = 'blog-dates-cache';

function loadCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, string>) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function extractDate(markdown: string): string {
  return markdown.match(/^date:\s*(.+)$/m)?.[1]?.trim() ?? '1970-01-01';
}

async function loadFilesWithDates(
  pat: string,
  owner: string,
  repo: string
): Promise<FileEntry[]> {
  const raw = await listBlogFiles(pat, owner, repo);
  const cache = loadCache();

  // Only fetch files whose sha isn't cached yet
  const uncached = raw.filter((f) => !cache[f.sha]);
  const results = await Promise.allSettled(
    uncached.map(async (f) => {
      const { content } = await getFile(pat, owner, repo, f.path);
      return { sha: f.sha, date: extractDate(fromBase64(content)) };
    })
  );

  for (const r of results) {
    if (r.status === 'fulfilled') cache[r.value.sha] = r.value.date;
  }
  saveCache(cache);

  return raw
    .map((f) => ({ ...f, date: new Date(cache[f.sha] ?? '1970-01-01') }))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

export default function Dashboard({ creds, onEdit, onNew, onSignOut }: Props) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Loading posts…');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    loadFilesWithDates(creds.pat, creds.owner, creds.repo)
      .then((f) => {
        if (!cancelled) setFiles(f);
      })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) { setLoading(false); setStatus(''); } });

    // Show progress hint after a short delay if still loading
    const t = setTimeout(() => {
      if (!cancelled) setStatus('Fetching dates for uncached posts…');
    }, 1500);

    return () => { cancelled = true; clearTimeout(t); };
  }, [creds]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href={import.meta.env.BASE_URL} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors text-sm">
              ← site
            </a>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {creds.owner}/{creds.repo}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNew}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
              + New post
            </button>
            <button
              onClick={onSignOut}
              className="px-3 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
          Posts{' '}
          {!loading && (
            <span className="text-zinc-400 dark:text-zinc-600 font-normal text-base">
              ({files.length})
            </span>
          )}
        </h1>

        {loading && (
          <p className="text-sm text-zinc-400 animate-pulse">{status}</p>
        )}

        {error && (
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        )}

        {!loading && !error && (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {files.map((file) => {
              const slug = file.name.replace(/\.md$/, '');
              const dateStr = file.date.getFullYear() > 1970
                ? file.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : '';
              return (
                <li key={file.path} className="flex items-center justify-between py-3 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {dateStr && (
                      <time className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0 w-28">
                        {dateStr}
                      </time>
                    )}
                    <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300 truncate">
                      {slug}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`${import.meta.env.BASE_URL}${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                      title="View post"
                    >
                      ↗
                    </a>
                    <button
                      onClick={() => onEdit(slug)}
                      className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
