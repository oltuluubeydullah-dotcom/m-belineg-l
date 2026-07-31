// ════════════════════════════════════════════════════════════
// Ürün Detay — v11.0 inobilya tarzı
// ════════════════════════════════════════════════════════════
// - Galeri (lightbox'lı)
// - Parça fiyatlandırma seçici (details.parts varsa)
// - Toplam fiyat dinamik
// - Accordion: Ürün Açıklamaları (bullets + ölçüler), Teslimat, Ödeme
// ════════════════════════════════════════════════════════════

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import {
  IconShoppingBag, IconBrandWhatsapp, IconMinus, IconPlus,
  IconShieldCheck, IconTruck, IconHeadphones, IconStarFilled,
  IconChevronDown, IconCircleCheck, IconRulerMeasure,
  IconCreditCard, IconBuildingStore,
} from '@tabler/icons-react';
import Galeri from './Galeri';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatFiyat, cn } from '@/lib/utils';
import { useWhatsapp } from '@/context/WhatsAppContext';
import { olayGonder } from '@/lib/pazarlama';

export default function UrunDetay({ urun, urunAd, urunDesc, locale, reviewOrt, reviewSayi }) {
  const { urunIcinSorMesaji } = useWhatsapp();
  // v51 PAZARLAMA: ürün görüntüleme → reklam platformlarına ViewContent
  useEffect(() => {
    if (!urun?.id) return;
    // İç analitik (urun_tiklama) + tüm pixellere ViewContent — tek çağrı
    olayGonder('urun_tiklama', {
      productId: urun.id, locale,
      pixel: 'ViewContent',
      pixelVeri: {
        content_name: urunAd,
        content_ids: [urun.id],
        value: urun.is_on_sale && urun.sale_price ? urun.sale_price : urun.base_price || undefined,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urun?.id]);

  const [adet, setAdet] = useState(1);
  const { ekle } = useCart();
  const { goster } = useToast();
  const t = useTranslations('Product');

  // Detaylar
  const parts = useMemo(
    () => (Array.isArray(urun.details?.parts) ? urun.details.parts : []),
    [urun.details?.parts]
  );
  const dimensions = Array.isArray(urun.details?.dimensions) ? urun.details.dimensions : [];
  const bullets = Array.isArray(urun.details?.bullets) ? urun.details.bullets : [];
  const parcaMod = parts.length > 0;

  // Parça adetleri — varsayılan olanlar 1 ile başlar, diğerleri 0
  const [adetler, setAdetler] = useState(() => {
    const init = {};
    parts.forEach((p, i) => { init[i] = p.varsayilan ? 1 : 0; });
    return init;
  });

  function adetDegistir(i, fark) {
    setAdetler((m) => ({ ...m, [i]: Math.max(0, (m[i] || 0) + fark) }));
  }

  // Toplam fiyat hesabı
  const birimFiyat = useMemo(() => {
    if (parcaMod) return null;
    const indirimVar = urun.is_on_sale && urun.sale_price && urun.sale_price < urun.base_price;
    return indirimVar ? urun.sale_price : urun.base_price;
  }, [parcaMod, urun]);

  const toplamFiyat = useMemo(() => {
    if (parcaMod) {
      return parts.reduce((sum, p, i) => {
        const a = adetler[i] || 0;
        if (a > 0 && p.fiyat) return sum + Number(p.fiyat) * a;
        return sum;
      }, 0);
    }
    // Normal ürün: birim fiyat × adet
    return birimFiyat ? birimFiyat * adet : 0;
  }, [parcaMod, parts, adetler, birimFiyat, adet]);

  // v12.4: Üstte gösterilecek fiyat — toplamFiyat 0 ise base_price'a düş (kart'la tutarlı)
  // Müşteri ürün admin panelden eklerken "Varsayılan" işaretlemese bile fiyat üstte görünür
  const gosterilecekUstFiyat = useMemo(() => {
    if (toplamFiyat > 0) return toplamFiyat;
    if (urun.base_price) {
      const indirim = urun.is_on_sale && urun.sale_price && urun.sale_price < urun.base_price;
      return indirim ? urun.sale_price : urun.base_price;
    }
    return 0;
  }, [toplamFiyat, urun]);

  // v13.x: "Tüm takım" sabit fiyatı — modül seçiminden BAĞIMSIZ (indirim varsa sale_price).
  // Üstteki başlangıç fiyatı ile aynı; "Tüm Takımı Sepete Ekle" butonu bunu kullanır.
  const takimFiyati = useMemo(() => {
    if (!parcaMod) return birimFiyat || 0;
    const indirim = urun.is_on_sale && urun.sale_price && urun.sale_price < urun.base_price;
    return indirim ? urun.sale_price : (urun.base_price || 0);
  }, [parcaMod, birimFiyat, urun]);

  // Parça modunda hiç seçim yokken "başlangıç fiyatı" göstergesi
  const baslangicFiyatiGosteriliyor = parcaMod && toplamFiyat === 0 && gosterilecekUstFiyat > 0;

  const seciliParcaSayisi = useMemo(
    () => Object.values(adetler).filter(a => a > 0).length,
    [adetler]
  );
  const toplamAdet = useMemo(
    () => Object.values(adetler).reduce((s, a) => s + (a || 0), 0),
    [adetler]
  );
  const indirimVar = !parcaMod && urun.is_on_sale && urun.sale_price && urun.sale_price < urun.base_price;
  const ad = urunAd || urun.name;
  const katAd = urun.categories
    ? (locale === 'tr' ? urun.categories.name : urun.categories.translations?.[locale]?.name || urun.categories.name)
    : null;

  // v13.x: Tüm takımı tek satır olarak sepete ekle (yazan fiyattan).
  // id = gerçek ürün id'si → checkout sunucusu fiyatı DB'den doğrular (güvenli).
  function tumTakimiEkle() {
    if (!takimFiyati) {
      goster(t('no_price'), 'uyari');
      return;
    }
    ekle({
      id: urun.id,
      productId: urun.id,
      partIndex: null,           // null = tüm ürün/takım
      name: ad,
      slug: urun.slug,
      price: takimFiyati,
      image: urun.images?.[0] || null,
    }, 1);
    goster(t('full_set_added'), 'basari');
  }

  // Seçili modülleri (tekil parçaları) sepete ekle.
  function modulleriEkle() {
    if (toplamAdet === 0) {
      goster(t('select_module'), 'uyari');
      return;
    }
    // Her parçayı ayrı satır olarak sepete ekle (kendi adetiyle)
    parts.forEach((p, i) => {
      const adet = adetler[i] || 0;
      if (adet > 0) {
        ekle({
          id: `${urun.id}::${i}`,   // benzersiz sepet satırı
          productId: urun.id,        // checkout sunucusu bununla ana ürünü bulur
          partIndex: i,              // ...ve details.parts[i].fiyat'ı DB'den okur (güvenli)
          name: `${ad} — ${p.ad}`,
          slug: urun.slug,
          price: Number(p.fiyat) || 0,
          image: urun.images?.[0] || null,
        }, adet);
      }
    });
    goster(t('modules_added', { count: seciliParcaSayisi, qty: toplamAdet }), 'basari');
    // v51 PAZARLAMA
    olayGonder('sepete_ekleme', {
      productId: urun.id, locale,
      pixel: 'AddToCart',
      pixelVeri: { content_name: ad, content_ids: [urun.id] },
    });
  }

  // Normal (parça olmayan) ürün için sepete ekle.
  function sepeteEkle() {
    if (parcaMod) { modulleriEkle(); return; }
    ekle({
      id: urun.id,
      productId: urun.id,
      partIndex: null,
      name: ad,
      slug: urun.slug,
      price: birimFiyat || 0,
      image: urun.images?.[0] || null,
    }, adet);
    goster(t('qty_added', { n: adet }), 'basari');
    // v51 PAZARLAMA: iç analitik + tüm pixellere AddToCart
    olayGonder('sepete_ekleme', {
      productId: urun.id, locale,
      pixel: 'AddToCart',
      pixelVeri: { content_name: ad, content_ids: [urun.id], value: (birimFiyat || 0) * adet },
    });
  }

  const whatsappMesaj = useMemo(() => {
    if (parcaMod) {
      const seciliParcalar = parts
        .map((p, i) => ({ ...p, adet: adetler[i] || 0 }))
        .filter(p => p.adet > 0);
      const parcaBaslik = { tr: 'Seçtiğim parçalar:', en: 'Selected parts:', de: 'Ausgewählte Teile:' }[locale] || 'Seçtiğim parçalar:';
      const ekstra = seciliParcalar.length > 0
        ? `\n\n${parcaBaslik}\n` + seciliParcalar.map(p =>
            `• ${p.ad} × ${p.adet}${p.fiyat ? ` — ${formatFiyat(Number(p.fiyat) * p.adet)}` : ''}`
          ).join('\n')
        : '';
      return urunIcinSorMesaji({ name: ad + ekstra, slug: urun.slug, translations: urun.translations }, locale);
    }
    return urunIcinSorMesaji({ name: ad, slug: urun.slug, translations: urun.translations }, locale);
  }, [parcaMod, parts, adetler, ad, urun, locale, urunIcinSorMesaji]);

  return (
    <>
      <section className="container mx-auto py-6 md:py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* SOL — Galeri */}
          <div>
            <Galeri urunAdi={ad} fotograflar={urun.images || []} />
          </div>

          {/* SAĞ — Bilgi */}
          <div>
            {urun.categories && katAd && (
              <Link
                href={`/kategori/${urun.categories.slug}`}
                className="inline-block text-xs uppercase tracking-widest text-brand-gold hover:text-brand-accent mb-3"
              >
                {katAd}
              </Link>
            )}

            <h1 className="font-sans font-semibold text-3xl md:text-4xl text-brand-dark leading-tight tracking-tight mb-3">
              {ad}
            </h1>


            {reviewSayi > 0 && (
              <div className="flex items-center gap-2 mb-4 text-sm">
                <div className="inline-flex items-center gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <IconStarFilled key={i} size={16} className={i <= Math.round(reviewOrt) ? 'text-brand-gold' : 'text-brand-ink/15'} />
                  ))}
                </div>
                <span className="font-medium text-brand-dark">{reviewOrt.toFixed(1)}</span>
                <span className="text-brand-ink/50">({reviewSayi})</span>
              </div>
            )}

            {/* Fiyat */}
            <div className="mb-6 pb-6 border-b border-brand-dark/10">
              {gosterilecekUstFiyat ? (
                <>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-sans font-bold text-3xl md:text-4xl text-brand-dark tracking-tight">
                      {formatFiyat(gosterilecekUstFiyat)}
                    </span>
                    {/* v12.4: indirim kart'taki gibi base_price üstü çizili eşit ölçüde */}
                    {(indirimVar || (baslangicFiyatiGosteriliyor && urun.is_on_sale && urun.sale_price < urun.base_price)) && (
                      <>
                        <span className="font-sans text-xl md:text-2xl font-medium text-brand-ink/45 line-through">
                          {formatFiyat(parcaMod ? urun.base_price : urun.base_price * adet)}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                          -%{Math.round((1 - urun.sale_price / urun.base_price) * 100)}
                        </span>
                      </>
                    )}
                    {parcaMod && toplamAdet > 0 && (
                      <span className="text-xs text-brand-ink/55 ml-1">({t('parts_total', { count: toplamAdet })})</span>
                    )}
                  </div>
                  {!parcaMod && adet > 1 && birimFiyat && (
                    <p className="text-xs text-brand-ink/55 mt-1.5">
                      {formatFiyat(birimFiyat)} × {adet} {t('items_unit')}
                    </p>
                  )}
                  {baslangicFiyatiGosteriliyor && (
                    <p className="text-xs text-brand-ink/55 mt-2">
                      {t('starting_price_note')}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-brand-ink/60 italic">{t('ask_price')}</p>
              )}
            </div>

            {/* PARÇA SEÇİCİ — her parça için adet spinner'ı */}
            {parcaMod && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-brand-ink/60 mb-3 font-medium">
                  {t('set_contents_note')}
                </p>
                <div className="space-y-2">
                  {parts.map((p, i) => {
                    const adet = adetler[i] || 0;
                    const aktif = adet > 0;
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all',
                          aktif ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-dark/10 bg-white'
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-brand-dark truncate">{p.ad}</p>
                          {p.fiyat != null && (
                            <p className="text-xs text-brand-ink/60 mt-0.5">
                              {formatFiyat(p.fiyat)} / {t('items_unit')}
                            </p>
                          )}
                        </div>
                        <div className="inline-flex items-center bg-white border border-brand-dark/15 rounded-full shrink-0">
                          <button
                            type="button"
                            onClick={() => adetDegistir(i, -1)}
                            disabled={adet === 0}
                            className="w-9 h-9 flex items-center justify-center text-brand-ink/70 hover:text-brand-teal disabled:opacity-30 disabled:hover:text-brand-ink/70"
                            aria-label={t('qty_decrease')}
                          >
                            <IconMinus size={16} />
                          </button>
                          <span className="px-2 font-semibold min-w-[2rem] text-center text-sm">{adet}</span>
                          <button
                            type="button"
                            onClick={() => adetDegistir(i, 1)}
                            className="w-9 h-9 flex items-center justify-center text-brand-ink/70 hover:text-brand-teal"
                            aria-label={t('qty_increase')}
                          >
                            <IconPlus size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Açıklama */}
            {urunDesc && (
              <p className="text-brand-ink/85 leading-relaxed mb-6 whitespace-pre-wrap">{urunDesc}</p>
            )}

            {/* Adet — parça modunda gizli (her parçanın kendi adeti var) */}
            {toplamFiyat > 0 && !parcaMod && (
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center bg-white border border-brand-dark/15 rounded-full">
                  <button
                    type="button"
                    onClick={() => setAdet(Math.max(1, adet - 1))}
                    className="w-11 h-11 flex items-center justify-center text-brand-ink/70 hover:text-brand-teal"
                    aria-label={t('qty_decrease')}
                  >
                    <IconMinus size={18} />
                  </button>
                  <span className="px-3 font-medium min-w-[2.5rem] text-center">{adet}</span>
                  <button
                    type="button"
                    onClick={() => setAdet(adet + 1)}
                    className="w-11 h-11 flex items-center justify-center text-brand-ink/70 hover:text-brand-teal"
                    aria-label={t('qty_increase')}
                  >
                    <IconPlus size={18} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 mb-8">
              {parcaMod ? (
                <>
                  {/* v13.x: TÜM TAKIM — yazan fiyattan tek tıkla, her zaman görünür */}
                  {takimFiyati > 0 && (
                    <Button variant="primary" onClick={tumTakimiEkle} className="w-full justify-center">
                      <IconShoppingBag size={18} />
                      {t('add_full_set')}
                    </Button>
                  )}

                  {/* SEÇİLİ MODÜLLER — en az bir modül seçiliyse görünür */}
                  {toplamAdet > 0 && (
                    <Button variant="outline" onClick={modulleriEkle} className="w-full justify-center">
                      <IconShoppingBag size={18} />
                      {t('add_modules')} · {toplamAdet} {t('items_unit')} · {formatFiyat(toplamFiyat)}
                    </Button>
                  )}

                  {/* WhatsApp */}
                  <a
                    href={whatsappMesaj}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => olayGonder('whatsapp_tiklama', { productId: urun.id, locale, pixel: 'Lead', pixelVeri: { content_name: urunAd, content_ids: [urun.id] } })}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full w-full",
                      "bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
                    )}
                  >
                    <IconBrandWhatsapp size={18} />
                    {t('ask_whatsapp')}
                  </a>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  {toplamFiyat > 0 && (
                    <Button variant="primary" onClick={sepeteEkle} className="flex-1 justify-center">
                      <IconShoppingBag size={18} />
                      {t('add_to_cart')}
                    </Button>
                  )}
                  <a
                    href={whatsappMesaj}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => olayGonder('whatsapp_tiklama', { productId: urun.id, locale, pixel: 'Lead', pixelVeri: { content_name: urunAd, content_ids: [urun.id] } })}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full",
                      "bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors",
                      toplamFiyat > 0 ? "flex-1" : "w-full"
                    )}
                  >
                    <IconBrandWhatsapp size={18} />
                    {t('ask_whatsapp')}
                  </a>
                </div>
              )}
            </div>

            <ul className="space-y-3 text-sm text-brand-ink/70">
              <li className="flex items-center gap-2.5">
                <IconTruck size={20} className="text-brand-gold shrink-0" />
                {t('delivery_note')}
              </li>
              <li className="flex items-center gap-2.5">
                <IconShieldCheck size={20} className="text-brand-gold shrink-0" />
                {t('warranty_note')}
              </li>
              <li className="flex items-center gap-2.5">
                <IconHeadphones size={20} className="text-brand-gold shrink-0" />
                {t('support_note')}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ AŞAĞI: ACCORDION DETAYLAR ═══ */}
      {(bullets.length > 0 || dimensions.length > 0) && (
        <section className="container mx-auto pb-10 md:pb-16">
          <div className="border-t border-brand-dark/10 max-w-5xl mx-auto pt-8 space-y-3">

            {/* ÜRÜN AÇIKLAMALARI */}
            {(bullets.length > 0 || dimensions.length > 0) && (
              <Accordion baslik={t('desc_accordion_title')} icon={IconCircleCheck} acikVarsayilan>
                {bullets.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex gap-3 text-brand-ink/85">
                        <span className="text-brand-gold mt-1.5 shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {dimensions.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-brand-ink/55 font-medium mb-3 flex items-center gap-2">
                      <IconRulerMeasure size={16} className="text-brand-gold" />
                      {t('dimensions_title')}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b-2 border-brand-dark/10">
                            <th className="text-left py-2 px-3 font-semibold text-brand-dark">{t('part')}</th>
                            <th className="text-left py-2 px-3 font-semibold text-brand-dark">{t('width')}</th>
                            <th className="text-left py-2 px-3 font-semibold text-brand-dark">{t('height')}</th>
                            <th className="text-left py-2 px-3 font-semibold text-brand-dark">{t('depth')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dimensions.map((d, i) => (
                            <tr key={i} className="border-b border-brand-dark/5">
                              <td className="py-2.5 px-3 text-brand-ink/85 font-medium">{d.ad}</td>
                              <td className="py-2.5 px-3 text-brand-ink/70">{d.genislik || '—'}</td>
                              <td className="py-2.5 px-3 text-brand-ink/70">{d.yukseklik || '—'}</td>
                              <td className="py-2.5 px-3 text-brand-ink/70">{d.derinlik || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Accordion>
            )}

            {/* TESLIMAT VE KURULUM */}
            <Accordion baslik={t('delivery_install_title')} icon={IconBuildingStore}>
              <ul className="space-y-2 text-brand-ink/85">
                <li className="flex gap-3"><span className="text-brand-gold mt-1.5 shrink-0">•</span>{t('delivery_1')}</li>
                <li className="flex gap-3"><span className="text-brand-gold mt-1.5 shrink-0">•</span>{t('delivery_2')}</li>
                <li className="flex gap-3"><span className="text-brand-gold mt-1.5 shrink-0">•</span>{t('delivery_3')}</li>
                <li className="flex gap-3"><span className="text-brand-gold mt-1.5 shrink-0">•</span>{t('delivery_4')}</li>
                <li className="flex gap-3"><span className="text-brand-gold mt-1.5 shrink-0">•</span>{t('delivery_5')}</li>
              </ul>
            </Accordion>

            {/* ÖDEME YÖNTEMLERİ */}
            <Accordion baslik={t('payment_contact_title')} icon={IconCreditCard}>
              <p className="text-brand-ink/85 mb-3">
                {t('payment_text')}
              </p>
              <a
                href={whatsappMesaj}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
              >
                <IconBrandWhatsapp size={18} />
                {t('whatsapp_contact')}
              </a>
            </Accordion>
          </div>
        </section>
      )}
    </>
  );
}

// ─── Accordion bileşeni ────────────────────────────────────
function Accordion({ baslik, icon: Icon, children, acikVarsayilan = false }) {
  const [acik, setAcik] = useState(acikVarsayilan);
  return (
    <div className="border border-brand-dark/10 rounded-xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setAcik(!acik)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-brand-cream/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className="text-brand-gold" />}
          <span className="font-display text-base md:text-lg font-medium text-brand-dark uppercase tracking-wider">
            {baslik}
          </span>
        </div>
        <IconChevronDown
          size={20}
          className={cn('text-brand-ink/50 transition-transform', acik && 'rotate-180')}
        />
      </button>
      {acik && (
        <div className="px-5 pb-5 pt-1 border-t border-brand-dark/5 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
