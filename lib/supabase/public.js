// ════════════════════════════════════════════════════════════
// Supabase Public Client — cookies'siz, anon key
// ════════════════════════════════════════════════════════════
// Public okumalar için. Static generation'da güvenle çalışır.
// Auth gerektiren işler için lib/supabase/server.js kullan.
// ════════════════════════════════════════════════════════════

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Her çağrıda yeni instance oluşturur.
 * ISR ve Edge runtime uyumluluğu için singleton kaldırıldı.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession:   false,
        autoRefreshToken: false,
      },
    }
  );
}
