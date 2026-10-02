'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, CalendarX, Users, Minus, Plus, Check, BedDouble, Maximize, Moon, User, Phone, ArrowRight } from 'lucide-react';
import { hotel, rooms, tarif, akhirPekan, daftarMalam, sisaUnit } from '@/lib/data';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useHariIni } from '@/lib/useHariIni';
import { tambahHari, selisihHari, fmtTanggal, rupiah, kodePesan } from '@/lib/waktu';

const KOSONG = { nama: '', hp: '', permintaan: '' };

export default function HotelApp() {
  const sp = useSearchParams();
  const { hari } = useHariIni();
  const [punyaku, setPunyaku] = useLocalStorage('tanjunglengkung.pesanan', []);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomId, setRoomId] = useState(null);
  const [form, setForm] = useState(KOSONG);
  const [done, setDone] = useState(null);

  // Tanggal bawaan: malam ini sampai besok (WIB). ?kamar= dari halaman detail memilih kamarnya.
  useEffect(() => {
    if (!hari || checkIn) return;
    setCheckIn(hari);
    setCheckOut(tambahHari(hari, 1));
    const k = sp.get('kamar');
    if (rooms.some((r) => r.id === k)) setRoomId(k);
  }, [hari, checkIn, sp]);

  const nights = checkIn && checkOut ? Math.max(0, selisihHari(checkIn, checkOut)) : 0;
  const terlaluLama = nights > hotel.malamMaks;
  const room = rooms.find((r) => r.id === roomId) || null;
  const sisa = (r) => (checkIn && checkOut ? sisaUnit(r, checkIn, checkOut, punyaku) : r.stock);
  const roomOk = room && nights > 0 && !terlaluLama && sisa(room) > 0 && room.capacity >= guests;

  const rincian = useMemo(() => {
    if (!room || !nights || terlaluLama) return null;
    const malam = daftarMalam(checkIn, checkOut);
    const biasa = malam.filter((m) => !akhirPekan(m)).length;
    const pekan = malam.length - biasa;
    const sub = malam.reduce((a, m) => a + tarif(room, m), 0);
    const pajak = Math.round(sub * hotel.pajak);
    return { biasa, pekan, sub, pajak, total: sub + pajak };
  }, [room, checkIn, checkOut, nights, terlaluLama]);

  const gantiMasuk = (v) => { setCheckIn(v); if (!checkOut || v >= checkOut) setCheckOut(tambahHari(v, 1)); };

  const confirm = (e) => {
    e.preventDefault();
    if (!roomOk || !rincian || !form.nama.trim() || !form.hp.trim()) return;
    const id = `h-${Date.now()}`;
    const booking = { id, kode: kodePesan('TL', id), roomId: room.id, roomName: room.name, checkIn, checkOut, nights, guests, total: rincian.total, ...form, dibuat: new Date().toISOString() };
    setPunyaku((p) => [...p, booking]);
    setDone(booking);
    setRoomId(null);
    setForm(KOSONG);
  };

  return (
    <div>
      <section className="relative flex h-[380px] items-end overflow-hidden md:h-[440px]">
        <Image src="/images/pantai-senja.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/60 via-teal-950/30 to-[#f6f5f1]" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-16">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-white">{hotel.lokasi}</p>
          <h1 className="mt-2 font-display text-5xl font-bold text-white drop-shadow md:text-6xl">Pilih kamar</h1>
          <p className="mt-2 max-w-md text-white drop-shadow">{hotel.tagline}. Dua belas kamar, satu pantai.</p>
        </div>
      </section>

      <div className="sticky top-[64px] z-20 mx-auto -mt-10 w-full max-w-5xl px-6">
        <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center">
          <SearchField icon={CalendarCheck} label="Check-in" htmlFor="tgl-masuk">
            <input id="tgl-masuk" type="date" min={hari || undefined} max={hari ? tambahHari(hari, 180) : undefined} value={checkIn} onChange={(e) => gantiMasuk(e.target.value)} className="w-full bg-transparent text-sm font-semibold text-teal-950 outline-none" />
          </SearchField>
          <div className="hidden h-10 w-px bg-stone-200 sm:block" aria-hidden="true" />
          <SearchField icon={CalendarX} label="Check-out" htmlFor="tgl-keluar">
            <input id="tgl-keluar" type="date" min={checkIn ? tambahHari(checkIn, 1) : undefined} max={checkIn ? tambahHari(checkIn, hotel.malamMaks) : undefined} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent text-sm font-semibold text-teal-950 outline-none" />
          </SearchField>
          <div className="hidden h-10 w-px bg-stone-200 sm:block" aria-hidden="true" />
          <SearchField icon={Users} label="Tamu">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100" aria-label="Kurangi tamu"><Minus size={14} /></button>
              <span className="text-sm font-bold" aria-live="polite">{guests}</span>
              <button type="button" onClick={() => setGuests((g) => Math.min(4, g + 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100" aria-label="Tambah tamu"><Plus size={14} /></button>
            </div>
          </SearchField>
          <span className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-teal-800 px-4 py-2 text-sm font-bold text-white">
            <Moon size={14} aria-hidden="true" /> {nights} malam
          </span>
        </div>
        {terlaluLama && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">Lebih dari {hotel.malamMaks} malam? Tulis ke kami untuk tarif bulanan.</p>}
      </div>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="sr-only">Daftar kamar</h2>
        <div className="space-y-8">
          {rooms.map((r) => {
            const remaining = sisa(r);
            const sold = remaining <= 0;
            const tooSmall = r.capacity < guests;
            const disabled = !hari || sold || tooSmall || nights === 0 || terlaluLama;
            const active = roomId === r.id;
            return (
              <article key={r.id} className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition md:flex-row ${active ? 'border-2 border-teal-700 shadow-lg' : 'border-stone-200'}`}>
                {active && <span className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-white shadow" aria-hidden="true"><Check size={16} /></span>}
                <div className="relative h-56 w-full shrink-0 md:h-auto md:w-2/5">
                  <Image src={r.photos[0]} alt="" fill sizes="(max-width:768px) 100vw, 400px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:p-8">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-teal-950">{r.name}</h3>
                    <p className="mt-1 text-stone-700">{r.desc}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-700">
                      <span className="flex items-center gap-1"><Users size={14} aria-hidden="true" /> {r.capacity} orang</span><span className="text-stone-400" aria-hidden="true">•</span>
                      <span className="flex items-center gap-1"><Maximize size={14} aria-hidden="true" /> {r.size}</span><span className="text-stone-400" aria-hidden="true">•</span>
                      <span className="flex items-center gap-1"><BedDouble size={14} aria-hidden="true" /> {r.bed}</span>
                    </div>
                    <Link href={`/kamar/${r.id}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-800 underline-offset-4 hover:underline">Foto & detail <ArrowRight size={14} aria-hidden="true" /></Link>
                  </div>
                  <div className="flex flex-col items-start justify-between gap-3 border-t border-stone-100 pt-5 md:flex-row md:items-end">
                    <div>
                      <p className="text-sm text-stone-700">Malam biasa · akhir pekan</p>
                      <p className="font-display text-2xl font-bold text-teal-900">{rupiah(r.price)} <span className="text-base font-normal text-stone-700">· {rupiah(r.akhirPekan)}</span></p>
                    </div>
                    <button type="button" disabled={disabled} onClick={() => setRoomId(r.id)} aria-pressed={active}
                      className={`w-full rounded-xl px-6 py-3 text-sm font-semibold transition md:w-auto ${
                        active ? 'bg-teal-800 text-white' : disabled ? 'cursor-not-allowed border border-stone-200 text-stone-600' : 'border border-teal-800 text-teal-900 hover:bg-teal-800 hover:text-white'
                      }`}>
                      {!hari ? 'Memuat…' : sold ? 'Penuh di tanggal ini' : tooSmall ? `Maks. ${r.capacity} orang` : active ? 'Dipilih' : `Pilih (${remaining} tersisa)`}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {hari && room && !roomOk && (
          <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950" role="status">
            {room.name}{' '}
            {nights === 0 ? 'butuh minimal satu malam — atur tanggal check-out.' : terlaluLama ? `hanya bisa dipesan sampai ${hotel.malamMaks} malam.` : room.capacity < guests ? `muat paling banyak ${room.capacity} orang.` : 'penuh pada salah satu malam di rentang ini. Coba geser tanggal atau pilih kamar lain.'}
          </p>
        )}

        {roomOk && rincian && (
          <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={confirm} className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-teal-950">Ringkasan pesanan</h2>
            <dl className="mt-3 space-y-1.5 border-b border-stone-100 pb-4 text-sm text-stone-700">
              <Row label={room.name} value={`${fmtTanggal(checkIn, { day: 'numeric', month: 'short' })} → ${fmtTanggal(checkOut, { day: 'numeric', month: 'short' })}`} />
              {rincian.biasa > 0 && <Row label={`${rupiah(room.price)} × ${rincian.biasa} malam biasa`} value={rupiah(room.price * rincian.biasa)} />}
              {rincian.pekan > 0 && <Row label={`${rupiah(room.akhirPekan)} × ${rincian.pekan} malam akhir pekan`} value={rupiah(room.akhirPekan * rincian.pekan)} />}
              <Row label={`Pajak & layanan ${Math.round(hotel.pajak * 100)}%`} value={rupiah(rincian.pajak)} />
            </dl>
            <div className="flex items-center justify-between py-3"><span className="font-semibold text-stone-900">Total</span><span className="font-display text-2xl font-bold text-teal-900">{rupiah(rincian.total)}</span></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-stone-300 px-3 py-2.5 focus-within:border-teal-600"><User size={16} className="text-stone-500" aria-hidden="true" /><span className="sr-only">Nama tamu</span><input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama tamu" autoComplete="name" required className="w-full bg-transparent text-sm outline-none" /></label>
              <label className="flex items-center gap-2 rounded-xl border border-stone-300 px-3 py-2.5 focus-within:border-teal-600"><Phone size={16} className="text-stone-500" aria-hidden="true" /><span className="sr-only">Nomor HP</span><input type="tel" value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} placeholder="Nomor HP" autoComplete="tel" required className="w-full bg-transparent text-sm outline-none" /></label>
              <label className="rounded-xl border border-stone-300 px-3 py-2.5 focus-within:border-teal-600 sm:col-span-2"><span className="sr-only">Permintaan khusus</span><textarea value={form.permintaan} onChange={(e) => setForm({ ...form, permintaan: e.target.value })} placeholder="Permintaan khusus: jam tiba, kasur tambahan, alergi (opsional)" rows={2} className="w-full resize-none bg-transparent text-sm outline-none" /></label>
            </div>
            <button type="submit" className="mt-5 w-full rounded-xl bg-teal-800 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-900">Simpan pesanan · {rupiah(rincian.total)}</button>
            <p className="mt-2 text-center text-xs text-stone-600">Purwarupa: tidak ada pembayaran dan tidak ada yang dikirim. Pesanan disimpan di peramban ini.</p>
          </motion.form>
        )}
      </main>

      <AnimatePresence>
        {done && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDone(null)}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby="judul-selesai" initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 text-white"><Check size={28} /></div>
              <h2 id="judul-selesai" className="mt-4 font-display text-2xl font-bold text-teal-950">Pesanan tersimpan</h2>
              <p className="mt-1 text-sm text-stone-700">Kode <span className="font-mono font-semibold text-stone-900">{done.kode}</span> · atas nama {done.nama}</p>
              <dl className="mt-5 space-y-1.5 rounded-xl bg-stone-50 p-4 text-left text-sm text-stone-700">
                <Row label="Kamar" value={done.roomName} bold />
                <Row label="Check-in" value={`${fmtTanggal(done.checkIn, { weekday: 'short', day: 'numeric', month: 'short' })}, ${hotel.checkIn}`} bold />
                <Row label="Check-out" value={`${fmtTanggal(done.checkOut, { weekday: 'short', day: 'numeric', month: 'short' })}, ${hotel.checkOut}`} bold />
                <Row label="Total" value={rupiah(done.total)} bold />
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-stone-600">Ini purwarupa: tidak ada pembayaran dan tidak ada yang dikirim ke penginapan.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link href="/pesanan" className="rounded-xl bg-teal-800 py-3 text-sm font-semibold text-white hover:bg-teal-900">Pesanan saya</Link>
                <button type="button" onClick={() => setDone(null)} className="rounded-xl border border-stone-300 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-50">Tutup</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchField({ icon: Icon, label, htmlFor, children }) {
  return (
    <div className="flex flex-1 items-center gap-3 px-2">
      <Icon size={18} className="shrink-0 text-teal-800" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {htmlFor ? <label htmlFor={htmlFor} className="block text-[11px] font-semibold uppercase tracking-wide text-stone-600">{label}</label> : <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone-600">{label}</span>}
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}
function Row({ label, value, bold }) {
  return <div className="flex justify-between gap-4"><dt>{label}</dt><dd className={`text-right ${bold ? 'font-semibold text-stone-900' : ''}`}>{value}</dd></div>;
}
