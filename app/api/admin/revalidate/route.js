// ════════════════════════════════════════════════════════════
// Manuel cache temizleme API'si (admin için)
// ════════════════════════════════════════════════════════════
// POST /api/admin/revalidate
// Body: { path?: string } — verilmezse '/' temizler
// ════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/auth/admin';

export const runtime = 'nodejs';

export async function POST(request) {
  // Auth: sadece allowlist'teki admin
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 });
    }
    // v11.6 GÜVENLİK: email allowlist kontrolü
    if (!isAdminUser(user)) {
      return NextResponse.json({ ok: false, error: 'Yetki yok' }, { status: 403 });
    }
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Auth hatası' }, { status: 401 });
  }

  let body = {};
  try { body = await request.json(); } catch { /* boş gövde OK */ }

  const yollar = body.paths || (body.path ? [body.path] : ['/', '/tr', '/en', '/de']);

  try {
    yollar.forEach(y => {
      try { revalidatePath(y, 'page'); } catch {}
      try { revalidatePath(y, 'layout'); } catch {}
    });
    return NextResponse.json({ ok: true, temizlenen: yollar });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
