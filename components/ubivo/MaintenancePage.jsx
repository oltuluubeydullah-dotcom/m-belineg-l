// ════════════════════════════════════════════════════════════
// MaintenancePage — Tam ekran "servis duraklatıldı"
// ════════════════════════════════════════════════════════════
// status = 'maintenance' veya lisans bulunamadı durumunda görünür.
// Tüm site içeriği bunun yerine gösterilir.
// ════════════════════════════════════════════════════════════

import { IconTool, IconMail, IconBrandWhatsapp } from '@tabler/icons-react';

export default function MaintenancePage({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-brand-cream via-white to-brand-cream">
      <div className="max-w-lg w-full text-center">
        {/* İkon */}
        <div className="inline-flex p-6 bg-brand-dark/5 rounded-full mb-8">
          <IconTool size={56} className="text-brand-ink/40" stroke={1.5} />
        </div>

        {/* Başlık */}
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-brand-ink mb-4 leading-tight">
          Servis Geçici Olarak Duraklatıldı
        </h1>

        <p className="text-base md:text-lg text-brand-ink/70 mb-8 leading-relaxed">
          {message || 'Bu site servisi geçici olarak duraklatılmıştır. Kısa süre içinde tekrar aktif olacaktır. Bilgi için aşağıdaki kanallardan iletişime geçebilirsiniz.'}
        </p>

        {/* İletişim kutuları */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <p className="text-sm text-brand-ink/60 mb-4">Acil durumlar için iletişim:</p>
          <div className="space-y-3">
            <a
              href="https://wa.me/905360400108"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              <IconBrandWhatsapp size={20} />
              WhatsApp ile iletişime geç
            </a>
            <a
              href="mailto:mobelinegol16@gmail.com"
              className="flex items-center justify-center gap-2 w-full py-3 px-5 bg-brand-dark hover:bg-brand-ink text-brand-cream rounded-lg font-medium transition-colors"
            >
              <IconMail size={20} />
              E-posta gönder
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-brand-ink/40">
          Geliştirici servis hattı · ubivo
        </p>
      </div>
    </div>
  );
}
