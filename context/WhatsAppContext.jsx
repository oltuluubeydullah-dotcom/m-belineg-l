// ════════════════════════════════════════════════════════════
// WhatsApp Context — client bileşenlere DB şablonlarını taşır
// ════════════════════════════════════════════════════════════
// Public layout, şablonları server-side çekip WhatsAppProvider'a geçer.
// Client bileşenler useWhatsapp() ile şablona bağlı builder'ları alır:
//   const { genelDestekLinki, urunIcinSorMesaji, siparisMesajiOlustur } = useWhatsapp();
// Provider dışında (ör. global error boundary) çağrılırsa VARSAYILAN'a düşer.
// ════════════════════════════════════════════════════════════
'use client';

import { createContext, useContext, useMemo } from 'react';
import {
  genelDestekLinki as _genelDestekLinki,
  urunIcinSorMesaji as _urunIcinSorMesaji,
  siparisMesajiOlustur as _siparisMesajiOlustur,
  VARSAYILAN_SABLONLAR,
} from '@/lib/whatsapp';

const WhatsAppContext = createContext(null);

export function WhatsAppProvider({ sablonlar, children }) {
  const value = useMemo(() => sablonlar || VARSAYILAN_SABLONLAR, [sablonlar]);
  return <WhatsAppContext.Provider value={value}>{children}</WhatsAppContext.Provider>;
}

/**
 * Şablonlara bağlı WhatsApp builder'larını döndürür.
 * İmzalar orijinaliyle aynı (locale/urun/args) — templates otomatik enjekte edilir.
 */
export function useWhatsapp() {
  const sablonlar = useContext(WhatsAppContext) || VARSAYILAN_SABLONLAR;
  return useMemo(
    () => ({
      genelDestekLinki: (locale = 'tr') => _genelDestekLinki(locale, sablonlar),
      urunIcinSorMesaji: (urun, locale = 'tr') => _urunIcinSorMesaji(urun, locale, sablonlar),
      siparisMesajiOlustur: (args) => _siparisMesajiOlustur({ ...args, templates: sablonlar }),
    }),
    [sablonlar],
  );
}
