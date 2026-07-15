// ════════════════════════════════════════════════════════════
// Möbel İnegöl — Yeni Özellikler Kullanım Kılavuzu
// ════════════════════════════════════════════════════════════

'use client';

import {
  IconChartBar, IconHeart,
  IconPhoto, IconBook, IconShieldLock,
  IconCheck, IconMapPin,
} from '@tabler/icons-react';

function Baslik({ icon: Icon, no, title }) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-brand-gold/20">
      <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-brand-ink/50 uppercase tracking-wider">{no}</p>
        <h3 className="font-display text-xl font-semibold text-brand-dark">{title}</h3>
      </div>
    </div>
  );
}

function Kart({ children }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-dark/5 mb-5">
      {children}
    </div>
  );
}

function Ipucu({ children }) {
  return (
    <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-brand-dark mt-3">
      💡 {children}
    </div>
  );
}

function Uyari({ children }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mt-3">
      ⚠️ {children}
    </div>
  );
}

export default function YeniOzellikler() {
  return (
    <section id="yeni-ozellikler" className="mt-10">
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-brand-dark mb-6">
        🆕 Möbel İnegöl — Yeni Özellikler
      </h2>

      {/* 1. Ziyaretçi İstatistikleri */}
      <Kart>
        <Baslik icon={IconChartBar} no="Yeni Özellik 1" title="Ziyaretçi & Analitik Paneli" />
        <p className="text-sm text-brand-ink/70 mb-3 leading-relaxed">
          Admin panelinin ana sayfasında artık sitenizi kaç kişinin ziyaret ettiğini görebilirsiniz.
          Tüm istatistikler otomatik olarak toplanır, siz hiçbir şey yapmanıza gerek yok.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-brand-cream rounded-xl p-3">
            <p className="font-semibold mb-1">📊 Ne görebilirsiniz?</p>
            <ul className="space-y-1 text-brand-ink/70">
              <li>• Bugünkü ziyaretçi sayısı</li>
              <li>• Bu ayki toplam ziyaret</li>
              <li>• Son 7 günlük grafik</li>
              <li>• En çok ziyaret edilen sayfalar</li>
            </ul>
          </div>
          <div className="bg-brand-cream rounded-xl p-3">
            <p className="font-semibold mb-1">📈 Nasıl kullanmalısınız?</p>
            <ul className="space-y-1 text-brand-ink/70">
              <li>• Hangi ürün sayfaları çok ziyaret alıyor?</li>
              <li>• Hangi gün trafiğiniz artıyor?</li>
              <li>• Instagram paylaşımı sonrası trafik arttı mı?</li>
            </ul>
          </div>
        </div>
        <Ipucu>Ziyaretçi istatistikleri bot ve crawler'ları filtreleyerek sadece gerçek kullanıcıları sayar.</Ipucu>
      </Kart>

      {/* 2. Favori Sistemi */}
      <Kart>
        <Baslik icon={IconHeart} no="Yeni Özellik 2" title="Ürün Favorileme" />
        <p className="text-sm text-brand-ink/70 mb-3 leading-relaxed">
          Müşteriler ürünleri "favorile" (kalp) butonuyla kaydedebilir. Admin panelinde hangi
          ürünlerin en çok favorilediğini görebilirsiniz.
        </p>
        <div className="space-y-2 text-sm text-brand-ink/70">
          <p className="flex items-start gap-2"><IconCheck size={16} className="text-green-500 mt-0.5 shrink-0" /> Müşteri hesabı açmadan çalışır (tarayıcı bazlı)</p>
          <p className="flex items-start gap-2"><IconCheck size={16} className="text-green-500 mt-0.5 shrink-0" /> Admin panelinde "En Çok Favorilenen" listesi otomatik güncellenir</p>
          <p className="flex items-start gap-2"><IconCheck size={16} className="text-green-500 mt-0.5 shrink-0" /> Çok favorilenen ürünler = en popüler ürünler = stok önceliği</p>
        </div>
        <Ipucu>Favori sayısı yüksek ürünleri öne çıkarın — bunlar müşterilerinizin en çok ilgilendiği modellerdir.</Ipucu>
      </Kart>

      {/* 3. Blog Kategorileri */}
      <Kart>
        <Baslik icon={IconBook} no="Yeni Özellik 3" title="Blog — 4 Ana Kategori" />
        <p className="text-sm text-brand-ink/70 mb-3 leading-relaxed">
          Blog bölümünde artık 4 farklı kategoride yazı ekleyebilirsiniz. Her yazıya kapak görseli
          yüklenebilir, okuma süresi ve etiket eklenebilir.
        </p>
        <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
          {[
            { emoji: '🛋️', label: 'Dekorasyon & Tasarım', aciklama: 'Renk, kombinasyon, trend' },
            { emoji: '🛍️', label: 'Satın Alma Rehberi', aciklama: 'İpuçları, karşılaştırma' },
            { emoji: '🔧', label: 'Bakım & Onarım', aciklama: 'Temizlik, uzun ömür' },
            { emoji: '✨', label: 'Yaşam Tarzları', aciklama: 'Ev kurma, taşınma planı' },
          ].map(k => (
            <div key={k.label} className="bg-brand-cream rounded-xl p-3">
              <p className="font-semibold">{k.emoji} {k.label}</p>
              <p className="text-brand-ink/60">{k.aciklama}</p>
            </div>
          ))}
        </div>
        <p className="text-sm font-medium text-brand-dark mb-2">Blog yazısı eklemek:</p>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-brand-ink/70">
          <li>Sol menüden <strong>Blog</strong> tıklayın</li>
          <li><strong>Yeni Yazı</strong> butonuna basın</li>
          <li>Kapak görseli yükleyin (önemli — görselsiz blog algılanmaz)</li>
          <li>Kategori seçin</li>
          <li>Başlık, içerik, etiket girin</li>
          <li><strong>Yayında</strong> kutusunu işaretleyin ve kaydedin</li>
        </ol>
        <Ipucu>Haftada 1 blog yazısı Google'daki görünürlüğünüzü önemli ölçüde artırır.</Ipucu>
      </Kart>

      {/* 4. Fotoğraf Limiti */}
      <Kart>
        <Baslik icon={IconPhoto} no="Yeni Özellik 4" title="Fotoğraf: 25 Adet & Üst Kalite" />
        <p className="text-sm text-brand-ink/70 mb-3 leading-relaxed">
          Her ürüne artık <strong>25 adede kadar fotoğraf</strong> ekleyebilirsiniz.
          Fotoğraflar otomatik olarak yüksek kalitede işlenerek yüklenir.
        </p>
        <div className="space-y-2 text-sm text-brand-ink/70">
          <p className="flex items-start gap-2"><IconCheck size={16} className="text-green-500 mt-0.5 shrink-0" /> Max 2400px çözünürlük korunur</p>
          <p className="flex items-start gap-2"><IconCheck size={16} className="text-green-500 mt-0.5 shrink-0" /> JPEG kalitesi %90 (görsel bozulma olmaz)</p>
          <p className="flex items-start gap-2"><IconCheck size={16} className="text-green-500 mt-0.5 shrink-0" /> HEIC (iPhone) formatı otomatik dönüştürülür</p>
          <p className="flex items-start gap-2"><IconCheck size={16} className="text-green-500 mt-0.5 shrink-0" /> İlk fotoğraf kapak görsel olur — sıralamayı değiştirebilirsiniz</p>
        </div>
        <Uyari>50MB üzeri fotoğraflar yüklenmez. Telefon kamerası ile çekilen normal fotoğraflar sorunsuz yüklenir.</Uyari>
      </Kart>

      {/* 5. Harita */}
      <Kart>
        <Baslik icon={IconMapPin} no="Yeni Özellik 5" title="Harita — Doğrudan Konum Yönlendirme" />
        <p className="text-sm text-brand-ink/70 mb-3 leading-relaxed">
          "Mağazalarımız" sayfasındaki haritaya tıklayan müşteriler direkt Google Maps veya
          Apple Maps'te mağazanızın konumuna yönlendirilir.
        </p>
        <p className="text-sm font-medium text-brand-dark mb-1">Konum nasıl ayarlanır?</p>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-brand-ink/70">
          <li>Google Maps'te mağazanızı bulun</li>
          <li>Konum üzerinde sağ tıklayın → koordinatları kopyalayın (örn: 40.1234, 29.5678)</li>
          <li>Vercel Dashboard → Settings → Environment Variables'a gidin</li>
          <li><code className="bg-brand-dark/5 px-1 rounded">NEXT_PUBLIC_MAP_LAT</code> = 40.1234</li>
          <li><code className="bg-brand-dark/5 px-1 rounded">NEXT_PUBLIC_MAP_LNG</code> = 29.5678</li>
          <li><code className="bg-brand-dark/5 px-1 rounded">NEXT_PUBLIC_MAP_QUERY</code> = Möbel İnegöl</li>
          <li>Redeploy yapın</li>
        </ol>
        <Ipucu>Koordinat bazlı yönlendirme isim aramasından çok daha doğru çalışır.</Ipucu>
      </Kart>

      {/* 6. Keep-alive */}
      <Kart>
        <Baslik icon={IconShieldLock} no="Sistem Güvenliği" title="Supabase Otomatik Canlı Tutma" />
        <p className="text-sm text-brand-ink/70 mb-3 leading-relaxed">
          Supabase ücretsiz hesaplarda 90 gün hareketsizlik sonrası veritabanı kapatılabilir.
          Bu riski ortadan kaldırmak için her 3 günde bir otomatik "ping" gönderilir.
        </p>
        <div className="space-y-2 text-sm text-brand-ink/70">
          <p className="flex items-start gap-2"><IconCheck size={16} className="text-green-500 mt-0.5 shrink-0" /> Tamamen otomatik — siz bir şey yapmanız gerekmez</p>
          <p className="flex items-start gap-2"><IconCheck size={16} className="text-green-500 mt-0.5 shrink-0" /> Vercel Cron üzerinden her 3 günde bir çalışır</p>
          <p className="flex items-start gap-2"><IconCheck size={16} className="text-green-500 mt-0.5 shrink-0" /> Siteniz kapanmaz, verileriniz korunur</p>
        </div>
        <Ipucu>Bu sistem sayesinde tatile gidip siteyi aylarca açmasanız bile veri kaybı olmaz.</Ipucu>
      </Kart>

    </section>
  );
}
