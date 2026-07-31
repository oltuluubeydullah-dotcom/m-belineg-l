// ════════════════════════════════════════════════════════════
// Möbel İnegöl — Admin Dashboard v2
// Ziyaretçi, Tıklanma, Favori, Talep istatistikleri
// ════════════════════════════════════════════════════════════

import Link from 'next/link';
import {
  IconPackage, IconCategory, IconEye,
  IconArrowRight, IconPlus, IconStarFilled, IconTrendingUp,
  IconHeart, IconUsers, IconChartBar, IconCalendar,
  IconBrandWhatsapp, IconActivity, IconShoppingCart,
} from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminAnasayfa() {
  const supabase = createClient();

  // ─── Temel istatistikler ─────────────────────────────────
  let stats = {
    aktif_urun: 0, toplam_urun: 0, aktif_kategori: 0,
    son_30_gun_talep: 0, toplam_talep: 0,
    son_30_gun_ziyaret: 0, bugun_ziyaret: 0, toplam_ziyaret: 0,
    tekil_ziyaret_30g: 0, tekil_ziyaret_bugun: 0, sepete_ekleme_30g: 0,
    toplam_yorum: 0, ortalama_yorum: 0, yayinda_blog: 0,
  };

  let statsView = null;
  try {
    const { data } = await supabase.from('admin_stats').select('*').maybeSingle();
    if (data) { statsView = data; stats = { ...stats, ...data }; }
  } catch (e) { console.error("[admin] veri hatasi:", e); }

  // Fallback — admin_stats view YOKSA (data null) temel sayımları çek.
  // FIX (v58): tetik koşulu artık gerçek view yokluğu (statsView === null);
  // eskiden aktif_urun===0 (tüm ürünler pasif) her yüklemede fallback tetikliyordu.
  if (statsView === null) {
    try {
      const otuzGun = new Date(Date.now() - 30*86400000).toISOString();
      const say = (tablo, kur) => {
        const q = supabase.from(tablo).select('id', { count: 'exact', head: true });
        return kur ? kur(q) : q;
      };
      const [p, k, i, pv] = await Promise.all([
        say('products', q => q.eq('is_active', true)),
        say('categories', q => q.eq('is_active', true)),
        say('inquiries', q => q.gte('created_at', otuzGun)),
        say('page_views', q => q.gte('created_at', otuzGun)),
      ]);
      stats.aktif_urun = p.count || 0;
      stats.aktif_kategori = k.count || 0;
      stats.son_30_gun_talep = i.count || 0;
      stats.son_30_gun_ziyaret = pv.count || 0;
    } catch (e) { console.error("[admin] veri hatasi:", e); }
  }

  // ─── Kalan tüm veriyi TEK Promise.all ile paralel çek ────
  // PERF (v58 · Ajan #24): eskiden 7 blok sıralı await'liydi (~9 gidiş-dönüş
  // ardışık). Hepsi birbirinden bağımsız → paralel. Ham satır toplama SQL'e
  // taşındı: admin_daily_views / admin_top_paths RPC (≤8 satır döner).
  const otuzGunISO = new Date(Date.now() - 30 * 86400000).toISOString();
  const sayEvent = (tip) => supabase.from('site_events')
    .select('id', { count: 'exact', head: true })
    .eq('event_type', tip).gte('created_at', otuzGunISO);

  const [
    tikRes, sepRes, waRes,
    populerRes, favoriRes,
    gunlukRes, sonYorumRes, topPathRes,
  ] = await Promise.all([
    sayEvent('urun_tiklama').then(r => r).catch(() => ({ count: 0 })),
    sayEvent('sepete_ekleme').then(r => r).catch(() => ({ count: 0 })),
    sayEvent('whatsapp_tiklama').then(r => r).catch(() => ({ count: 0 })),
    supabase.from('products').select('id, name, slug, view_count, favorite_count')
      .eq('is_active', true).order('view_count', { ascending: false }).limit(10)
      .then(r => r).catch(() => ({ data: [] })),
    supabase.from('products').select('id, name, slug, favorite_count')
      .eq('is_active', true).gt('favorite_count', 0)
      .order('favorite_count', { ascending: false }).limit(5)
      .then(r => r).catch(() => ({ data: [] })),
    supabase.rpc('admin_daily_views', { days: 7 }).then(r => r).catch(() => ({ data: null })),
    supabase.from('reviews')
      .select('id, name, rating, text, created_at, products(name, slug)')
      .eq('is_hidden', false).order('created_at', { ascending: false }).limit(5)
      .then(r => r).catch(() => ({ data: [] })),
    supabase.rpc('admin_top_paths', { days: 30, lim: 8 }).then(r => r).catch(() => ({ data: null })),
  ]);

  // ─── v51: Dönüşüm hunisi (son 30 gün) ────────────────────
  const huni = {
    ziyaret: stats.tekil_ziyaret_30g || stats.son_30_gun_ziyaret || 0,
    urunTik: tikRes.count || 0,
    sepet: sepRes.count || 0,
    whatsapp: waRes.count || 0,
  };

  const populerUrunler = populerRes.data || [];
  const favoriUrunler = favoriRes.data || [];

  // ─── Son 7 günlük ziyaret (SQL RPC → JS'te sadece etiketle) ─
  const gunlukZiyaret = (gunlukRes.data || []).map((r) => [
    new Date(r.gun).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric' }),
    Number(r.count) || 0,
  ]);

  // ─── Son yorumlar — sayım/ortalama admin_stats'tan (2. sorgu YOK) ─
  const yorumOzeti = {
    adet: stats.toplam_yorum || 0,
    ortalama: Number(stats.ortalama_yorum) || 0,
    sonlar: sonYorumRes.data || [],
  };

  // ─── En çok ziyaret edilen sayfalar (SQL RPC) ────────────
  const popSayfalar = (topPathRes.data || []).map((r) => ({ path: r.path, count: Number(r.count) || 0 }));

  const ANA_KARTLAR = [
    { ad: 'Aktif Ürün',         deger: stats.aktif_urun,          icon: IconPackage,         renk: 'bg-brand-gold/10 text-brand-gold',      link: '/admin/urunler' },
    { ad: 'Bu Ay Sipariş',      deger: stats.son_30_gun_talep,    icon: IconBrandWhatsapp,   renk: 'bg-[#25D366]/10 text-[#1faa52]',        link: '/admin/talepler' },
    { ad: 'Tekil Ziyaretçi (30g)', deger: stats.tekil_ziyaret_30g, icon: IconUsers,          renk: 'bg-brand-teal/10 text-brand-teal',      link: '#ziyaret' },
    { ad: 'Bugün Tekil',        deger: stats.tekil_ziyaret_bugun, icon: IconActivity,        renk: 'bg-brand-navy/10 text-brand-navy',      link: '#ziyaret' },
    { ad: 'Sepete Ekleme (30g)',deger: stats.sepete_ekleme_30g,   icon: IconShoppingCart,    renk: 'bg-brand-teal2/10 text-brand-teal2',    link: '#ziyaret' },
    { ad: 'Blog Yazısı',        deger: stats.yayinda_blog,        icon: IconCalendar,        renk: 'bg-brand-gold/10 text-brand-gold',      link: '/admin/blog' },
    { ad: 'Toplam Yorum',       deger: stats.toplam_yorum,        icon: IconStarFilled,      renk: 'bg-brand-gold/10 text-brand-gold',      link: '/admin/yorumlar' },
    { ad: 'Kategoriler',        deger: stats.aktif_kategori,      icon: IconCategory,        renk: 'bg-brand-teal/10 text-brand-teal',      link: '/admin/kategoriler' },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">Hoş Geldiniz</h1>
          <p className="text-brand-ink/60 mt-2">Möbel İnegöl yönetim paneli — genel bakış.</p>
        </div>
        <Link
          href="/admin/urunler"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-brand-cream rounded-full text-sm font-medium hover:bg-brand-darker transition-colors"
        >
          <IconPlus size={18} />
          Yeni Ürün
        </Link>
      </div>

      {/* 8 Ana İstatistik Kartı */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {ANA_KARTLAR.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.ad}
              href={s.link}
              className="group bg-white rounded-2xl p-5 shadow-card border border-brand-dark/5 hover:shadow-card-h transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${s.renk} flex items-center justify-center`}>
                  <Icon size={22} stroke={2} />
                </div>
                <IconArrowRight size={16} className="text-brand-ink/30 group-hover:text-brand-gold transition-colors" />
              </div>
              <p className="text-xs text-brand-ink/60 uppercase tracking-wider">{s.ad}</p>
              <p className="font-display text-3xl font-semibold text-brand-dark mt-1">{s.deger ?? 0}</p>
            </Link>
          );
        })}
      </div>

      {/* v51: Dönüşüm Hunisi — ziyaretten WhatsApp'a yolculuk */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-brand-dark/5 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="font-semibold text-brand-dark">Dönüşüm Hunisi <span className="text-xs font-normal text-brand-ink/50">(son 30 gün)</span></h2>
          <Link href="/admin/pazarlama" className="text-xs text-brand-teal hover:underline">Pazarlama raporu →</Link>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { ad: 'Ziyaretçi', deger: huni.ziyaret, renk: 'bg-brand-teal/10 text-brand-teal' },
            { ad: 'Ürün İnceleme', deger: huni.urunTik, renk: 'bg-blue-50 text-blue-600' },
            { ad: 'Sepete Ekleme', deger: huni.sepet, renk: 'bg-amber-50 text-amber-600' },
            { ad: 'WhatsApp 💬', deger: huni.whatsapp, renk: 'bg-green-50 text-green-600' },
          ].map((h, i) => (
            <div key={h.ad} className={`rounded-xl p-3 ${h.renk}`}>
              <p className="font-display text-xl md:text-2xl font-semibold">{h.deger}</p>
              <p className="text-[10px] md:text-xs mt-0.5 opacity-80">{h.ad}</p>
              {i > 0 && huni.ziyaret > 0 && (
                <p className="text-[10px] opacity-60 mt-0.5">%{((h.deger / huni.ziyaret) * 100).toFixed(1)}</p>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-brand-ink/40 mt-3">Ziyaretçilerin ne kadarı ürün inceliyor, sepete ekliyor ve WhatsApp&apos;tan ulaşıyor — satış sağlığınızın özeti.</p>
      </div>

      {/* Ziyaret grafiği (son 7 gün) */}
      {gunlukZiyaret.length > 0 && (
        <section id="ziyaret" className="bg-white rounded-2xl p-6 shadow-card border border-brand-dark/5 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <IconChartBar size={20} className="text-brand-gold" />
            <h2 className="font-display text-lg font-semibold text-brand-dark">Son 7 Gün Ziyaret</h2>
          </div>
          <p className="text-xs text-brand-ink/55 mb-5">
            Grafik <strong>görüntülenme</strong> (sayfa açılışı) gösterir. Tekil ziyaretçi:
            <strong> {stats.tekil_ziyaret_30g}</strong> (30 gün) · Toplam görüntülenme:
            <strong> {stats.toplam_ziyaret}</strong>. Bir kişi birden çok sayfa açınca görüntülenme artar; tekil ziyaretçi IP bazlı tek sayılır.
          </p>
          <div className="flex items-end gap-1 sm:gap-2 h-28 sm:h-32 overflow-x-auto pb-1">
            {(() => {
              const max = Math.max(...gunlukZiyaret.map(([, c]) => c), 1);
              return gunlukZiyaret.map(([gun, count]) => (
                <div key={gun} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-brand-ink/50">{count}</span>
                  <div
                    className="w-full bg-brand-gold/80 rounded-t-sm transition-all"
                    style={{ height: `${Math.max(8, (count / max) * 100)}%` }}
                  />
                  <span className="text-[10px] text-brand-ink/40 text-center leading-tight">{gun}</span>
                </div>
              ));
            })()}
          </div>
        </section>
      )}

      {/* En çok tıklanan + favorilenen */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <section className="bg-white rounded-2xl p-6 shadow-card border border-brand-dark/5">
          <div className="flex items-center gap-2 mb-4">
            <IconTrendingUp size={20} className="text-brand-gold" />
            <h2 className="font-display text-lg font-semibold text-brand-dark">En Çok Tıklanan</h2>
          </div>
          {populerUrunler.length === 0 ? (
            <p className="text-sm text-brand-ink/50 text-center py-4">Henüz görüntülenme yok.</p>
          ) : (
            <ol className="space-y-2.5">
              {populerUrunler.map((u, i) => (
                <li key={u.id} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-brand-cream text-brand-dark font-bold flex items-center justify-center text-xs shrink-0">{i + 1}</span>
                  <a href={`/urun/${u.slug}`} target="_blank" rel="noopener noreferrer"
                     className="flex-1 line-clamp-1 hover:text-brand-gold transition-colors">{u.name}</a>
                  <span className="text-xs text-brand-ink/50 shrink-0 flex items-center gap-1">
                    <IconEye size={13} /> {u.view_count}
                  </span>
                  {u.favorite_count > 0 && (
                    <span className="text-xs text-red-400 flex items-center gap-0.5">
                      <IconHeart size={13} /> {u.favorite_count}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-card border border-brand-dark/5">
          <div className="flex items-center gap-2 mb-4">
            <IconHeart size={20} className="text-red-500" />
            <h2 className="font-display text-lg font-semibold text-brand-dark">En Çok Favorilenen</h2>
          </div>
          {favoriUrunler.length === 0 ? (
            <p className="text-sm text-brand-ink/50 text-center py-4">Henüz favorileme yok.</p>
          ) : (
            <ol className="space-y-2.5">
              {favoriUrunler.map((u, i) => (
                <li key={u.id} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-red-50 text-red-400 font-bold flex items-center justify-center text-xs shrink-0">{i + 1}</span>
                  <a href={`/urun/${u.slug}`} target="_blank" rel="noopener noreferrer"
                     className="flex-1 line-clamp-1 hover:text-red-400 transition-colors">{u.name}</a>
                  <span className="text-xs text-red-400 flex items-center gap-0.5">
                    <IconHeart size={13} /> {u.favorite_count}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      {/* En çok ziyaret edilen sayfalar */}
      {popSayfalar.length > 0 && (
        <section className="bg-white rounded-2xl p-6 shadow-card border border-brand-dark/5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <IconEye size={20} className="text-brand-teal" />
            <h2 className="font-display text-lg font-semibold text-brand-dark">Son 30 Gün — En Çok Ziyaret Edilen Sayfalar</h2>
          </div>
          <div className="space-y-2">
            {popSayfalar.map(({ path, count }) => {
              const max = popSayfalar[0]?.count || 1;
              return (
                <div key={path} className="flex items-center gap-3">
                  <span className="text-xs text-brand-ink/50 w-32 sm:w-48 truncate font-mono shrink-0">{path}</span>
                  <div className="flex-1 bg-brand-cream rounded-full h-2">
                    <div
                      className="bg-brand-teal h-2 rounded-full"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-brand-ink/60 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Son yorumlar */}
      <section className="bg-white rounded-2xl p-6 shadow-card border border-brand-dark/5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <IconStarFilled size={20} className="text-brand-gold" />
          <h2 className="font-display text-lg font-semibold text-brand-dark">Son Yorumlar</h2>
        </div>
        {yorumOzeti.adet > 0 && (
          <p className="text-xs text-brand-ink/60 mb-4">
            Ortalama <strong>{yorumOzeti.ortalama}/5</strong> · {yorumOzeti.adet} yorum
          </p>
        )}
        {yorumOzeti.sonlar.length === 0 ? (
          <p className="text-sm text-brand-ink/50 text-center py-4">Henüz yorum yok.</p>
        ) : (
          <ul className="space-y-3">
            {yorumOzeti.sonlar.map((y) => (
              <li key={y.id} className="text-sm border-b border-brand-dark/5 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-brand-dark">{y.name}</span>
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => (
                      <IconStarFilled key={i} size={11} className={i <= y.rating ? 'text-brand-gold' : 'text-brand-ink/15'} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-brand-ink/70 line-clamp-2">{y.text}</p>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/yorumlar" className="inline-block mt-4 text-sm font-medium text-brand-gold hover:text-brand-accent">
          Tüm yorumları yönet →
        </Link>
      </section>

      {/* Hızlı eylemler */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/urunler"
          className="bg-white rounded-2xl p-6 shadow-card border border-brand-dark/5 hover:border-brand-gold/30 transition-colors group">
          <h3 className="font-display text-xl font-semibold text-brand-dark mb-2">Ürün Ekle / Düzenle</h3>
          <p className="text-sm text-brand-ink/60 mb-3">Kataloğa yeni ürün ekleyin, mevcut ürünleri güncelleyin.</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-gold group-hover:gap-2 transition-all">
            Ürünlere git <IconArrowRight size={14} />
          </span>
        </Link>
        <Link href="/admin/talepler"
          className="bg-white rounded-2xl p-6 shadow-card border border-brand-dark/5 hover:border-brand-gold/30 transition-colors group">
          <h3 className="font-display text-xl font-semibold text-brand-dark mb-2">Müşteri Talepleri</h3>
          <p className="text-sm text-brand-ink/60 mb-3">WhatsApp'a gönderilen siparişlerin geçmişi.</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-gold group-hover:gap-2 transition-all">
            Talepleri görüntüle <IconArrowRight size={14} />
          </span>
        </Link>
      </div>
    </>
  );
}
