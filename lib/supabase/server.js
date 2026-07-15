// ════════════════════════════════════════════════════════════
// Supabase Client — Server tarafı (Server Components, SSG)
// ════════════════════════════════════════════════════════════
// "use client" YOK olan bileşenlerde bunu kullan.
// Örnek: kategori sayfası, ürün detayı, anasayfa (SEO için).
// ════════════════════════════════════════════════════════════

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client.
 * Next.js cookie API'sini kullanır (kullanıcı oturumu için).
 *
 * Kullanım:
 *   import { createClient } from '@/lib/supabase/server';
 *   const supabase = createClient();
 *   const { data } = await supabase.from('products').select('*');
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server Component'ten çağrıldığında set sessizce başarısız olur.
            // Middleware'de oturum yenileniyorsa bu normal.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Yukarıdaki gibi sessiz başarısızlık.
          }
        },
      },
    }
  );
}
