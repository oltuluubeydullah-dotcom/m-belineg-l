'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import {
  IconShoppingBag, IconMinus, IconPlus, IconTrash,
  IconArrowRight, IconArrowLeft, IconPackage,
} from '@tabler/icons-react';
import { useCart } from '@/context/CartContext';
import { formatFiyat } from '@/lib/utils';

export default function SepetClient() {
  const { sepet, cikar, miktarGuncelle, toplamTutar, toplamAdet } = useCart();
  const t = useTranslations('Cart');

  if (sepet.length === 0) {
    return (
      <section className="container mx-auto py-16 md:py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-brand-navy/5 flex items-center justify-center mb-6">
            <IconShoppingBag size={36} className="text-brand-ink/40" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-brand-dark mb-2">
            {t('empty_title')}
          </h2>
          <p className="text-brand-ink/60 mb-8">{t('empty_text')}</p>
          <Link href="/" className="btn-primary inline-flex">
            <IconPackage size={18} />
            {t('browse')}
          </Link>
        </div>
      </section>
    );
  }

  const fiyatsizUrunSayisi = sepet.filter((u) => !u.price).length;

  return (
    <section className="container mx-auto py-8 md:py-12">
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Sol: kalemler */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark mb-6">
            {t('title')}
          </h1>

          <ul className="space-y-4">
            {sepet.map((urun) => (
              <li key={urun.id} className="bg-white rounded-2xl p-4 md:p-5 border border-brand-dark/5 shadow-card flex gap-4">
                {/* Görsel */}
                <Link href={`/urun/${urun.slug}`} className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-brand-cream relative">
                  {urun.image ? (
                    <Image src={urun.image} alt={urun.name} fill sizes="100px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display text-2xl text-brand-dark/30">K</div>
                  )}
                </Link>

                {/* Detay */}
                <div className="flex-1 min-w-0">
                  <Link href={`/urun/${urun.slug}`} className="font-medium text-brand-dark hover:text-brand-teal line-clamp-2">
                    {urun.name}
                  </Link>
                  <p className="text-sm text-brand-ink/70 mt-1">
                    {urun.price > 0 ? formatFiyat(urun.price) : t('price_inquiry')}
                  </p>

                  {/* Adet + Sil */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center bg-white border border-brand-dark/15 rounded-full">
                      <button
                        type="button"
                        onClick={() => miktarGuncelle(urun.id, urun.qty - 1)}
                        className="w-9 h-9 flex items-center justify-center text-brand-ink/70 hover:text-brand-teal"
                        aria-label="−"
                      >
                        <IconMinus size={16} />
                      </button>
                      <span className="px-2 text-sm font-medium min-w-[2rem] text-center">{urun.qty}</span>
                      <button
                        type="button"
                        onClick={() => miktarGuncelle(urun.id, urun.qty + 1)}
                        className="w-9 h-9 flex items-center justify-center text-brand-ink/70 hover:text-brand-teal"
                        aria-label="+"
                      >
                        <IconPlus size={16} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => cikar(urun.id)}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <IconTrash size={16} />
                      <span className="hidden sm:inline">{t('remove')}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link href="/" className="inline-flex items-center gap-2 mt-6 text-sm text-brand-ink/70 hover:text-brand-teal">
            <IconArrowLeft size={16} />
            {t('browse')}
          </Link>
        </div>

        {/* Sağ: özet */}
        <aside className="lg:sticky lg:top-32 h-fit bg-white rounded-2xl p-6 border border-brand-dark/5 shadow-card">
          <h2 className="font-display text-xl font-semibold text-brand-dark mb-5">
            {t('summary')}
          </h2>
          <dl className="space-y-3 text-sm border-b border-brand-dark/5 pb-5 mb-5">
            <div className="flex justify-between">
              <dt className="text-brand-ink/70">{t('total_items')}</dt>
              <dd className="font-medium">{toplamAdet}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-ink/70">{t('subtotal')}</dt>
              <dd className="font-medium">{toplamTutar > 0 ? formatFiyat(toplamTutar) : '—'}</dd>
            </div>
          </dl>

          <div className="mb-5">
            <p className="text-xs uppercase tracking-widest text-brand-ink/50 mb-1">{t('approx_total')}</p>
            <p className="font-display text-2xl text-brand-dark">
              {toplamTutar > 0 ? formatFiyat(toplamTutar) : '—'}
            </p>
            {fiyatsizUrunSayisi > 0 && (
              <p className="text-xs text-brand-ink/60 mt-2 leading-relaxed">{t('approx_note')}</p>
            )}
          </div>

          <Link href="/sepet/onayla" className="btn-primary w-full justify-center">
            {t('confirm')}
            <IconArrowRight size={18} />
          </Link>
          <p className="text-xs text-brand-ink/50 mt-3 leading-relaxed text-center">
            {t('confirm_note')}
          </p>
        </aside>
      </div>
    </section>
  );
}
