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
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    yazilar = data || [];
  } catch (e) {
    // Tablo henüz yoksa
  }

  return <BlogYonetim ilkYazilar={yazilar} />;
}
