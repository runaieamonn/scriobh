const API = 'https://api.github.com';

function headers(pat: string) {
  return {
    Authorization: `token ${pat}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

async function checkResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `GitHub API ${res.status}`);
  }
  return res.json();
}

export async function listBlogFiles(pat: string, owner: string, repo: string) {
  const res = await fetch(
    `${API}/repos/${owner}/${repo}/contents/src/content/blog`,
    { headers: headers(pat) }
  );
  const files = await checkResponse(res);
  return (files as { name: string; path: string; sha: string; type: string }[])
    .filter((f) => f.type === 'file' && f.name.endsWith('.md'))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getFile(pat: string, owner: string, repo: string, path: string) {
  const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${path}`, {
    headers: headers(pat),
  });
  return checkResponse(res) as Promise<{ content: string; sha: string; path: string }>;
}

export async function putFile(
  pat: string,
  owner: string,
  repo: string,
  path: string,
  message: string,
  content: string,
  sha?: string
) {
  const payload: Record<string, unknown> = { message, content };
  if (sha) payload.sha = sha;

  const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: headers(pat),
    body: JSON.stringify(payload),
  });
  return checkResponse(res);
}

/** Unicode-safe Base64 encoding — btoa() alone breaks on non-ASCII. */
export function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** Decode GitHub's chunked base64 response to a UTF-8 string. */
export function fromBase64(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
