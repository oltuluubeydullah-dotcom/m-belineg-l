import { createClient } from '@/lib/supabase/server';
import SayfalarYonetim from './SayfalarYonetim';

export const dynamic = 'force-dynamic';

export default async function SayfalarAdmin() {
  const supabase = createClient();
  const { data } = await supabase
    .from('content_pages')
    .select('*')
    .order('slug', { ascending: true });
  return <SayfalarYonetim baslangic={data || []} />;
}
