import { rooms } from '@/lib/data';

const URL = 'https://reservasi-hotel-kappa.vercel.app';

export default function sitemap() {
  const now = new Date();
  return ['', '/kamar', ...rooms.map((r) => `/kamar/${r.id}`)].map((p) => ({ url: URL + p, lastModified: now, changeFrequency: 'monthly', priority: p ? 0.7 : 1 }));
}
