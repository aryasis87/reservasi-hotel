import Link from 'next/link';
import { hotel, rooms } from '@/lib/data';

export default function Kaki() {
  return (
    <footer className="mt-16 bg-teal-950 text-teal-50">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold text-white">{hotel.name}</p>
          <p className="mt-2 text-sm text-teal-50/90">{hotel.tagline}. {hotel.lokasi}.</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">Ketentuan</p>
          <ul className="mt-2 space-y-1 text-teal-50/90">
            <li>Check-in {hotel.checkIn}, check-out {hotel.checkOut}</li>
            <li>Harga belum termasuk pajak & layanan {Math.round(hotel.pajak * 100)}%</li>
            <li>Batal gratis sampai {hotel.batalGratis} hari sebelum check-in</li>
          </ul>
        </div>
        <nav aria-label="Kamar" className="text-sm">
          <p className="font-semibold text-white">Kamar</p>
          <ul className="mt-2 space-y-1">
            {rooms.map((r) => <li key={r.id}><Link href={`/kamar/${r.id}`} className="text-teal-50/90 underline-offset-4 hover:text-white hover:underline">{r.name}</Link></li>)}
          </ul>
        </nav>
      </div>
      <p className="border-t border-white/10 px-6 py-4 text-center text-xs text-teal-50/90">Purwarupa desain: penginapan, kamar, dan harga fiktif. Foto CC0. Pesanan hanya disimpan di peramban ini.</p>
    </footer>
  );
}
