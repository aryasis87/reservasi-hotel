import { Suspense } from 'react';
import HotelApp from '@/components/HotelApp';

export default function Home() {
  return (
    <Suspense fallback={<p className="py-32 text-center text-stone-600">Memuat…</p>}>
      <HotelApp />
    </Suspense>
  );
}
