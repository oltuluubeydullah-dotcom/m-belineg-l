import { createClient } from '@/lib/supabase/server';
import HeroBannerYonetim from './HeroBannerYonetim';

export const dynamic = 'force-dynamic';

export default async function HeroBannerSayfa() {
  const supabase = createClient();
  const { data: banners } = await supabase
    .from('hero_banners')
    .select('*')
    .order('sort_order', { ascending: true });

  return <HeroBannerYonetim baslangic={banners || []} />;
}
