# Tanjung Lengkung — Design System (Reservasi Hotel)

> Concept: **immersive travel-magazine** — booking terasa seperti membuka brosur resor mewah; foto besar, tipografi editorial, lapang & menenangkan. Platform: responsive web. Bahasa: Indonesia.

## Brand voice
Tenang, aspiratif, ramah. "Tepi pantai, ketenangan tanpa batas", "Pesan kamar impianmu".

## Color tokens
| Token | Hex | Pakai |
|---|---|---|
| `bg` | `#f6f5f1` | latar (ivory/sand) |
| `surface` | `#ffffff` | kartu |
| `ink` | `#1c2b2d` | teks utama (teal-ink) |
| `muted` | `#5b6b6a` | teks sekunder |
| `primary` | `#0f766e` | aksi (teal-700) |
| `primary-deep` | `#115e59` | hover/aksen |
| `ocean` | `#0e7490` | aksen sekunder |
| `available` | `#059669` | sisa kamar |
| `sold` | `#e11d48` | penuh |
| `border` | `#e7ebe9` | garis |

## Typography
- Display/heading: **Fraunces** (soft luxe serif, 500–700) — nama resor, nama kamar, harga.
- Body/UI: **Inter** (400–600).
- Skala besar & berkelas: hero 32–40, harga 20–24, body 14–16.

## Shape & elevation
- Radius: kartu `16–20px`, gambar kamar membulat di sudut kartu.
- Elevation berlapis lembut; foto full-bleed dengan overlay gradien tipis.

## Components
- **Search bar (sticky)**: Check-in, Check-out, Tamu, + badge "X malam" (auto-hitung).
- **Room card (signature group)**: foto kiri + detail kanan (kapasitas, ukuran, kasur, fasilitas), harga/malam, status ketersediaan; pilih → ring teal.
- **Summary**: rincian (harga × malam, pajak 10%, total) + form tamu.
- **Buttons**: primary teal penuh dengan total harga.

## States
Empty/awal = daftar kamar. Hover card → border teal. Selected → ring + centang. Disabled = penuh / kapasitas kurang. Success = modal centang teal + ringkasan booking.

## Motion
Parallax/zoom halus pada foto, range-date smooth, hover lift kartu (250ms). Hormati reduced-motion.

## Layout
Desktop: hero foto + search sticky + kartu kamar lebar (foto+detail). Mobile: kartu menumpuk, foto di atas.
