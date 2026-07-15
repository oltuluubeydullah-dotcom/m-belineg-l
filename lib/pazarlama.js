// ════════════════════════════════════════════════════════════
// Pazarlama Köprüsü — tek event, tüm platformlar (v51)
// ════════════════════════════════════════════════════════════
// reklamEvent('Lead', {...}) → Meta Pixel + TikTok Pixel + Google
// hangisi aktifse hepsine gider. Pixel yüklü değilse sessizce atlar.
// KVKK: pixeller zaten consent'e bağlı yüklenir (PixelScripts.jsx).
//
// utmYakala() → reklam linkindeki utm_* parametrelerini sessionStorage'a
// yazar (ilk dokunuş). utmGetir() → iç analitik event'lerine eklenir.
// ════════════════════════════════════════════════════════════
'use client';

const UTM_KEY = 'mobel-utm';

// ─── UTM ─────────────────────────────────────────────────────
export function utmYakala() {
  try {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const source = p.get('utm_source');
    if (!source) return; // utm yoksa dokunma (ilk dokunuş korunur)
    const utm = {
      utm_source: source.slice(0, 80),
      utm_medium: (p.get('utm_medium') || '').slice(0, 80) || null,
      utm_campaign: (p.get('utm_campaign') || '').slice(0, 120) || null,
    };
    sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
  } catch (_) { /* storage kapalıysa sorun değil */ }
}

export function utmGetir() {
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) { return {}; }
}

// ─── Pixel event köprüsü ─────────────────────────────────────
// EVENT_MAP: ortak ad → her platformun standart event adı
const EVENT_MAP = {
  ViewContent: { meta: 'ViewContent', tiktok: 'ViewContent', google: 'view_item' },
  AddToCart:   { meta: 'AddToCart',   tiktok: 'AddToCart',   google: 'add_to_cart' },
  Lead:        { meta: 'Lead',        tiktok: 'Contact',     google: 'generate_lead' },
  Search:      { meta: 'Search',      tiktok: 'Search',      google: 'search' },
  InitiateCheckout: { meta: 'InitiateCheckout', tiktok: 'InitiateCheckout', google: 'begin_checkout' },
};

/**
 * Tüm aktif reklam platformlarına event gönder.
 * @param {string} ad - EVENT_MAP anahtarı (ör. 'Lead')
 * @param {object} veri - { content_name, content_ids, value, currency, search_string }
 */
export function reklamEvent(ad, veri = {}) {
  if (typeof window === 'undefined') return;
  const map = EVENT_MAP[ad];
  if (!map) return;
  const ortak = {
    content_name: veri.content_name,
    content_ids: veri.content_ids,
    content_type: veri.content_ids ? 'product' : undefined,
    value: veri.value,
    currency: veri.value != null ? 'TRY' : undefined,
    search_string: veri.search_string,
  };
  // Meta Pixel
  try { if (window.fbq) window.fbq('track', map.meta, temizle(ortak)); } catch (_) {}
  // TikTok Pixel
  try {
    if (window.ttq) window.ttq.track(map.tiktok, temizle({
      contents: veri.content_ids ? [{ content_id: veri.content_ids[0], content_name: veri.content_name }] : undefined,
      value: ortak.value, currency: ortak.currency, query: veri.search_string,
    }));
  } catch (_) {}
  // Google (GA4 + Ads — gtag tek kanal)
  try {
    if (window.gtag) window.gtag('event', map.google, temizle({
      items: veri.content_ids ? [{ item_id: veri.content_ids[0], item_name: veri.content_name }] : undefined,
      value: ortak.value, currency: ortak.currency, search_term: veri.search_string,
    }));
  } catch (_) {}
}

function temizle(obj) {
  const out = {};
  for (const k in obj) if (obj[k] !== undefined && obj[k] !== null) out[k] = obj[k];
  return out;
}

// ─── İç analitik + pixel birlikte ────────────────────────────
/**
 * Hem kendi site_events tablomuza hem reklam platformlarına yazar.
 * eventType: 'sepete_ekleme' | 'urun_tiklama' | 'whatsapp_tiklama'
 */
export function olayGonder(eventType, { productId, path, locale, pixel, pixelVeri } = {}) {
  // 1) İç analitik (UTM eklenir)
  try {
    const utm = utmGetir();
    fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        product_id: productId || null,
        path: path || (typeof window !== 'undefined' ? window.location.pathname : null),
        locale: locale || 'tr',
        ...utm,
      }),
      keepalive: true, // sayfa kapanırken bile gitsin (WhatsApp'a geçişte kritik)
    }).catch(() => {});
  } catch (_) {}
  // 2) Reklam platformları
  if (pixel) reklamEvent(pixel, pixelVeri || {});
}
