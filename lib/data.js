// Konfigurasi resort + tipe kamar.
export const hotel = {
  name: 'Senja Bay Resort',
  tagline: 'Tepi pantai, ketenangan tanpa batas',
};

export const rooms = [
  {
    id: 'standard',
    name: 'Deluxe Garden',
    desc: 'Kamar nyaman menghadap taman tropis dengan balkon pribadi.',
    price: 850000,
    capacity: 2,
    size: '28 m²',
    bed: '1 King / 2 Twin',
    stock: 6,
    amenities: ['WiFi', 'AC', 'TV', 'Sarapan'],
    photo: 'https://placehold.co/600x400/0f766e/ffffff.png?text=Deluxe+Garden',
  },
  {
    id: 'ocean',
    name: 'Ocean View Suite',
    desc: 'Pemandangan laut lepas, ruang tamu terpisah, dan bathtub.',
    price: 1650000,
    capacity: 3,
    size: '45 m²',
    bed: '1 King',
    stock: 4,
    amenities: ['WiFi', 'AC', 'Smart TV', 'Sarapan', 'Bathtub'],
    photo: 'https://placehold.co/600x400/0e7490/ffffff.png?text=Ocean+View+Suite',
  },
  {
    id: 'villa',
    name: 'Private Pool Villa',
    desc: 'Vila eksklusif dengan kolam renang pribadi & dapur kecil.',
    price: 3200000,
    capacity: 4,
    size: '90 m²',
    bed: '2 King',
    stock: 2,
    amenities: ['WiFi', 'AC', 'Smart TV', 'Sarapan', 'Private Pool', 'Dapur'],
    photo: 'https://placehold.co/600x400/115e59/ffffff.png?text=Private+Pool+Villa',
  },
];

// Reservasi dummy (untuk demo ketersediaan).
const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
export const seedReservations = [
  { id: 'h1', roomId: 'villa', checkIn: d(1), checkOut: d(4) },
  { id: 'h2', roomId: 'villa', checkIn: d(2), checkOut: d(3) },
];
