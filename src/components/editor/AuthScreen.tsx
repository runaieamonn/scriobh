import { useState } from 'react';

export interface Creds {
  pat: string;
  owner: string;
  repo: string;
}

interface Props {
  onAuth: (creds: Creds) => void;
}

export default function AuthScreen({ onAuth }: Props) {
  const [pat, setPat] = useState('');
  const [ownerRepo, setOwnerRepo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const parts = ownerRepo.trim().split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      setError('Repository must be in owner/repo format, e.g. eobrain/my-blog');
      return;
    }
    const [owner, repo] = parts;

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/src/content/blog`,
        { headers: { Authorization: `token ${pat}` } }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { message?: string }).message ??
            `GitHub returned ${res.status}`
        );
      }
      const creds: Creds = { pat, owner, repo };
      localStorage.setItem('editor-creds', JSON.stringify(creds));
      onAuth(creds);
    } catch (err) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError(
          'Network error: could not reach api.github.com. ' +
            'Check your internet connection and that no browser extension is blocking the request.'
        );
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Connect to GitHub
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Credentials are stored only in your browser.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Personal Access Token"
            hint='Needs "Contents" read/write scope'
            type="password"
            value={pat}
            onChange={setPat}
            placeholder="ghp_..."
            autoComplete="current-password"
          />
          <Field
            label="Repository"
            hint="owner/repo format"
            value={ownerRepo}
            onChange={setOwnerRepo}
            placeholder="eobrain/my-blog"
          />

          {error && (
            <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !pat || !ownerRepo}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
          >
            {loading ? 'Connecting…' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  hint?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        {label}
        {hint && (
          <span className="ml-1.5 font-normal text-zinc-400 dark:text-zinc-500">
            — {hint}
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
    </div>
  );
}
