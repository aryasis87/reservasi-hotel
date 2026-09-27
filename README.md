# Senja Bay Resort — Reservasi Kamar Online

Reservasi kamar hotel online: pilih tanggal menginap dan tipe kamar, cek ketersediaan, dan pesan dalam hitungan menit.

**Demo live:** https://reservasi-hotel-kappa.vercel.app

![Tangkapan layar Senja Bay Resort](public/og.jpg)

> Aplikasi reservasi contoh. Data tersimpan di browser (localStorage), tanpa backend.

## Konsep

Paradigma **rentang tanggal**: pilih tipe kamar serta tanggal check-in dan check-out, lalu jumlah malam, pajak, dan ketersediaan dihitung otomatis.

## Halaman

`/`

## Teknologi

- Next.js 15.5 (App Router) dan React 19
- Tailwind CSS v4
- JavaScript
- Framer Motion, Lucide (ikon)
- Font: Inter, Fraunces (next/font)
- SEO: metadata per halaman, Open Graph, JSON-LD, sitemap.xml, dan robots.txt

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk build produksi: `npm run build` lalu `npm start`.

---

Bagian dari koleksi 5 aplikasi reservasi di [PortalReservasi](https://portal-reservasi-nu.vercel.app). Dibuat oleh [PintuWeb](https://pintuweb.com), jasa pembuatan website.
