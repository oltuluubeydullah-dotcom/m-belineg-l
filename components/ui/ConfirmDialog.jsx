// ════════════════════════════════════════════════════════════
// ConfirmDialog — Onay Diyaloğu
// ════════════════════════════════════════════════════════════
// "Bu ürünü silmek istediğinizden emin misiniz?" tarzı kullanım.
// ════════════════════════════════════════════════════════════

'use client';

import Modal from './Modal';
import Button from './Button';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function ConfirmDialog({
  acik,
  kapat,
  baslik = 'Emin misiniz?',
  mesaj,
  onayMetni = 'Evet, devam et',
  iptalMetni = 'İptal',
  tip = 'danger',  // 'danger' | 'warning'
  onOnay,
  yukleniyor = false,
}) {
  const renkler = {
    danger:  'text-red-500',
    warning: 'text-amber-500',
  };

  async function handleOnay() {
    try {
      await onOnay();
      kapat();
    } catch (e) {
      // Hata toast'ı çağıran tarafta gösterilir
    }
  }

  return (
    <Modal acik={acik} kapat={kapat} size="sm" kapatilabilir={!yukleniyor}>
      <div className="text-center py-2">
        <div className={`w-14 h-14 rounded-full bg-current/10 ${renkler[tip]} mx-auto flex items-center justify-center mb-4`}>
          <IconAlertTriangle size={28} />
        </div>
        <h3 className="font-display text-xl font-semibold text-brand-dark mb-2">
          {baslik}
        </h3>
        {mesaj && (
          <p className="text-sm text-brand-ink/70 mb-6 leading-relaxed">
            {mesaj}
          </p>
        )}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-center">
          <Button variant="ghost" onClick={kapat} disabled={yukleniyor}>
            {iptalMetni}
          </Button>
          <Button
            variant={tip === 'danger' ? 'danger' : 'primary'}
            onClick={handleOnay}
            yukleniyor={yukleniyor}
          >
            {onayMetni}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
