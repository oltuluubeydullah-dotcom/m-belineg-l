// ════════════════════════════════════════════════════════════
// Kategori Araç Çubuğu — Sıralama dropdown'u (client)
// ════════════════════════════════════════════════════════════

'use client';

import { useRouter } from 'next/navigation';
import { ROTALAR } from '@/lib/constants';

const SIRALAMA_DEGERLER = ['varsayilan', 'en-yeni', 'fiyat-artan', 'fiyat-azalan'];
const CEVIRI = {
  tr: { etiket: ['Varsayılan Sıralama', 'En Yeniye Göre', 'Fiyata Göre (Düşükten Yükseğe)', 'Fiyata Göre (Yüksekten Düşüğe)'], urun: 'ürün', sayfa: 'Sayfa' },
  en: { etiket: ['Default Sorting', 'Newest First', 'Price (Low to High)', 'Price (High to Low)'], urun: 'products', sayfa: 'Page' },
  de: { etiket: ['Standardsortierung', 'Neueste zuerst', 'Preis (aufsteigend)', 'Preis (absteigend)'], urun: 'Produkte', sayfa: 'Seite' },
};

export default function KategoriClient({ slug, seciliSiralama, toplamUrun, sayfa, sonSayfa, locale = 'tr' }) {
  const router = useRouter();
  const L = CEVIRI[locale] || CEVIRI.tr;

  function siralamaDegistir(yeni) {
    router.push(`${ROTALAR.kategori(slug)}?sirala=${yeni}&sayfa=1`);
  }

  return (
    <section className="container mx-auto py-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-brand-ink/60">
        <span className="font-semibold text-brand-dark">{toplamUrun}</span> {L.urun}
        {sonSayfa > 1 && (
          <span className="ml-2 text-brand-ink/40">
            • {L.sayfa} {sayfa} / {sonSayfa}
          </span>
        )}
      </p>

      <select
        value={seciliSiralama}
        onChange={(e) => siralamaDegistir(e.target.value)}
        className="px-4 py-2 border border-brand-dark/15 rounded-lg bg-white text-sm
                   focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-teal/30"
      >
        {SIRALAMA_DEGERLER.map((deger, i) => (
          <option key={deger} value={deger}>{L.etiket[i]}</option>
        ))}
      </select>
    </section>
  );
}
