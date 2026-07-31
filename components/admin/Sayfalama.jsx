'use client';

// ════════════════════════════════════════════════════════════
// Admin — Sayfalama (server-side pagination kontrolü)
// ════════════════════════════════════════════════════════════
// URL query param ile çalışır (force-dynamic sayfalarda tam re-fetch).
// hrefYap(n): n. sayfanın URL'sini üretir (arama/filtre paramlarını korur).
// ════════════════════════════════════════════════════════════

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

function SayfaLink({ aktif, href, children }) {
  if (!aktif) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-brand-ink/30 border border-brand-dark/5 cursor-not-allowed select-none">
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-brand-dark border border-brand-dark/15 hover:bg-brand-dark/5 transition-colors"
    >
      {children}
    </a>
  );
}

export default function Sayfalama({ sayfa, toplam, sayfaBoyutu, hrefYap }) {
  const toplamSayfa = Math.max(1, Math.ceil((toplam || 0) / sayfaBoyutu));
  if (toplamSayfa <= 1) return null;
  const bas = (sayfa - 1) * sayfaBoyutu + 1;
  const son = Math.min(sayfa * sayfaBoyutu, toplam);
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-brand-ink/60">
        {bas}–{son} <span className="text-brand-ink/40">/ {toplam}</span>
      </p>
      <div className="flex items-center gap-2">
        <SayfaLink aktif={sayfa > 1} href={hrefYap(sayfa - 1)}>
          <IconChevronLeft size={16} /> Önceki
        </SayfaLink>
        <span className="text-sm text-brand-ink/70 tabular-nums">
          {sayfa} / {toplamSayfa}
        </span>
        <SayfaLink aktif={sayfa < toplamSayfa} href={hrefYap(sayfa + 1)}>
          Sonraki <IconChevronRight size={16} />
        </SayfaLink>
      </div>
    </div>
  );
}
