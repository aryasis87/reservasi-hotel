import Image from 'next/image';
import Link from 'next/link';
import { hotel, rooms } from '@/lib/data';
import { rupiah } from '@/lib/waktu';

export const metadata = {
  title: 'Kamar & vila',
  description: 'Kamar Taman, Suite Teluk, dan Vila Kolam di Tanjung Lengkung: luas, kapasitas, fasilitas, dan tarif malam biasa serta akhir pekan.',
  alternates: { canonical: '/kamar' },
};

export default function KamarIndex() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-teal-950 md:text-5xl">Kamar & vila</h1>
      <p className="mt-3 max-w-2xl text-stone-700">Dua belas unit di satu tanjung: enam kamar taman, empat suite di lantai atas, dan dua vila berkolam. {hotel.lokasi}.</p>
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {rooms.map((r) => (
          <li key={r.id}>
            <Link href={`/kamar/${r.id}`} className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="relative block aspect-[4/3]"><Image src={r.photos[0]} alt="" fill sizes="(max-width:768px) 100vw, 320px" className="object-cover transition duration-700 group-hover:scale-105" /></span>
              <span className="block p-5">
                <span className="block font-display text-xl font-bold text-teal-950">{r.name}</span>
                <span className="mt-1 block text-sm text-stone-700">{r.size} · {r.capacity} orang · {r.stock} unit</span>
                <span className="mt-3 block font-semibold text-teal-900">{rupiah(r.price)} <span className="font-normal text-stone-700">/ malam</span></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
