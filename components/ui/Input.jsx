// ════════════════════════════════════════════════════════════
// Input + Textarea — Form alanları
// ════════════════════════════════════════════════════════════

'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { label, error, className = '', required = false, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-brand-ink mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg text-base',
          'border border-brand-dark/15 bg-white',
          'focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30',
          'transition-colors',
          'disabled:bg-brand-dark/5 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, className = '', required = false, rows = 4, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-brand-ink mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg text-base',
          'border border-brand-dark/15 bg-white',
          'focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30',
          'transition-colors resize-y',
          'disabled:bg-brand-dark/5',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, error, className = '', required = false, children, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-brand-ink mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg text-base',
          'border border-brand-dark/15 bg-white',
          'focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30',
          'transition-colors',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});

export const Checkbox = forwardRef(function Checkbox(
  { label, className = '', ...props },
  ref
) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'w-4 h-4 rounded border-brand-dark/30 text-brand-gold',
          'focus:ring-brand-gold/30',
          className
        )}
        {...props}
      />
      {label && <span className="text-sm text-brand-ink">{label}</span>}
    </label>
  );
});
