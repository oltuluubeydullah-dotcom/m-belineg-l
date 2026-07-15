// ════════════════════════════════════════════════════════════
// POST /api/upload — Sıkıştırılmış görseli R2'ye yükler
// ════════════════════════════════════════════════════════════
// Client TARAYICIDA sıkıştırır (webp/resize), bu route SADECE
// hazır blob'u alıp R2'ye yazar. R2 secret'ı serverda kalır.
// Sadece allowlist admin erişebilir.
// R2 yapılandırılmamışsa 503 → client Supabase fallback'ine düşer.
// by ubivo
// ════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/auth/admin';
import { r2Aktif, r2Yukle, r2Sil } from '@/lib/r2';

export const runtime = 'nodejs';
export const maxDuration = 30;

const IZINLI_TIPLER = new Set(['image/webp', 'image/jpeg', 'image/png']);
const IZINLI_KLASORLER = new Set(['urunler', 'kategoriler', 'bloglar', 'hero', 'diger']);
const MAX_BYTE = 8 * 1024 * 1024; // sıkıştırma sonrası 8 MB üstü = anormal

export async function POST(request) {
  // ── Auth: sadece admin ──
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 });
    if (!isAdminUser(user)) return NextResponse.json({ ok: false, error: 'Yetki yok' }, { status: 403 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Auth hatası' }, { status: 401 });
  }

  // ── R2 yoksa fallback sinyali ──
  if (!r2Aktif()) {
    return NextResponse.json({ ok: false, error: 'r2_yok', fallback: true }, { status: 503 });
  }

  // ── Dosyayı al ──
  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek' }, { status: 400 });
  }

  const dosya = form.get('file');
  const klasorRaw = String(form.get('folder') || 'diger');
  const uzantiRaw = String(form.get('ext') || '');

  if (!dosya || typeof dosya.arrayBuffer !== 'function') {
    return NextResponse.json({ ok: false, error: 'Dosya yok' }, { status: 400 });
  }
  if (!IZINLI_TIPLER.has(dosya.type)) {
    return NextResponse.json({ ok: false, error: 'Geçersiz dosya tipi' }, { status: 415 });
  }
  if (dosya.size > MAX_BYTE) {
    return NextResponse.json({ ok: false, error: 'Dosya çok büyük' }, { status: 413 });
  }

  const klasor = IZINLI_KLASORLER.has(klasorRaw) ? klasorRaw : 'diger';
  const uzanti = /^(webp|jpg|jpeg|png)$/.test(uzantiRaw)
    ? uzantiRaw
    : (dosya.type === 'image/webp' ? 'webp' : dosya.type === 'image/png' ? 'png' : 'jpg');

  const ad = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${uzanti}`;
  const key = `${klasor}/${ad}`;

  try {
    const buffer = Buffer.from(await dosya.arrayBuffer());
    const url = await r2Yukle(buffer, key, dosya.type);
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error('[api/upload] R2 yükleme hatası:', e?.message);
    return NextResponse.json({ ok: false, error: 'Yükleme başarısız', fallback: true }, { status: 500 });
  }
}

export async function DELETE(request) {
  // ── Auth: sadece admin ──
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 });
    if (!isAdminUser(user)) return NextResponse.json({ ok: false, error: 'Yetki yok' }, { status: 403 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Auth hatası' }, { status: 401 });
  }

  let body = {};
  try { body = await request.json(); } catch { /* boş OK */ }
  if (!body.url) return NextResponse.json({ ok: false, error: 'url yok' }, { status: 400 });

  try {
    await r2Sil(body.url);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/upload] R2 silme hatası:', e?.message);
    return NextResponse.json({ ok: false, error: 'Silme başarısız' }, { status: 500 });
  }
}
