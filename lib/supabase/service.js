// ════════════════════════════════════════════════════════════
// Supabase Service Role Client
// ════════════════════════════════════════════════════════════
// SADECE server-side API route'lardan çağrılır.
// Service role RLS'i bypass eder — client'a asla expose etme.
// Env yoksa null döndür, çağıran kontrol etsin.
// ════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

/**
 * Her çağrıda yeni client oluşturur.
 * Serverless ortamda module-level singleton güvenli olmayabilir.
 */
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[supabase/service] SUPABASE_SERVICE_ROLE_KEY eksik — özellik devre dışı');
    }
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession:   false,
      autoRefreshToken: false,
    },
  });
}
