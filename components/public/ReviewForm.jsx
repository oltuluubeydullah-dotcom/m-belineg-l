// ════════════════════════════════════════════════════════════
// ReviewForm — Misafir yorum formu (login yok)
// ════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { IconStar, IconStarFilled, IconSend, IconCheck } from '@tabler/icons-react';

export default function ReviewForm({ productId }) {
  const t = useTranslations('Reviews');
  const locale = useLocale();
  const [ad, setAd] = useState('');
  const [puan, setPuan] = useState(0);
  const [hoverPuan, setHoverPuan] = useState(0);
  const [metin, setMetin] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [basarili, setBasarili] = useState(false);
  const [hata, setHata] = useState(null);

  const gonder = async (e) => {
    e.preventDefault();
    setHata(null);

    if (ad.trim().length < 2) return setHata(t('error_name_short'));
    if (puan < 1) return setHata(t('error_rating'));
    if (metin.trim().length < 5) return setHata(t('error_text_short'));

    setYukleniyor(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          name: ad.trim(),
          rating: puan,
          text: metin.trim(),
          locale,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'rate_limit')  return setHata(t('error_rate_limit'));
        if (data.error === 'profanity')   return setHata(t('error_profanity'));
        return setHata(t('error_generic'));
      }

      setBasarili(true);
      setAd(''); setPuan(0); setMetin('');
      setTimeout(() => setBasarili(false), 5000);
    } catch (_) {
      setHata(t('error_generic'));
    } finally {
      setYukleniyor(false);
    }
  };

  if (basarili) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-3">
          <IconCheck size={28} strokeWidth={2.5} />
        </div>
        <p className="font-medium text-green-900">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={gonder} className="bg-brand-cream rounded-2xl p-5 md:p-6 border border-brand-gold/20">
      <h3 className="font-display text-lg font-semibold text-brand-dark mb-4">
        {t('form_title')}
      </h3>

      {/* Yıldız puan */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-brand-ink/70 mb-2">
          {t('rating_label')} <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoverPuan(i)}
              onMouseLeave={() => setHoverPuan(0)}
              onClick={() => setPuan(i)}
              className="p-1 transition-transform hover:scale-110"
              aria-label={`${i} yıldız`}
            >
              {i <= (hoverPuan || puan)
                ? <IconStarFilled size={32} className="text-brand-gold" />
                : <IconStar size={32} className="text-brand-ink/25" />
              }
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-brand-ink/70 mb-1">
            {t('name_label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            maxLength={60}
            placeholder={t('name_ph')}
            className="w-full px-3 py-2 bg-white border border-brand-dark/10 rounded-lg text-base
                       focus:border-brand-gold focus:ring-1 focus:ring-brand-teal outline-none"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-brand-ink/70 mb-1">
          {t('text_label')} <span className="text-red-500">*</span>
        </label>
        <textarea
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder={t('text_ph')}
          className="w-full px-3 py-2 bg-white border border-brand-dark/10 rounded-lg text-sm
                     focus:border-brand-gold focus:ring-1 focus:ring-brand-teal outline-none"
        />
        <p className="text-xs text-brand-ink/40 mt-1">{metin.length}/1000</p>
      </div>

      {hata && (
        <p className="text-sm text-red-600 mb-3 bg-red-50 px-3 py-2 rounded-lg">{hata}</p>
      )}

      <button
        type="submit"
        disabled={yukleniyor}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-brand-dark
                   font-semibold rounded-full hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        <IconSend size={18} />
        {yukleniyor ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
