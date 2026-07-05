'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, CalendarX, Users, Minus, Plus, Check, BedDouble, Maximize, Moon, User, Phone } from 'lucide-react';
import { hotel, rooms, seedReservations } from '@/lib/data';
import { useLocalStorage } from '@/lib/useLocalStorage';

const todayStr = new Date().toISOString().slice(0, 10);
const addDays = (s, n) => { const x = new Date(s); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
const rupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function HotelApp() {
  const [reservations, setReservations] = useLocalStorage('hotel.reservations', seedReservations);
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(addDays(todayStr, 1));
  const [guests, setGuests] = useState(2);
  const [roomId, setRoomId] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [done, setDone] = useState(null);

  const nights = Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const remainingOf = useMemo(() => {
    const overlap = (r) => r.checkIn < checkOut && r.checkOut > checkIn;
    return (room) => room.stock - reservations.filter((r) => r.roomId === room.id && overlap(r)).length;
  }, [reservations, checkIn, checkOut]);

  const room = rooms.find((r) => r.id === roomId) || null;
  const roomOk = room && nights > 0 && remainingOf(room) > 0 && room.capacity >= guests;
  const subtotal = room ? room.price * nights : 0;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const confirm = (e) => {
    e.preventDefault();
    if (!roomOk || !form.name.trim() || !form.phone.trim()) return;
    const booking = { id: `h-${Date.now()}`, roomId: room.id, roomName: room.name, checkIn, checkOut, nights, guests, total, ...form };
    setReservations((p) => [...p, booking]);
    setDone(booking);
    setRoomId(null);
    setForm({ name: '', phone: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex h-[400px] items-end overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-900 md:h-[460px]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,.5), transparent 40%)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#f6f5f1]" />
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-16">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-white/80">{hotel.name}</p>
          <h1 className="mt-2 font-display text-5xl font-bold text-white drop-shadow md:text-6xl">Pilih Kamar</h1>
          <p className="mt-2 max-w-md text-white/80">{hotel.tagline}</p>
        </div>
      </section>

      {/* Search widget (glass, overlapping hero) */}
      <div className="sticky top-3 z-40 mx-auto -mt-10 w-full max-w-5xl px-6">
        <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center">
          <SearchField icon={CalendarCheck} label="Check-in">
            <input type="date" min={todayStr} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1)); }} className="w-full bg-transparent text-sm font-semibold text-teal-900 outline-none" />
          </SearchField>
          <div className="hidden h-10 w-px bg-stone-200 sm:block" />
          <SearchField icon={CalendarX} label="Check-out">
            <input type="date" min={addDays(checkIn, 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent text-sm font-semibold text-teal-900 outline-none" />
          </SearchField>
          <div className="hidden h-10 w-px bg-stone-200 sm:block" />
          <SearchField icon={Users} label="Tamu">
            <div className="flex items-center gap-3">
              <button onClick={() => setGuests((g) => Math.max(1, g - 1))} className="rounded p-0.5 text-stone-500 hover:bg-stone-100" aria-label="Kurangi"><Minus size={14} /></button>
              <span className="text-sm font-bold">{guests}</span>
              <button onClick={() => setGuests((g) => Math.min(6, g + 1))} className="rounded p-0.5 text-stone-500 hover:bg-stone-100" aria-label="Tambah"><Plus size={14} /></button>
            </div>
          </SearchField>
          <span className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white">
            <Moon size={14} /> {nights} Malam
          </span>
        </div>
      </div>

      {/* Room list */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="space-y-8">
          {rooms.map((r) => {
            const remaining = remainingOf(r);
            const sold = remaining <= 0;
            const tooSmall = r.capacity < guests;
            const disabled = sold || tooSmall || nights === 0;
            const active = roomId === r.id;
            return (
              <article key={r.id} className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition md:flex-row ${active ? 'border-2 border-teal-600 shadow-lg' : 'border-stone-200'}`}>
                {active && <span className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white shadow"><Check size={16} /></span>}
                <div className="relative h-56 w-full shrink-0 md:h-auto md:w-2/5">
                  <Image src={r.photo} alt={r.name} fill sizes="(max-width:768px) 100vw, 320px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:p-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Oceanfront</p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-teal-900">{r.name}</h3>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
                      <span className="flex items-center gap-1"><Users size={14} /> {r.capacity} orang</span><span className="text-stone-300">•</span>
                      <span className="flex items-center gap-1"><Maximize size={14} /> {r.size}</span><span className="text-stone-300">•</span>
                      <span className="flex items-center gap-1"><BedDouble size={14} /> {r.bed}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {r.amenities.map((a) => <span key={a} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">{a}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-between gap-3 border-t border-stone-100 pt-5 md:flex-row md:items-end">
                    <div>
                      <p className="text-sm text-stone-500">Harga mulai</p>
                      <p className="font-display text-2xl font-bold text-teal-800">{rupiah(r.price)} <span className="text-sm font-normal text-stone-400">/malam</span></p>
                    </div>
                    <button disabled={disabled} onClick={() => setRoomId(r.id)}
                      className={`w-full rounded-xl px-8 py-3 text-sm font-semibold transition md:w-auto ${
                        active ? 'bg-teal-700 text-white' : disabled ? 'cursor-not-allowed border border-stone-200 text-stone-400' : 'border border-teal-700 text-teal-800 hover:bg-teal-700 hover:text-white'
                      }`}>
                      {sold ? 'Penuh' : tooSmall ? 'Kapasitas kurang' : active ? 'Dipilih ✓' : `Pilih Kamar (${remaining} sisa)`}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Summary + form */}
        {roomOk && (
          <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={confirm} className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-teal-900">Ringkasan Pesanan</h3>
            <div className="mt-3 space-y-1.5 border-b border-stone-100 pb-4 text-sm text-stone-600">
              <Row label={room.name} value={`${checkIn} → ${checkOut}`} />
              <Row label={`${rupiah(room.price)} × ${nights} malam`} value={rupiah(subtotal)} />
              <Row label="Pajak & layanan (10%)" value={rupiah(tax)} />
            </div>
            <div className="flex items-center justify-between py-3"><span className="font-semibold text-stone-800">Total</span><span className="font-display text-2xl font-bold text-teal-800">{rupiah(total)}</span></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 focus-within:border-teal-500"><User size={16} className="text-stone-400" /><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama tamu" required className="w-full bg-transparent text-sm outline-none" /></label>
              <label className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 focus-within:border-teal-500"><Phone size={16} className="text-stone-400" /><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="No. WhatsApp" required className="w-full bg-transparent text-sm outline-none" /></label>
            </div>
            <button type="submit" className="mt-5 w-full rounded-xl bg-teal-700 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-800">Pesan Sekarang • {rupiah(total)}</button>
          </motion.form>
        )}
      </main>

      <AnimatePresence>
        {done && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDone(null)}>
            <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white"><Check size={28} /></div>
              <h3 className="mt-4 font-display text-2xl font-bold text-teal-900">Booking Terkonfirmasi!</h3>
              <p className="mt-1 text-sm text-stone-500">Terima kasih, {done.name} 🌴</p>
              <div className="mt-5 space-y-1.5 rounded-xl bg-stone-50 p-4 text-left text-sm text-stone-600">
                <Row label="Kamar" value={done.roomName} bold /><Row label="Check-in" value={done.checkIn} bold /><Row label="Check-out" value={done.checkOut} bold /><Row label="Total" value={rupiah(done.total)} bold />
              </div>
              <button onClick={() => setDone(null)} className="mt-5 w-full rounded-xl border border-stone-300 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">Selesai</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchField({ icon: Icon, label, children }) {
  return (
    <div className="flex flex-1 items-center gap-3 px-2">
      <Icon size={18} className="shrink-0 text-teal-700" />
      <div className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-stone-400">{label}</span>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}
function Row({ label, value, bold }) {
  return <p className="flex justify-between"><span>{label}</span><span className={bold ? 'font-semibold text-stone-800' : ''}>{value}</span></p>;
}
