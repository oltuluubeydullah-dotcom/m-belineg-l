// ════════════════════════════════════════════════════════════
// Global Loading — Sayfa geçişlerinde gösterilir
// Firma logosu + yükleniyor animasyonu
// ════════════════════════════════════════════════════════════

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        {/* Firma logosu — hafif nabız efektiyle */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/marka/mobel-logo.png"
          alt="Möbel İnegöl"
          width={361}
          height={120}
          className="h-16 w-auto object-contain animate-pulse-soft"
        />
        {/* İnce ilerleme çizgisi */}
        <div className="relative w-32 h-1 bg-brand-dark/10 rounded-full overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-1/2 bg-brand-teal rounded-full animate-loading-bar" />
        </div>
        <p className="text-xs text-brand-ink/50 tracking-[0.2em] uppercase">
          Yükleniyor
        </p>
      </div>
    </div>
  );
}
