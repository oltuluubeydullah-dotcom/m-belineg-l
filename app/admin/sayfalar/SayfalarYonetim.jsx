'use client';

import { useState } from 'react';
import { IconDeviceFloppy, IconFileText, IconChevronRight } from '@tabler/icons-react';
import { useToast } from '@/context/ToastContext';
import { createClient } from '@/lib/supabase/client';
import { revalidatePaths, icerikSayfaRevalidatePaths } from '@/lib/revalidate';
import Button from '@/components/ui/Button';

const SAYFA_BASLIKLARI = {
  'hakkimizda':        'Hakkımızda',
  'teslimat-kurulum':  'Teslimat ve Kurulum',
  'garanti-iade':      'Garanti ve İade',
  'gizlilik':          'Gizlilik ve Çerez Politikası',
  'kvkk':              'KVKK Aydınlatma Metni',
  'satis-sozlesmesi':  'Mesafeli Satış Sözleşmesi',
};

export default function SayfalarYonetim({ baslangic }) {
  const [sayfalar, setSayfalar] = useState(baslangic);
  const [seciliId, setSeciliId] = useState(baslangic[0]?.id);
  const [aktifLocale, setAktifLocale] = useState('tr');
  const [yukleniyor, setYukleniyor] = useState(false);
  const { goster } = useToast();
  const supabase = createClient();

  const secili = sayfalar.find((s) => s.id === seciliId);

  const guncelle = (alan, deger, locale = null) => {
    setSayfalar((prev) => prev.map((s) => {
      if (s.id !== seciliId) return s;
      if (locale) {
        const ceviri = { ...(s.translations || {}) };
        ceviri[locale] = { ...(ceviri[locale] || {}), [alan]: deger };
        return { ...s, translations: ceviri };
      }
      return { ...s, [alan]: deger };
    }));
  };

  const kaydet = async () => {
    if (!secili) return;
    setYukleniyor(true);
    try {
      const { error } = await supabase
        .from('content_pages')
        .update({
          title: secili.title,
          content: secili.content,
          translations: secili.translations || {},
          meta_title: secili.meta_title,
          meta_desc: secili.meta_desc,
          is_published: secili.is_published,
        })
        .eq('id', secili.id);
      if (error) throw error;
      // FIX (Ajan #03/#19): kaydet sonrası revalidate YOKTU → hakkımızda/KVKK
      // gibi yasal sayfalar public'te 1 saate kadar bayat kalıyordu. Artık
      // ilgili slug'ın TR/EN/DE yolları anında temizlenir.
      revalidatePaths(icerikSayfaRevalidatePaths(secili.slug)).catch(() => {});
      goster('Sayfa güncellendi', 'basari');
    } catch (e) {
      goster('Hata: ' + e.message, 'hata');
    } finally {
      setYukleniyor(false);
    }
  };

  const getDeger = (alan) => {
    if (!secili) return '';
    if (aktifLocale === 'tr') return secili[alan] || '';
    return secili.translations?.[aktifLocale]?.[alan] || '';
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">Sayfa İçerikleri</h1>
        <p className="text-brand-ink/60 mt-2">
          Hakkımızda, KVKK, Gizlilik gibi statik sayfaların içeriklerini buradan düzenleyin.
          Markdown desteklenir: <code className="bg-brand-cream px-1 rounded">**kalın**</code>,{' '}
          <code className="bg-brand-cream px-1 rounded"># Başlık</code>,{' '}
          <code className="bg-brand-cream px-1 rounded">- liste</code>
        </p>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Sol: sayfa listesi */}
        <aside className="bg-white rounded-2xl border border-brand-dark/5 shadow-card overflow-hidden h-fit">
          <div className="p-4 border-b border-brand-dark/5">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-brand-ink/60">Sayfalar</h2>
          </div>
          <ul>
            {sayfalar.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSeciliId(s.id)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm transition-colors ${
                    s.id === seciliId ? 'bg-brand-gold/10 text-brand-dark font-medium' : 'hover:bg-brand-cream'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <IconFileText size={16} />
                    {SAYFA_BASLIKLARI[s.slug] || s.title}
                  </span>
                  {s.id === seciliId && <IconChevronRight size={16} />}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Sağ: editör */}
        {secili && (
          <div className="bg-white rounded-2xl border border-brand-dark/5 shadow-card p-5 md:p-7">
            {/* Dil sekmeleri */}
            <div className="flex gap-2 mb-5">
              {[
                { l: 'tr', label: '🇹🇷 Türkçe (Ana)' },
                { l: 'en', label: '🇬🇧 English' },
                { l: 'de', label: '🇩🇪 Deutsch' },
              ].map((s) => (
                <button
                  key={s.l}
                  type="button"
                  onClick={() => setAktifLocale(s.l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    aktifLocale === s.l ? 'bg-brand-dark text-brand-cream' : 'bg-brand-cream text-brand-ink hover:bg-brand-dark/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-brand-ink/70 mb-1">Başlık</label>
                <input
                  type="text"
                  value={getDeger('title')}
                  onChange={(e) => guncelle('title', e.target.value, aktifLocale === 'tr' ? null : aktifLocale)}
                  className="w-full px-3 py-2 border border-brand-dark/10 rounded-lg text-base
                             focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-ink/70 mb-1">
                  İçerik (Markdown)
                </label>
                <textarea
                  value={getDeger('content')}
                  onChange={(e) => guncelle('content', e.target.value, aktifLocale === 'tr' ? null : aktifLocale)}
                  rows={20}
                  className="w-full px-3 py-2 border border-brand-dark/10 rounded-lg text-sm font-mono
                             focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                />
                <p className="text-xs text-brand-ink/50 mt-1">
                  Tüyo: <strong># Başlık</strong> büyük başlık, <strong>## Alt başlık</strong>,{' '}
                  <strong>**kalın**</strong>, <strong>*italik*</strong>,{' '}
                  <strong>- madde</strong>, <strong>[bağlantı](https://...)</strong>
                </p>
              </div>

              {aktifLocale === 'tr' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-brand-ink/70 mb-1">SEO Başlığı (opsiyonel)</label>
                    <input
                      type="text"
                      value={secili.meta_title || ''}
                      onChange={(e) => guncelle('meta_title', e.target.value)}
                      placeholder="Google'da görünecek başlık"
                      className="w-full px-3 py-2 border border-brand-dark/10 rounded-lg text-base
                                 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-ink/70 mb-1">SEO Açıklama (opsiyonel)</label>
                    <textarea
                      value={secili.meta_desc || ''}
                      onChange={(e) => guncelle('meta_desc', e.target.value)}
                      placeholder="Google sonuçlarında görünecek açıklama (en fazla 160 karakter)"
                      rows={2}
                      className="w-full px-3 py-2 border border-brand-dark/10 rounded-lg text-sm
                                 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                    />
                  </div>
                </>
              )}

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={secili.is_published}
                  onChange={(e) => guncelle('is_published', e.target.checked)}
                  className="rounded"
                />
                Yayında (kapatınca sayfa ziyaretçilere görünmez)
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="gold" onClick={kaydet} yukleniyor={yukleniyor}>
                <IconDeviceFloppy size={18} />
                Kaydet
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
