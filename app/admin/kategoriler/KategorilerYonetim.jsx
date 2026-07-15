// ════════════════════════════════════════════════════════════
// Kategoriler Yönetim — Client
// ════════════════════════════════════════════════════════════
// 9 kategori sabit; ekleme/silme yok ama edit + sıralama var.
// Yine de "Yeni Kategori" butonu var (esneklik için).
// ════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import {
  IconPlus, IconEdit, IconTrash, IconChevronUp, IconChevronDown,
  IconEye, IconEyeOff, IconCategory,
} from '@tabler/icons-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import KategoriFormu from './KategoriFormu';
import { useToast } from '@/context/ToastContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { revalidatePaths, kategoriRevalidatePaths } from '@/lib/revalidate';
import { cn } from '@/lib/utils';

export default function KategorilerYonetim({ ilkKategoriler, urunSayilari }) {
  const [kategoriler, setKategoriler] = useState(ilkKategoriler);
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState(null);
  const [silOnay, setSilOnay] = useState(null);
  const [silYukleniyor, setSilYukleniyor] = useState(false);
  const [siralamaYukleniyor, setSiralamaYukleniyor] = useState(false);

  const { goster } = useToast();
  const supabase = getSupabaseClient();

  // ─── EKLE / DÜZENLE ──────────────────────────────────
  function yeniAc() {
    setDuzenlenen(null);
    setFormAcik(true);
  }

  function duzenleAc(kategori) {
    setDuzenlenen(kategori);
    setFormAcik(true);
  }

  async function kaydet(veri) {
    try {
      if (duzenlenen) {
        const { data, error } = await supabase
          .from('categories')
          .update(veri)
          .eq('id', duzenlenen.id)
          .select()
          .maybeSingle();
        if (error) throw error;
        const guncel = data || { ...duzenlenen, ...veri };
        setKategoriler((m) => m.map((k) => (k.id === guncel.id ? guncel : k)));
        goster('Kategori güncellendi', 'basari');
      } else {
        // Yeni eklemede sort_order'ı sona koy
        const sonSira = Math.max(0, ...kategoriler.map((k) => k.sort_order || 0));
        const { data, error } = await supabase
          .from('categories')
          .insert([{ ...veri, sort_order: sonSira + 1 }])
          .select()
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          // RLS RETURNING blocked → slug ile re-fetch
          const rf = await supabase.from('categories').select('*').eq('slug', veri.slug).maybeSingle();
          if (!rf.data) throw new Error('Kategori eklendi ama veri okunamadı. Sayfayı yenileyin.');
          setKategoriler((m) => [...m, rf.data]);
        } else {
          setKategoriler((m) => [...m, data]);
        }
        goster('Kategori eklendi', 'basari');
      }
      // Site cache temizle — değişiklik anında görünür olsun
      revalidatePaths(kategoriRevalidatePaths(veri.slug)).catch(() => {});
      setFormAcik(false);
      setDuzenlenen(null);
    } catch (err) {
      const mesaj = err?.message?.includes('duplicate key')
        ? 'Bu slug zaten kullanılıyor, farklı bir slug girin.'
        : 'Kaydetme başarısız: ' + (err?.message || '');
      goster(mesaj, 'hata');
      throw err;
    }
  }

  // ─── SİL ─────────────────────────────────────────────
  async function silOnayla() {
    if (!silOnay) return;

    // Önce ürünleri kontrol et
    if (urunSayilari[silOnay.id] > 0) {
      goster(`Bu kategoride ${urunSayilari[silOnay.id]} ürün var, önce onları silin`, 'uyari');
      setSilOnay(null);
      return;
    }

    setSilYukleniyor(true);
    try {
      const { error } = await supabase.from('categories').delete().eq('id', silOnay.id);
      if (error) throw error;
      setKategoriler((m) => m.filter((k) => k.id !== silOnay.id));
      goster('Kategori silindi', 'basari');
      revalidatePaths(kategoriRevalidatePaths(silOnay.slug)).catch(() => {});
      setSilOnay(null);
    } catch (err) {
      goster('Silme başarısız: ' + (err?.message || ''), 'hata');
    } finally {
      setSilYukleniyor(false);
    }
  }

  // ─── SIRALAMA (yukarı / aşağı) ───────────────────────
  async function siralamaTasi(index, yon) {
    const yeniIndex = index + yon;
    if (yeniIndex < 0 || yeniIndex >= kategoriler.length) return;

    setSiralamaYukleniyor(true);
    try {
      const a = kategoriler[index];
      const b = kategoriler[yeniIndex];

      // Sıralama numaralarını takasla
      await Promise.all([
        supabase.from('categories').update({ sort_order: b.sort_order }).eq('id', a.id),
        supabase.from('categories').update({ sort_order: a.sort_order }).eq('id', b.id),
      ]);

      // Lokal listeyi de güncelle
      const yeniListe = [...kategoriler];
      yeniListe[index] = { ...a, sort_order: b.sort_order };
      yeniListe[yeniIndex] = { ...b, sort_order: a.sort_order };
      yeniListe.sort((x, y) => x.sort_order - y.sort_order);
      setKategoriler(yeniListe);
      revalidatePaths(kategoriRevalidatePaths(null)).catch(() => {});
    } catch (err) {
      goster('Sıralama değiştirilemedi', 'hata');
    } finally {
      setSiralamaYukleniyor(false);
    }
  }

  // ─── AKTİF TOGGLE ────────────────────────────────────
  async function aktifToggle(kategori) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({ is_active: !kategori.is_active })
        .eq('id', kategori.id)
        .select()
        .maybeSingle();
      if (error) throw error;
      const guncel = data || { ...kategori, is_active: !kategori.is_active };
      setKategoriler((m) => m.map((k) => (k.id === guncel.id ? guncel : k)));
      revalidatePaths(kategoriRevalidatePaths(kategori.slug)).catch(() => {});
    } catch (err) {
      goster('Güncelleme başarısız', 'hata');
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">
            Kategoriler
          </h1>
          <p className="text-brand-ink/60 mt-2">
            {kategoriler.length} kategori — sıralama, kapak görseli, aktif/pasif
          </p>
        </div>
        <Button onClick={yeniAc} variant="primary" size="lg">
          <IconPlus size={18} />
          Yeni Kategori
        </Button>
      </div>

      {kategoriler.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-card border border-brand-dark/5 text-center">
          <IconCategory size={48} className="mx-auto text-brand-ink/20 mb-3" />
          <p className="font-display text-xl text-brand-dark/60 mb-2">
            Kategori yok
          </p>
          <p className="text-sm text-brand-ink/50 mb-6">
            SQL şeması çalıştırıldıysa 9 kategori otomatik gelmeliydi.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {kategoriler.map((k, i) => (
            <div
              key={k.id}
              className="bg-white rounded-xl shadow-card border border-brand-dark/5 p-4 flex items-center gap-4 group"
            >
              {/* Sıra okları */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => siralamaTasi(i, -1)}
                  disabled={i === 0 || siralamaYukleniyor}
                  className="p-1 text-brand-ink/40 hover:text-brand-gold disabled:opacity-30 transition-colors"
                  title="Yukarı taşı"
                >
                  <IconChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => siralamaTasi(i, 1)}
                  disabled={i === kategoriler.length - 1 || siralamaYukleniyor}
                  className="p-1 text-brand-ink/40 hover:text-brand-gold disabled:opacity-30 transition-colors"
                  title="Aşağı taşı"
                >
                  <IconChevronDown size={16} />
                </button>
              </div>

              {/* Kapak görseli */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-brand-dark/5 shrink-0">
                {k.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={k.image_url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-ink/30">
                    <IconCategory size={24} />
                  </div>
                )}
              </div>

              {/* Bilgi */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-semibold text-lg text-brand-dark">
                    {k.name}
                  </h3>
                  {!k.is_active && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">
                      Pasif
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-ink/50 mt-0.5">
                  /kategori/{k.slug} · {urunSayilari[k.id] || 0} ürün
                </p>
              </div>

              {/* Aksiyonlar */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => aktifToggle(k)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    k.is_active
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-brand-ink/30 hover:bg-brand-dark/5'
                  )}
                  title={k.is_active ? 'Aktif (tıkla = pasif)' : 'Pasif (tıkla = aktif)'}
                >
                  {k.is_active ? <IconEye size={18} /> : <IconEyeOff size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => duzenleAc(k)}
                  className="p-2 rounded-lg text-brand-ink/60 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                  title="Düzenle"
                >
                  <IconEdit size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setSilOnay(k)}
                  className="p-2 rounded-lg text-brand-ink/60 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Sil"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      <Modal
        acik={formAcik}
        kapat={() => { setFormAcik(false); setDuzenlenen(null); }}
        baslik={duzenlenen ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
        altBaslik={duzenlenen?.name}
        size="md"
      >
        <KategoriFormu
          ilkVeri={duzenlenen}
          onKaydet={kaydet}
          onIptal={() => { setFormAcik(false); setDuzenlenen(null); }}
        />
      </Modal>

      {/* Sil onay */}
      <ConfirmDialog
        acik={!!silOnay}
        kapat={() => !silYukleniyor && setSilOnay(null)}
        baslik="Kategori silinecek"
        mesaj={
          silOnay
            ? urunSayilari[silOnay.id] > 0
              ? `Bu kategoride ${urunSayilari[silOnay.id]} ürün var. Önce ürünleri silin veya başka kategoriye taşıyın.`
              : `"${silOnay.name}" kategorisi silinecek. Bu işlem geri alınamaz.`
            : ''
        }
        onayMetni="Evet, sil"
        onOnay={silOnayla}
        yukleniyor={silYukleniyor}
      />
    </>
  );
}
