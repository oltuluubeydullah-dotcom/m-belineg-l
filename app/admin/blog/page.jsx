// ════════════════════════════════════════════════════════════
// Admin / Blog — Server Component
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import BlogYonetim from './BlogYonetim';

export const metadata = {
  title: 'Blog Yönetimi',
};

export default async function BlogAdminSayfasi() {
  const supabase = createClient();

  let yazilar = [];
  try {
    // PERF (Ajan #24): liste sadece bu kolonları gösteriyor; tüm makale
    // gövdesini (content) + translations jsonb'yi çekme. Düzenlemede tam
    // satır BlogYonetim.duzenleAc içinde id ile yeniden çekilir.
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, cover_image, is_published, published_at, created_at')
      .order('created_at', { ascending: false });
    yazilar = data || [];
  } catch (e) {
    // Tablo henüz yoksa
  }

  return <BlogYonetim ilkYazilar={yazilar} />;
}
