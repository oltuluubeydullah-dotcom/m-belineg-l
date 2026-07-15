// ════════════════════════════════════════════════════════════
// ImageUploader — Tek resim yükleme — v12.0 PROGRESS
// ════════════════════════════════════════════════════════════
// v12.0 EKLENDİ:
//   • Anlık preview (object URL) — dosya seçilince hemen görünür
//   • Overlay spinner — yükleme sırasında preview üzerinde
//   • Akıcı transition (yüklenirken → tamamlandığında)
//   • WebP convert (tercihWebP: true) — JPEG → ~25% küçülür
// Kullanım: kategori kapağı, hero banner, vb.
// ════════════════════════════════════════════════════════════

'use client';

import { useState, useRef, useEffect } from 'react';
import { IconUpload, IconX, IconLoader2 } from '@tabler/icons-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { resimYukle, resimSil } from '@/lib/imageUpload';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

export default function ImageUploader({
  deger,
  onDegisim,
  klasor = 'diger',
  label,
  aspect = 'aspect-video',
}) {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [preview, setPreview] = useState(null);  // Yüklenirken anlık görüntü
  const inputRef = useRef(null);
  const { goster } = useToast();
  const supabase = getSupabaseClient();

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleSecim(e) {
    const dosya = e.target.files?.[0];
    if (!dosya) return;

    // Anlık preview göster
    const blobUrl = URL.createObjectURL(dosya);
    setPreview(blobUrl);
    setYukleniyor(true);

    try {
      if (deger) {
        await resimSil(supabase, deger).catch(() => {});
      }
      const url = await resimYukle(supabase, dosya, klasor, { tercihWebP: true });
      onDegisim(url);
      goster('Görsel yüklendi', 'basari');
    } catch (err) {
      goster('Yükleme başarısız: ' + (err?.message || 'bilinmeyen sebep'), 'hata');
    } finally {
      setYukleniyor(false);
      if (blobUrl?.startsWith('blob:')) URL.revokeObjectURL(blobUrl);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleSil() {
    if (!deger) return;
    setYukleniyor(true);
    try {
      await resimSil(supabase, deger);
      onDegisim(null);
      goster('Görsel silindi', 'bilgi');
    } catch (err) {
      goster('Silme başarısız', 'hata');
    } finally {
      setYukleniyor(false);
    }
  }

  // Görünen URL — preview varsa preview, yoksa kaydedilmiş URL
  const gosterilen = preview || deger;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-brand-ink mb-1.5">
          {label}
        </label>
      )}

      <div className={cn(
        'relative w-full rounded-xl border-2 border-dashed overflow-hidden bg-brand-dark/5',
        aspect,
        gosterilen ? 'border-transparent' : 'border-brand-dark/15 hover:border-brand-gold/50'
      )}>
        {gosterilen ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gosterilen}
              alt=""
              className={cn(
                'w-full h-full object-cover transition-opacity',
                yukleniyor && 'opacity-70'
              )}
            />

            {/* Yükleme overlay'i */}
            {yukleniyor && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30 backdrop-blur-[1px]">
                <IconLoader2 size={36} className="animate-spin text-white drop-shadow-lg" />
                <span className="text-sm font-medium text-white drop-shadow-lg">
                  Yükleniyor…
                </span>
              </div>
            )}

            {/* Sil butonu — yükleme bittiyse görünür */}
            {!yukleniyor && deger && (
              <button
                type="button"
                onClick={handleSil}
                disabled={yukleniyor}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors disabled:opacity-50"
                title="Sil"
              >
                <IconX size={16} />
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={yukleniyor}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-ink/50 hover:text-brand-gold transition-colors disabled:cursor-not-allowed"
          >
            <IconUpload size={32} stroke={1.5} />
            <span className="text-sm font-medium">Görsel Seç</span>
            <span className="text-xs">JPG, PNG, WebP, AVIF, GIF — max 50 MB</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSecim}
        className="hidden"
      />
    </div>
  );
}
