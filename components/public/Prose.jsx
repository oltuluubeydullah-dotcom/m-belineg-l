// ════════════════════════════════════════════════════════════
// Prose — Uzun metin sayfaları için tipografi sarmalı
// ════════════════════════════════════════════════════════════
// KVKK, Hakkımızda gibi sayfalardaki başlık/paragraf hiyerarşisi
// için tutarlı görünüm.
// ════════════════════════════════════════════════════════════

import { cn } from '@/lib/utils';

export default function Prose({ children, className = '' }) {
  return (
    <div className={cn(
      'max-w-3xl mx-auto',
      '[&_h2]:font-display [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-brand-dark [&_h2]:mt-12 [&_h2]:mb-4',
      '[&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-brand-dark [&_h3]:mt-8 [&_h3]:mb-3',
      '[&_p]:text-brand-ink/80 [&_p]:leading-relaxed [&_p]:mb-4',
      '[&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1.5 [&_ul]:text-brand-ink/80 [&_ul]:mb-4 [&_ul]:ml-2',
      '[&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1.5 [&_ol]:text-brand-ink/80 [&_ol]:mb-4 [&_ol]:ml-2',
      '[&_a]:text-brand-gold [&_a]:underline hover:[&_a]:opacity-80',
      '[&_strong]:text-brand-dark [&_strong]:font-semibold',
      '[&_blockquote]:border-l-4 [&_blockquote]:border-brand-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-brand-ink/70 [&_blockquote]:my-6',
      className
    )}>
      {children}
    </div>
  );
}
