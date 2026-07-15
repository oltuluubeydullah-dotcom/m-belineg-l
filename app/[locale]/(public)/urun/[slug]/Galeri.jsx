// ════════════════════════════════════════════════════════════
// Ürün Galerisi v4 — Next.js Image + PINCH-TO-ZOOM (v12.0)
// ════════════════════════════════════════════════════════════
// v12.0 EKLENDİ:
//   • Next.js <Image> migration — AVIF/WebP, srcset, lazy load
//   • Skeleton placeholder — yüklenirken pulse (CLS sıfır)
//   • Blur-up effect — küçük renkli placeholder → gerçek görsel
//   • Lightbox'ta PINCH-TO-ZOOM (2 parmak) + DOUBLE-TAP zoom
//   • Pan (sürükleme) — zoom edilmiş görsel sürüklenir
//   • Mouse wheel zoom (desktop)
//   • Geri tuşu lightbox'ı kapatır (mobil UX)
// Korunan davranışlar (v11.9):
//   • Swipe geçiş (touch threshold 50px)
//   • Klavye gezinti (Arrow + ESC)
//   • Body scroll lock + ESC
// ════════════════════════════════════════════════════════════

'use client';

import { gorselSrc } from '@/lib/gorsel';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  IconChevronLeft, IconChevronRight, IconPhoto, IconX, IconZoomIn,
  IconZoomReset,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

// ─── Swipe hook (yatay geçiş için) ──────────────────────────
function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50, enabled = true }) {
  const baslangic = useRef(null);
  return {
    onTouchStart: (e) => {
      if (!enabled) return;
      // 2+ parmak → swipe iptal (pinch için)
      if (e.touches.length > 1) { baslangic.current = null; return; }
      const t = e.touches[0];
      baslangic.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    },
    onTouchEnd: (e) => {
      if (!enabled) return;
      if (!baslangic.current) return;
      if (e.changedTouches.length === 0) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - baslangic.current.x;
      const dy = t.clientY - baslangic.current.y;
      const sure = Date.now() - baslangic.current.time;
      baslangic.current = null;

      if (Math.abs(dx) < threshold) return;
      if (Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (sure > 800) return;

      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
  };
}

// ─── Pinch-to-zoom hook ─────────────────────────────────────
// 2-parmak pinch + double-tap toggle + drag (pan)
// Zoom edilmişken: swipe DEVRE DIŞI (sürtüşme önlenir)
function usePinchZoom() {
  const [zoom, setZoom] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  // İç state'ler — re-render tetiklemez
  const pinchBaslangic = useRef(null);    // { mesafe, zoom }
  const panBaslangic = useRef(null);      // { x, y, tx, ty }
  const sonTap = useRef(0);

  const sifirla = useCallback(() => {
    setZoom(1); setTx(0); setTy(0);
  }, []);

  // İki parmak mesafesi
  const ikiParmakMesafe = (e) => {
    const [t1, t2] = e.touches;
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch başla
      pinchBaslangic.current = {
        mesafe: ikiParmakMesafe(e),
        zoom: zoom,
      };
      panBaslangic.current = null;
    } else if (e.touches.length === 1 && zoom > 1) {
      // Zoom'daysa tek parmak pan başlatır
      const t = e.touches[0];
      panBaslangic.current = { x: t.clientX, y: t.clientY, tx, ty };
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && pinchBaslangic.current) {
      e.preventDefault?.(); // browser zoom'u engelle
      const yeniMesafe = ikiParmakMesafe(e);
      const oran = yeniMesafe / pinchBaslangic.current.mesafe;
      const yeniZoom = Math.min(4, Math.max(1, pinchBaslangic.current.zoom * oran));
      setZoom(yeniZoom);
      // Zoom 1'e geldiyse pan'ı sıfırla
      if (yeniZoom <= 1.02) {
        setTx(0); setTy(0);
      }
    } else if (e.touches.length === 1 && panBaslangic.current && zoom > 1) {
      const t = e.touches[0];
      const dx = t.clientX - panBaslangic.current.x;
      const dy = t.clientY - panBaslangic.current.y;
      setTx(panBaslangic.current.tx + dx);
      setTy(panBaslangic.current.ty + dy);
    }
  };

  const onTouchEnd = (e) => {
    // Pinch bitti
    if (e.touches.length < 2) {
      pinchBaslangic.current = null;
    }
    if (e.touches.length === 0) {
      panBaslangic.current = null;
      // Double-tap kontrolü (sadece tek-parmak bittiğinde)
      const simdi = Date.now();
      if (simdi - sonTap.current < 300 && e.changedTouches.length === 1) {
        // Double-tap → 1x ↔ 2x toggle
        if (zoom > 1) {
          sifirla();
        } else {
          setZoom(2);
        }
      }
      sonTap.current = simdi;
    }
  };

  // Mouse wheel (desktop) — lightbox'ta her zaman zoom yapar (1x'ten itibaren)
  const onWheel = (e) => {
    e.preventDefault?.();
    const yon = e.deltaY < 0 ? 1.15 : 0.87;
    const yeniZoom = Math.min(4, Math.max(1, zoom * yon));
    setZoom(yeniZoom);
    if (yeniZoom <= 1.02) { setTx(0); setTy(0); }
  };

  const style = zoom === 1
    ? { transform: 'none', transition: 'transform 0.2s ease-out' }
    : {
        transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
        transition: panBaslangic.current ? 'none' : 'transform 0.2s ease-out',
      };

  return {
    zoom,
    style,
    sifirla,
    bindings: { onTouchStart, onTouchMove, onTouchEnd, onWheel },
  };
}

export default function Galeri({ urunAdi, fotograflar: fotograflarRaw = [] }) {
  const fotograflar = (fotograflarRaw || []).map(gorselSrc);
  const [aktif, setAktif] = useState(0);
  const [lightboxAcik, setLightboxAcik] = useState(false);
  const [ilkYuklendi, setIlkYuklendi] = useState(false);

  const onceki = useCallback(() => {
    if (fotograflar.length === 0) return;
    setAktif((a) => (a - 1 + fotograflar.length) % fotograflar.length);
  }, [fotograflar.length]);

  const sonraki = useCallback(() => {
    if (fotograflar.length === 0) return;
    setAktif((a) => (a + 1) % fotograflar.length);
  }, [fotograflar.length]);

  // Pinch zoom (sadece lightbox'ta aktif)
  const pinch = usePinchZoom();

  // Yeni görsele geçince zoom sıfırla
  useEffect(() => {
    pinch.sifirla();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktif, lightboxAcik]);

  // Swipe — zoom aktifken devre dışı (parmak pan için)
  const swipeAna = useSwipe({ onSwipeLeft: sonraki, onSwipeRight: onceki });
  const swipeLightbox = useSwipe({
    onSwipeLeft: sonraki,
    onSwipeRight: onceki,
    enabled: pinch.zoom <= 1,
  });

  // Lightbox'taki touch handler'lar: swipe + pinch birleştirilir (override engeli)
  const lightboxHandlers = {
    onTouchStart: (e) => {
      pinch.bindings.onTouchStart(e);
      swipeLightbox.onTouchStart(e);
    },
    onTouchMove: (e) => {
      pinch.bindings.onTouchMove(e);
    },
    onTouchEnd: (e) => {
      pinch.bindings.onTouchEnd(e);
      swipeLightbox.onTouchEnd(e);
    },
    onWheel: pinch.bindings.onWheel,
  };

  // Klavye gezinti
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') onceki();
      else if (e.key === 'ArrowRight') sonraki();
      else if (e.key === 'Escape' && lightboxAcik) setLightboxAcik(false);
      else if ((e.key === '0' || e.key === '_') && lightboxAcik) pinch.sifirla();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onceki, sonraki, lightboxAcik, pinch]);

  // Lightbox açıkken body scroll lock + history state (geri tuşu kapatır)
  useEffect(() => {
    if (!lightboxAcik) return;
    const eski = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Geri tuşu yakala (mobil UX)
    window.history.pushState({ lightbox: true }, '');
    const popHandler = () => setLightboxAcik(false);
    window.addEventListener('popstate', popHandler);

    return () => {
      document.body.style.overflow = eski;
      window.removeEventListener('popstate', popHandler);
      // Lightbox normal kapanırsa state'i geri çek
      if (window.history.state?.lightbox) {
        window.history.back();
      }
    };
  }, [lightboxAcik]);

  if (fotograflar.length === 0) {
    return (
      <div className="aspect-[4/3] bg-brand-dark/5 rounded-2xl flex items-center justify-center">
        <IconPhoto size={64} className="text-brand-ink/20" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Ana görsel — tıkla → lightbox, swipe → görsel geç */}
        <div
          className="relative aspect-[4/3] bg-brand-dark/5 rounded-2xl overflow-hidden group touch-pan-y select-none"
          {...swipeAna}
        >
          <button
            type="button"
            onClick={() => setLightboxAcik(true)}
            className="absolute inset-0 w-full h-full cursor-zoom-in"
            aria-label="Görseli büyüt"
          >
            {/* Skeleton — ilk yüklenmede pulse */}
            {!ilkYuklendi && (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/5 via-brand-dark/10 to-brand-dark/5 animate-pulse" />
            )}
            <Image
              src={fotograflar[aktif]}
              alt={`${urunAdi} - Görsel ${aktif + 1}`}
              fill
              priority={aktif === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 800px"
              className="object-cover animate-fade-in"
              quality={80}
              onLoad={() => setIlkYuklendi(true)}
              key={fotograflar[aktif]}
              draggable={false}
            />
          </button>

          <div className="absolute top-3 right-3 p-2 bg-brand-dark/60 text-brand-cream rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <IconZoomIn size={18} />
          </div>

          {fotograflar.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onceki(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-brand-dark/60 hover:bg-brand-dark text-brand-cream rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Önceki görsel"
              >
                <IconChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); sonraki(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-brand-dark/60 hover:bg-brand-dark text-brand-cream rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Sonraki görsel"
              >
                <IconChevronRight size={24} />
              </button>

              <div className="absolute bottom-3 right-3 px-3 py-1 bg-brand-dark/60 text-brand-cream text-xs rounded-full pointer-events-none">
                {aktif + 1} / {fotograflar.length}
              </div>

              <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-brand-dark/40 text-brand-cream text-[10px] rounded-full pointer-events-none md:hidden">
                ← Kaydır →
              </div>
            </>
          )}
        </div>

        {/* Thumbnail'ler */}
        {fotograflar.length > 1 && (
          <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
            {fotograflar.map((foto, i) => (
              <button
                key={foto}
                type="button"
                onClick={() => setAktif(i)}
                className={cn(
                  'relative aspect-square rounded-lg overflow-hidden transition-all bg-brand-dark/5',
                  i === aktif
                    ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-brand-cream'
                    : 'opacity-60 hover:opacity-100'
                )}
              >
                <Image
                  src={foto}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                  quality={70}
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── LIGHTBOX MODAL ───────────────────────────────────── */}
      {lightboxAcik && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={() => setLightboxAcik(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxAcik(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
            aria-label="Kapat (ESC)"
          >
            <IconX size={24} />
          </button>

          {/* Zoom reset (sadece zoom > 1 iken) */}
          {pinch.zoom > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); pinch.sifirla(); }}
              className="absolute top-4 right-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
              aria-label="Yakınlaştırmayı sıfırla"
              title="Yakınlaştırmayı sıfırla (0)"
            >
              <IconZoomReset size={24} />
            </button>
          )}

          {fotograflar.length > 1 && (
            <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 text-white text-sm rounded-full font-medium pointer-events-none">
              {aktif + 1} / {fotograflar.length}
              {pinch.zoom > 1 && (
                <span className="ml-2 text-brand-gold">{pinch.zoom.toFixed(1)}x</span>
              )}
            </div>
          )}

          {fotograflar.length > 1 && pinch.zoom <= 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onceki(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
              aria-label="Önceki görsel"
            >
              <IconChevronLeft size={28} />
            </button>
          )}

          {/* Görsel container — swipe + pinch destekli (birleşik handler) */}
          <div
            className="relative w-full h-full flex items-center justify-center p-4 md:p-16 touch-none select-none overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            {...lightboxHandlers}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={pinch.style}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotograflar[aktif]}
                alt={`${urunAdi} - Görsel ${aktif + 1}`}
                className="max-w-full max-h-full object-contain animate-fade-in"
                key={`lb-${fotograflar[aktif]}`}
                draggable={false}
              />
            </div>
          </div>

          {fotograflar.length > 1 && pinch.zoom <= 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); sonraki(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
              aria-label="Sonraki görsel"
            >
              <IconChevronRight size={28} />
            </button>
          )}

          {/* Mobile ipucu — pinch nasıl yapılır */}
          {pinch.zoom <= 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 text-white/80 text-[11px] rounded-full pointer-events-none md:hidden">
              2 parmakla yakınlaştır · çift dokun
            </div>
          )}

          {/* Desktop ipucu — fare tekerleği ile zoom */}
          {pinch.zoom <= 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 text-white/80 text-[11px] rounded-full pointer-events-none hidden md:block">
              Fare tekerleğiyle yakınlaştır · sürükleyerek gezin
            </div>
          )}

          {/* Alt thumbnail strip — sadece zoom 1 iken */}
          {fotograflar.length > 1 && pinch.zoom <= 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
              <div className="flex gap-2 overflow-x-auto max-w-full bg-white/5 rounded-lg p-2">
                {fotograflar.map((foto, i) => (
                  <button
                    key={`lb-th-${foto}`}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setAktif(i); }}
                    className={cn(
                      'shrink-0 relative w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden transition-all bg-white/10',
                      i === aktif ? 'ring-2 ring-brand-gold scale-105' : 'opacity-50 hover:opacity-100'
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={foto} alt="" className="w-full h-full object-cover" draggable={false} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
