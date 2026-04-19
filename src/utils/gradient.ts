const GRADIENTS = [
  'from-violet-600 to-indigo-600',
  'from-blue-600 to-cyan-500',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-rose-600',
  'from-pink-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-slate-600 to-zinc-700',
  'from-teal-500 to-emerald-600',
  'from-sky-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-lime-500 to-green-600',
  'from-indigo-500 to-violet-700',
];

export function slugGradient(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) & 0x7fffffff;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}
