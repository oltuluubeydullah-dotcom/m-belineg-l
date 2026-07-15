// ════════════════════════════════════════════════════════════
// Kategori Araç Çubuğu — Sıralama dropdown'u (client)
// ════════════════════════════════════════════════════════════

'use client';

import { useRouter } from 'next/navigation';
import { ROTALAR } from '@/lib/constants';

const SIRALAMA_OPSIYONLARI = [
  { deger: 'varsayilan',    etiket: 'Varsayılan Sıralama' },
  { deger: 'en-yeni',       etiket: 'En Yeniye Göre' },
  { deger: 'fiyat-artan',   etiket: 'Fiyata Göre (Düşükten Yükseğe)' },
  { deger: 'fiyat-azalan',  etiket: 'Fiyata Göre (Yüksekten Düşüğe)' },
];

export default function KategoriClient({ slug, seciliSiralama, toplamUrun, sayfa, sonSayfa }) {
  const router = useRouter();

  function siralamaDegistir(yeni) {
    router.push(`${ROTALAR.kategori(slug)}?sirala=${yeni}&sayfa=1`);
  }

  return (
    <section className="container mx-auto py-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-brand-ink/60">
        <span className="font-semibold text-brand-dark">{toplamUrun}</span> ürün
        {sonSayfa > 1 && (
          <span className="ml-2 text-brand-ink/40">
            • Sayfa {sayfa} / {sonSayfa}
          </span>
        )}
      </p>

      <select
        value={seciliSiralama}
        onChange={(e) => siralamaDegistir(e.target.value)}
        className="px-4 py-2 border border-brand-dark/15 rounded-lg bg-white text-sm
                   focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-teal/30"
      >
        {SIRALAMA_OPSIYONLARI.map((o) => (
          <option key={o.deger} value={o.deger}>{o.etiket}</option>
        ))}
      </select>
    </section>
  );
}
