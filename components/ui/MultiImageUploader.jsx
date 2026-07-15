// ════════════════════════════════════════════════════════════
// MultiImageUploader — v12.0 PROGRESS + WebP
// ════════════════════════════════════════════════════════════
// v12.0 EKLENDİ:
//   • Per-file progress (preview thumbnail + spinner + ✓/✗)
//   • Toplam ilerleme barı + "X / Y yüklendi" sayacı
//   • WebP convert (tercihWebP: true) — ~25% boyut tasarrufu
//   • Object URL preview (yükleme tamamlanmadan görüntü)
//   • Cleanup: object URL'ler bittikten sonra revoke edilir
// Korunan:
//   • İlk resim KAPAK
//   • Drag-and-drop sıralama
//   • Mobil ok butonları
// ════════════════════════════════════════════════════════════

'use client';

import { useState, useRef, useEffect } from 'react';
import {
  IconUpload, IconX, IconLoader2, IconCheck, IconAlertCircle,
  IconChevronLeft, IconChevronRight, IconStarFilled,
} from '@tabler/icons-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { birdenCokResimYukle, resimSil } from '@/lib/imageUpload';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

export default function MultiImageUploader({
  degerler = [],
  onDegisim,
  klasor = 'urunler',
  maksimum = 25,
  label,
}) {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [yuklemeKuyrugu, setYuklemeKuyrugu] = useState([]); // [{id, name, previewUrl, status, errorMsg}]
  const [suruklenenIndex, setSuruklenenIndex] = useState(null);
  const [hedefIndex, setHedefIndex] = useState(null);
  const inputRef = useRef(null);
  const { goster } = useToast();
  const supabase = getSupabaseClient();

  // Cleanup: blob URL'ler kuyruktan çıkınca revoke et
  useEffect(() => {
    return () => {
      yuklemeKuyrugu.forEach((it) => {
        if (it.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(it.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Drag-and-drop sıralama ────────────────────────────
  function handleDragStart(i) { setSuruklenenIndex(i); }
  function handleDragOver(e, i) {
    e.preventDefault();
    if (suruklenenIndex !== null && suruklenenIndex !== i) setHedefIndex(i);
  }
  function handleDragEnd() {
    if (suruklenenIndex !== null && hedefIndex !== null && suruklenenIndex !== hedefIndex) {
      const yeni = [...degerler];
      const [tasinan] = yeni.splice(suruklenenIndex, 1);
      yeni.splice(hedefIndex, 0, tasinan);
      onDegisim(yeni);
    }
    setSuruklenenIndex(null);
    setHedefIndex(null);
  }

  async function handleSecim(e) {
    const dosyalar = Array.from(e.target.files || []);
    if (dosyalar.length === 0) return;

    const kalan = maksimum - degerler.length;
    if (kalan <= 0) {
      goster(`En fazla ${maksimum} görsel yükleyebilirsiniz`, 'uyari');
      return;
    }

    const yuklenecekler = dosyalar.slice(0, kalan);

    // Preview URL'leri oluştur — hemen göster
    const baslangicKuyruk = yuklenecekler.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      previewUrl: URL.createObjectURL(f),
      status: 'bekliyor', // bekliyor | yukleniyor | tamam | hata
      errorMsg: null,
    }));
    setYuklemeKuyrugu(baslangicKuyruk);
    setYukleniyor(true);

    try {
      const { basarili, hatali } = await birdenCokResimYukle(
        supabase, yuklenecekler, klasor,
        {
          tercihWebP: true, // v12.0: JPEG → WebP convert (Supabase reddedirse JPEG'e fallback)
          onItemStart: (i) => {
            setYuklemeKuyrugu((prev) => {
              const next = [...prev];
              if (next[i]) next[i] = { ...next[i], status: 'yukleniyor' };
              return next;
            });
          },
          onItemDone: (i, sonuc) => {
            setYuklemeKuyrugu((prev) => {
              const next = [...prev];
              if (next[i]) {
                next[i] = sonuc.ok
                  ? { ...next[i], status: 'tamam' }
                  : { ...next[i], status: 'hata', errorMsg: sonuc.sebep };
              }
              return next;
            });
          },
        }
      );

      if (basarili.length > 0) {
        onDegisim([...degerler, ...basarili]);
        goster(`${basarili.length} görsel yüklendi`, 'basari');
      }
      if (hatali.length > 0) {
        const ilkBesi = hatali.slice(0, 3);
        ilkBesi.forEach(h => goster(`${h.dosya}: ${h.sebep}`, 'hata'));
        if (hatali.length > 3) goster(`+${hatali.length - 3} dosya daha hata aldı`, 'uyari');
      }
    } catch (err) {
      goster('Yükleme başarısız: ' + (err?.message || 'bilinmeyen'), 'hata');
    } finally {
      setYukleniyor(false);
      // 1.5 sn sonra kuyruğu temizle (kullanıcı sonucu görsün diye gecikme)
      setTimeout(() => {
        setYuklemeKuyrugu((prev) => {
          prev.forEach((it) => {
            if (it.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(it.previewUrl);
          });
          return [];
        });
      }, 1500);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleSil(index) {
    const url = degerler[index];
    setYukleniyor(true);
    try {
      await resimSil(supabase, url);
      const yeni = degerler.filter((_, i) => i !== index);
      onDegisim(yeni);
    } catch (err) {
      goster('Silme başarısız', 'hata');
    } finally {
      setYukleniyor(false);
    }
  }

  function handleSirala(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= degerler.length) return;
    const yeni = [...degerler];
    [yeni[fromIndex], yeni[toIndex]] = [yeni[toIndex], yeni[fromIndex]];
    onDegisim(yeni);
  }

  // Progress hesaplama
  const toplamKuyruk = yuklemeKuyrugu.length;
  const bittiSayisi = yuklemeKuyrugu.filter(it => it.status === 'tamam' || it.status === 'hata').length;
  const yuklemeOrani = toplamKuyruk > 0 ? Math.round((bittiSayisi / toplamKuyruk) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-brand-ink">
            {label}
            {maksimum && (
              <span className="text-xs text-brand-ink/50 ml-2">
                ({degerler.length} / {maksimum})
              </span>
            )}
          </label>
        </div>
      )}

      {/* ─── PROGRESS BAR (yükleme sırasında) ─────────────── */}
      {yukleniyor && toplamKuyruk > 0 && (
        <div className="mb-3 p-3 bg-brand-gold/10 border border-brand-gold/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-brand-ink">
              {bittiSayisi} / {toplamKuyruk} yüklendi
            </span>
            <span className="text-xs text-brand-ink/60 font-mono">%{yuklemeOrani}</span>
          </div>
          <div className="h-2 bg-brand-dark/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-gold transition-all duration-300 ease-out"
              style={{ width: `${yuklemeOrani}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Mevcut görseller */}
        {degerler.map((url, i) => (
          <div
            key={url}
            draggable={!yukleniyor}
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => { e.preventDefault(); handleDragEnd(); }}
            className={cn(
              'relative aspect-square rounded-lg overflow-hidden bg-brand-dark/5 group cursor-move transition-all',
              i === 0 && 'ring-2 ring-brand-gold',
              suruklenenIndex === i && 'opacity-30 scale-95',
              hedefIndex === i && suruklenenIndex !== i && 'ring-2 ring-brand-accent scale-105'
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover pointer-events-none select-none" draggable={false} />

            {i === 0 && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-brand-gold text-brand-dark text-xs font-semibold rounded-md flex items-center gap-1 pointer-events-none">
                <IconStarFilled size={12} /> Kapak
              </div>
            )}

            <button
              type="button"
              onClick={() => handleSil(i)}
              disabled={yukleniyor}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity disabled:opacity-50"
              title="Sil"
            >
              <IconX size={14} />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:hidden">
              <button
                type="button"
                onClick={() => handleSirala(i, i - 1)}
                disabled={i === 0 || yukleniyor}
                className="p-1 bg-brand-dark text-brand-cream rounded disabled:opacity-30"
                title="Sola taşı"
              >
                <IconChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleSirala(i, i + 1)}
                disabled={i === degerler.length - 1 || yukleniyor}
                className="p-1 bg-brand-dark text-brand-cream rounded disabled:opacity-30"
                title="Sağa taşı"
              >
                <IconChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* ─── YÜKLENEN DOSYALARIN PER-FILE PREVIEW'I ──── */}
        {yuklemeKuyrugu.map((it) => (
          <div
            key={it.id}
            className={cn(
              'relative aspect-square rounded-lg overflow-hidden bg-brand-dark/5 transition-all',
              it.status === 'hata' && 'ring-2 ring-red-500',
              it.status === 'tamam' && 'ring-2 ring-green-500'
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.previewUrl}
              alt={it.name}
              loading="lazy"
              decoding="async"
              className={cn(
                'w-full h-full object-cover transition-all',
                it.status === 'bekliyor' && 'opacity-50',
                it.status === 'yukleniyor' && 'opacity-70 blur-[1px]'
              )}
              draggable={false}
            />

            {/* Status overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              {it.status === 'bekliyor' && (
                <div className="px-2 py-1 bg-white/90 rounded text-xs text-brand-ink">Sırada…</div>
              )}
              {it.status === 'yukleniyor' && (
                <div className="flex flex-col items-center gap-1">
                  <IconLoader2 size={28} className="animate-spin text-white drop-shadow-lg" />
                  <span className="text-[10px] text-white drop-shadow-lg font-medium">Yükleniyor…</span>
                </div>
              )}
              {it.status === 'tamam' && (
                <div className="bg-green-500 rounded-full p-2 shadow-lg animate-fade-in">
                  <IconCheck size={20} className="text-white" />
                </div>
              )}
              {it.status === 'hata' && (
                <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center p-2 text-center">
                  <IconAlertCircle size={24} className="text-white mb-1" />
                  <span className="text-[10px] text-white font-medium line-clamp-2">
                    {it.errorMsg?.slice(0, 60) || 'Hata'}
                  </span>
                </div>
              )}
            </div>

            {/* Dosya adı altta (küçük) */}
            <div className="absolute bottom-0 inset-x-0 px-2 py-1 bg-black/50 text-white text-[9px] truncate">
              {it.name}
            </div>
          </div>
        ))}

        {/* Yeni ekle kutusu */}
        {degerler.length + yuklemeKuyrugu.length < maksimum && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={yukleniyor}
            className="aspect-square rounded-lg border-2 border-dashed border-brand-dark/15 hover:border-brand-teal/50 flex flex-col items-center justify-center gap-1 text-brand-ink/50 hover:text-brand-gold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {yukleniyor ? (
              <>
                <IconLoader2 size={28} className="animate-spin" />
                <span className="text-xs">Lütfen bekleyin…</span>
              </>
            ) : (
              <>
                <IconUpload size={28} stroke={1.5} />
                <span className="text-xs font-medium">Görsel Ekle</span>
              </>
            )}
          </button>
        )}
      </div>

      {degerler.length > 0 && !yukleniyor && (
        <p className="text-xs text-brand-ink/50 mt-2">
          💡 İlk görsel (altın çerçeveli) <strong>kapak</strong> olarak kullanılır. Sıralamak için görseli <strong>fareyle sürükleyip bırak</strong>. Mobilde aşağıdaki ok butonlarıyla taşıyabilirsin.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSecim}
        className="hidden"
      />
    </div>
  );
}
