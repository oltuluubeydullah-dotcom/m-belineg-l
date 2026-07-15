// ════════════════════════════════════════════════════════════
// LicenseContext — Client component'ler için license durumu
// ════════════════════════════════════════════════════════════
// Server component'te lisans çekildikten sonra, sepet/WhatsApp
// gibi client component'lerin "kısıtlama var mı?" diye bilmesi
// için context.
// ════════════════════════════════════════════════════════════

'use client';

import { createContext, useContext } from 'react';
import { LICENSE_STATUSES, kisitliMi } from '@/lib/ubivo/license';

const LicenseContext = createContext({
  status: LICENSE_STATUSES.ACTIVE,
  message: null,
  paid_until: null,
});

export function LicenseProvider({ value, children }) {
  return (
    <LicenseContext.Provider value={value || { status: LICENSE_STATUSES.ACTIVE }}>
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicense() {
  return useContext(LicenseContext);
}

/**
 * Yardımcı: WhatsApp/Sepet butonları "restricted" modda
 * disabled olur. Bu hook'u her interaktif butonun yanında çağır.
 */
export function useKisitlama() {
  const { status } = useLicense();
  return {
    kisitli: kisitliMi(status),
    sebep: 'Servis duraklatıldı — kısa süre içinde aktif olacaktır.',
  };
}
