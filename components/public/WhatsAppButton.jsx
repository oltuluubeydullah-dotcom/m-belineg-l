// ════════════════════════════════════════════════════════════
// Floating WhatsApp Butonu
// ════════════════════════════════════════════════════════════
// Sayfanın sağ alt köşesinde sabit duran yeşil daire.
// inobilya'daki gibi, ama bizde tek satış kanalı olduğu için daha vurgulu.
// ════════════════════════════════════════════════════════════

'use client';

import { useLocale } from 'next-intl';
import { IconBrandWhatsapp, IconLock } from '@tabler/icons-react';
import { useWhatsapp } from '@/context/WhatsAppContext';
import { olayGonder } from '@/lib/pazarlama';
import { useKisitlama } from '@/components/ubivo/LicenseContext';

export default function WhatsAppButton() {
  const { kisitli } = useKisitlama();
  const locale = useLocale();
  const { genelDestekLinki } = useWhatsapp();

  if (kisitli) {
    return (
      <div
        aria-label="WhatsApp geçici olarak kullanılamıyor"
        className="
          fixed bottom-6 right-6 z-50
          flex items-center justify-center
          w-14 h-14 md:w-16 md:h-16
          bg-gray-400 text-white rounded-full
          shadow-card-h cursor-not-allowed
          opacity-70
          group
        "
        title="Servis duraklatıldı"
      >
        <IconLock size={24} stroke={1.8} />
      </div>
    );
  }

  return (
    <a
      onClick={() => olayGonder('whatsapp_tiklama', { pixel: 'Lead', pixelVeri: { content_name: 'genel_destek' } })}
      href={genelDestekLinki(locale)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan iletişime geç"
      className="
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        w-14 h-14 md:w-16 md:h-16
        bg-green-500 hover:bg-green-600
        text-white rounded-full
        shadow-card-h
        transition-all duration-300
        hover:scale-110
        group
      "
    >
      <IconBrandWhatsapp size={28} stroke={1.8} />

      {/* Hover'da çıkan tooltip */}
      <span className="
        absolute right-full mr-3 px-3 py-2
        bg-brand-dark text-brand-cream text-sm
        rounded-lg whitespace-nowrap
        opacity-0 group-hover:opacity-100
        translate-x-2 group-hover:translate-x-0
        transition-all duration-200
        pointer-events-none
        hidden md:block
      ">
        Yardıma ihtiyacınız var mı?
      </span>

      {/* Pulse efekti (dikkat çekmek için) */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
    </a>
  );
}
