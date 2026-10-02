'use client';
import Link from 'next/link';
import { CalendarDays, Moon, Users, X } from 'lucide-react';
import { hotel } from '@/lib/data';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useHariIni } from '@/lib/useHariIni';
import { fmtTanggal, selisihHari, tambahHari, rupiah } from '@/lib/waktu';

export default function DaftarPesanan() {
  const [punyaku, setPunyaku, loaded] = useLocalStorage('tanjunglengkung.pesanan', []);
  const { hari } = useHariIni();
  if (!loaded || !hari) return <p className="py-16 text-center text-stone-600">Memuat pesanan…</p>;

  if (!punyaku.length) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white/70 p-10 text-center">
        <p className="font-display text-2xl font-bold text-teal-950">Belum ada pesanan</p>
        <p className="mt-2 text-stone-700">Pesanan yang kamu buat di peramban ini akan muncul di sini.</p>
        <Link href="/" className="mt-5 inline-block rounded-xl bg-teal-800 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-900">Cari kamar</Link>
      </div>
    );
  }

  const urut = [...punyaku].sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const nanti = urut.filter((r) => r.checkOut > hari);
  const lalu = urut.filter((r) => r.checkOut <= hari).reverse();
  const batal = (r) => {
    const sisa = selisihHari(hari, r.checkIn);
    const pesan = sisa >= hotel.batalGratis ? 'Batalkan pesanan ini? Pembatalan masih gratis.' : `Check-in tinggal ${Math.max(sisa, 0)} hari: pada penginapan sungguhan, malam pertama akan ditagih. Tetap batalkan?`;
    if (window.confirm(pesan)) setPunyaku((p) => p.filter((x) => x.id !== r.id));
  };

  return (
    <div className="space-y-10">
      <section aria-labelledby="h-nanti">
        <h2 id="h-nanti" className="font-display text-2xl font-bold text-teal-950">Menginap nanti ({nanti.length})</h2>
        {nanti.length === 0 ? <p className="mt-3 text-stone-700">Tidak ada pesanan yang akan datang.</p> : (
          <ul className="mt-4 space-y-4">
            {nanti.map((r) => {
              const sisa = selisihHari(hari, r.checkIn);
              const sedang = r.checkIn <= hari;
              return (
                <li key={r.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{sedang ? 'Sedang menginap' : sisa === 1 ? 'Besok' : `${sisa} hari lagi`}</p>
                      <p className="mt-1 font-display text-xl font-bold text-teal-950">{r.roomName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold text-stone-800">{r.kode}</p>
                      <p className="font-display text-lg font-bold text-teal-900">{rupiah(r.total)}</p>
                    </div>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-700">
                    <li className="flex items-center gap-1.5"><CalendarDays size={15} aria-hidden="true" /> {fmtTanggal(r.checkIn, { weekday: 'short', day: 'numeric', month: 'short' })} → {fmtTanggal(r.checkOut, { weekday: 'short', day: 'numeric', month: 'short' })}</li>
                    <li className="flex items-center gap-1.5"><Moon size={15} aria-hidden="true" /> {r.nights} malam</li>
                    <li className="flex items-center gap-1.5"><Users size={15} aria-hidden="true" /> {r.guests} tamu · {r.nama}</li>
                  </ul>
                  {!sedang && (
                    <p className="mt-3 text-sm text-stone-700">{sisa >= hotel.batalGratis ? `Batal gratis sampai ${fmtTanggal(tambahHari(r.checkIn, -hotel.batalGratis), { weekday: 'long', day: 'numeric', month: 'long' })}.` : 'Sudah lewat batas batal gratis.'}</p>
                  )}
                  {!sedang && <button type="button" onClick={() => batal(r)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-red-800 hover:underline"><X size={15} aria-hidden="true" /> Batalkan</button>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {lalu.length > 0 && (
        <section aria-labelledby="h-lalu">
          <h2 id="h-lalu" className="font-display text-2xl font-bold text-teal-950">Riwayat</h2>
          <ul className="mt-4 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
            {lalu.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm text-stone-700">
                <span>{r.roomName} · {fmtTanggal(r.checkIn, { day: 'numeric', month: 'short', year: 'numeric' })} · {r.nights} malam</span>
                <button type="button" onClick={() => setPunyaku((p) => p.filter((x) => x.id !== r.id))} className="font-semibold text-stone-800 hover:underline">Hapus</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
