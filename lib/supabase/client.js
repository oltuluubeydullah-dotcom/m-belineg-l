// ════════════════════════════════════════════════════════════
// Supabase Client — Tarayıcı tarafı (Client Components)
// ════════════════════════════════════════════════════════════
// "use client" işaretli bileşenlerde bunu kullan.
// Örnek: admin sayfaları, sepet, form'lar.
// ════════════════════════════════════════════════════════════

'use client';

import { createBrowserClient } from '@supabase/ssr';

let _supabase = null;

/**
 * Tarayıcıda kullanılacak Supabase client'ı döner.
 * Singleton paterni — uygulama boyunca tek instance.
 *
 * Kullanım:
 *   import { getSupabaseClient } from '@/lib/supabase/client';
 *   const supabase = getSupabaseClient();
 *   const { data } = await supabase.from('products').select('*');
 */
export function getSupabaseClient() {
  if (_supabase) return _supabase;

  _supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return _supabase;
}

// Backward-compatible alias — eski admin sayfaları createClient adıyla import ediyor
export const createClient = getSupabaseClient;
