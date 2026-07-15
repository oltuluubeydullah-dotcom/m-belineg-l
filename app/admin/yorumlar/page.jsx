import { createClient } from '@/lib/supabase/server';
import YorumlarYonetim from './YorumlarYonetim';

export const dynamic = 'force-dynamic';

export default async function YorumlarSayfa() {
  const supabase = createClient();
  const { data } = await supabase
    .from('reviews')
    .select('*, products(name, slug)')
    .order('created_at', { ascending: false })
    .limit(200);
  return <YorumlarYonetim baslangic={data || []} />;
}
