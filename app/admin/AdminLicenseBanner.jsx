// ════════════════════════════════════════════════════════════
// AdminLicenseBanner — Admin paneline giren Enes'e uyarı
// ════════════════════════════════════════════════════════════
// Public banner zaten müşterilere gösteriliyor. Bu da Enes'in
// giriş yaptığında üst kısımda görmesi için.
// ════════════════════════════════════════════════════════════

import { LICENSE_STATUSES } from '@/lib/ubivo/license';
import { IconAlertTriangle, IconInfoCircle, IconLock } from '@tabler/icons-react';

export default function AdminLicenseBanner({ status, message, paidUntil }) {
  if (!status || status === LICENSE_STATUSES.ACTIVE) return null;

  const tipler = {
    [LICENSE_STATUSES.WARNING_1]: {
      bg: 'bg-amber-50 border-amber-300',
      text: 'text-amber-900',
      icon: <IconInfoCircle size={20} className="text-amber-600" />,
      baslik: 'Servis Ödemesi Hatırlatması',
    },
    [LICENSE_STATUSES.WARNING_2]: {
      bg: 'bg-orange-50 border-orange-400',
      text: 'text-orange-900',
      icon: <IconAlertTriangle size={20} className="text-orange-600" />,
      baslik: 'Servis Ödemesi Gecikti',
    },
    [LICENSE_STATUSES.RESTRICTED]: {
      bg: 'bg-red-50 border-red-400',
      text: 'text-red-900',
      icon: <IconLock size={20} className="text-red-600" />,
      baslik: 'Site Kısıtlı Modda — Acil Ödeme Gerekli',
    },
  };

  const tip = tipler[status];
  if (!tip) return null;

  return (
    <div className={`${tip.bg} border-2 rounded-xl p-4 mb-6 flex items-start gap-3`}>
      <div className="shrink-0 mt-0.5">{tip.icon}</div>
      <div className={`flex-1 ${tip.text}`}>
        <div className="font-semibold text-sm mb-1">{tip.baslik}</div>
        <p className="text-sm leading-relaxed">
          {message || 'Sitenizin sürekliliği için servis ödemesinin tamamlanması gerekmektedir. Geliştirici ile iletişime geçiniz.'}
        </p>
        {paidUntil && (
          <p className="text-xs mt-2 opacity-80">
            Son ödeme tarihi: <strong>{new Date(paidUntil).toLocaleDateString('tr-TR')}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
