// ════════════════════════════════════════════════════════════
// Modal — Dialog bileşeni
// ════════════════════════════════════════════════════════════
// Form ekleme/düzenleme, onay diyalogları için.
// Esc tuşu ve backdrop tıklamasıyla kapanır.
// ════════════════════════════════════════════════════════════

'use client';

import { useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const BOYUTLAR = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({
  acik,
  kapat,
  baslik,
  altBaslik,
  children,
  size = 'md',
  kapatilabilir = true,
}) {
  // Esc tuşu ile kapat
  useEffect(() => {
    if (!acik || !kapatilabilir) return;
    const handler = (e) => e.key === 'Escape' && kapat();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [acik, kapatilabilir, kapat]);

  // Açıkken body scroll'u durdur
  useEffect(() => {
    if (acik) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [acik]);

  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop — blur kaldırıldı (scroll kasmasına sebep oluyordu) */}
      <div
        className="absolute inset-0 bg-brand-dark/70"
        onClick={() => kapatilabilir && kapat()}
      />

      {/* Modal kutusu */}
      <div className={cn(
        'relative w-full bg-brand-cream rounded-2xl shadow-card-h',
        'max-h-[90vh] flex flex-col animate-slide-up',
        BOYUTLAR[size]
      )}>
        {/* Başlık */}
        {(baslik || kapatilabilir) && (
          <div className="flex items-start justify-between gap-4 p-6 border-b border-brand-dark/5">
            <div className="flex-1">
              {baslik && (
                <h2 className="font-display text-xl font-semibold text-brand-dark">
                  {baslik}
                </h2>
              )}
              {altBaslik && (
                <p className="text-sm text-brand-ink/60 mt-1">{altBaslik}</p>
              )}
            </div>
            {kapatilabilir && (
              <button
                type="button"
                onClick={kapat}
                className="p-1.5 rounded-lg hover:bg-brand-dark/5 transition-colors"
                aria-label="Kapat"
              >
                <IconX size={20} />
              </button>
            )}
          </div>
        )}

        {/* İçerik — akıcı scroll, taşma kontrolü */}
        <div
          className="flex-1 overflow-y-auto p-6 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch', transform: 'translateZ(0)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
