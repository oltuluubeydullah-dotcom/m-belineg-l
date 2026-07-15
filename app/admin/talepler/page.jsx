// ════════════════════════════════════════════════════════════
// Admin / Talepler — Server Component
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import TaleplerListe from './TaleplerListe';

export const metadata = {
  title: 'Müşteri Talepleri',
};

export default async function TaleplerSayfasi() {
  const supabase = createClient();

  const { data: talepler } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  return <TaleplerListe ilkTalepler={talepler || []} />;
}
