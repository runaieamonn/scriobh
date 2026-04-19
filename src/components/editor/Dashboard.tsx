import { useEffect, useState } from 'react';
import { listBlogFiles } from './github';
import type { Creds } from './AuthScreen';

interface FileEntry {
  name: string;
  path: string;
  sha: string;
}

interface Props {
  creds: Creds;
  onEdit: (slug: string) => void;
  onNew: () => void;
  onSignOut: () => void;
}

export default function Dashboard({ creds, onEdit, onNew, onSignOut }: Props) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listBlogFiles(creds.pat, creds.owner, creds.repo)
      .then(setFiles)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [creds]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors text-sm">
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
          Posts <span className="text-zinc-400 dark:text-zinc-600 font-normal text-base">({files.length})</span>
        </h1>

        {loading && (
          <p className="text-sm text-zinc-400 animate-pulse">Loading posts…</p>
        )}

        {error && (
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        )}

        {!loading && !error && (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {files.map((file) => {
              const slug = file.name.replace(/\.md$/, '');
              return (
                <li key={file.path} className="flex items-center justify-between py-3 gap-4">
                  <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300 truncate">
                    {slug}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/${slug}`}
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
