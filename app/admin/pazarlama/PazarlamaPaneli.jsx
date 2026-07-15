// ════════════════════════════════════════════════════════════
// Pazarlama Paneli — Client (v51)
// ════════════════════════════════════════════════════════════
// 3 platform kartı (Meta / TikTok / Google) + katalog feed +
// kampanya raporu. Müşteri dili: her kartta "ID'yi nereden alırım?"
// ════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';
import {
  IconBrandMeta, IconBrandTiktok, IconBrandGoogle,
  IconCopy, IconCheck, IconRss, IconChartBar, IconInfoCircle,
  IconDeviceFloppy, IconExternalLink,
} from '@tabler/icons-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { tumSiteRevalidatePaths } from '@/lib/revalidate';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
const FEED_URL = `${SITE}/api/feed/urunler.xml`;

// ID format kontrolleri (yanlış yapıştırmayı yakalar)
const FORMATLAR = {
  meta_pixel_id: { test: (v) => /^\d{10,20}$/.test(v), ornek: '1234567890123456', hata: 'Meta Pixel ID sadece rakamlardan oluşur (15-16 hane)' },
  tiktok_pixel_id: { test: (v) => /^[A-Z0-9]{15,30}$/i.test(v), ornek: 'C9XXXXXXXXXXXXXXXXX', hata: 'TikTok Pixel ID harf+rakam karışık bir koddur' },
  google_ads_id: { test: (v) => /^AW-\d{8,12}$/.test(v), ornek: 'AW-123456789', hata: "Google Ads etiketi 'AW-' ile başlar (ör. AW-123456789)" },
};

const PLATFORMLAR = [
  {
    anahtar: 'meta_pixel_id',
    ad: 'Meta Pixel',
    kapsam: 'Instagram + Facebook reklamları',
    Icon: IconBrandMeta,
    renk: 'text-blue-600 bg-blue-50',
    kilavuz: 'Reklam ajansınız bu numarayı Meta Business Suite → Olay Yöneticisi (Events Manager) bölümünden alıp size iletir. Buraya yapıştırıp kaydedin — başka işlem gerekmez.',
  },
  {
    anahtar: 'tiktok_pixel_id',
    ad: 'TikTok Pixel',
    kapsam: 'TikTok reklamları',
    Icon: IconBrandTiktok,
    renk: 'text-neutral-900 bg-neutral-100',
    kilavuz: 'TikTok Ads Manager → Varlıklar → Olaylar (Events) → Web Olayları bölümündeki Pixel ID. Ajansınızdan isteyin, buraya yapıştırın.',
  },
  {
    anahtar: 'google_ads_id',
    ad: 'Google Ads',
    kapsam: 'YouTube + Google Arama reklamları',
    Icon: IconBrandGoogle,
    renk: 'text-red-600 bg-red-50',
    kilavuz: "Google Ads → Araçlar → Dönüşümler bölümündeki 'AW-' ile başlayan etiket numarası. (Google Analytics zaten ayrıca bağlı.)",
  },
];

export default function PazarlamaPaneli({ ayarlarId, ilkTracking, kampanyalar }) {
  const { goster } = useToast();
  const [veri, setVeri] = useState({
    meta_pixel_id: ilkTracking?.meta_pixel_id || '',
    tiktok_pixel_id: ilkTracking?.tiktok_pixel_id || '',
    google_ads_id: ilkTracking?.google_ads_id || '',
  });
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);

  function guncelle(anahtar, deger) {
    setVeri((v) => ({ ...v, [anahtar]: deger.trim() }));
  }

  async function kaydet() {
    // Format kontrolü — dolu alanlar doğru formatta olmalı
    for (const [anahtar, f] of Object.entries(FORMATLAR)) {
      const deger = veri[anahtar];
      if (deger && !f.test(deger)) {
        goster(f.hata, 'hata');
        return;
      }
    }
    setKaydediliyor(true);
    try {
      const supabase = getSupabaseClient();
      const tracking = {
        meta_pixel_id: veri.meta_pixel_id || null,
        tiktok_pixel_id: veri.tiktok_pixel_id || null,
        google_ads_id: veri.google_ads_id || null,
      };
      let hata;
      if (ayarlarId) {
        ({ error: hata } = await supabase.from('settings').update({ tracking }).eq('id', ayarlarId));
      } else {
        ({ error: hata } = await supabase.from('settings').insert([{ tracking }]));
      }
      if (hata) throw hata;
      // Tüm site cache'ini yenile — pixeller anında devreye girsin
      await tumSiteRevalidatePaths().catch(() => {});
      goster('Pazarlama ayarları kaydedildi — pixeller aktif ✓', 'basari');
    } catch (err) {
      console.error('[pazarlama] kaydetme hatası:', err);
      goster('Kaydedilemedi. (sql/19 migration çalıştı mı?)', 'hata');
    } finally {
      setKaydediliyor(false);
    }
  }

  async function feedKopyala() {
    try {
      await navigator.clipboard.writeText(FEED_URL);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
      goster('Feed adresi kopyalandı', 'basari');
    } catch (_) {
      goster('Kopyalanamadı — adresi elle seçin', 'hata');
    }
  }

  const utmOrnek = `${SITE}/?utm_source=instagram&utm_medium=cpc&utm_campaign=yaz-indirimi`;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Pazarlama</h1>
        <p className="text-sm text-brand-ink/60 mt-1">
          Reklam platformu bağlantıları, ürün kataloğu ve kampanya performansı — tek yerden.
        </p>
      </div>

      {/* ── 1. Platform Bağlantıları ── */}
      <section className="bg-white rounded-2xl border border-brand-dark/10 p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-semibold text-lg text-brand-dark">Reklam Platformu Bağlantıları</h2>
          <Button variant="primary" onClick={kaydet} disabled={kaydediliyor}>
            <IconDeviceFloppy size={16} />
            {kaydediliyor ? 'Kaydediliyor…' : 'Kaydet ve Aktifleştir'}
          </Button>
        </div>
        <p className="text-sm text-brand-ink/60 -mt-2">
          Ajansınızın vereceği takip kodlarını (Pixel ID) buraya yapıştırın.
          Kaydettiğiniz anda site veri göndermeye başlar — <strong>yazılımcıya gerek yok</strong>.
        </p>

        <div className="grid gap-4">
          {PLATFORMLAR.map(({ anahtar, ad, kapsam, Icon, renk, kilavuz }) => {
            const aktif = !!veri[anahtar];
            return (
              <div key={anahtar} className="rounded-xl border border-brand-dark/10 p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${renk}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-brand-dark">{ad}</span>
                      <span className="text-xs text-brand-ink/50">{kapsam}</span>
                      <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                        aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {aktif ? '● Aktif' : '○ Bağlı değil'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Input
                        value={veri[anahtar]}
                        onChange={(e) => guncelle(anahtar, e.target.value)}
                        placeholder={`Örn: ${FORMATLAR[anahtar].ornek}`}
                        className="font-mono text-sm"
                      />
                    </div>
                    <p className="mt-2 text-xs text-brand-ink/50 flex items-start gap-1.5">
                      <IconInfoCircle size={14} className="shrink-0 mt-0.5" />
                      {kilavuz}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-brand-ink/40 border-t border-brand-dark/5 pt-3">
          🔒 KVKK: Takip kodları yalnızca ziyaretçi çerez iznini kabul ettikten sonra çalışır.
        </p>
      </section>

      {/* ── 2. Ürün Kataloğu (Feed) ── */}
      <section className="bg-white rounded-2xl border border-brand-dark/10 p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <IconRss size={20} className="text-brand-teal" />
          <h2 className="font-semibold text-lg text-brand-dark">Ürün Kataloğu (Dinamik Reklam)</h2>
        </div>
        <p className="text-sm text-brand-ink/60">
          Bu adres, sitedeki <strong>tüm aktif ürünleri</strong> reklam platformlarına otomatik aktarır.
          Ajansınız bunu Meta / TikTok / Google kataloğuna ekler — müşterinin baktığı ürün,
          reklamda karşısına çıkar. Ürün ekleyip çıkardığınızda katalog <strong>kendiliğinden güncellenir</strong>.
        </p>
        <div className="flex items-center gap-2 bg-brand-cream/60 rounded-xl p-3">
          <code className="flex-1 text-xs md:text-sm text-brand-dark truncate">{FEED_URL}</code>
          <Button variant="ghost" onClick={feedKopyala} className="shrink-0">
            {kopyalandi ? <IconCheck size={16} className="text-green-600" /> : <IconCopy size={16} />}
            {kopyalandi ? 'Kopyalandı' : 'Kopyala'}
          </Button>
          <a
            href={FEED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-brand-ink/50 hover:text-brand-teal p-2"
            title="Feed'i görüntüle"
          >
            <IconExternalLink size={16} />
          </a>
        </div>
      </section>

      {/* ── 3. Kampanya Performansı ── */}
      <section className="bg-white rounded-2xl border border-brand-dark/10 p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <IconChartBar size={20} className="text-brand-teal" />
          <h2 className="font-semibold text-lg text-brand-dark">Kampanya Performansı <span className="text-xs font-normal text-brand-ink/50">(son 30 gün)</span></h2>
        </div>

        {kampanyalar.length === 0 ? (
          <div className="text-sm text-brand-ink/60 bg-brand-cream/40 rounded-xl p-4 space-y-2">
            <p>Henüz kampanya verisi yok. Ajansınız reklam linklerine <strong>UTM etiketi</strong> eklediğinde
            burada hangi kampanyanın kaç ziyaret ve WhatsApp talebi getirdiğini göreceksiniz.</p>
            <p className="text-xs">
              Ajansa iletilecek örnek link formatı:<br />
              <code className="text-[11px] break-all text-brand-dark">{utmOrnek}</code>
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-brand-ink/50 border-b border-brand-dark/10">
                  <th className="py-2 px-2">Kaynak</th>
                  <th className="py-2 px-2">Kampanya</th>
                  <th className="py-2 px-2 text-right">Ziyaret</th>
                  <th className="py-2 px-2 text-right">Sepet</th>
                  <th className="py-2 px-2 text-right">WhatsApp 💬</th>
                </tr>
              </thead>
              <tbody>
                {kampanyalar.map((k, i) => (
                  <tr key={i} className="border-b border-brand-dark/5 last:border-0">
                    <td className="py-2 px-2 font-medium text-brand-dark capitalize">{k.kaynak || '—'}</td>
                    <td className="py-2 px-2 text-brand-ink/70">{k.kampanya || '(genel)'}</td>
                    <td className="py-2 px-2 text-right">{k.ziyaret ?? 0}</td>
                    <td className="py-2 px-2 text-right">{k.sepete_ekleme ?? 0}</td>
                    <td className="py-2 px-2 text-right font-semibold text-green-700">{k.whatsapp_tiklama ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-brand-ink/40">
          💡 WhatsApp sütunu = reklamdan gelip WhatsApp&apos;tan iletişime geçen kişi sayısı.
          Ajansın performansını bu tablodan denetleyebilirsiniz.
        </p>
      </section>
    </div>
  );
}
