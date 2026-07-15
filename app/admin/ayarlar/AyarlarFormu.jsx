// ════════════════════════════════════════════════════════════
// Ayarlar Formu — Site genel ayarları
// ════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import {
  IconBrandWhatsapp, IconMapPin, IconMail, IconPhone,
  IconBrandInstagram, IconBrandFacebook, IconDeviceFloppy, IconBuildingStore,
} from '@tabler/icons-react';
import Button from '@/components/ui/Button';
import { Input, Checkbox } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { revalidatePaths, tumSiteRevalidatePaths } from '@/lib/revalidate';

export default function AyarlarFormu({ ilkAyarlar }) {
  const [veri, setVeri] = useState(() => ({
    id: ilkAyarlar?.id || null,
    whatsapp_number:           ilkAyarlar?.whatsapp_number || '905360400118',
    business_name:             ilkAyarlar?.business_name || 'Möbel İnegöl',
    business_tagline:          ilkAyarlar?.business_tagline || 'Hayalindeki Eve Bir Adım',
    business_address:          ilkAyarlar?.business_address || 'İnegöl / Bursa',
    business_phone:            ilkAyarlar?.business_phone || '',
    business_email:            ilkAyarlar?.business_email || 'info@mobelinegol.com',
    social_links: {
      instagram: ilkAyarlar?.social_links?.instagram || 'https://instagram.com/mobelinegol',
      facebook:  ilkAyarlar?.social_links?.facebook || '',
      youtube:   ilkAyarlar?.social_links?.youtube || '',
    },
  }));

  const [yukleniyor, setYukleniyor] = useState(false);
  const { goster } = useToast();
  const supabase = getSupabaseClient();

  function guncelle(alan, deger) {
    setVeri((m) => ({ ...m, [alan]: deger }));
  }

  function sosyalGuncelle(platform, deger) {
    setVeri((m) => ({
      ...m,
      social_links: { ...m.social_links, [platform]: deger },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setYukleniyor(true);
    try {
      const { id, ...degisiklikler } = veri;
      if (!id) {
        // İlk seferinde insert
        const { error } = await supabase.from('settings').insert([degisiklikler]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('settings').update(degisiklikler).eq('id', id);
        if (error) throw error;
      }
      goster('Ayarlar kaydedildi', 'basari');
      revalidatePaths(tumSiteRevalidatePaths()).catch(() => {});
    } catch (err) {
      goster('Kaydetme başarısız: ' + (err?.message || ''), 'hata');
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">
          Ayarlar
        </h1>
        <p className="text-brand-ink/60 mt-2">
          Site genel ayarları, iletişim bilgileri, duyuru barı
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* İŞLETME BİLGİLERİ */}
        <section className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <IconBuildingStore size={20} className="text-brand-gold" />
            <h2 className="font-display text-xl font-semibold text-brand-dark">İşletme</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="İşletme Adı"
              value={veri.business_name}
              onChange={(e) => guncelle('business_name', e.target.value)}
              required
            />
            <Input
              label="Slogan"
              value={veri.business_tagline}
              onChange={(e) => guncelle('business_tagline', e.target.value)}
              placeholder="Hayalindeki Eve Bir Adım"
            />
            <Input
              label={<><IconMapPin size={14} className="inline mr-1" />Adres</>}
              value={veri.business_address}
              onChange={(e) => guncelle('business_address', e.target.value)}
              placeholder="İnegöl / Bursa"
            />
            <Input
              label={<><IconPhone size={14} className="inline mr-1" />Sabit Telefon</>}
              value={veri.business_phone}
              onChange={(e) => guncelle('business_phone', e.target.value)}
              placeholder="opsiyonel"
            />
            <Input
              label={<><IconMail size={14} className="inline mr-1" />E-posta</>}
              type="email"
              value={veri.business_email}
              onChange={(e) => guncelle('business_email', e.target.value)}
              placeholder="info@mobelinegol.com"
            />
            <Input
              label={<><IconBrandWhatsapp size={14} className="inline mr-1 text-green-600" />WhatsApp Numarası</>}
              value={veri.whatsapp_number}
              onChange={(e) => guncelle('whatsapp_number', e.target.value)}
              placeholder="905360400118"
              required
            />
          </div>
          <p className="text-xs text-brand-ink/50 mt-3">
            💡 WhatsApp formatı: <code>905XXXXXXXXX</code> — başında + yok, ülke kodu var.
          </p>
        </section>

        {/* SOSYAL MEDYA */}
        <section className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <IconBrandInstagram size={20} className="text-brand-gold" />
            <h2 className="font-display text-xl font-semibold text-brand-dark">Sosyal Medya</h2>
          </div>
          <div className="space-y-4">
            <Input
              label={<><IconBrandInstagram size={14} className="inline mr-1" />Instagram URL</>}
              value={veri.social_links.instagram}
              onChange={(e) => sosyalGuncelle('instagram', e.target.value)}
              placeholder="https://instagram.com/mobelinegol"
            />
            <Input
              label={<><IconBrandFacebook size={14} className="inline mr-1" />Facebook URL</>}
              value={veri.social_links.facebook}
              onChange={(e) => sosyalGuncelle('facebook', e.target.value)}
              placeholder="opsiyonel"
            />
            <Input
              label="YouTube URL"
              value={veri.social_links.youtube}
              onChange={(e) => sosyalGuncelle('youtube', e.target.value)}
              placeholder="opsiyonel"
            />
          </div>
        </section>

        {/* KAYDET */}
        <div className="sticky bottom-4 bg-brand-cream border border-brand-dark/10 rounded-2xl shadow-card-h p-4 flex justify-end gap-2">
          <Button type="submit" variant="primary" size="lg" yukleniyor={yukleniyor}>
            <IconDeviceFloppy size={18} />
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </>
  );
}

// ─── Şifre Değiştirme Bölümü (dosya sonuna eklendi) ───────────────
// Bu export'u AyarlarFormu'nun içine entegre et veya ayrı bileşen olarak kullan
