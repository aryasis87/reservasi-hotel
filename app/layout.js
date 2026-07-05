import './globals.css';
import { Inter, Fraunces } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-fraunces', display: 'swap' });

const __jsonld = {"@context":"https://schema.org","@type":"Resort","name":"Senja Bay Resort","description":"Reservasi kamar hotel online","url":"https://hotel.pintuweb.com","areaServed":"ID"};

export const metadata = {
  metadataBase: new URL("https://hotel.pintuweb.com"),
  title: "Senja Bay Resort — Reservasi Kamar Online",
  description: "Reservasi kamar hotel online: pilih tanggal menginap dan tipe kamar, cek ketersediaan, dan pesan dalam hitungan menit.",
  applicationName: "Senja Bay Resort",
  keywords: ["reservasi hotel", "booking kamar", "pesan hotel online", "resort", "menginap"],
  authors: [{ name: "Senja Bay Resort" }],
  creator: "Senja Bay Resort",
  publisher: "Senja Bay Resort",
  alternates: { canonical: "https://hotel.pintuweb.com" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://hotel.pintuweb.com",
    siteName: "Senja Bay Resort",
    title: "Senja Bay Resort — Reservasi Kamar Online",
    description: "Reservasi kamar hotel online: pilih tanggal menginap dan tipe kamar, cek ketersediaan, dan pesan dalam hitungan menit.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Senja Bay Resort — Reservasi Kamar Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Senja Bay Resort — Reservasi Kamar Online",
    description: "Reservasi kamar hotel online: pilih tanggal menginap dan tipe kamar, cek ketersediaan, dan pesan dalam hitungan menit.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport = { themeColor: '#0f766e' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased">{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(__jsonld) }} />
        </body>
    </html>
  );
}
