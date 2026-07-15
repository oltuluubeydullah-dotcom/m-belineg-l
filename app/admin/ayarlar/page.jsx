// ════════════════════════════════════════════════════════════
// Admin / Ayarlar — Server Component
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import AyarlarFormu from './AyarlarFormu';
import SifreDegistir from './SifreDegistir';

export const metadata = {
  title: 'Site Ayarları',
};

export default async function AyarlarSayfasi() {
  const supabase = createClient();

  const { data: ayarlar } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  return (
    <>
      <AyarlarFormu ilkAyarlar={ayarlar} />
      <SifreDegistir />
    </>
  );
}
