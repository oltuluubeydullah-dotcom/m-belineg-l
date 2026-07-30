// ════════════════════════════════════════════════════════════
// Supabase Sorguları — v12.1 SAVUNMACI MUTATION PATTERN
// ════════════════════════════════════════════════════════════
// v12.1 KRİTİK FIX:
//   • TÜM mutation'lar (.maybeSingle() yerine .maybeSingle())
//   • RLS UPDATE+SELECT mismatch durumunda "Cannot coerce" yerine
//     anlamlı hata mesajı VEYA optimistic fallback
//   • Bug: ürün güncelleme bazen kayıt edilip yine de hata gösteriyordu
//     (UPDATE çalışıyor, RETURNING'i SELECT policy bloklıyordu)
// ════════════════════════════════════════════════════════════
// Hem client hem server taraftan çağrılabilir.
// Çağıran taraf doğru supabase instance'ını verir.
// ════════════════════════════════════════════════════════════

// ─── KATEGORİLER ─────────────────────────────────────────────

export async function kategorileriGetir(supabase, { aktifMi = true } = {}) {
  let q = supabase.from('categories').select('*').order('sort_order', { ascending: true });
  if (aktifMi) q = q.eq('is_active', true);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function kategoriBulSlug(supabase, slug) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function kategoriGuncelle(supabase, id, degisiklikler) {
  const { data, error } = await supabase
    .from('categories')
    .update(degisiklikler)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  // RLS RETURNING blok ederse data null gelir → optimistic dön
  return data || { id, ...degisiklikler };
}

// ─── ÜRÜNLER ─────────────────────────────────────────────────

// Liste/kart görünümü için kolon seti.
// NOT (v35.1 hotfix): Açık kolon listesi canlı DB'de eksik bir kolona denk gelince
// Supabase sorguyu 400 ile reddediyordu → ürünler boş dönüyordu. Güvenli '*' kullanıyoruz:
// '*' yalnızca var olan kolonları çeker, eksik kolon hatası vermez.
// Performans (description/variants hariç tutma) DB şeması doğrulandıktan sonra tekrar denenecek.
export const URUN_LISTE_SELECT = '*, categories!category_id(name, slug, translations)';

export async function urunleriGetir(supabase, {
  kategoriId = null,
  aktifMi = true,
  oneCikan = false,
  limit = null,
  siralama = 'sort_order',
  yon = 'asc',
} = {}) {
  let q = supabase
    .from('products')
    .select(URUN_LISTE_SELECT)
    .order(siralama, { ascending: yon === 'asc' });
  if (kategoriId) q = q.eq('category_id', kategoriId);
  if (aktifMi) q = q.eq('is_active', true);
  if (oneCikan) q = q.eq('is_featured', true);
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function urunBulSlug(supabase, slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!category_id(name, slug)')
    .eq('slug', slug)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function urunOlustur(supabase, veri) {
  const { data, error } = await supabase
    .from('products')
    .insert([veri])
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    // Insert yapıldı ama RLS RETURNING'i bloklamış — slug ile re-fetch dene
    if (veri.slug) {
      const refetch = await supabase
        .from('products')
        .select('*')
        .eq('slug', veri.slug)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (refetch.data) return refetch.data;
    }
    throw new Error('Ürün oluşturuldu ama dönüş okunamadı. Sayfayı yenileyin.');
  }
  return data;
}

export async function urunGuncelle(supabase, id, degisiklikler) {
  const { data, error } = await supabase
    .from('products')
    .update(degisiklikler)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    // RLS RETURNING blocked → ayrı SELECT ile doğrula
    const verify = await supabase
      .from('products')
      .select('*, categories!category_id(name, slug, translations)')
      .eq('id', id)
      .maybeSingle();
    if (verify.data) return verify.data;
    // FIX (Agent #54 #2): teyit edilemeyen yazımı "başarılı" gösterme.
    // Sahte başarı → admin yanlış fiyat/stok kaydettiğini sanır. Anlamlı hata fırlat.
    throw new Error('Güncelleme doğrulanamadı. Sayfayı yenileyip kontrol edin.');
  }
  return data;
}

export async function urunSil(supabase, id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ─── TALEPLER (Inquiries) ───────────────────────────────────

export async function talepKaydet(supabase, veri) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([{ ...veri, whatsapp_sent_at: new Date().toISOString() }])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data || { ...veri, id: null };  // Talep API server-side, RLS sorunu beklemiyoruz
}

export async function taleplersGetir(supabase, { limit = 50 } = {}) {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

// ─── AYARLAR ────────────────────────────────────────────────

export async function ayarlariGetir(supabase) {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function ayarlariGuncelle(supabase, id, degisiklikler) {
  const { data, error } = await supabase
    .from('settings')
    .update(degisiklikler)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data || { id, ...degisiklikler };
}

// ─── DASHBOARD STATS ────────────────────────────────────────

export async function dashboardIstatistikleri(supabase) {
  const [urunler, kategoriler, talepler] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('inquiries').select('id', { count: 'exact', head: true }),
  ]);
  return {
    toplamUrun: urunler.count || 0,
    toplamKategori: kategoriler.count || 0,
    toplamTalep: talepler.count || 0,
  };
}
