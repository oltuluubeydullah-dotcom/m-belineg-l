import { createClient } from '@/lib/supabase/server';
import WhatsAppSablonlariYonetim from './WhatsAppSablonlariYonetim';

export const dynamic = 'force-dynamic';

export default async function Sayfa() {
  const supabase = createClient();
  const { data } = await supabase
    .from('whatsapp_templates')
    .select('*')
    .order('key', { ascending: true });
  return <WhatsAppSablonlariYonetim baslangic={data || []} />;
}
