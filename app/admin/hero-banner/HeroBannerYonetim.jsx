'use client';

import { useState } from 'react';
import { IconDeviceFloppy, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useToast } from '@/context/ToastContext';
import { createClient } from '@/lib/supabase/client';
import { revalidatePaths, tumSiteRevalidatePaths } from '@/lib/revalidate';
import Button from '@/components/ui/Button';

const BANNER_TIPLERI = {
  simdi:  '🎆 ŞİMDİ ALIN (havai fişek tema)',
  teklif: '🏷️ EN İYİ TEKLİF (premium tema)',
  avrupa: '🇪🇺 AVRUPA TESLİMAT (mavi tema)',
  custom: '✨ Özel banner',
};

const ALANLAR = [
  { key: 'kicker',    label: 'Üst metin (kicker)',   ph: 'Zamlardan etkilenmeden indirimli fiyatlarla' },
  { key: 'title',     label: 'Başlık',               ph: 'ŞİMDİ' },
  { key: 'title_em',  label: 'Vurgulu kelime',       ph: 'ALIN!' },
  { key: 'body',      label: 'Açıklama / alt metin', ph: 'Depomuzda bekletelim...' },
  { key: 'cta_label', label: 'Buton metni (opsiyonel)', ph: 'İletişim Hattı' },
];

export default function HeroBannerYonetim({ baslangic }) {
  const [banners, setBanners] = useState(baslangic);
  const [yukleniyor, setYukleniyor] = useState(false);
  const { goster } = useToast();
  const supabase = createClient();

  const guncelle = (id, alan, deger, locale = null) => {
    setBanners((prev) => prev.map((b) => {
      if (b.id !== id) return b;
      if (locale) {
        const ceviri = { ...(b.translations || {}) };
        ceviri[locale] = { ...(ceviri[locale] || {}), [alan]: deger };
        return { ...b, translations: ceviri };
      }
      return { ...b, [alan]: deger };
    }));
  };

  const kaydet = async (banner) => {
    setYukleniyor(true);
    try {
      const { error } = await supabase
        .from('hero_banners')
        .update({
          kicker: banner.kicker, title: banner.title, title_em: banner.title_em,
          body: banner.body, cta_label: banner.cta_label, cta_url: banner.cta_url,
          translations: banner.translations || {},
          is_active: banner.is_active,
          sort_order: banner.sort_order,
        })
        .eq('id', banner.id);
      if (error) throw error;
      goster('Banner güncellendi', 'basari');
      revalidatePaths(tumSiteRevalidatePaths()).catch(() => {});
    } catch (e) {
      goster('Hata: ' + e.message, 'hata');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">Hero Bannerlar</h1>
        <p className="text-brand-ink/60 mt-2">
          Anasayfanın üstünde dönen 3 büyük banner. Türkçe metni doldur, İngilizce ve Almanca ayrı sekmelerden gir.
          Değişiklik 60 saniye içinde yayına geçer.
        </p>
      </div>

      <div className="space-y-6">
        {banners.map((banner) => (
          <BannerCard
            key={banner.id}
            banner={banner}
            guncelle={guncelle}
            kaydet={kaydet}
            yukleniyor={yukleniyor}
          />
        ))}
      </div>
    </>
  );
}

function BannerCard({ banner, guncelle, kaydet, yukleniyor }) {
  const [aktif, setAktif] = useState('tr');

  return (
    <div className="bg-white rounded-2xl border border-brand-dark/5 shadow-card p-5 md:p-7">
      <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-brand-dark/5">
        <div>
          <h2 className="font-display text-lg md:text-xl font-semibold text-brand-dark">
            {BANNER_TIPLERI[banner.kind] || banner.kind}
          </h2>
          <p className="text-xs text-brand-ink/50 mt-1">Sıra: {banner.sort_order}</p>
        </div>
        <button
          type="button"
          onClick={() => guncelle(banner.id, 'is_active', !banner.is_active)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            banner.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-brand-dark/5 text-brand-ink/50'
          }`}
        >
          {banner.is_active ? <IconEye size={14} /> : <IconEyeOff size={14} />}
          {banner.is_active ? 'Yayında' : 'Gizli'}
        </button>
      </div>

      {/* Dil sekmeleri */}
      <div className="flex gap-2 mb-4">
        {[
          { l: 'tr', label: '🇹🇷 Türkçe (Ana)' },
          { l: 'en', label: '🇬🇧 English' },
          { l: 'de', label: '🇩🇪 Deutsch' },
        ].map((s) => (
          <button
            key={s.l}
            type="button"
            onClick={() => setAktif(s.l)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              aktif === s.l ? 'bg-brand-dark text-brand-cream' : 'bg-brand-cream text-brand-ink hover:bg-brand-dark/5'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Alanlar */}
      <div className="space-y-3">
        {ALANLAR.map((alan) => {
          const deger = aktif === 'tr'
            ? (banner[alan.key] || '')
            : (banner.translations?.[aktif]?.[alan.key] || '');
          return (
            <div key={alan.key}>
              <label className="block text-xs font-medium text-brand-ink/70 mb-1">{alan.label}</label>
              <input
                type="text"
                value={deger}
                onChange={(e) => guncelle(
                  banner.id,
                  alan.key,
                  e.target.value,
                  aktif === 'tr' ? null : aktif
                )}
                placeholder={alan.ph}
                className="w-full px-3 py-2 border border-brand-dark/10 rounded-lg text-base
                           focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end">
        <Button variant="gold" onClick={() => kaydet(banner)} yukleniyor={yukleniyor}>
          <IconDeviceFloppy size={18} />
          Kaydet
        </Button>
      </div>
    </div>
  );
}
