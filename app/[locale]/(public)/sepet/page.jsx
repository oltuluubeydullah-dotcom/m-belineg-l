// ════════════════════════════════════════════════════════════
// Sepet Sayfası — /sepet
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import SepetClient from './SepetClient';

export async function generateMetadata() {
  const t = await getTranslations('Cart');
  return {
    title: t('title'),
    description: t('subtitle'),
    robots: { index: false, follow: true },
  };
}

export default async function SepetSayfasi() {
  const t = await getTranslations('Cart');
  return (
    <>
      <div className="section-band">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-white drop-shadow-md">
            {t('title')}
          </h1>
          <p className="text-white/85 font-sans text-sm mt-3 tracking-widest uppercase">
            {t('subtitle')}
          </p>
        </div>
      </div>
      <SepetClient />
    </>
  );
}
