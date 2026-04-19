import { useEffect, useState } from 'react';
import AuthScreen, { type Creds } from './AuthScreen';
import Dashboard from './Dashboard';
import PostEditor from './PostEditor';

type Screen =
  | { kind: 'auth' }
  | { kind: 'dashboard' }
  | { kind: 'editor'; slug: string | null };

function loadCreds(): Creds | null {
  try {
    const raw = localStorage.getItem('editor-creds');
    return raw ? (JSON.parse(raw) as Creds) : null;
  } catch {
    return null;
  }
}

export default function EditorApp() {
  const [creds, setCreds] = useState<Creds | null>(null);
  const [screen, setScreen] = useState<Screen>({ kind: 'auth' });

  useEffect(() => {
    const saved = loadCreds();
    if (saved) {
      setCreds(saved);
      setScreen({ kind: 'dashboard' });
    }
  }, []);

  function handleAuth(c: Creds) {
    setCreds(c);
    setScreen({ kind: 'dashboard' });
  }

  function handleSignOut() {
    localStorage.removeItem('editor-creds');
    setCreds(null);
    setScreen({ kind: 'auth' });
  }

  if (screen.kind === 'auth' || !creds) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (screen.kind === 'dashboard') {
    return (
      <Dashboard
        creds={creds}
        onEdit={(slug) => setScreen({ kind: 'editor', slug })}
        onNew={() => setScreen({ kind: 'editor', slug: null })}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <PostEditor
      creds={creds}
      slug={screen.slug}
      onBack={() => setScreen({ kind: 'dashboard' })}
    />
  );
}
