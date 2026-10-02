'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Waves } from 'lucide-react';
import { hotel, nav } from '@/lib/data';

export default function Kepala() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-stone-200 bg-[#f6f5f1]/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-xl font-bold text-teal-900">
          <Waves size={20} aria-hidden="true" /> {hotel.name}
        </Link>
        <nav aria-label="Utama" className="flex gap-1 overflow-x-auto text-sm font-semibold">
          {nav.map((n) => {
            const aktif = n.href === '/' ? path === '/' : path?.startsWith(n.href.split('/').slice(0, 2).join('/'));
            return (
              <Link key={n.href} href={n.href} aria-current={aktif ? 'page' : undefined}
                className={`shrink-0 rounded-full px-3 py-1.5 transition ${aktif ? 'bg-teal-800 text-white' : 'text-stone-800 hover:bg-teal-50 hover:text-teal-900'}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
