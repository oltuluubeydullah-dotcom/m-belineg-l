// ════════════════════════════════════════════════════════════
// LicenseGate — Public layout'u sarar
// ════════════════════════════════════════════════════════════
// Server component. lisansKontrol() çağırır, sonuca göre:
//   maintenance → MaintenancePage göster (içeriği gizle)
//   diğer       → Banner + içerik göster
// Child component'lere context ile status'u geçirir.
// ════════════════════════════════════════════════════════════

import { lisansKontrol, bakimMi } from '@/lib/ubivo/license';
import LicenseBanner from './LicenseBanner';
import MaintenancePage from './MaintenancePage';
import { LicenseProvider } from './LicenseContext';

export default async function LicenseGate({ children }) {
  const lisans = await lisansKontrol();

  if (bakimMi(lisans.status)) {
    return <MaintenancePage message={lisans.message} />;
  }

  return (
    <LicenseProvider value={lisans}>
      <LicenseBanner status={lisans.status} message={lisans.message} />
      {children}
    </LicenseProvider>
  );
}
