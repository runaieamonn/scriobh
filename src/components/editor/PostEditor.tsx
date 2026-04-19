import { useEffect, useRef, useState } from 'react';
import { getFile, putFile, toBase64, fromBase64 } from './github';
import { parseFM, serializeFM, titleToSlug, emptyFM, type FM } from './frontmatter';
import type { Creds } from './AuthScreen';

interface Props {
  creds: Creds;
  slug: string | null;
  onBack: () => void;
}

export default function PostEditor({ creds, slug, onBack }: Props) {
  const isNew = slug === null;

  const [fm, setFm] = useState<FM>(emptyFM());
  const [slugInput, setSlugInput] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [body, setBody] = useState('');
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load existing post
  useEffect(() => {
    if (isNew) return;
    const path = `src/content/blog/${slug}.md`;
    getFile(creds.pat, creds.owner, creds.repo, path)
      .then(({ content, sha: fileSha }) => {
        const markdown = fromBase64(content);
        const { fm: parsed, body: parsedBody } = parseFM(markdown);
        setFm(parsed);
        setSlugInput(slug!);
        setBody(parsedBody);
        setSha(fileSha);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug, creds, isNew]);

  // Auto-resize textarea on content change
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [body]);

  function handleTitleChange(title: string) {
    setFm((f) => ({ ...f, title }));
    if (!slugTouched && isNew) {
      setSlugInput(titleToSlug(title));
    }
  }

  async function handlePublish() {
    if (!slugInput.trim()) {
      setError('Slug is required.');
      return;
    }
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const path = `src/content/blog/${slugInput.trim()}.md`;
      const content = toBase64(serializeFM(fm, body));
      const commitMsg = isNew ? `Add post: ${fm.title}` : `Update post: ${fm.title}`;

      // For updates: always fetch latest sha to avoid conflicts
      let currentSha = sha;
      if (!isNew) {
        const latest = await getFile(creds.pat, creds.owner, creds.repo, path);
        currentSha = latest.sha;
      }

      await putFile(creds.pat, creds.owner, creds.repo, path, commitMsg, content, currentSha);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      if (isNew) {
        // Refresh sha for subsequent saves
        const created = await getFile(creds.pat, creds.owner, creds.repo, path);
        setSha(created.sha);
        setSlugTouched(true); // lock slug now that file exists
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-zinc-400 animate-pulse">Loading post…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm transition-colors flex-shrink-0"
          >
            ← posts
          </button>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="font-mono text-xs text-zinc-500 truncate flex-1">
            {slugInput || 'new-post'}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            {saved && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Published
              </span>
            )}
            {error && (
              <span className="text-xs text-rose-600 dark:text-rose-400 max-w-xs truncate">
                {error}
              </span>
            )}
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {saving ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-5">
        {/* Title */}
        <input
          type="text"
          value={fm.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
          className="w-full text-2xl font-bold bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-700"
        />

        {/* Metadata row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <MetaField label="Slug">
            <input
              type="text"
              value={slugInput}
              onChange={(e) => { setSlugInput(e.target.value); setSlugTouched(true); }}
              readOnly={!isNew && !!sha}
              className="meta-input font-mono text-xs"
              placeholder="post-slug"
            />
          </MetaField>

          <MetaField label="Date">
            <input
              type="date"
              value={fm.date}
              onChange={(e) => setFm((f) => ({ ...f, date: e.target.value }))}
              className="meta-input"
            />
          </MetaField>

          <MetaField label="Cover Image URL" className="sm:col-span-2">
            <input
              type="url"
              value={fm.coverImage}
              onChange={(e) => setFm((f) => ({ ...f, coverImage: e.target.value }))}
              placeholder="https://..."
              className="meta-input"
            />
          </MetaField>

          <MetaField label="Excerpt" className="sm:col-span-2">
            <textarea
              value={fm.excerpt}
              onChange={(e) => setFm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short description for cards and meta tags…"
              rows={2}
              className="meta-input resize-none"
            />
          </MetaField>
        </div>

        {/* Body */}
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your post in Markdown…"
          className="w-full font-mono text-sm leading-relaxed bg-transparent border-none outline-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-300 dark:placeholder-zinc-700 resize-none overflow-hidden min-h-[60vh]"
          spellCheck
        />
      </main>

      <style>{`
        .meta-input {
          width: 100%;
          background: transparent;
          border: 1px solid rgb(228 228 231);
          border-radius: 0.5rem;
          padding: 0.375rem 0.625rem;
          font-size: 0.8125rem;
          color: inherit;
          outline: none;
        }
        .dark .meta-input {
          border-color: rgb(63 63 70);
        }
        .meta-input:focus {
          border-color: rgb(99 102 241);
          box-shadow: 0 0 0 2px rgb(99 102 241 / 0.2);
        }
        .meta-input[readonly] {
          opacity: 0.5;
          cursor: default;
        }
      `}</style>
    </div>
  );
}

function MetaField({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
