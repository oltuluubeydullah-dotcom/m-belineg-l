// ════════════════════════════════════════════════════════════
// Public Error Boundary — v12.3
// ════════════════════════════════════════════════════════════
// Müşteri-tarafı bir sayfa patlarsa beyaz ekran yerine markaya
// uygun bir hata sayfası görünür. Header/footer korunur.
// ════════════════════════════════════════════════════════════

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { IconAlertCircle, IconRefresh, IconHome, IconBrandWhatsapp } from '@tabler/icons-react';

export default function PublicError({ error, reset }) {
  useEffect(() => {
    console.error('[PublicError]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex p-4 bg-brand-dark/5 rounded-full mb-6">
          <IconAlertCircle size={48} className="text-brand-ink/40" stroke={1.5} />
        </div>

        <h1 className="text-2xl font-display font-semibold text-brand-ink mb-3">
          Sayfa yüklenirken bir sorun oluştu
        </h1>
        <p className="text-brand-ink/70 mb-8 leading-relaxed">
          Geçici bir aksaklık olmuş olabilir. Tekrar deneyebilir veya bizimle WhatsApp üzerinden iletişime geçebilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-dark text-brand-cream rounded-lg font-medium hover:bg-brand-ink transition-colors"
          >
            <IconRefresh size={18} />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-brand-dark/15 text-brand-ink rounded-lg font-medium hover:bg-brand-dark/5 transition-colors"
          >
            <IconHome size={18} />
            Ana Sayfa
          </Link>
          <a
            href="https://wa.me/905360400108"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            <IconBrandWhatsapp size={18} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
