import Link from 'next/link';

export const metadata = { title: 'Halaman tidak ditemukan' };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-display text-7xl font-bold text-teal-800">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-teal-950">Kamar ini tidak ada</h1>
      <p className="mt-3 text-stone-700">Halaman yang kamu cari tidak ditemukan.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-xl bg-teal-800 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-900">Cari kamar</Link>
        <Link href="/kamar" className="rounded-xl border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-50">Lihat semua kamar</Link>
      </div>
    </main>
  );
}
