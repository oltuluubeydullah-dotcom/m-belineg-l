// ════════════════════════════════════════════════════════════
// Global Error Boundary
// ════════════════════════════════════════════════════════════

'use client';

import Link from 'next/link';
import { IconAlertTriangle, IconHome, IconRefresh, IconBrandWhatsapp } from '@tabler/icons-react';
import { genelDestekLinki } from '@/lib/whatsapp';
import { ROTALAR } from '@/lib/constants';

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
          <IconAlertTriangle size={36} className="text-red-500" />
        </div>

        <h1 className="font-display text-3xl font-semibold text-brand-dark mb-3">
          Bir Sorun Oluştu
        </h1>

        <p className="text-brand-ink/70 mb-8 leading-relaxed">
          Beklenmedik bir hata meydana geldi. Lütfen sayfayı yenilemeyi deneyin.
          Sorun devam ederse WhatsApp&apos;tan bize ulaşabilirsiniz.
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-dark text-brand-cream rounded-full font-medium hover:bg-brand-darker transition-colors"
          >
            <IconRefresh size={18} />
            Tekrar Dene
          </button>

          <Link
            href={ROTALAR.anasayfa}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-brand-dark/15 text-brand-dark rounded-full font-medium hover:bg-brand-dark/5 transition-colors"
          >
            <IconHome size={18} />
            Anasayfa
          </Link>

          <a
            href={genelDestekLinki()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm text-brand-ink/60 hover:text-brand-teal transition-colors"
          >
            <IconBrandWhatsapp size={16} />
            WhatsApp&apos;tan Yaz
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && error?.message && (
          <details className="mt-8 text-left bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
            <summary className="cursor-pointer font-medium">Geliştirici Bilgisi</summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
