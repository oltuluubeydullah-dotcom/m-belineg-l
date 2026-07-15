// ════════════════════════════════════════════════════════════
// Sepet Sayfası — /sepet
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import SepetClient from './SepetClient';

export const metadata = {
  title: 'Sepetim',
  description: 'Möbel İnegöl sepetinizdeki ürünler',
  robots: { index: false, follow: true },
};

export default function SepetSayfasi() {
  return (
    <>
      <div className="section-band">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-white drop-shadow-md">
            Sepetim
          </h1>
          <p className="text-white/85 font-sans text-sm mt-3 tracking-widest uppercase">
            Sepetinizi gözden geçirin, WhatsApp'tan onaylayın
          </p>
        </div>
      </div>
      <SepetClient />
    </>
  );
}
