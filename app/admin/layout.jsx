// ════════════════════════════════════════════════════════════
// Admin Layout — Server Component
// ════════════════════════════════════════════════════════════
// Middleware zaten yetkisiz erişimi engelliyor, burada da
// double-check yapıyoruz (defense in depth).
// ════════════════════════════════════════════════════════════

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/auth/admin';
import { lisansKontrol } from '@/lib/ubivo/license';
import Providers from '@/app/providers';
import AdminShell from './AdminShell';
import AdminLicenseBanner from './AdminLicenseBanner';

// Admin sayfaları AUTH gerektiriyor — cookies'li client kullanılıyor
// Build-time prerender'da cookies() çağrısı patlıyor → her sayfa request-time render
export const dynamic = 'force-dynamic';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/giris');
  }

  // v11.8 GÜVENLİK: middleware'in yanı sıra layout'ta da email allowlist kontrolü
  // (defense in depth — middleware'i bir şekilde atlatan istekleri burada kes)
  if (!isAdminUser(user)) {
    redirect('/giris?error=unauthorized');
  }

  // v13.0: Ubivo lisans durumunu çek, admin'in görmesi için banner
  const lisans = await lisansKontrol();

  return (
    <Providers>
      <AdminShell user={user}>
        <AdminLicenseBanner status={lisans.status} message={lisans.message} paidUntil={lisans.paid_until} />
        {children}
      </AdminShell>
    </Providers>
  );
}
