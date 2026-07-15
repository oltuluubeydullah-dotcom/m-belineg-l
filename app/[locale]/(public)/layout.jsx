// ════════════════════════════════════════════════════════════
// Public Layout (v9.1)
// ════════════════════════════════════════════════════════════
// (public) route grubu — Header + Footer + WhatsApp burada.
// Server component: DB'den aktif kategorileri çekip Header'a props ile geçer.
// Admin'in eklediği yeni kategoriler artık otomatik header'a düşer.
// ════════════════════════════════════════════════════════════

import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import CookieConsent from '@/components/public/CookieConsent';
import LicenseGate from '@/components/ubivo/LicenseGate';
import { createPublicClient } from '@/lib/supabase/public';
import { KATEGORILER as KAT_FALLBACK } from '@/lib/constants';

// Admin'den yapılan kategori/duyuru/banner değişiklikleri on-demand revalidation ile
// güncellenir (admin CRUD → /api/admin/revalidate çağrılır).
// 5 dakikada bir de otomatik ISR yenileme yapılır.
export const revalidate = 300;

export default async function PublicLayout({ children }) {
  // DB'den aktif kategorileri çek
  const supabase = createPublicClient();
  let kategoriler = [];
  try {
    const { data } = await supabase
      .from('categories')
      .select('name, slug, translations')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    kategoriler = data || [];
  } catch (e) {
    // DB erişimi başarısız → fallback statik liste
  }

  // Hiç kategori yoksa fallback
  if (kategoriler.length === 0) {
    kategoriler = KAT_FALLBACK;
  }

  return (
    <LicenseGate>
      <Header kategoriler={kategoriler} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
    </LicenseGate>
  );
}
