import { gorselSrc } from '@/lib/gorsel';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { formatFiyat } from '@/lib/utils';
import { getLocalizedName } from '@/lib/i18n/auto-translate';

export default function ProductCard({ urun, locale: localePassed }) {
  const t = useTranslations('Product');
  const localeHook = useLocale();
  const locale = localePassed || localeHook;

  const indirimVar = urun.is_on_sale && urun.sale_price && urun.sale_price < urun.base_price;
  const gosterilecekFiyat = indirimVar ? urun.sale_price : urun.base_price;
  const ilkGorsel = urun.images?.[0] || null;
  const ad = getLocalizedName(urun, locale);

  return (
    <Link href={`/urun/${urun.slug}`} className="group block relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-dark/5 mb-3">
        {indirimVar && <span className="badge-sale">{t('discount_badge')}</span>}
        {ilkGorsel ? (
          <Image src={gorselSrc(ilkGorsel)} alt={ad} fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-dark/30 font-display text-4xl">K</div>
        )}
      </div>
      <h3 className="font-sans font-semibold text-sm md:text-base text-brand-ink line-clamp-2 group-hover:text-brand-teal transition-colors tracking-tight">
        {ad}
      </h3>
      {gosterilecekFiyat ? (
        <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
          <span className="font-sans font-bold text-lg md:text-xl text-brand-dark tracking-tight">{formatFiyat(gosterilecekFiyat)}</span>
          {indirimVar && (
            <span className="font-sans font-medium text-sm line-through text-brand-ink/45">
              {formatFiyat(urun.base_price)}
            </span>
          )}
        </div>
      ) : (
        <p className="mt-1.5 text-xs text-brand-ink/60">{t('ask_price')}</p>
      )}
    </Link>
  );
}
