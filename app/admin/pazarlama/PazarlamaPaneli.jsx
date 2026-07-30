// ════════════════════════════════════════════════════════════
// Pazarlama & Reklam Yönetimi — Client (v56 · kurumsal / ajans-dostu)
// ════════════════════════════════════════════════════════════
// Reklam ajanslarının ihtiyaç duyduğu her şey tek panelde:
//  1) Platform bağlantıları (Meta / TikTok / Google Ads pixel'leri)
//  2) Ürün kataloğu (dinamik reklam feed'i)
//  3) UTM kampanya linki oluşturucu
//  4) Kampanya performansı (UTM raporu)
//  5) Ajans teslim paketi (tek tıkla kopyala)
// Her bölümün altında "Ne işe yarar? / Nasıl kullanılır?" notu vardır.
// Kaydetme yalnızca gerçek/uygulanan alanları yazar (settings.tracking).
// ════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';
import {
  IconBrandMeta, IconBrandTiktok, IconBrandGoogle,
  IconCopy, IconCheck, IconRss, IconChartBar, IconInfoCircle,
  IconDeviceFloppy, IconExternalLink, IconLink, IconRocket,
  IconClipboardCheck, IconShieldLock, IconBulb,
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
    kapsam: 'Instagram + Facebook',
    Icon: IconBrandMeta,
    renk: 'text-blue-600 bg-blue-50',
    nerede: 'Meta Business Suite → Olay Yöneticisi (Events Manager) → Veri Kaynakları → Pixel',
    kilavuz: 'Ajansınız bu numarayı Meta Business Suite → Olay Yöneticisi bölümünden alıp size iletir. Buraya yapıştırıp kaydedin — başka işlem gerekmez.',
    dogrula: '“Meta Pixel Helper” tarayıcı eklentisiyle sitenizi açıp pixel’in çalıştığını görebilirsiniz.',
  },
  {
    anahtar: 'tiktok_pixel_id',
    ad: 'TikTok Pixel',
    kapsam: 'TikTok reklamları',
    Icon: IconBrandTiktok,
    renk: 'text-neutral-900 bg-neutral-100',
    nerede: 'TikTok Ads Manager → Varlıklar (Assets) → Olaylar (Events) → Web Olayları → Pixel',
    kilavuz: 'TikTok Ads Manager → Varlıklar → Olaylar bölümündeki Pixel ID’yi ajansınızdan isteyin, buraya yapıştırın.',
    dogrula: 'TikTok Pixel yalnızca ziyaretçi çerez iznini kabul ettikten sonra yüklenir (KVKK).',
  },
  {
    anahtar: 'google_ads_id',
    ad: 'Google Ads',
    kapsam: 'YouTube + Google Arama',
    Icon: IconBrandGoogle,
    renk: 'text-red-600 bg-red-50',
    nerede: 'Google Ads → Araçlar → Dönüşümler → “AW-” ile başlayan etiket kimliği',
    kilavuz: "Google Ads → Araçlar → Dönüşümler bölümündeki 'AW-' ile başlayan numarayı buraya yapıştırın.",
    dogrula: 'Dönüşüm (satın alma/talep) takibi için ajansınız ayrıca dönüşüm eylemlerini tanımlamalıdır.',
  },
];

// UTM oluşturucu hazır şablonları
const UTM_HAZIR = [
  { etiket: 'Instagram (ücretli)', source: 'instagram', medium: 'cpc' },
  { etiket: 'Facebook (ücretli)', source: 'facebook', medium: 'cpc' },
  { etiket: 'Google (ücretli)', source: 'google', medium: 'cpc' },
  { etiket: 'TikTok (ücretli)', source: 'tiktok', medium: 'cpc' },
  { etiket: 'Instagram (profil/bio)', source: 'instagram', medium: 'bio' },
];

// Ortak "not" kutusu — her bölümün ne işe yaradığını / nasıl kullanılacağını anlatır
function Not({ baslik = 'Ne işe yarar?', Icon = IconInfoCircle, children }) {
  return (
    <div className="rounded-xl border border-brand-teal/20 bg-brand-teallt/30 p-3.5 text-sm leading-relaxed text-brand-ink/80">
      <p className="font-semibold text-brand-dark mb-1 flex items-center gap-1.5">
        <Icon size={15} className="text-brand-teal shrink-0" /> {baslik}
      </p>
      {children}
    </div>
  );
}

export default function PazarlamaPaneli({ ayarlarId, ilkTracking, kampanyalar }) {
  const { goster } = useToast();
  const [veri, setVeri] = useState({
    meta_pixel_id: ilkTracking?.meta_pixel_id || '',
    tiktok_pixel_id: ilkTracking?.tiktok_pixel_id || '',
    google_ads_id: ilkTracking?.google_ads_id || '',
  });
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [kopyalanan, setKopyalanan] = useState('');

  // UTM oluşturucu state
  const [utm, setUtm] = useState({ source: 'instagram', medium: 'cpc', campaign: '' });

  function guncelle(anahtar, deger) {
    setVeri((v) => ({ ...v, [anahtar]: deger.trim() }));
  }

  async function kopyala(metin, etiket) {
    try {
      await navigator.clipboard.writeText(metin);
      setKopyalanan(etiket);
      setTimeout(() => setKopyalanan(''), 2000);
      goster('Kopyalandı ✓', 'basari');
    } catch (_) {
      goster('Kopyalanamadı — metni elle seçin', 'hata');
    }
  }

  async function kaydet() {
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
      await tumSiteRevalidatePaths().catch(() => {});
      goster('Pazarlama ayarları kaydedildi — pixeller aktif ✓', 'basari');
    } catch (err) {
      console.error('[pazarlama] kaydetme hatası:', err);
      goster('Kaydedilemedi. (sql/19 migration çalıştı mı?)', 'hata');
    } finally {
      setKaydediliyor(false);
    }
  }

  // UTM linkini oluştur
  const utmLink = (() => {
    const p = new URLSearchParams();
    if (utm.source) p.set('utm_source', utm.source.trim());
    if (utm.medium) p.set('utm_medium', utm.medium.trim());
    if (utm.campaign) p.set('utm_campaign', utm.campaign.trim().replace(/\s+/g, '-').toLowerCase());
    const qs = p.toString();
    return qs ? `${SITE}/?${qs}` : `${SITE}/`;
  })();

  // Ajans teslim paketi metni
  const ajansPaketi = [
    'MÖBEL İNEGÖL — REKLAM AJANSI TESLİM PAKETİ',
    '',
    `Site: ${SITE}`,
    `Ürün kataloğu (feed): ${FEED_URL}`,
    `Örnek UTM linki: ${utmLink}`,
    '',
    'İstenecek erişimler / kurulacaklar:',
    '• Meta Business Suite → Pixel ID (Instagram+Facebook)',
    '• TikTok Ads Manager → Web Pixel ID',
    '• Google Ads → Dönüşüm etiketi (AW-…)',
    '• Ürün kataloğunu Meta Commerce / TikTok Catalog / Google Merchant’a ekleyin',
    '',
    'Not: Tüm takip kodları KVKK gereği yalnızca ziyaretçi çerez iznini kabul ettikten sonra çalışır.',
  ].join('\n');

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Pazarlama &amp; Reklam Yönetimi</h1>
        <p className="text-sm text-brand-ink/60 mt-1">
          Reklam ajansınızın ihtiyaç duyduğu her şey tek panelde — <strong>kod bilgisi gerekmez</strong>.
        </p>
      </div>

      {/* Hızlı başlangıç — 3 adım */}
      <div className="rounded-2xl border border-brand-gold/30 bg-gradient-to-br from-brand-gold/10 to-brand-cream/40 p-5">
        <p className="font-semibold text-brand-dark flex items-center gap-2 mb-2">
          <IconRocket size={18} className="text-brand-gold" /> Nasıl çalışır? (3 adım)
        </p>
        <ol className="text-sm text-brand-ink/80 space-y-1.5 list-decimal list-inside">
          <li>Ajansınızdan <strong>Pixel ID</strong>’lerini alın → aşağıdaki 1. bölüme yapıştırıp kaydedin.</li>
          <li><strong>Ürün kataloğu</strong> (feed) adresini ajansa verin (2. bölüm).</li>
          <li>Reklam linklerine <strong>UTM etiketi</strong> ekletin (3. bölüm) ve performansı buradan izleyin (4. bölüm).</li>
        </ol>
      </div>

      {/* ── 1. Platform Bağlantıları ── */}
      <section className="bg-white rounded-2xl border border-brand-dark/10 p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-semibold text-lg text-brand-dark">1) Reklam Platformu Bağlantıları</h2>
          <Button variant="primary" onClick={kaydet} disabled={kaydediliyor}>
            <IconDeviceFloppy size={16} />
            {kaydediliyor ? 'Kaydediliyor…' : 'Kaydet ve Aktifleştir'}
          </Button>
        </div>

        <Not baslik="Ne işe yarar?">
          Pixel (takip) kodları, reklamlardan gelen ziyaretçilerin sitede ne yaptığını
          (ürün görüntüleme, sepet, WhatsApp iletişimi) reklam platformuna bildirir.
          Böylece ajansınız reklamları <strong>optimize eder</strong>, dönüşümü ölçer ve
          siteyi gezenlere <strong>yeniden pazarlama</strong> (retargeting) yapar.
        </Not>

        <div className="grid gap-4">
          {PLATFORMLAR.map(({ anahtar, ad, kapsam, Icon, renk, nerede, kilavuz, dogrula }) => {
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
                    <p className="mt-2 text-xs text-brand-ink/60 flex items-start gap-1.5">
                      <IconInfoCircle size={14} className="shrink-0 mt-0.5 text-brand-teal" />
                      <span><strong className="text-brand-dark/70">Nasıl bulunur:</strong> {nerede}</span>
                    </p>
                    <p className="mt-1 text-xs text-brand-ink/50 pl-[22px]">{kilavuz}</p>
                    <p className="mt-1 text-xs text-brand-ink/45 pl-[22px] italic">💡 {dogrula}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-brand-ink/70 flex items-start gap-2">
          <IconShieldLock size={15} className="shrink-0 mt-0.5 text-amber-600" />
          <span><strong>KVKK / Gizlilik:</strong> Takip kodları yalnızca ziyaretçi çerez iznini kabul ettikten
          sonra çalışır (Consent Mode v2). Bu, yasal uyumluluğu otomatik sağlar — ek işlem gerekmez.</span>
        </div>
      </section>

      {/* ── 2. Ürün Kataloğu (Feed) ── */}
      <section className="bg-white rounded-2xl border border-brand-dark/10 p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <IconRss size={20} className="text-brand-teal" />
          <h2 className="font-semibold text-lg text-brand-dark">2) Ürün Kataloğu (Dinamik Reklam)</h2>
        </div>

        <Not baslik="Ne işe yarar?">
          Bu adres, sitedeki <strong>tüm aktif ürünleri</strong> reklam platformlarına otomatik aktarır.
          Müşterinin sitede baktığı ürün, reklamda tekrar karşısına çıkar (dinamik retargeting).
          Ürün ekleyip çıkardığınızda katalog <strong>kendiliğinden güncellenir</strong> — elle iş yok.
        </Not>

        <div className="flex items-center gap-2 bg-brand-cream/60 rounded-xl p-3">
          <code className="flex-1 text-xs md:text-sm text-brand-dark truncate">{FEED_URL}</code>
          <Button variant="ghost" onClick={() => kopyala(FEED_URL, 'feed')} className="shrink-0">
            {kopyalanan === 'feed' ? <IconCheck size={16} className="text-green-600" /> : <IconCopy size={16} />}
            {kopyalanan === 'feed' ? 'Kopyalandı' : 'Kopyala'}
          </Button>
          <a href={FEED_URL} target="_blank" rel="noopener noreferrer"
            className="shrink-0 text-brand-ink/50 hover:text-brand-teal p-2" title="Feed'i görüntüle">
            <IconExternalLink size={16} />
          </a>
        </div>

        <p className="text-xs text-brand-ink/55 flex items-start gap-1.5">
          <IconInfoCircle size={14} className="shrink-0 mt-0.5 text-brand-teal" />
          <span><strong className="text-brand-dark/70">Nasıl kullanılır:</strong> Bu adresi ajansınıza iletin.
          Ajans onu Meta Commerce Manager, TikTok Catalog Manager veya Google Merchant Center’a ekler.</span>
        </p>
      </section>

      {/* ── 3. UTM Kampanya Linki Oluşturucu ── */}
      <section className="bg-white rounded-2xl border border-brand-dark/10 p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <IconLink size={20} className="text-brand-teal" />
          <h2 className="font-semibold text-lg text-brand-dark">3) UTM Kampanya Linki Oluşturucu</h2>
        </div>

        <Not baslik="Ne işe yarar?">
          Reklam linklerine <strong>UTM etiketi</strong> eklenince, hangi kampanyanın kaç ziyaret,
          sepet ve WhatsApp talebi getirdiğini alttaki tablodan (4. bölüm) görürsünüz.
          Aşağıdan hazır bir link üretip ajansınıza verin.
        </Not>

        <div className="flex flex-wrap gap-2">
          {UTM_HAZIR.map((h) => (
            <button
              key={h.etiket}
              type="button"
              onClick={() => setUtm((u) => ({ ...u, source: h.source, medium: h.medium }))}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                utm.source === h.source && utm.medium === h.medium
                  ? 'bg-brand-teal text-white border-brand-teal'
                  : 'bg-white text-brand-ink/70 border-brand-dark/15 hover:border-brand-teal'
              }`}
            >
              {h.etiket}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="text-xs text-brand-ink/60 space-y-1">
            <span>Kaynak (utm_source)</span>
            <Input value={utm.source} onChange={(e) => setUtm((u) => ({ ...u, source: e.target.value }))} placeholder="instagram" />
          </label>
          <label className="text-xs text-brand-ink/60 space-y-1">
            <span>Tür (utm_medium)</span>
            <Input value={utm.medium} onChange={(e) => setUtm((u) => ({ ...u, medium: e.target.value }))} placeholder="cpc" />
          </label>
          <label className="text-xs text-brand-ink/60 space-y-1">
            <span>Kampanya adı (utm_campaign)</span>
            <Input value={utm.campaign} onChange={(e) => setUtm((u) => ({ ...u, campaign: e.target.value }))} placeholder="yaz-indirimi" />
          </label>
        </div>

        <div className="flex items-center gap-2 bg-brand-cream/60 rounded-xl p-3">
          <code className="flex-1 text-xs md:text-sm text-brand-dark break-all">{utmLink}</code>
          <Button variant="ghost" onClick={() => kopyala(utmLink, 'utm')} className="shrink-0">
            {kopyalanan === 'utm' ? <IconCheck size={16} className="text-green-600" /> : <IconCopy size={16} />}
            {kopyalanan === 'utm' ? 'Kopyalandı' : 'Kopyala'}
          </Button>
        </div>
      </section>

      {/* ── 4. Kampanya Performansı ── */}
      <section className="bg-white rounded-2xl border border-brand-dark/10 p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <IconChartBar size={20} className="text-brand-teal" />
          <h2 className="font-semibold text-lg text-brand-dark">4) Kampanya Performansı <span className="text-xs font-normal text-brand-ink/50">(son 30 gün)</span></h2>
        </div>

        <Not baslik="Nasıl okunur?">
          Her satır bir reklam kaynağını gösterir. <strong>WhatsApp</strong> sütunu, reklamdan gelip
          WhatsApp’tan iletişime geçen kişi sayısıdır — ajansınızın performansını buradan denetleyebilirsiniz.
          Veriler ancak reklam linklerinde UTM etiketi olduğunda dolar (3. bölüm).
        </Not>

        {kampanyalar.length === 0 ? (
          <div className="text-sm text-brand-ink/60 bg-brand-cream/40 rounded-xl p-4">
            Henüz kampanya verisi yok. Yukarıdaki UTM linkleriyle reklam başlatıldığında bu tablo dolmaya başlar.
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
      </section>

      {/* ── 5. Ajans Teslim Paketi ── */}
      <section className="bg-brand-dark text-white rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <IconClipboardCheck size={20} className="text-brand-gold" />
          <h2 className="font-semibold text-lg">5) Ajans Teslim Paketi</h2>
        </div>
        <p className="text-sm text-white/70 flex items-start gap-1.5">
          <IconBulb size={15} className="shrink-0 mt-0.5 text-brand-gold" />
          Yeni bir reklam ajansıyla çalışırken bu özeti tek tıkla kopyalayıp iletin — ihtiyaç duyacakları
          her şey (feed adresi, örnek UTM, istenecek erişimler) içinde.
        </p>
        <pre className="text-[11px] md:text-xs leading-relaxed bg-black/30 rounded-xl p-4 whitespace-pre-wrap font-mono text-white/85 overflow-x-auto">{ajansPaketi}</pre>
        <Button variant="gold" onClick={() => kopyala(ajansPaketi, 'paket')}>
          {kopyalanan === 'paket' ? <IconCheck size={16} /> : <IconCopy size={16} />}
          {kopyalanan === 'paket' ? 'Kopyalandı ✓' : 'Teslim Paketini Kopyala'}
        </Button>
      </section>
    </div>
  );
}
