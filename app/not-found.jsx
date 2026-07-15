// ════════════════════════════════════════════════════════════
// 404 — Sayfa Bulunamadı
// ════════════════════════════════════════════════════════════

import Link from 'next/link';
import { IconHome, IconShoppingBag } from '@tabler/icons-react';
import { ROTALAR, KATEGORILER } from '@/lib/constants';

export const metadata = {
  title: 'Sayfa Bulunamadı',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* 404 büyük */}
        <p className="font-display text-[120px] md:text-[180px] font-light leading-none tracking-tight text-brand-gold/40 select-none">
          404
        </p>

        <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark -mt-4 md:-mt-8 mb-4">
          Sayfa Bulunamadı
        </h1>

        <p className="text-brand-ink/70 mb-10 max-w-md mx-auto leading-relaxed">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          Anasayfadan veya aşağıdaki kategorilerden devam edebilirsiniz.
        </p>

        {/* Hızlı linkler */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link href={ROTALAR.anasayfa} className="btn-primary">
            <IconHome size={18} />
            Anasayfa
          </Link>
          <Link href={ROTALAR.kategori('koltuk-takimi')} className="btn-ghost">
            <IconShoppingBag size={18} />
            Ürünleri Gez
          </Link>
        </div>

        {/* Popüler kategoriler */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6 md:p-8">
          <p className="text-xs text-brand-ink/50 uppercase tracking-widest mb-4">
            Popüler Kategoriler
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {KATEGORILER.slice(0, 6).map((kat) => (
              <Link
                key={kat.slug}
                href={ROTALAR.kategori(kat.slug)}
                className="px-4 py-2 text-sm bg-brand-dark/5 hover:bg-brand-gold hover:text-brand-dark text-brand-ink rounded-full transition-colors"
              >
                {kat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
