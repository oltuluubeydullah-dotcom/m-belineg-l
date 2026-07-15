// ════════════════════════════════════════════════════════════
// Ubivo License Check — Server-side, 1 saat cache
// ════════════════════════════════════════════════════════════
// Her sayfa render edilirken Ubivo Master Supabase'i sorgular.
// Cache: Next.js `next.revalidate` ile 1 saat.
// Hata olursa fail-open → 'active' dön (müşteri zarar görmesin).
// ════════════════════════════════════════════════════════════

const UBIVO_SUPABASE_URL  = process.env.UBIVO_SUPABASE_URL;
const UBIVO_SUPABASE_KEY  = process.env.UBIVO_SUPABASE_ANON_KEY;
const LICENSE_ID          = process.env.UBIVO_LICENSE_ID || 'unknown';
const DOMAIN              = process.env.UBIVO_DOMAIN || 'localhost';

// Status mantığı:
//   active        → her şey normal
//   warning_1     → ince sarı banner
//   warning_2     → büyük banner
//   restricted    → WhatsApp/Sepet disabled
//   maintenance   → tam ekran kapanma
export const LICENSE_STATUSES = {
  ACTIVE:      'active',
  WARNING_1:   'warning_1',
  WARNING_2:   'warning_2',
  RESTRICTED:  'restricted',
  MAINTENANCE: 'maintenance',
};

// Boş/hatalı durumda fail-open default
const FAIL_OPEN = {
  status: LICENSE_STATUSES.ACTIVE,
  message: null,
  paid_until: null,
  found: false,
};

/**
 * Lisans durumunu kontrol et — server-side.
 * Sonuç 1 saat cache'lenir (Next.js fetch revalidate).
 */
export async function lisansKontrol() {
  // Env yoksa fail-open (geliştirme ortamı)
  if (!UBIVO_SUPABASE_URL || !UBIVO_SUPABASE_KEY) {
    return FAIL_OPEN;
  }

  try {
    const url = `${UBIVO_SUPABASE_URL}/rest/v1/rpc/check_license`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': UBIVO_SUPABASE_KEY,
        'Authorization': `Bearer ${UBIVO_SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        p_license_id: LICENSE_ID,
        p_domain: DOMAIN,
      }),
      // Next.js 1 saat cache + tag'le manuel invalidate
      next: { revalidate: 3600, tags: ['ubivo-license'] },
    });

    if (!res.ok) {
      console.warn('[ubivo/license] HTTP fail:', res.status);
      return FAIL_OPEN;
    }

    const data = await res.json();
    // RPC dizi döndürür, ilk elemanı al
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return FAIL_OPEN;

    return {
      status: row.status || LICENSE_STATUSES.ACTIVE,
      message: row.message || null,
      paid_until: row.paid_until || null,
      found: row.found || false,
    };
  } catch (err) {
    console.warn('[ubivo/license] fetch error:', err?.message);
    return FAIL_OPEN;
  }
}

/**
 * Yardımcı: status'ten kısıtlama seviyesi al
 */
export function kisitlamaSeviyesi(status) {
  switch (status) {
    case LICENSE_STATUSES.MAINTENANCE: return 4;
    case LICENSE_STATUSES.RESTRICTED:  return 3;
    case LICENSE_STATUSES.WARNING_2:   return 2;
    case LICENSE_STATUSES.WARNING_1:   return 1;
    default: return 0;
  }
}

export function bakimMi(status) {
  return status === LICENSE_STATUSES.MAINTENANCE;
}

export function kisitliMi(status) {
  return kisitlamaSeviyesi(status) >= 3;
}

export function bannerGosterilsinMi(status) {
  return kisitlamaSeviyesi(status) >= 1;
}
