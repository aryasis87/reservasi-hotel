import DaftarPesanan from '@/components/DaftarPesanan';

export const metadata = {
  title: 'Pesanan saya',
  description: 'Lihat dan batalkan pesanan kamar Tanjung Lengkung yang tersimpan di peramban ini.',
  alternates: { canonical: '/pesanan' },
  robots: { index: false, follow: true },
};

export default function PesananPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-teal-950 md:text-5xl">Pesanan saya</h1>
      <p className="mt-3 max-w-2xl text-stone-700">Tersimpan di peramban ini saja. Pembatalan gratis sampai tiga hari sebelum check-in.</p>
      <div className="mt-10"><DaftarPesanan /></div>
    </main>
  );
}
