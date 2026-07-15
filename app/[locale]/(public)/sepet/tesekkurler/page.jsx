export const dynamic = 'force-dynamic';

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { IconCircleCheck, IconBrandWhatsapp, IconHome } from '@tabler/icons-react';
import { genelDestekLinki } from '@/lib/whatsapp';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'Checkout' });
  return { title: t('thanks_title'), robots: { index: false, follow: false } };
}

export default async function TesekkurlerSayfasi({ params: { locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('Checkout');

  return (
    <section className="container mx-auto py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6 animate-fade-in">
          <IconCircleCheck size={56} className="text-green-600" />
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-light tracking-tight text-brand-dark mb-4">
          {t('thanks_title')}
        </h1>

        <p className="text-lg text-brand-ink/70 mb-8 leading-relaxed">
          {t('thanks_text')}
        </p>

        <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6 md:p-8 text-left space-y-4 mb-8">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center font-semibold text-sm shrink-0">1</div>
            <div className="flex-1 pt-1"><p className="text-sm text-brand-ink/85">{t('thanks_step1')}</p></div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center font-semibold text-sm shrink-0">2</div>
            <div className="flex-1 pt-1"><p className="text-sm text-brand-ink/85">{t('thanks_step2')}</p></div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center font-semibold text-sm shrink-0">3</div>
            <div className="flex-1 pt-1"><p className="text-sm text-brand-ink/85">{t('thanks_step3')}</p></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <IconHome size={18} />
            {locale === 'tr' ? 'Anasayfa' : locale === 'en' ? 'Home' : 'Startseite'}
          </Link>
          <a href={genelDestekLinki(locale)} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-colors">
            <IconBrandWhatsapp size={18} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
