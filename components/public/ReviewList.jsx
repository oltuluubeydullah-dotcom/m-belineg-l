// ════════════════════════════════════════════════════════════
// ReviewList — Yorum listesi + ortalama yıldız
// ════════════════════════════════════════════════════════════

import { IconStar, IconStarFilled, IconCircleCheck } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

function StarsView({ rating, size = 16 }) {
  return (
    <div className="inline-flex items-center" aria-label={`${rating}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        i <= rating
          ? <IconStarFilled key={i} size={size} className="text-brand-gold" />
          : <IconStar key={i} size={size} className="text-brand-ink/20" />
      ))}
    </div>
  );
}

function timeAgo(iso, locale) {
  const now = Date.now();
  const d = new Date(iso).getTime();
  const diff = Math.floor((now - d) / 1000);
  const labels = {
    tr: { now: 'şimdi', m: 'dk önce', h: 'saat önce', d: 'gün önce', mo: 'ay önce', y: 'yıl önce' },
    en: { now: 'now',   m: 'min ago', h: 'h ago',     d: 'd ago',    mo: 'mo ago', y: 'y ago' },
    de: { now: 'jetzt', m: 'Min.',    h: 'Std.',      d: 'T.',       mo: 'Mon.',   y: 'J.' },
  };
  const L = labels[locale] || labels.tr;
  if (diff < 60) return L.now;
  if (diff < 3600) return `${Math.floor(diff / 60)} ${L.m}`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ${L.h}`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ${L.d}`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} ${L.mo}`;
  return `${Math.floor(diff / 31536000)} ${L.y}`;
}

export default async function ReviewList({ reviews, locale }) {
  const t = await getTranslations('Reviews');
  const sayi = reviews.length;
  const ortalama = sayi > 0
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / sayi) * 10) / 10
    : 0;

  return (
    <section className="border-t border-brand-dark/10 pt-10 mt-10">
      <h2 className="font-display text-2xl md:text-3xl font-light text-brand-dark mb-6">
        {t('title')}
      </h2>

      {sayi > 0 && (
        <div className="flex items-center gap-4 mb-8 p-4 md:p-5 bg-brand-cream rounded-2xl">
          <div className="text-center">
            <div className="font-display text-4xl md:text-5xl text-brand-dark leading-none">{ortalama.toFixed(1)}</div>
            <StarsView rating={Math.round(ortalama)} size={18} />
          </div>
          <div className="text-sm text-brand-ink/70">
            <p className="font-medium text-brand-dark">{t('average', { rating: ortalama, count: sayi })}</p>
          </div>
        </div>
      )}

      {sayi === 0 ? (
        <p className="text-brand-ink/60 italic text-center py-6">{t('no_reviews')}</p>
      ) : (
        <ul className="space-y-5">
          {reviews.map((r) => (
            <li key={r.id} className="bg-white rounded-xl p-4 md:p-5 border border-brand-dark/5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-dark text-sm">{r.name}</span>
                  {r.is_verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                      <IconCircleCheck size={12} />
                      {t('verified_badge')}
                    </span>
                  )}
                </div>
                <span className="text-xs text-brand-ink/50">{timeAgo(r.created_at, locale)}</span>
              </div>
              <StarsView rating={r.rating} size={14} />
              <p className="text-sm text-brand-ink/85 mt-2 leading-relaxed whitespace-pre-wrap">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
