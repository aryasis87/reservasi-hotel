import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Users, Maximize, BedDouble } from 'lucide-react';
import { hotel, rooms, getRoom } from '@/lib/data';
import { rupiah } from '@/lib/waktu';

export function generateStaticParams() {
  return rooms.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const r = getRoom(id);
  if (!r) return { title: 'Kamar tidak ditemukan' };
  return {
    title: r.name,
    description: `${r.desc} ${r.size}, untuk ${r.capacity} orang, mulai ${rupiah(r.price)} per malam.`,
    alternates: { canonical: `/kamar/${r.id}` },
    openGraph: { images: [{ url: r.photos[0] }] },
  };
}

export default async function KamarPage({ params }) {
  const { id } = await params;
  const r = getRoom(id);
  if (!r) notFound();
  const lain = rooms.filter((x) => x.id !== r.id);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/kamar" className="inline-flex items-center gap-1 text-sm font-semibold text-stone-700 hover:text-teal-800"><ArrowLeft size={15} aria-hidden="true" /> Semua kamar</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-teal-950 md:text-5xl">{r.name}</h1>
          <p className="mt-2 max-w-xl text-stone-700">{r.desc}</p>
        </div>
        <div className="sm:text-right">
          <p className="font-display text-3xl font-bold text-teal-900">{rupiah(r.price)}</p>
          <p className="text-sm text-stone-700">per malam · akhir pekan {rupiah(r.akhirPekan)}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-[2fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src={r.photos[0]} alt={`${r.name}, foto utama`} fill priority sizes="(max-width:768px) 100vw, 640px" className="object-cover" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-auto">
          <Image src={r.photos[1]} alt={`${r.name}, foto kedua`} fill sizes="(max-width:768px) 100vw, 320px" className="object-cover" />
        </div>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-bold text-teal-950">Tentang kamar ini</h2>
          <div className="mt-3 space-y-3 leading-relaxed text-stone-800">{r.detail.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</div>
          <h2 className="mt-8 font-display text-2xl font-bold text-teal-950">Fasilitas</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {r.amenities.map((a) => <li key={a} className="flex items-center gap-2 text-stone-800"><Check size={16} className="text-teal-700" aria-hidden="true" /> {a}</li>)}
          </ul>
        </div>
        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4"><dt className="flex items-center gap-2 text-stone-700"><Users size={16} aria-hidden="true" /> Kapasitas</dt><dd className="font-semibold text-stone-900">{r.capacity} orang</dd></div>
            <div className="flex items-center justify-between gap-4"><dt className="flex items-center gap-2 text-stone-700"><Maximize size={16} aria-hidden="true" /> Luas</dt><dd className="font-semibold text-stone-900">{r.size}</dd></div>
            <div className="flex items-center justify-between gap-4"><dt className="flex items-center gap-2 text-stone-700"><BedDouble size={16} aria-hidden="true" /> Kasur</dt><dd className="font-semibold text-stone-900">{r.bed}</dd></div>
            <div className="flex items-center justify-between gap-4"><dt className="text-stone-700">Check-in / out</dt><dd className="font-semibold text-stone-900">{hotel.checkIn} / {hotel.checkOut}</dd></div>
          </dl>
          <p className="mt-4 border-t border-stone-100 pt-4 text-sm text-stone-700">Tarif akhir pekan berlaku untuk malam Jumat dan Sabtu. Pajak & layanan {Math.round(hotel.pajak * 100)}% ditambahkan di ringkasan.</p>
          <Link href={`/?kamar=${r.id}`} className="mt-5 block rounded-xl bg-teal-800 py-3 text-center text-sm font-semibold text-white hover:bg-teal-900">Cek tanggal & pesan</Link>
        </aside>
      </div>

      <h2 className="mt-14 font-display text-2xl font-bold text-teal-950">Pilihan lain</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {lain.map((x) => (
          <li key={x.id}>
            <Link href={`/kamar/${x.id}`} className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-3 transition hover:border-teal-700">
              <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl"><Image src={x.photos[0]} alt="" fill sizes="112px" className="object-cover" /></span>
              <span><span className="block font-display text-lg font-bold text-teal-950">{x.name}</span><span className="text-sm text-stone-700">{x.capacity} orang · {rupiah(x.price)}/malam</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
