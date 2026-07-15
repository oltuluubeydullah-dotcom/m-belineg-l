// ════════════════════════════════════════════════════════════
// POST /api/inquiries — Sepet talebini server-side oluştur
// ════════════════════════════════════════════════════════════
// PROBLEM (v11.5 öncesi):
//   Checkout doğrudan Supabase'e INSERT atıyordu.
//   `total_estimate` ve `cart_items[].price` client'tan geliyordu →
//   müşteri DevTools'tan fiyatı 0 yapabilirdi (price tampering).
//   WhatsApp model olduğu için kritik DEĞİL (Enes manuel onaylar)
//   ama yine de "doğru kayıt" için server-side recompute ŞART.
//
// ÇÖZÜM:
//   Bu endpoint cart_items'ı alır, içindeki `id`'lerle DB'den
//   güncel fiyatları çeker, total'i SERVERDE hesaplar, öyle insert.
//
// RATE LIMIT:
//   1 IP / 1 dakikada 3 talep (form spam koruması)
// ════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/service';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { kufurIceriyorMu } from '@/lib/profanity';
import { lisansKontrol, kisitliMi } from '@/lib/ubivo/license';

export const runtime = 'nodejs';

export async function POST(request) {
  // 0) Ubivo lisans kontrolü — restricted/maintenance'de talep alma
  const lisans = await lisansKontrol();
  if (kisitliMi(lisans.status)) {
    return NextResponse.json(
      { ok: false, error: 'service_paused', message: 'Bu servis geçici olarak duraklatıldı. Lütfen kısa süre içinde tekrar deneyiniz.' },
      { status: 503 }
    );
  }

  // 1) Rate limit
  const ip = getClientIP(request);
  const rl = await checkRateLimit(ip, 'inquiry', 3, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limit', retryAfter: rl.retryAfter },
      { status: 429 }
    );
  }

  // 2) Body parse
  let body;
  try { body = await request.json(); } catch (_) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const {
    customer_name,
    customer_phone,
    customer_address,
    customer_note,
    cart_items,
    kvkk_consent,
  } = body || {};

  // 3.0) KVKK açık rıza ZORUNLU — onaysız kişisel veri işlenmez
  if (kvkk_consent !== true) {
    return NextResponse.json({ ok: false, error: 'consent_required' }, { status: 400 });
  }

  // 3) Validation
  if (!customer_name || typeof customer_name !== 'string'
      || customer_name.trim().length < 2 || customer_name.length > 80) {
    return NextResponse.json({ ok: false, error: 'name_invalid' }, { status: 400 });
  }
  if (!customer_phone || typeof customer_phone !== 'string') {
    return NextResponse.json({ ok: false, error: 'phone_invalid' }, { status: 400 });
  }
  const telDigits = customer_phone.replace(/\D/g, '');
  if (telDigits.length < 10 || telDigits.length > 15) {
    return NextResponse.json({ ok: false, error: 'phone_invalid' }, { status: 400 });
  }
  if (!Array.isArray(cart_items) || cart_items.length === 0 || cart_items.length > 50) {
    return NextResponse.json({ ok: false, error: 'cart_invalid' }, { status: 400 });
  }

  // 4) Profanity (ad + not)
  if (kufurIceriyorMu(customer_name)) {
    return NextResponse.json({ ok: false, error: 'profanity_name' }, { status: 400 });
  }
  if (customer_note && kufurIceriyorMu(customer_note)) {
    return NextResponse.json({ ok: false, error: 'profanity_note' }, { status: 400 });
  }

  // 5) Ürün id'lerini çöz — modüller composite id taşır (uuid::index),
  //    ama DB sorgusu GERÇEK ürün id'siyle (productId) yapılmalı.
  //    Aksi halde "uuid::0" uuid kolonuna cast edilemez → checkout patlardı (v13.x fix).
  function parcaIndeksi(it) {
    if (typeof it?.partIndex === 'number' && it.partIndex >= 0) return it.partIndex;
    // Backward-compat: partIndex yoksa composite id'den (uuid::i) çıkar
    if (typeof it?.id === 'string' && it.id.includes('::')) {
      const n = parseInt(it.id.split('::')[1], 10);
      return Number.isInteger(n) ? n : null;
    }
    return null;
  }
  function anaUrunId(it) {
    if (typeof it?.productId === 'string' && it.productId) return it.productId;
    if (typeof it?.id === 'string') return it.id.split('::')[0];
    return null;
  }

  const urunIdSet = new Set();
  for (const it of cart_items) {
    const pid = anaUrunId(it);
    if (!pid) {
      return NextResponse.json({ ok: false, error: 'cart_invalid_ids' }, { status: 400 });
    }
    urunIdSet.add(pid);
  }
  const idler = Array.from(urunIdSet);

  // 6) Server-side fiyat fetch — RLS bypass (service role)
  const svc = getServiceClient();
  if (!svc) {
    return NextResponse.json({ ok: false, error: 'service_unavailable' }, { status: 503 });
  }
  // v13.x: details de çekiliyor — modül/parça fiyatları orada saklanıyor.
  const { data: urunler, error: urunHata } = await svc
    .from('products')
    .select('id, name, slug, base_price, sale_price, is_on_sale, images, details')
    .in('id', idler)
    .eq('is_active', true);
  if (urunHata) {
    console.error('[api/inquiries] DB fetch error:', urunHata.message);
    return NextResponse.json({ ok: false, error: 'db_fetch_error' }, { status: 500 });
  }

  // 7) Server-side total — gerçek fiyatlar (TÜM ÜRÜN veya MODÜL)
  const urunMap = new Map((urunler || []).map((u) => [u.id, u]));
  const cartItemsServer = [];
  let totalServer = 0;
  let priceTamperingDetected = false;

  for (const clientItem of cart_items) {
    const pid = anaUrunId(clientItem);
    const u = urunMap.get(pid);
    if (!u) continue; // ürün kaldırılmış/pasif — sessizce atla

    const pIndex = parcaIndeksi(clientItem);
    const adet = Math.max(1, Math.min(99, parseInt(clientItem.qty, 10) || 1));

    let fiyat, satirAd, satirId;

    if (pIndex === null) {
      // TÜM ÜRÜN / TAKIM — base/sale fiyatı (yazan fiyat)
      fiyat = u.is_on_sale && u.sale_price ? u.sale_price : (u.base_price || 0);
      satirAd = u.name;
      satirId = u.id;
    } else {
      // MODÜL — fiyat DB'deki details.parts[pIndex]'ten (client'a güvenmiyoruz)
      const parts = Array.isArray(u.details?.parts) ? u.details.parts : [];
      const part = parts[pIndex];
      if (!part) continue; // geçersiz/silinmiş modül — atla
      fiyat = Number(part.fiyat) || 0;
      satirAd = `${u.name} — ${part.ad || ('Modül ' + (pIndex + 1))}`;
      satirId = `${u.id}::${pIndex}`;
    }

    // Client fiyatı server fiyatından farklıysa logla (tampering tespiti)
    if (typeof clientItem.price === 'number' && Math.abs(clientItem.price - fiyat) > 0.01) {
      priceTamperingDetected = true;
    }

    totalServer += (fiyat || 0) * adet;

    cartItemsServer.push({
      id: satirId,
      name: satirAd,
      slug: u.slug,
      price: fiyat,             // SERVER fiyatı (client'a güvenmiyoruz)
      qty: adet,
      image: Array.isArray(u.images) && u.images[0] ? u.images[0] : null,
    });
  }

  if (cartItemsServer.length === 0) {
    return NextResponse.json({ ok: false, error: 'cart_empty_or_invalid' }, { status: 400 });
  }

  // 8) Insert — SERVER computed values
  // v12.3 BUG FIX: Türkiye dışı telefon (DE +49 vs.) için doğru format
  let normalizedPhone;
  if (customer_phone.trim().startsWith('+')) {
    // Uluslararası format: + işaretini koruyarak rakamlar
    normalizedPhone = '+' + telDigits;
  } else if (telDigits.startsWith('90') && telDigits.length === 12) {
    // Zaten 90'la başlayan TR numarası
    normalizedPhone = telDigits;
  } else if (telDigits.length === 10 && telDigits.startsWith('5')) {
    // TR mobile (5xx xxx xx xx) — başına 90 ekle
    normalizedPhone = '90' + telDigits;
  } else if (telDigits.length === 11 && telDigits.startsWith('0')) {
    // TR fix-line "0xxx xxx xxxx" → "90xxx..."
    normalizedPhone = '90' + telDigits.slice(1);
  } else {
    // Diğer (DE, UK, vs.) — olduğu gibi kaydet
    normalizedPhone = telDigits;
  }

  const yeniTalep = {
    customer_name:    customer_name.trim().slice(0, 80),
    customer_phone:   normalizedPhone.slice(0, 20),
    customer_address: (typeof customer_address === 'string' && customer_address.trim())
                       ? customer_address.trim().slice(0, 500) : null,
    customer_note:    (typeof customer_note === 'string' && customer_note.trim())
                       ? customer_note.trim().slice(0, 1000) : null,
    cart_items:       cartItemsServer,
    total_estimate:   totalServer > 0 ? totalServer : null,
    consent_at:       new Date().toISOString(),  // KVKK açık rıza ispatı
    whatsapp_sent_at: new Date().toISOString(),
  };

  const { data, error } = await svc
    .from('inquiries')
    .insert(yeniTalep)
    .select()
    .maybeSingle();

  if (error) {
    // v12.3: error.message client'a sızmasın (info disclosure önleme)
    console.error('[api/inquiries] DB insert error:', error.message);
    return NextResponse.json(
      { ok: false, error: 'db_insert_error' },
      { status: 500 }
    );
  }

  // 9) Client'a SERVER computed sepeti döndür → WhatsApp mesajı bununla oluşturulsun
  // v12.3: _meta.tampering kaldırıldı (saldırgan API'yi test edip "tespit edildi" görmesin)
  if (priceTamperingDetected) {
    console.warn('[api/inquiries] Price tampering detected from IP:', ip);
  }

  return NextResponse.json({
    ok: true,
    inquiry_id: data?.id,
    cart_items: cartItemsServer,
    total_estimate: yeniTalep.total_estimate,
  });
}
