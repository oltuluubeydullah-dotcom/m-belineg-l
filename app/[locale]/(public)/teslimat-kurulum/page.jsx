// ════════════════════════════════════════════════════════════
// teslimat-kurulum — CMS'ten içerik (admin düzenler)
// ════════════════════════════════════════════════════════════
export const revalidate = 3600; // ISR: 3600s

import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/public/PageHero';
import { getContentPage, markdownToHtml } from '@/lib/cms';
import { genelDestekLinki } from '@/lib/whatsapp';
import { whatsappSablonlariniGetir } from '@/lib/whatsapp-server';
import {
  IconTruckDelivery, IconWorld, IconShieldCheck, IconTools, IconPhone, IconArrowRight,
} from '@tabler/icons-react';

export async function generateMetadata({ params: { locale } }) {
  const sayfa = await getContentPage('teslimat-kurulum', locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
  const canonicalPath = locale === 'tr' ? '/teslimat-kurulum' : `/${locale}/teslimat-kurulum`;
  return {
    title: sayfa?.meta_title || sayfa?.title || 'teslimat-kurulum',
    description: sayfa?.meta_desc,
    alternates: {
      canonical: `${siteUrl}${canonicalPath}`,
      languages: {
        tr: `${siteUrl}/teslimat-kurulum`,
        en: `${siteUrl}/en/teslimat-kurulum`,
        de: `${siteUrl}/de/teslimat-kurulum`,
      },
    },
  };
}

export default async function Sayfa({ params: { locale } }) {
  setRequestLocale(locale);
  const sayfa = await getContentPage('teslimat-kurulum', locale);
  if (!sayfa) return notFound();
  const whatsappSablonlari = await whatsappSablonlariniGetir();

  const html = markdownToHtml(sayfa.content);
  // CMS içeriği anlamlı uzunluktaysa göster (kısa placeholder'ları gizle)
  const cmsAnlamli = (sayfa.content || '').replace(/\s/g, '').length > 120;

  const metin = {
    tr: {
      trBaslik: 'Türkiye’nin Her Yerine Nakliye + Kurulum',
      trGovde: 'İnegöl’den tüm Türkiye’ye güvenli nakliye sağlıyoruz. Mobilyalarınız uzman ekiplerimizce özenle paketlenir, adresinize ulaştırılır ve yerinde profesyonel olarak kurulur. Siz yalnızca beğenmekle ilgilenin; taşımayı, montajı ve yerleşimi biz hallederiz.',
      avrupaBaslik: 'Avrupa’ya Kapınıza Kadar Teslim',
      avrupaGovde: 'Almanya, Fransa, Belçika, Hollanda, İsviçre, İngiltere, Avusturya, Bulgaristan ve daha fazlasına teslimat yapıyoruz. Gümrük işlemleri ve uluslararası nakliyenin tüm yükünü biz üstleniyoruz — beğendiğiniz mobilya garantili şekilde kapınıza kadar gelir.',
      garantiBaslik: '2 Yıl Garanti',
      garantiGovde: 'Sattığımız tüm ürünler 2 yıl garanti kapsamındadır. Üretim ve işçilik kaynaklı sorunlarda yanınızdayız; alışverişinizin huzurla sürmesi için arkasında durduğumuz bir hizmet sunuyoruz.',
      kurulumBaslik: 'Profesyonel Kurulum',
      kurulumGovde: 'Yatak odası, koltuk takımı, yemek odası ve tüm mobilyalarınız deneyimli ekiplerimizce kurulur. Hiçbir parça eksik veya yanlış monte edilmez; ev kullanıma hazır teslim edilir.',
      ctaBaslik: 'Teslimat ve kurulum hakkında bilgi almak ister misiniz?',
      ctaButon: 'WhatsApp’tan İletişime Geçin',
    },
    en: {
      trBaslik: 'Delivery + Setup Across Türkiye',
      trGovde: 'We provide safe shipping from İnegöl to anywhere in Türkiye. Your furniture is carefully packed by our expert teams, delivered to your address, and professionally assembled on site. You just enjoy choosing — we handle transport, assembly and placement.',
      avrupaBaslik: 'Delivered to Your Door in Europe',
      avrupaGovde: 'We deliver to Germany, France, Belgium, the Netherlands, Switzerland, the UK, Austria, Bulgaria and more. We take on all customs and international shipping — the furniture you love arrives at your door, guaranteed.',
      garantiBaslik: '2-Year Warranty',
      garantiGovde: 'All products we sell come with a 2-year warranty. We stand behind our work for any manufacturing or workmanship issues, so your purchase stays worry-free.',
      kurulumBaslik: 'Professional Setup',
      kurulumGovde: 'Bedrooms, sofa sets, dining rooms and all your furniture are assembled by our experienced teams. Nothing is left incomplete or wrongly fitted; your home is delivered ready to use.',
      ctaBaslik: 'Would you like more information about delivery and setup?',
      ctaButon: 'Contact Us on WhatsApp',
    },
    de: {
      trBaslik: 'Lieferung + Montage in der ganzen Türkei',
      trGovde: 'Wir liefern sicher von İnegöl in die ganze Türkei. Ihre Möbel werden von unseren Fachteams sorgfältig verpackt, zu Ihnen geliefert und vor Ort professionell montiert. Sie wählen aus — Transport, Montage und Aufstellung übernehmen wir.',
      avrupaBaslik: 'Bis vor Ihre Tür in Europa',
      avrupaGovde: 'Wir liefern nach Deutschland, Frankreich, Belgien, in die Niederlande, in die Schweiz, nach Großbritannien, Österreich, Bulgarien und mehr. Zoll und internationalen Versand übernehmen wir vollständig — Ihre Wunschmöbel kommen garantiert bis vor Ihre Tür.',
      garantiBaslik: '2 Jahre Garantie',
      garantiGovde: 'Auf alle verkauften Produkte gewähren wir 2 Jahre Garantie. Bei Material- oder Verarbeitungsfehlern stehen wir Ihnen zur Seite — für einen sorgenfreien Einkauf.',
      kurulumBaslik: 'Professionelle Montage',
      kurulumGovde: 'Schlafzimmer, Sofagarnituren, Esszimmer und alle Ihre Möbel werden von erfahrenen Teams montiert. Nichts bleibt unvollständig oder falsch montiert; Ihr Zuhause wird einsatzbereit übergeben.',
      ctaBaslik: 'Möchten Sie mehr über Lieferung und Montage erfahren?',
      ctaButon: 'Kontaktieren Sie uns über WhatsApp',
    },
  };
  const M = metin[locale] || metin.tr;

  const kartlar = [
    { Icon: IconTruckDelivery, baslik: M.trBaslik, govde: M.trGovde },
    { Icon: IconWorld, baslik: M.avrupaBaslik, govde: M.avrupaGovde },
    { Icon: IconShieldCheck, baslik: M.garantiBaslik, govde: M.garantiGovde, vurgu: true },
    { Icon: IconTools, baslik: M.kurulumBaslik, govde: M.kurulumGovde },
  ];

  return (
    <>
      <PageHero baslik={sayfa.title} />

      {/* CMS içeriği (admin doldurduysa) */}
      {cmsAnlamli && (
        <section className="container mx-auto pt-10 md:pt-16">
          <article
            className="prose max-w-3xl mx-auto text-brand-ink leading-relaxed
                       prose-headings:font-display prose-headings:text-brand-dark
                       prose-a:text-brand-gold"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </section>
      )}

      {/* Zengin teslimat / kurulum / garanti bölümü */}
      <section className="container mx-auto py-12 md:py-16">
        <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {kartlar.map(({ Icon, baslik, govde, vurgu }) => (
            <div
              key={baslik}
              className={`rounded-2xl p-6 md:p-8 border transition-shadow hover:shadow-card-h ${
                vurgu
                  ? 'bg-brand-teal/8 border-brand-teal/30'
                  : 'bg-white border-brand-dark/10'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                vurgu ? 'bg-brand-teal text-white' : 'bg-brand-teal/10 text-brand-teal'
              }`}>
                <Icon size={30} stroke={1.6} />
              </div>
              <h2 className="font-display text-xl md:text-2xl font-semibold text-brand-dark mb-3">
                {baslik}
              </h2>
              <p className="text-sm md:text-base text-brand-ink/75 leading-relaxed">
                {govde}
              </p>
            </div>
          ))}
        </div>

        {/* CTA — WhatsApp */}
        <div className="max-w-4xl mx-auto mt-10 md:mt-12 text-center bg-brand-dark rounded-2xl p-8 md:p-10">
          <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-5">
            {M.ctaBaslik}
          </h3>
          <a
            href={genelDestekLinki(locale, whatsappSablonlari)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-4 bg-[#25D366] hover:bg-[#1fb855] text-white rounded-full text-sm md:text-base font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            <IconPhone size={20} />
            {M.ctaButon}
            <IconArrowRight size={18} />
          </a>
        </div>
      </section>
    </>
  );
}
