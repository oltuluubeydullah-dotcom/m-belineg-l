// ════════════════════════════════════════════════════════════
// Button — Yeniden kullanılabilir buton
// ════════════════════════════════════════════════════════════
// 4 varyant: primary (koyu), gold (altın), ghost (border), danger (kırmızı)
// 3 boyut: sm, md, lg
// ════════════════════════════════════════════════════════════

'use client';

import { cn } from '@/lib/utils';
import { IconLoader2 } from '@tabler/icons-react';

const VARYANTLAR = {
  primary: 'bg-brand-dark text-brand-cream hover:bg-brand-darker',
  gold:    'bg-brand-gold text-brand-dark hover:opacity-90',
  ghost:   'border border-brand-dark/20 text-brand-dark hover:bg-brand-dark hover:text-brand-cream',
  danger:  'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark',
};

const BOYUTLAR = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  yukleniyor = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || yukleniyor}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARYANTLAR[variant],
        BOYUTLAR[size],
        className
      )}
      {...props}
    >
      {yukleniyor && <IconLoader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
