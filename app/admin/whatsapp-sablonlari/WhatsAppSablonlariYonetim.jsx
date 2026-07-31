'use client';

import { useState } from 'react';
import { IconDeviceFloppy, IconBrandWhatsapp, IconInfoCircle } from '@tabler/icons-react';
import { useToast } from '@/context/ToastContext';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

export default function WhatsAppSablonlariYonetim({ baslangic }) {
  const [sablonlar, setSablonlar] = useState(baslangic);
  // Per-row kayıt durumu — bir kartı kaydederken diğerleri dönmesin (Ajan #30).
  const [kaydedilenId, setKaydedilenId] = useState(null);
  const { goster } = useToast();
  const supabase = createClient();

  const guncelle = (id, alan, deger) => {
    setSablonlar((prev) => prev.map((s) => (s.id === id ? { ...s, [alan]: deger } : s)));
  };

  const kaydet = async (sablon) => {
    setKaydedilenId(sablon.id);
    try {
      const { error } = await supabase
        .from('whatsapp_templates')
        .update({
          template_tr: sablon.template_tr,
          template_en: sablon.template_en,
          template_de: sablon.template_de,
        })
        .eq('id', sablon.id);
      if (error) throw error;
      goster('Şablon güncellendi', 'basari');
    } catch (e) {
      goster('Hata: ' + e.message, 'hata');
    } finally {
      setKaydedilenId(null);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">WhatsApp Mesaj Şablonları</h1>
        <p className="text-brand-ink/60 mt-2">
          Müşteri site üzerinden WhatsApp&apos;a tıkladığında otomatik açılan mesajları düzenleyin.
          <strong> &#123;urun&#125;</strong> gibi yer tutucular destekleniyor.
        </p>
      </div>

      {/* Dürüstlük notu (Ajan #54): şablonlar DB'ye kaydediliyor ancak site
          şu an yerleşik varsayılan metinleri kullanıyor. Yanıltıcı olmasın. */}
      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <IconInfoCircle size={18} className="shrink-0 mt-0.5" />
        <p>
          <strong>Bilgi:</strong> Buradaki değişiklikler kaydediliyor, ancak sitedeki WhatsApp mesajları
          şu an <strong>yerleşik varsayılan metinleri</strong> kullanıyor. Özel şablonların canlıya
          bağlanması bir sonraki güncellemede yapılacak. (Mevcut mesajlar zaten profesyonel ve üç dilde hazır.)
        </p>
      </div>

      <div className="space-y-5">
        {sablonlar.map((sablon) => (
          <div key={sablon.id} className="bg-white rounded-2xl border border-brand-dark/5 shadow-card p-5 md:p-7">
            <div className="flex items-start gap-3 mb-4 pb-4 border-b border-brand-dark/5">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                <IconBrandWhatsapp size={20} />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-lg font-semibold text-brand-dark">
                  {sablon.key === 'support'        && 'Genel Destek Mesajı'}
                  {sablon.key === 'product_inquiry'&& 'Ürün Hakkında Soru'}
                  {sablon.key === 'cart_checkout'  && 'Sepet Onay Mesajı'}
                </h2>
                <p className="text-xs text-brand-ink/50 mt-1 flex items-start gap-1">
                  <IconInfoCircle size={14} className="shrink-0 mt-0.5" />
                  {sablon.description}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { lang: 'tr', label: '🇹🇷 Türkçe', field: 'template_tr', required: true },
                { lang: 'en', label: '🇬🇧 English', field: 'template_en', required: false },
                { lang: 'de', label: '🇩🇪 Deutsch', field: 'template_de', required: false },
              ].map((sec) => (
                <div key={sec.lang}>
                  <label className="block text-xs font-medium text-brand-ink/70 mb-1">
                    {sec.label} {sec.required && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={sablon[sec.field] || ''}
                    onChange={(e) => guncelle(sablon.id, sec.field, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-brand-dark/10 rounded-lg text-sm
                               focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <Button variant="gold" onClick={() => kaydet(sablon)} yukleniyor={kaydedilenId === sablon.id}>
                <IconDeviceFloppy size={18} />
                Kaydet
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
