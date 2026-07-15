// ════════════════════════════════════════════════════════════
// Admin Email Allowlist — Yetkili kullanıcı kontrolü
// ════════════════════════════════════════════════════════════
// KULLANIM:
//   Vercel Dashboard → Environment Variables:
//   ADMIN_EMAILS=admin@firmaadi.com
//   Birden fazla: ADMIN_EMAILS=a@x.com,b@y.com
//
// EKSTRA GÜVENLİK:
//   Supabase Dashboard → Authentication → Sign Ups → DISABLE
// ════════════════════════════════════════════════════════════

/**
 * Allowlist'i env'den oku.
 * NEXT_PUBLIC_ önekli DEĞİL — client bundle'a sızmasın.
 * Sadece server (middleware, API route, server component).
 */
export function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || '';
  if (!raw.trim()) return [];
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Bir email allowlist'te mi?
 * Case-insensitive karşılaştırma.
 */
export function isAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emails = getAdminEmails();
  if (emails.length === 0) {
    // TEŞHİS: env hiç okunamıyor — Vercel'de ADMIN_EMAILS yok ya da
    // bu ortama (Production) eklenmemiş demektir.
    console.error('[admin] ADMIN_EMAILS env BOŞ veya okunamıyor. Vercel env kontrolü gerek.');
    return false;
  }
  const normalized = email.trim().toLowerCase();
  const sonuc = emails.includes(normalized);
  if (!sonuc) {
    // TEŞHİS: env var ama eşleşmedi — yazım/boşluk farkı olabilir.
    console.error(`[admin] Email eşleşmedi. Gelen: "${normalized}" | İzinli liste: ${JSON.stringify(emails)}`);
  }
  return sonuc;
}

/**
 * Supabase user objesinden admin mi diye kontrol et.
 * email_confirmed_at zorunlu — onaylanmamış email ile admin OLAMAZ.
 */
export function isAdminUser(user) {
  if (!user) return false;
  if (!user.email) return false;
  if (!user.email_confirmed_at) return false;
  return isAdminEmail(user.email);
}
