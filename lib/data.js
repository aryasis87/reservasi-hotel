// Tanjung Lengkung — penginapan fiktif untuk purwarupa reservasi kamar.
import { acak, hariKe, tambahHari } from './waktu';

export const hotel = {
  name: 'Tanjung Lengkung',
  tagline: 'Penginapan kecil di ujung teluk yang melengkung',
  lokasi: 'Pesisir timur Lombok',
  url: 'https://reservasi-hotel-kappa.vercel.app',
  checkIn: '14.00',
  checkOut: '12.00',
  pajak: 0.21, // pajak & layanan
  malamMaks: 14,
  batalGratis: 3, // hari sebelum check-in
};

export const nav = [
  { href: '/', label: 'Pesan kamar' },
  { href: '/kamar', label: 'Kamar & vila' },
  { href: '/pesanan', label: 'Pesanan saya' },
];

const f = (n) => `/images/${n}.webp`;
export const rooms = [
  {
    id: 'taman', name: 'Kamar Taman', price: 850000, akhirPekan: 980000,
    desc: 'Kamar tenang menghadap taman kamboja, dengan teras kayu kecil untuk kopi pagi.',
    detail: ['Enam kamar berderet di sisi taman, masing-masing dengan teras beratap. Pagi hari cahaya masuk dari timur; sore hari teduh.', 'Pantai berjarak dua menit berjalan kaki lewat jalan setapak di ujung taman.'],
    capacity: 2, size: '28 m²', bed: '1 king atau 2 single', stock: 6,
    amenities: ['Wi-Fi', 'AC', 'Teras pribadi', 'Sarapan untuk 2', 'Pancuran air panas'],
    photos: [f('kamar-hangat'), f('ruang-teras-kayu')],
  },
  {
    id: 'teluk', name: 'Suite Teluk', price: 1650000, akhirPekan: 1850000,
    desc: 'Lantai atas dengan balkon menghadap teluk, ruang duduk terpisah, dan bak mandi.',
    detail: ['Empat suite di lantai dua dengan balkon lebar ke arah teluk. Ruang duduk dipisah pintu geser, cukup untuk kasur tambahan bagi anak.', 'Matahari terbit tepat di depan balkon pada bulan Juni–Agustus.'],
    capacity: 3, size: '45 m²', bed: '1 king + sofa bed', stock: 4,
    amenities: ['Wi-Fi', 'AC', 'Balkon menghadap teluk', 'Bak mandi', 'Sarapan untuk 3', 'Mesin kopi'],
    photos: [f('teras-tropis'), f('kamar-kota')],
  },
  {
    id: 'vila', name: 'Vila Kolam', price: 3200000, akhirPekan: 3600000,
    desc: 'Vila dua kamar dengan kolam renang pribadi dan dapur kecil, terpisah dari bangunan utama.',
    detail: ['Dua vila di ujung tanjung, dipisah pagar tanaman. Kolam 8 meter, dapur kecil dengan kompor dua tungku, dan ruang makan untuk empat orang.', 'Cocok untuk keluarga atau dua pasangan yang bepergian bersama.'],
    capacity: 4, size: '90 m²', bed: '2 king', stock: 2,
    amenities: ['Wi-Fi', 'AC', 'Kolam pribadi', 'Dapur kecil', 'Sarapan untuk 4', 'Antar-jemput bandara'],
    photos: [f('villa-modern'), f('teras-kolam')],
  },
];
export const getRoom = (id) => rooms.find((r) => r.id === id);

// Malam Jumat & Sabtu memakai tarif akhir pekan.
export const akhirPekan = (malam) => [5, 6].includes(hariKe(malam));
export const tarif = (room, malam) => (akhirPekan(malam) ? room.akhirPekan : room.price);
export const daftarMalam = (masuk, keluar) => {
  const out = [];
  for (let d = masuk; d < keluar; d = tambahHari(d, 1)) out.push(d);
  return out;
};

// Unit yang sudah dipesan tamu lain (contoh) untuk satu malam — stabil per tanggal.
export function terisiContoh(room, malam) {
  const ramai = akhirPekan(malam) ? 0.7 : 0.45;
  return Math.min(room.stock, Math.floor(acak(`${malam}|${room.id}`) * (room.stock + 1) * ramai));
}

// Sisa unit untuk seluruh rentang menginap = malam paling penuh.
export function sisaUnit(room, masuk, keluar, punyaku = []) {
  const malam = daftarMalam(masuk, keluar);
  if (!malam.length) return room.stock;
  return Math.min(...malam.map((m) => room.stock - terisiContoh(room, m) - punyaku.filter((r) => r.roomId === room.id && r.checkIn <= m && r.checkOut > m).length));
}
