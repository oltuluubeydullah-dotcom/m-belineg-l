// ════════════════════════════════════════════════════════════
// Checkout Formu — Müşteri bilgileri + WhatsApp akışı
// ════════════════════════════════════════════════════════════
// Akış:
// 1) Form validate
// 2) Supabase inquiries'a kaydet
// 3) WhatsApp linki AÇ (user gesture'da, popup engellenmesin)
// 4) Sepeti temizle
// 5) Teşekkür sayfasına yönlendir
// ════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import {
  IconUser, IconPhone, IconMapPin, IconNote,
  IconBrandWhatsapp, IconArrowLeft, IconShieldCheck,
} from '@tabler/icons-react';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useWhatsapp } from '@/context/WhatsAppContext';
import { olayGonder } from '@/lib/pazarlama';
import { checkoutDogrula } from '@/lib/validators';
import { formatFiyat } from '@/lib/utils';

export default function CheckoutFormu() {
  const { sepet, toplamTutar, temizle } = useCart();
  const { goster } = useToast();
  const router = useRouter();
  const t = useTranslations('Checkout');
  const tCart = useTranslations('Cart');
  const locale = useLocale();
  const { siparisMesajiOlustur } = useWhatsapp();
  const formRef = useRef(null); // BUG fix: doğru formu submit etmek için

  const [veri, setVeri] = useState({
    ad: '',
    telefon: '',
    adres: '',
    not: '',
    kvkkOnay: false,
  });
  const [hatalar, setHatalar] = useState({});
  const [yukleniyor, setYukleniyor] = useState(false);

  // Sepet boşsa otomatik anasayfaya
  useEffect(() => {
    if (sepet.length === 0 && !yukleniyor) {
      router.replace(locale === 'tr' ? '/sepet' : `/${locale}/sepet`);
    }
  }, [sepet.length, yukleniyor, router, locale]);

  function alanGuncelle(alan, deger) {
    setVeri((m) => ({ ...m, [alan]: deger }));
    if (hatalar[alan]) {
      setHatalar((h) => { const yeni = { ...h }; delete yeni[alan]; return yeni; });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dogrulaHatalari = checkoutDogrula(veri);
    if (dogrulaHatalari) {
      setHatalar(dogrulaHatalari);
      goster(t('errors.address_required'), 'uyari');
      return;
    }

    if (sepet.length === 0) {
      goster(tCart('empty_title'), 'uyari');
      return;
    }

    setYukleniyor(true);

    const sepetSnapshot = sepet.map((item) => ({
      id: item.id,
      productId: item.productId || item.id,   // v13.x: ana ürün id'si (modüller için)
      partIndex: (item.partIndex ?? null),    // v13.x: modül indeksi (tüm üründe null)
      name: item.name, slug: item.slug, price: item.price, qty: item.qty, image: item.image,
    }));

    try {
      // v11.6 GÜVENLİK: Server-side API → fiyat tampering engeli
      // Server, DB'den gerçek fiyatları çekip total'i kendi hesaplar.
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name:    veri.ad,
          customer_phone:   veri.telefon,
          customer_address: veri.adres,
          customer_note:    veri.not,
          cart_items:       sepetSnapshot,
          kvkk_consent:     veri.kvkkOnay === true,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        // v12.5+: Geliştirme/debug için hata detayını console'a yaz (müşteriye yansımaz)
        if (typeof window !== 'undefined') {
          console.error('[checkout] API hata:', { status: res.status, ...json });
        }

        // v12.5 BUG FIX: tCart(key) bulunamayınca "Cart.error_xxx" string'i döner
        // (falsy değil) → || fallback çalışmaz. Bu helper kontrolü düzeltir.
        const ceviri = (key, fallback) => {
          const v = tCart(key);
          // next-intl bulamadığında "Cart.error_xxx" gibi key path'ı döner → bunu yakala
          return (v && !v.startsWith('Cart.')) ? v : fallback;
        };

        // v12.6: Tüm 13 server error code'u kapsamlı handle ediliyor
        // ?debug=1 query parametresi ile gerçek error code görünür (developer için)
        const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');
        const debugSuffix = debug ? ` [${res.status}:${json.error || 'unknown'}]` : '';

        let mesaj;
        switch (json.error) {
          case 'service_paused':
            mesaj = ceviri('error_service_paused', 'Sipariş servisi geçici olarak duraklatılmıştır.');
            break;
          case 'rate_limit':
            mesaj = ceviri('error_rate_limit', 'Çok fazla istek. Birkaç dakika sonra tekrar deneyin.');
            break;
          case 'profanity_name':
          case 'profanity_note':
            mesaj = ceviri('error_profanity', 'Lütfen uygunsuz dilden kaçının.');
            break;
          case 'cart_empty_or_invalid':
          case 'cart_invalid':
          case 'cart_invalid_ids':
            mesaj = ceviri('error_cart_invalid', 'Sepetteki bazı ürünler artık mevcut değil. Sepetinizi kontrol edin.');
            break;
          case 'invalid_body':
          case 'name_invalid':
          case 'phone_invalid':
            mesaj = 'Form bilgilerinizi kontrol edip tekrar deneyin.';
            break;
          case 'consent_required':
            mesaj = 'Devam etmek için KVKK aydınlatma metnini onaylamanız gerekir.';
            break;
          case 'service_unavailable':
            mesaj = 'Sipariş servisi geçici olarak hazır değil. Lütfen birkaç dakika sonra tekrar deneyin veya WhatsApp\'tan doğrudan yazın.';
            break;
          case 'db_fetch_error':
          case 'db_insert_error':
            // Backend DB hatası — fallback olarak direkt WhatsApp linki açalım, müşteri kaybolmasın
            mesaj = 'Sistem hatası. WhatsApp\'tan doğrudan bağlantı kuruyoruz...';
            // 1.5 sn sonra WhatsApp'a yönlendir (fallback flow)
            setTimeout(() => {
              const waLink = siparisMesajiOlustur({
                sepet: sepetSnapshot,
                musteri: { ad: veri.ad, telefon: veri.telefon, adres: veri.adres, not: veri.not },
                locale,
              });
              olayGonder('whatsapp_tiklama', { locale, pixel: 'Lead', pixelVeri: { content_name: 'siparis_whatsapp' } });
              window.open(waLink, '_blank', 'noopener,noreferrer');
            }, 1500);
            break;
          default:
            mesaj = ceviri('error_send', 'Talep gönderilemedi, lütfen tekrar deneyin.');
        }

        goster(mesaj + debugSuffix, 'hata');
        setYukleniyor(false);
        return;
      }

      // Server'ın döndüğü güncel sepet + total → WhatsApp mesajı bununla
      const guncelSepet = json.cart_items || sepetSnapshot;

      const waLink = siparisMesajiOlustur({
        sepet: guncelSepet,
        musteri: { ad: veri.ad, telefon: veri.telefon, adres: veri.adres, not: veri.not },
        locale,
      });
      olayGonder('whatsapp_tiklama', { locale, pixel: 'Lead', pixelVeri: { content_name: 'siparis_whatsapp' } });
              window.open(waLink, '_blank', 'noopener,noreferrer');

      temizle();
      router.push(`${locale === 'tr' ? '' : '/' + locale}/sepet/tesekkurler?id=${json.inquiry_id || ''}`);
    } catch (err) {
      console.error('Talep kaydedilemedi:', err);
      const waLink = siparisMesajiOlustur({
        sepet: sepetSnapshot,
        musteri: { ad: veri.ad, telefon: veri.telefon, adres: veri.adres, not: veri.not },
        locale,
      });
      olayGonder('whatsapp_tiklama', { locale, pixel: 'Lead', pixelVeri: { content_name: 'siparis_whatsapp' } });
              window.open(waLink, '_blank', 'noopener,noreferrer');
      temizle();
      router.push(`${locale === 'tr' ? '' : '/' + locale}/sepet/tesekkurler`);
    } finally {
      setYukleniyor(false);
    }
  }

  if (sepet.length === 0) {
    return null;  // useEffect yönlendirir
  }

  return (
    <section className="container mx-auto py-10 md:py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <form ref={formRef} onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold text-brand-dark mb-1">
              {t('title')}
            </h2>
            <p className="text-sm text-brand-ink/60 mb-6">
              {t('subtitle')}
            </p>

            <div className="space-y-5">
              <Input
                label={<><IconUser size={14} className="inline mr-1" />{t('name')}</>}
                value={veri.ad}
                onChange={(e) => alanGuncelle('ad', e.target.value)}
                error={hatalar.ad}
                placeholder={t('name')}
                required
                autoComplete="name"
              />

              <Input
                label={<><IconPhone size={14} className="inline mr-1" />{t('phone')}</>}
                type="tel"
                inputMode="tel"
                value={veri.telefon}
                onChange={(e) => alanGuncelle('telefon', e.target.value)}
                error={hatalar.telefon}
                placeholder={t('phone_placeholder')}
                required
                autoComplete="tel"
              />

              <Textarea
                label={<><IconMapPin size={14} className="inline mr-1" />{t('address')}</>}
                value={veri.adres}
                onChange={(e) => alanGuncelle('adres', e.target.value)}
                error={hatalar.adres}
                placeholder={t('address_placeholder')}
                required
                rows={3}
              />

              <Textarea
                label={<><IconNote size={14} className="inline mr-1" />{t('note')}</>}
                value={veri.not}
                onChange={(e) => alanGuncelle('not', e.target.value)}
                placeholder={t('note_placeholder')}
                rows={3}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={veri.kvkkOnay}
                onChange={(e) => alanGuncelle('kvkkOnay', e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-brand-dark/30 text-brand-gold focus:ring-brand-teal/30"
              />
              <div className="text-sm text-brand-ink/80 leading-relaxed">
                {t.rich('kvkk_text', {
                  a: (chunks) => <Link href="/kvkk" target="_blank" className="text-brand-gold underline">{chunks}</Link>,
                })}
                <span className="text-red-500 ml-1">*</span>
              </div>
            </label>
            {hatalar.kvkkOnay && (
              <p className="text-xs text-red-500 mt-2 ml-7">{hatalar.kvkkOnay}</p>
            )}
          </div>

          <div>
            <Link href="/sepet" className="inline-flex items-center gap-1 text-sm text-brand-ink/60 hover:text-brand-teal">
              <IconArrowLeft size={16} />
              {t('back')}
            </Link>
          </div>
        </form>

        <div>
          <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6 sticky top-24 space-y-4">
            <h2 className="font-display text-xl font-semibold text-brand-dark">
              {tCart('summary')}
            </h2>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {sepet.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 rounded-md bg-brand-navy/5 shrink-0 overflow-hidden">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-2 text-brand-ink">{item.name}</p>
                    <p className="text-xs text-brand-ink/50 mt-0.5">
                      {item.qty}
                      {item.price > 0 && ` × ${formatFiyat(item.price)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-brand-dark/5">
              {toplamTutar > 0 ? (
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-brand-dark">{tCart('approx_total')}</span>
                  <span className="font-display text-xl font-semibold text-brand-dark">
                    {formatFiyat(toplamTutar)}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-brand-ink/60">{tCart('approx_note')}</p>
              )}
            </div>

            <Button
              type="button"
              onClick={() => { formRef.current?.requestSubmit(); }}
              variant="primary"
              size="lg"
              yukleniyor={yukleniyor}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              <IconBrandWhatsapp size={20} />
              {yukleniyor ? t('thanks_text') : t('submit')}
            </Button>

            <div className="flex items-start gap-2 text-xs text-brand-ink/60 pt-2 border-t border-brand-dark/5">
              <IconShieldCheck size={16} className="text-brand-gold shrink-0 mt-0.5" />
              <p>{tCart('confirm_note')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
