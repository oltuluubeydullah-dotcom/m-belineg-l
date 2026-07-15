// ════════════════════════════════════════════════════════════
// SSS — Sık Sorulan Sorular (GEO / direkt-cevap sayfası)
// ════════════════════════════════════════════════════════════
// AI arama motorlarının (ChatGPT, Claude, Perplexity, Gemini) ve
// Google'ın kaynak gösterebilmesi için: net soru-cevap + FAQPage
// JSON-LD + TL;DR. Uzun-kuyruk yerel sorulara odaklı.
// İçerik statik & 3 dilli — CMS bağımlılığı yok (güvenilir render).
// ════════════════════════════════════════════════════════════
export const revalidate = 86400; // ISR: günlük

import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/public/PageHero';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
const GUNCELLEME = '2026-06-03';

const ICERIK = {
  tr: {
    baslik: 'Sık Sorulan Sorular',
    ozet: 'Kısaca: Möbel İnegöl, İnegöl (Bursa) merkezli bir mobilya mağazasıdır. Tüm Türkiye ve 8 Avrupa ülkesine nakliye + kurulum yapar. Sipariş ve fiyat bilgisi WhatsApp üzerinden ilerler; sitede online ödeme yoktur.',
    sss: [
      { s: 'İnegöl\u2019de mobilya nereden alınır?', c: 'Möbel İnegöl, İnegöl / Bursa\u2019da hizmet verir. Koltuk takımı, köşe koltuk, yatak odası, yemek odası, TV ünitesi, bebek & genç odası, ve masa-sandalye sunar. Ürünleri mobelinegol.com üzerinden inceleyip WhatsApp\u2019tan fiyat ve sipariş bilgisi alabilirsiniz.' },
      { s: 'Avrupa\u2019ya mobilya teslimatı yapıyor musunuz?', c: 'Evet. İnegöl\u2019den Almanya, Fransa, Belçika, Hollanda, İsviçre, İngiltere, Avusturya ve Bulgaristan başta olmak üzere Avrupa ülkelerine kapıya teslim mobilya gönderiyoruz. Detaylar için WhatsApp hattından bölge ve ürün bilginizi paylaşmanız yeterli.' },
      { s: 'Nakliye ve kurulum fiyata dahil mi?', c: 'Möbel İnegöl tüm Türkiye\u2019ye nakliye ve profesyonel kurulum hizmeti sunar. Koşullar ürün ve bölgeye göre değişir; net bilgi için WhatsApp üzerinden ürünü belirtmeniz yeterlidir.' },
      { s: 'Ürünlerde garanti var mı?', c: 'Evet, ürünlerimiz üretim garantilidir. Garanti ve iade koşullarının ayrıntısını sitedeki Garanti & İade sayfasından inceleyebilirsiniz.' },
      { s: 'Fiyatları nasıl öğrenirim?', c: 'Sitede beğendiğiniz ürünün sayfasındaki WhatsApp butonuna basın; ürün bilgisi otomatik mesaja eklenir ve size güncel fiyatla dönüş yapılır. İsterseniz sepete birden çok ürün ekleyip toplu olarak da sorabilirsiniz.' },
      { s: 'Sitede online ödeme / kredi kartı var mı?', c: 'Hayır. Möbel İnegöl WhatsApp üzerinden sipariş modeliyle çalışır. Ürünü seçer, WhatsApp\u2019tan iletişime geçer, ödeme ve teslimatı birebir görüşerek netleştirirsiniz.' },
      { s: 'Hangi dilleri destekliyorsunuz?', c: 'Site Türkçe, İngilizce ve Almanca yayındadır. Özellikle Avrupa\u2019daki müşterilerimiz için Almanca ve İngilizce içerik mevcuttur.' },
    ],
    iletisim: 'WhatsApp ile iletişim',
    guncelleme: 'Son güncelleme',
  },
  en: {
    baslik: 'Frequently Asked Questions',
    ozet: 'In short: Möbel İnegöl is a furniture store based in İnegöl (Bursa, Türkiye). We deliver and install across all of Türkiye and 8 European countries. Orders and pricing go through WhatsApp; there is no online payment on the site.',
    sss: [
      { s: 'Where can I buy furniture in İnegöl?', c: 'Möbel İnegöl is located at İnegöl / Bursa. We offer sofa sets, corner sofas, bedrooms, dining rooms, TV units, kids & teen rooms, and table-chair sets. Browse products at mobelinegol.com and get pricing via WhatsApp.' },
      { s: 'Do you deliver furniture to Europe?', c: 'Yes. We ship door-to-door from İnegöl to Germany, France, Belgium, the Netherlands, Switzerland, the UK, Austria and Bulgaria, among other European countries. Just share your region and product via WhatsApp.' },
      { s: 'Are delivery and assembly included?', c: 'Möbel İnegöl provides delivery and professional assembly across Türkiye. Terms vary by product and region; message us on WhatsApp for exact details.' },
      { s: 'Is there a warranty?', c: 'Yes, our products come with a manufacturer warranty. See the Warranty & Returns page for details.' },
      { s: 'How do I find out the prices?', c: 'Tap the WhatsApp button on any product page; the product details are added to the message automatically and we reply with the current price. You can also add multiple items to the cart and ask together.' },
      { s: 'Is there online payment / credit card on the site?', c: 'No. Möbel İnegöl works on a WhatsApp ordering model. You pick the product, contact us on WhatsApp, and we finalize payment and delivery directly.' },
      { s: 'Which languages do you support?', c: 'The site is available in Turkish, English and German — with English and German content especially for our customers in Europe.' },
    ],
    iletisim: 'Contact via WhatsApp',
    guncelleme: 'Last updated',
  },
  de: {
    baslik: 'Häufig gestellte Fragen',
    ozet: 'Kurz gesagt: Möbel İnegöl ist ein Möbelgeschäft mit Sitz in İnegöl (Bursa, Türkei). Wir liefern und montieren in der gesamten Türkei und in 8 europäischen Ländern. Bestellungen und Preise laufen über WhatsApp; auf der Website gibt es keine Online-Zahlung.',
    sss: [
      { s: 'Wo kann man in İnegöl Möbel kaufen?', c: 'Möbel İnegöl befindet sich in İnegöl / Bursa. Wir bieten Sofagarnituren, Ecksofas, Schlafzimmer, Esszimmer, TV-Möbel, Kinder- & Jugendzimmer, und Tisch-Stuhl-Sets. Produkte auf mobelinegol.com ansehen und Preise per WhatsApp erfragen.' },
      { s: 'Liefern Sie Möbel nach Europa?', c: 'Ja. Wir liefern von İnegöl bis vor die Haustür nach Deutschland, Frankreich, Belgien, in die Niederlande, in die Schweiz, nach Großbritannien, Österreich und Bulgarien sowie in weitere europäische Länder. Teilen Sie uns einfach Ihre Region und das Produkt per WhatsApp mit.' },
      { s: 'Sind Lieferung und Montage inbegriffen?', c: 'Möbel İnegöl bietet Lieferung und professionelle Montage in der gesamten Türkei. Die Bedingungen variieren je nach Produkt und Region; schreiben Sie uns für genaue Angaben per WhatsApp.' },
      { s: 'Gibt es eine Garantie?', c: 'Ja, unsere Produkte haben eine Herstellergarantie. Einzelheiten finden Sie auf der Seite Garantie & Rückgabe.' },
      { s: 'Wie erfahre ich die Preise?', c: 'Tippen Sie auf einer Produktseite auf den WhatsApp-Button; die Produktdetails werden automatisch der Nachricht hinzugefügt und wir antworten mit dem aktuellen Preis. Sie können auch mehrere Artikel in den Warenkorb legen und gemeinsam anfragen.' },
      { s: 'Gibt es Online-Zahlung / Kreditkarte auf der Website?', c: 'Nein. Möbel İnegöl arbeitet mit einem WhatsApp-Bestellmodell. Sie wählen das Produkt, kontaktieren uns per WhatsApp und wir klären Zahlung und Lieferung direkt.' },
      { s: 'Welche Sprachen unterstützen Sie?', c: 'Die Website ist auf Türkisch, Englisch und Deutsch verfügbar — mit englischen und deutschen Inhalten besonders für unsere Kunden in Europa.' },
    ],
    iletisim: 'Kontakt über WhatsApp',
    guncelleme: 'Zuletzt aktualisiert',
  },
};

export async function generateMetadata({ params: { locale } }) {
  const L = ICERIK[locale] || ICERIK.tr;
  const canonicalPath = locale === 'tr' ? '/sss' : `/${locale}/sss`;
  return {
    title: `${L.baslik} — Möbel İnegöl`,
    description: L.ozet,
    alternates: {
      canonical: `${SITE}${canonicalPath}`,
      languages: {
        tr: `${SITE}/sss`,
        en: `${SITE}/en/sss`,
        de: `${SITE}/de/sss`,
      },
    },
  };
}

export default function SSSPage({ params: { locale } }) {
  setRequestLocale(locale);
  const L = ICERIK[locale] || ICERIK.tr;

  // FAQPage JSON-LD — AI ve Google için yapısal cevaplar
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: L.sss.map((q) => ({
      '@type': 'Question',
      name: q.s,
      acceptedAnswer: { '@type': 'Answer', text: q.c },
    })),
  };

  return (
    <>
      <PageHero baslik={L.baslik} />

      <section className="container mx-auto py-10 md:py-16 max-w-3xl">
        {/* TL;DR — AI motorlarının özet alması için */}
        <div className="bg-brand-teallt/60 border border-brand-teal/20 rounded-2xl p-5 md:p-6 mb-8">
          <p className="text-sm md:text-base text-brand-ink leading-relaxed">
            <span className="font-semibold text-brand-teal2">TL;DR — </span>{L.ozet}
          </p>
        </div>

        <div className="space-y-5">
          {L.sss.map((q, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 md:p-6 shadow-card border border-brand-dark/5">
              <h2 className="font-display text-lg md:text-xl font-semibold text-brand-dark mb-2">{q.s}</h2>
              <p className="text-sm md:text-base text-brand-ink/85 leading-relaxed">{q.c}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-brand-ink/40 mt-8 text-center">
          {L.guncelleme}: {GUNCELLEME}
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
