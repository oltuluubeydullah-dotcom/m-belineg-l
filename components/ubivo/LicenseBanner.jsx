// ════════════════════════════════════════════════════════════
// LicenseBanner — Sayfanın üstünde uyarı şeridi
// ════════════════════════════════════════════════════════════
// warning_1 → ince sarı şerit
// warning_2 → daha büyük + dikkat çekici
// Müşteri kapatamaz (dismissible değil) — kasıtlı.
// ════════════════════════════════════════════════════════════

import { IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';
import { LICENSE_STATUSES } from '@/lib/ubivo/license';

export default function LicenseBanner({ status, message }) {
  if (status === LICENSE_STATUSES.WARNING_1) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs md:text-sm">
          <IconInfoCircle size={16} className="shrink-0" />
          <span className="font-medium">
            {message || 'Servis ödemesi bekleniyor. Detay için geliştirici ile iletişime geçiniz.'}
          </span>
        </div>
      </div>
    );
  }

  if (status === LICENSE_STATUSES.WARNING_2) {
    return (
      <div className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 text-sm md:text-base">
          <IconAlertTriangle size={20} className="shrink-0" />
          <div className="flex-1">
            <strong className="block md:inline">Servis ödemesi gecikti.</strong>
            <span className="md:ml-2">
              {message || 'Sitenin sürekliliği için ödemenin tamamlanması gerekmektedir.'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (status === LICENSE_STATUSES.RESTRICTED) {
    return (
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 text-sm md:text-base">
          <IconAlertTriangle size={20} className="shrink-0 animate-pulse" />
          <div className="flex-1">
            <strong className="block md:inline">⚠️ Site kısıtlı modda</strong>
            <span className="md:ml-2">
              {message || 'WhatsApp ve sepet işlevleri geçici olarak devre dışıdır. Ödeme tamamlandığında 24 saat içinde tekrar açılacaktır.'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
