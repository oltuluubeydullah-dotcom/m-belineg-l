'use client';

// ════════════════════════════════════════════════════════════
// FeaturedProductsInfiniteScroll
// ════════════════════════════════════════════════════════════
// Anasayfa "Sizin İçin Seçtiğimiz" — infinite scroll.
//
// AKIŞ:
//   1) SSR'de gelen 12 ürün render edilir (initialProducts).
//   2) Sayfa sonuna yaklaşınca IntersectionObserver tetiklenir.
//   3) /api/products/featured?page=2 → 12 ürün daha.
//   4) /api/products/featured?page=3 → 12 ürün daha (toplam 36).
//   5) hasMore=false → "Tüm Koleksiyonu Gör" butonu görünür.
//
// PERFORMANS:
//   - Lazy load: tetiklenince fetch
//   - rootMargin 400px → kullanıcı görmeden önce hazır
//   - Dedup: zaten yüklü ID'leri filtrele (random sıralamada çift gelirse)
//   - Loading skeleton (4 kart) → CLS engeli
// ════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { IconArrowRight, IconLoader2 } from '@tabler/icons-react';
import { Link } from '@/lib/i18n/navigation';
import ProductCard from './ProductCard';

export default function FeaturedProductsInfiniteScroll({
  initialProducts = [],
  locale = 'tr',
}) {
  const t = useTranslations('Home');
  const [items, setItems] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hataVar, setHataVar] = useState(false);
  const [bitti, setBitti] = useState(false);
  const sentinelRef = useRef(null);
  const fetchEdildi = useRef(new Set([1])); // page 1 zaten yüklü

  const sonrakiPageYukle = useCallback(async () => {
    if (yukleniyor || bitti) return;
    const nextPage = page + 1;
    if (fetchEdildi.current.has(nextPage)) return;
    fetchEdildi.current.add(nextPage);

    setYukleniyor(true);
    setHataVar(false);

    try {
      const res = await fetch(`/api/products/featured?page=${nextPage}`, {
        // Browser cache açık — aynı sayfa scroll edilirse tekrar fetch yapmaz
        cache: 'default',
      });
      const json = await res.json();
      if (!json.ok) throw new Error('api_error');

      // Dedup: aynı ID iki kez gelmesin (random sıralamada riskli)
      const mevcutIdler = new Set(items.map((u) => u.id));
      const yeniler = (json.items || []).filter((u) => !mevcutIdler.has(u.id));

      setItems((prev) => [...prev, ...yeniler]);
      setPage(nextPage);

      if (!json.hasMore || nextPage >= json.maxPage) {
        setBitti(true);
      }
    } catch (e) {
      setHataVar(true);
      fetchEdildi.current.delete(nextPage); // tekrar denenebilir
    } finally {
      setYukleniyor(false);
    }
  }, [yukleniyor, bitti, page, items]);

  // IntersectionObserver — sayfanın altına yaklaşılınca tetikle
  useEffect(() => {
    if (bitti || hataVar) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) sonrakiPageYukle();
      },
      { rootMargin: '400px 0px' } // kullanıcı görmeden önce hazır olsun
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [sonrakiPageYukle, bitti, hataVar]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((u) => <ProductCard key={u.id} urun={u} locale={locale} />)}
        {yukleniyor && (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={`skel-${i}`}
                className="aspect-[4/3] bg-brand-dark/5 rounded-xl animate-pulse"
              />
            ))}
          </>
        )}
      </div>

      {/* Trigger: bu div görünürse next page fetch tetiklenir */}
      {!bitti && !hataVar && (
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      )}

      {/* Yükleme göstergesi (sentinel'den ayrı) */}
      {yukleniyor && (
        <div className="flex justify-center items-center mt-6">
          <IconLoader2 className="animate-spin text-brand-gold" size={28} />
        </div>
      )}

      {/* Hata varsa retry */}
      {hataVar && (
        <div className="text-center mt-6">
          <button
            onClick={() => { setHataVar(false); sonrakiPageYukle(); }}
            className="text-sm text-brand-gold hover:underline"
          >
            Tekrar dene
          </button>
        </div>
      )}

      {/* Bitti → "Tüm Koleksiyonu Gör" */}
      {bitti && (
        <div className="text-center mt-10 md:mt-14">
          <Link href="/urunler" className="btn-teal">
            {t('view_all')}
            <IconArrowRight size={18} />
          </Link>
        </div>
      )}
    </>
  );
}
