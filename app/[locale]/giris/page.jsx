export const dynamic = 'force-dynamic';

// ════════════════════════════════════════════════════════════
// Admin Giriş Sayfası — /giris
// ════════════════════════════════════════════════════════════
// Server component (metadata). Form client component'te.
// ════════════════════════════════════════════════════════════

import { Suspense } from 'react';
import GirisFormu from './GirisFormu';

export const metadata = {
  title: 'Yönetim Girişi',
  robots: { index: false, follow: false },
};

export default function GirisSayfasi() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" /></div>}>
      <GirisFormu />
    </Suspense>
  );
}
