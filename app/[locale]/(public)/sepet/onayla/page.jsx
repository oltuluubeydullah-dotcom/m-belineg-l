// ════════════════════════════════════════════════════════════
// Checkout Sayfası — /sepet/onayla
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import CheckoutFormu from './CheckoutFormu';

export const metadata = {
  title: 'Siparişi Onayla',
  robots: { index: false, follow: false },
};

export default function CheckoutSayfasi() {
  return (
    <>
      <div className="section-band">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-white drop-shadow-md">
            Siparişi Onayla
          </h1>
          <p className="text-white/85 font-sans text-sm mt-3 tracking-widest uppercase">
            Bilgilerinizi girin — WhatsApp'tan iletişime geçelim
          </p>
        </div>
      </div>
      <CheckoutFormu />
    </>
  );
}
