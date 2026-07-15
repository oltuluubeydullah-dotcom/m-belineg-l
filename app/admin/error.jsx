// ════════════════════════════════════════════════════════════
// Admin Error Boundary — v12.3
// ════════════════════════════════════════════════════════════
// Admin sayfasında bir component patlarsa beyaz ekran yerine bu görünür.
// Sidebar korunur, sadece içerik bölgesi error mesajı gösterir.
// ════════════════════════════════════════════════════════════

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { IconAlertTriangle, IconRefresh, IconHome } from '@tabler/icons-react';

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error('[AdminError]', error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="inline-flex p-4 bg-red-50 rounded-full mb-4">
          <IconAlertTriangle size={36} className="text-red-500" />
        </div>
        <h1 className="text-xl font-display font-semibold text-brand-ink mb-2">
          Bir şeyler ters gitti
        </h1>
        <p className="text-sm text-brand-ink/70 mb-6 leading-relaxed">
          Bu sayfa yüklenirken bir hata oluştu. Tekrar denemen genelde yeterli olur.
          Sorun devam ederse panele tekrar girip dene.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-brand-cream rounded-lg text-sm font-medium hover:bg-brand-ink transition-colors"
          >
            <IconRefresh size={16} />
            Tekrar Dene
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-dark/15 text-brand-ink rounded-lg text-sm font-medium hover:bg-brand-dark/5 transition-colors"
          >
            <IconHome size={16} />
            Panele Dön
          </Link>
        </div>

        {process.env.NODE_ENV !== 'production' && error?.message && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-brand-ink/50 cursor-pointer">
              Geliştirici detayları
            </summary>
            <pre className="mt-2 p-3 bg-brand-dark/5 rounded text-[11px] overflow-auto text-brand-ink/60">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
