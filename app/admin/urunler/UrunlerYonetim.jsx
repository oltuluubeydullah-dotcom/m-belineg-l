// ════════════════════════════════════════════════════════════
// Ürünler Yönetim — Client Component
// ════════════════════════════════════════════════════════════
// Tablo + ekle modal + düzenle modal + sil onay
// ════════════════════════════════════════════════════════════

'use client';
import { revalidatePaths, urunRevalidatePaths } from '@/lib/revalidate';

import { useState, useEffect, useRef } from 'react';
import {
  IconPlus, IconEdit, IconTrash, IconStar, IconStarFilled,
  IconEye, IconEyeOff, IconSearch, IconPackage,
} from '@tabler/icons-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import UrunFormu from './UrunFormu';
import { useToast } from '@/context/ToastContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import {
  urunOlustur, urunGuncelle, urunSil,
} from '@/lib/supabase/queries';
import { formatFiyat, cn } from '@/lib/utils';

export default function UrunlerYonetim({ ilkUrunler, toplamSayi = 0, sayfaBoyu = 100, kategoriler }) {
  const [urunler, setUrunler] = useState(ilkUrunler);
  const [toplam, setToplam] = useState(Math.max(toplamSayi, ilkUrunler.length));
  const [arama, setArama] = useState('');
  const [seciliKategori, setSeciliKategori] = useState('hepsi');

  // v37 PERFORMANS: sunucu taraflı arama/filtre sonuçları (liste eksikken devreye girer)
  const [uzakSonuc, setUzakSonuc] = useState(null);   // null = sunucu sonucu yok, lokal filtre geçerli
  const [uzakYukleniyor, setUzakYukleniyor] = useState(false);
  const [dahaYukleniyor, setDahaYukleniyor] = useState(false);
  const aramaZamanlayici = useRef(null);

  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenenUrun, setDuzenlenenUrun] = useState(null);

  const [silOnay, setSilOnay] = useState(null);
  const [silYukleniyor, setSilYukleniyor] = useState(false);

  // ─── Bulk seçim ───
  const [seciliIds, setSeciliIds] = useState(new Set());
  const [topluYukleniyor, setTopluYukleniyor] = useState(false);

  const { goster } = useToast();
  const supabase = getSupabaseClient();

  const hepsiYuklu = urunler.length >= toplam;

  // Lokal filtre (yüklü liste üzerinde)
  const lokalFiltre = urunler.filter((u) => {
    if (seciliKategori !== 'hepsi' && u.category_id !== seciliKategori) return false;
    if (arama && !(u.name || '').toLowerCase().includes(arama.toLowerCase())) return false;
    return true;
  });

  // Sunucu sonucu varsa onu göster (eksik listede arama kaçırmasın), yoksa lokal
  const filtrelenmis = uzakSonuc ?? lokalFiltre;

  // v37: Liste eksikken arama/kategori filtresi → sunucudan tamamla (350ms debounce)
  useEffect(() => {
    const filtreAktif = arama.trim().length > 0 || seciliKategori !== 'hepsi';
    if (hepsiYuklu || !filtreAktif) {
      setUzakSonuc(null);
      return undefined;
    }
    clearTimeout(aramaZamanlayici.current);
    aramaZamanlayici.current = setTimeout(async () => {
      setUzakYukleniyor(true);
      try {
        let q = supabase
          .from('products')
          .select('*, categories!category_id(name, slug)')
          .order('created_at', { ascending: false })
          .limit(200);
        if (seciliKategori !== 'hepsi') q = q.eq('category_id', seciliKategori);
        if (arama.trim()) q = q.ilike('name', `%${arama.trim()}%`);
        const { data, error } = await q;
        if (error) throw error;
        setUzakSonuc(data || []);
      } catch (e) {
        console.error('[admin] sunucu arama hatası:', e?.message);
        setUzakSonuc(null); // hata → lokal filtreye düş
      } finally {
        setUzakYukleniyor(false);
      }
    }, 350);
    return () => clearTimeout(aramaZamanlayici.current);
  }, [arama, seciliKategori, hepsiYuklu, supabase]);

  // v37: "Daha Fazla Yükle" — sonraki sayfayı çek, tekrarsız ekle
  async function dahaFazlaYukle() {
    setDahaYukleniyor(true);
    try {
      const from = urunler.length;
      const { data, error } = await supabase
        .from('products')
        .select('*, categories!category_id(name, slug)')
        .order('created_at', { ascending: false })
        .range(from, from + sayfaBoyu - 1);
      if (error) throw error;
      setUrunler((mevcut) => {
        const ids = new Set(mevcut.map((u) => u.id));
        return [...mevcut, ...(data || []).filter((u) => !ids.has(u.id))];
      });
    } catch (e) {
      goster('Liste yüklenemedi: ' + (e?.message || ''), 'hata');
    } finally {
      setDahaYukleniyor(false);
    }
  }
  // v37: Mutasyonlar hem ana listeyi hem (varsa) sunucu arama sonucunu günceller
  function ikiListeGuncelle(updater) {
    setUrunler(updater);
    setUzakSonuc((p) => (p ? updater(p) : p));
  }


  // ─── EKLE ─────────────────────────────────────────────
  function yeniUrunAc() {
    setDuzenlenenUrun(null);
    setFormAcik(true);
  }

  // ─── DÜZENLE ──────────────────────────────────────────
  function duzenlemeyiAc(urun) {
    setDuzenlenenUrun(urun);
    setFormAcik(true);
  }

  // ─── KAYDET (yeni veya güncelleme) ────────────────────
  async function kaydet(veri) {
    try {
      if (duzenlenenUrun) {
        const guncel = await urunGuncelle(supabase, duzenlenenUrun.id, veri);
        // Listede güncelle
        ikiListeGuncelle((mevcut) =>
          mevcut.map((u) => (u.id === guncel.id ? { ...u, ...guncel } : u))
        );
        goster('Ürün güncellendi', 'basari');
      } else {
        const yeni = await urunOlustur(supabase, veri);
        // Kategori adını bul ve ekle (server'dan join gelmediği için)
        const kat = kategoriler.find((k) => k.id === yeni.category_id);
        setUrunler((mevcut) => [{ ...yeni, categories: kat ? { name: kat.name, slug: kat.slug } : null }, ...mevcut]);
        setToplam((t) => t + 1);
        goster('Ürün eklendi', 'basari');
      }
      // Anasayfa + kategoriler cache temizle (anlık görünür olsun)
      // FIX: categorySlug her zaman category_id'den türetilir (form vermese de
      // kategori sayfası revalidate edilsin → yeni ürün anında görünsün).
      const revalKatSlug = kategoriler.find((k) => k.id === veri.category_id)?.slug || veri.categorySlug;
      revalidatePaths(urunRevalidatePaths(veri.slug, revalKatSlug)).catch(() => {});
      setFormAcik(false);
      setDuzenlenenUrun(null);
    } catch (err) {
      console.error(err);
      const mesaj = err?.message?.includes('duplicate key')
        ? 'Bu slug zaten kullanılıyor, farklı bir slug girin.'
        : 'Kaydetme başarısız: ' + (err?.message || 'Bilinmeyen hata');
      goster(mesaj, 'hata');
      throw err;
    }
  }

  // ─── SİL ──────────────────────────────────────────────
  async function silOnayla() {
    if (!silOnay) return;
    setSilYukleniyor(true);
    try {
      await urunSil(supabase, silOnay.id);
      ikiListeGuncelle((mevcut) => mevcut.filter((u) => u.id !== silOnay.id));
      setToplam((t) => Math.max(0, t - 1));
      goster('Ürün silindi', 'basari');
      setSilOnay(null);
    } catch (err) {
      goster('Silme başarısız: ' + (err?.message || ''), 'hata');
    } finally {
      setSilYukleniyor(false);
    }
  }

  // ─── HIZLI TOGGLE (öne çıkar / aktif) ────────────────
  async function hizliToggle(urun, alan) {
    try {
      const guncel = await urunGuncelle(supabase, urun.id, { [alan]: !urun[alan] });
      ikiListeGuncelle((mevcut) =>
        mevcut.map((u) => (u.id === guncel.id ? { ...u, ...guncel } : u))
      );
    } catch (err) {
      goster('Güncelleme başarısız', 'hata');
    }
  }

  // ─── BULK ─────────────────────────────────────────────
  function secimToggle(id) {
    setSeciliIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function tumunuSec() {
    if (seciliIds.size === filtrelenmis.length) {
      setSeciliIds(new Set());
    } else {
      setSeciliIds(new Set(filtrelenmis.map((u) => u.id)));
    }
  }

  async function topluIslem(islem) {
    if (seciliIds.size === 0) return;
    const onayMesaji = {
      aktif:   `${seciliIds.size} ürünü AKTİF yap?`,
      pasif:   `${seciliIds.size} ürünü PASİF yap?`,
      sil:     `${seciliIds.size} ürünü KALICI olarak sil? Bu geri alınamaz!`,
      ozellik: `${seciliIds.size} ürünü ÖNE ÇIKAR olarak işaretle?`,
    }[islem];

    if (!confirm(onayMesaji)) return;
    setTopluYukleniyor(true);

    try {
      const ids = Array.from(seciliIds);
      if (islem === 'sil') {
        const { error } = await supabase.from('products').delete().in('id', ids);
        if (error) throw error;
        ikiListeGuncelle((p) => p.filter((u) => !seciliIds.has(u.id)));
        setToplam((t) => Math.max(0, t - ids.length));
      } else {
        const guncellemeler = {
          aktif:   { is_active: true  },
          pasif:   { is_active: false },
          ozellik: { is_featured: true },
        }[islem];
        const { error } = await supabase.from('products').update(guncellemeler).in('id', ids);
        if (error) throw error;
        ikiListeGuncelle((p) => p.map((u) => seciliIds.has(u.id) ? { ...u, ...guncellemeler } : u));
      }
      goster(`${ids.length} ürün güncellendi`, 'basari');
      setSeciliIds(new Set());
    } catch (e) {
      goster('Toplu işlem hatası: ' + e.message, 'hata');
    } finally {
      setTopluYukleniyor(false);
    }
  }

  return (
    <>
      {/* Başlık + Yeni Ürün */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">
            Ürünler
          </h1>
          <p className="text-brand-ink/60 mt-2">
            {toplam} ürün, {kategoriler.length} kategori
          </p>
        </div>
        <Button onClick={yeniUrunAc} size="lg" variant="primary">
          <IconPlus size={18} />
          Yeni Ürün
        </Button>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-brand-dark/5 mb-6">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40" />
            <input
              type="text"
              placeholder="Ürün adı ara…"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-brand-dark/15 rounded-lg
                         focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30"
            />
          </div>
          <select
            value={seciliKategori}
            onChange={(e) => setSeciliKategori(e.target.value)}
            className="px-4 py-2.5 border border-brand-dark/15 rounded-lg
                       focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30"
          >
            <option value="hepsi">Tüm Kategoriler</option>
            {kategoriler.map((k) => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste */}
      {filtrelenmis.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-card border border-brand-dark/5 text-center">
          <IconPackage size={48} className="mx-auto text-brand-ink/20 mb-3" />
          <p className="font-display text-xl text-brand-dark/60 mb-2">
            {urunler.length === 0 ? 'Henüz ürün yok' : 'Sonuç bulunamadı'}
          </p>
          <p className="text-sm text-brand-ink/50 mb-6">
            {urunler.length === 0
              ? 'İlk ürünü ekleyerek başlayın.'
              : 'Farklı bir arama veya kategori deneyin.'}
          </p>
          {urunler.length === 0 && (
            <Button onClick={yeniUrunAc} variant="primary">
              <IconPlus size={18} />
              İlk Ürünü Ekle
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 overflow-hidden">
          {/* Bulk action bar */}
          {seciliIds.size > 0 && (
            <div className="bg-brand-gold/10 border-b border-brand-gold/30 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-sm font-medium text-brand-dark">
                {seciliIds.size} ürün seçildi
              </span>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={topluYukleniyor} onClick={() => topluIslem('aktif')}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-60">
                  Aktif yap
                </button>
                <button type="button" disabled={topluYukleniyor} onClick={() => topluIslem('pasif')}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-brand-dark/70 text-white hover:bg-brand-dark disabled:opacity-60">
                  Pasif yap
                </button>
                <button type="button" disabled={topluYukleniyor} onClick={() => topluIslem('ozellik')}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-brand-gold text-brand-dark hover:opacity-90 disabled:opacity-60">
                  Öne çıkar
                </button>
                <button type="button" disabled={topluYukleniyor} onClick={() => topluIslem('sil')}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-60">
                  Sil
                </button>
                <button type="button" onClick={() => setSeciliIds(new Set())}
                        className="px-3 py-1.5 text-xs text-brand-ink/60 hover:text-brand-dark">
                  Seçimi kaldır
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-dark/5 text-left">
                <tr>
                  <th className="px-3 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={seciliIds.size > 0 && seciliIds.size === filtrelenmis.length}
                      onChange={tumunuSec}
                      aria-label="Tümünü seç"
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider">Foto</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider">Ürün</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider hidden md:table-cell">Kategori</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider hidden lg:table-cell">Fiyat</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider">Durum</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-dark/5">
                {filtrelenmis.map((u) => (
                  <tr key={u.id} className={cn(
                    "hover:bg-brand-dark/[0.02]",
                    seciliIds.has(u.id) && "bg-brand-gold/5"
                  )}>
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={seciliIds.has(u.id)}
                        onChange={() => secimToggle(u.id)}
                        aria-label={`${u.name} seç`}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg bg-brand-dark/5 overflow-hidden flex items-center justify-center">
                        {u.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.images[0]} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        ) : (
                          <IconPackage size={20} className="text-brand-ink/30" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-dark line-clamp-1">{u.name}</p>
                      <p className="text-xs text-brand-ink/50 line-clamp-1">/urun/{u.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-ink/70 hidden md:table-cell">
                      {u.categories?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">
                      {u.base_price ? (
                        <span className={cn('font-medium', u.is_on_sale && 'text-badge-sale')}>
                          {formatFiyat(u.is_on_sale && u.sale_price ? u.sale_price : u.base_price)}
                        </span>
                      ) : (
                        <span className="text-brand-ink/40 text-xs">Sor</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => hizliToggle(u, 'is_active')}
                          title={u.is_active ? 'Aktif (tıkla = pasif)' : 'Pasif (tıkla = aktif)'}
                          className={cn(
                            'p-1.5 rounded-md transition-colors',
                            u.is_active
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-brand-ink/30 hover:bg-brand-dark/5'
                          )}
                        >
                          {u.is_active ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => hizliToggle(u, 'is_featured')}
                          title={u.is_featured ? 'Öne çıkan (tıkla = kaldır)' : 'Tıkla = öne çıkar'}
                          className={cn(
                            'p-1.5 rounded-md transition-colors',
                            u.is_featured
                              ? 'text-brand-gold hover:bg-brand-gold/10'
                              : 'text-brand-ink/30 hover:bg-brand-dark/5'
                          )}
                        >
                          {u.is_featured ? <IconStarFilled size={16} /> : <IconStar size={16} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => duzenlemeyiAc(u)}
                          className="p-2 rounded-lg text-brand-ink/60 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                          title="Düzenle"
                        >
                          <IconEdit size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSilOnay(u)}
                          className="p-2 rounded-lg text-brand-ink/60 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Sil"
                        >
                          <IconTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* v37: Sayfalama — filtre yokken liste eksikse devam yükle */}
      {!hepsiYuklu && !arama.trim() && seciliKategori === 'hepsi' && (
        <div className="mt-5 text-center">
          <Button onClick={dahaFazlaYukle} variant="ghost" disabled={dahaYukleniyor}>
            {dahaYukleniyor ? 'Yükleniyor…' : `Daha Fazla Yükle (${urunler.length} / ${toplam})`}
          </Button>
        </div>
      )}
      {uzakYukleniyor && (
        <p className="mt-3 text-center text-sm text-brand-ink/50">Tüm ürünlerde aranıyor…</p>
      )}

      {/* Form modal */}
      <Modal
        acik={formAcik}
        kapat={() => { setFormAcik(false); setDuzenlenenUrun(null); }}
        baslik={duzenlenenUrun ? 'Ürünü Düzenle' : 'Yeni Ürün'}
        altBaslik={duzenlenenUrun ? duzenlenenUrun.name : 'Yeni bir ürün ekleyin'}
        size="lg"
      >
        <UrunFormu
          ilkVeri={duzenlenenUrun}
          kategoriler={kategoriler}
          onKaydet={kaydet}
          onIptal={() => { setFormAcik(false); setDuzenlenenUrun(null); }}
        />
      </Modal>

      {/* Sil onay */}
      <ConfirmDialog
        acik={!!silOnay}
        kapat={() => !silYukleniyor && setSilOnay(null)}
        baslik="Ürün silinecek"
        mesaj={silOnay ? `"${silOnay.name}" ürünü kalıcı olarak silinecek. Bu işlem geri alınamaz.` : ''}
        onayMetni="Evet, sil"
        onOnay={silOnayla}
        yukleniyor={silYukleniyor}
      />
    </>
  );
}
