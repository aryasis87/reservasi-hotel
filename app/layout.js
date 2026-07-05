import './globals.css';
import { Inter, Fraunces } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-fraunces', display: 'swap' });

export const metadata = {
  title: 'Senja Bay Resort — Reservasi Kamar',
  description: 'Pesan kamar dengan pilihan tanggal menginap & tipe kamar.',
};

export const viewport = { themeColor: '#0f766e' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
