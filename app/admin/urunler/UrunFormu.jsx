// ════════════════════════════════════════════════════════════
// Ürün Formu — Ekle / Düzenle
// ════════════════════════════════════════════════════════════
// Modal içinde render edilir, sahip (parent) onKaydet/onIptal verir.
// ════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/Input';
import MultiImageUploader from '@/components/ui/MultiImageUploader';
import { slugOlustur, formatFiyat } from '@/lib/utils';
import { urunDogrula } from '@/lib/validators';

const BOS = {
  name: '',
  slug: '',
  product_code: '',
  description: '',
  meta_title: '',
  meta_description: '',
  category_id: '',
  base_price: '',
  sale_price: '',
  is_on_sale: false,
  is_active: true,
  is_featured: false,
  sort_order: 0,
  images: [],
  variants: {},
  translations: {},
  details: { parts: [], dimensions: [], bullets: [] },
};

export default function UrunFormu({ ilkVeri, kategoriler, onKaydet, onIptal }) {
  const [veri, setVeri] = useState(() => {
    if (ilkVeri) {
      const d = ilkVeri.details || {};
      return {
        name: ilkVeri.name || '',
        slug: ilkVeri.slug || '',
        product_code: ilkVeri.product_code || '',
        description: ilkVeri.description || '',
        meta_title: ilkVeri.meta_title || '',
        meta_description: ilkVeri.meta_description || '',
        category_id: ilkVeri.category_id || '',
        base_price: ilkVeri.base_price ?? '',
        sale_price: ilkVeri.sale_price ?? '',
        is_on_sale: !!ilkVeri.is_on_sale,
        is_active: ilkVeri.is_active !== false,
        is_featured: !!ilkVeri.is_featured,
        sort_order: ilkVeri.sort_order ?? 0,
        images: ilkVeri.images || [],
        variants: ilkVeri.variants || {},
        translations: ilkVeri.translations || {},
        details: {
          parts: Array.isArray(d.parts) ? d.parts : [],
          dimensions: Array.isArray(d.dimensions) ? d.dimensions : [],
          bullets: Array.isArray(d.bullets) ? d.bullets : [],
        },
      };
    }
    return BOS;
  });

  const [hatalar, setHatalar] = useState({});
  const [yukleniyor, setYukleniyor] = useState(false);

  function alanGuncelle(alan, deger) {
    setVeri((m) => {
      const yeni = { ...m, [alan]: deger };
      // Ad değişince slug otomatik üret (sadece yeni üründe)
      if (alan === 'name' && !ilkVeri) {
        yeni.slug = slugOlustur(deger);
      }
      return yeni;
    });
    // Bu alanın hatasını temizle
    if (hatalar[alan]) {
      setHatalar((h) => { const yeni = { ...h }; delete yeni[alan]; return yeni; });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const dogrulaHatalari = urunDogrula(veri);
    if (dogrulaHatalari) {
      setHatalar(dogrulaHatalari);
      return;
    }

    // Otomatik çeviri uygula (admin manuel doldurmadıysa)
    let translations = veri.translations || {};
    try {
      const { urunCevir } = await import('@/lib/i18n/auto-translate');
      translations = urunCevir({ name: veri.name, description: veri.description }, translations);
    } catch (e) { console.warn('Otomatik çeviri atlandı:', e?.message); }

    // Veriyi temizle (boş stringleri null'a çevir)
    // Details: boş satırları at
    const temizDetails = {
      parts: (veri.details?.parts || [])
        .filter(p => (p.ad || '').trim() !== '')
        .map(p => ({ ad: p.ad.trim(), fiyat: p.fiyat === '' || p.fiyat == null ? null : Number(p.fiyat), varsayilan: !!p.varsayilan })),
      dimensions: (veri.details?.dimensions || [])
        .filter(d => (d.ad || '').trim() !== '')
        .map(d => ({ ad: d.ad.trim(), genislik: d.genislik?.trim() || '', yukseklik: d.yukseklik?.trim() || '', derinlik: d.derinlik?.trim() || '' })),
      bullets: (veri.details?.bullets || []).map(b => (b || '').trim()).filter(b => b !== ''),
    };

    const temizVeri = {
      ...veri,
      product_code: (veri.product_code || '').trim() || null,
      base_price: veri.base_price === '' ? null : Number(veri.base_price),
      sale_price: veri.sale_price === '' ? null : Number(veri.sale_price),
      sort_order: veri.sort_order === '' || veri.sort_order == null ? 0 : Number(veri.sort_order),
      description: veri.description || null,
      meta_title: (veri.meta_title || '').trim() || null,
      meta_description: (veri.meta_description || '').trim() || null,
      translations,
      details: temizDetails,
    };

    setYukleniyor(true);
    try {
      await onKaydet(temizVeri);
    } catch (err) {
      // Toast parent'ta gösteriliyor
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Ürün Adı"
        value={veri.name}
        onChange={(e) => alanGuncelle('name', e.target.value)}
        error={hatalar.name}
        placeholder="örn. Modern Köşe Koltuk Takımı"
        required
      />

      <div className="grid md:grid-cols-3 gap-4">
        <Input
          label="Slug (URL)"
          value={veri.slug}
          onChange={(e) => alanGuncelle('slug', e.target.value)}
          error={hatalar.slug}
          placeholder="modern-kose-koltuk-takimi"
          required
        />

        <Input
          label="Ürün Kodu"
          value={veri.product_code}
          onChange={(e) => alanGuncelle('product_code', e.target.value)}
          placeholder="örn. KM-2026-001 (opsiyonel)"
        />

        <Select
          label="Kategori"
          value={veri.category_id}
          onChange={(e) => alanGuncelle('category_id', e.target.value)}
          error={hatalar.category_id}
          required
        >
          <option value="">Seçiniz…</option>
          {kategoriler.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Açıklama"
        value={veri.description}
        onChange={(e) => alanGuncelle('description', e.target.value)}
        placeholder="Ürün hakkında detaylı bilgi (boş bırakılabilir)"
        rows={4}
      />

      {/* v51 SEO: Google'da görünüm — opsiyonel, boşsa otomatik */}
      <details className="rounded-xl border border-brand-dark/10 p-4 bg-brand-cream/30">
        <summary className="cursor-pointer text-sm font-semibold text-brand-dark select-none">
          🔍 Google&apos;da Görünüm (SEO) — opsiyonel
        </summary>
        <div className="mt-3 space-y-3">
          <p className="text-xs text-brand-ink/55">
            Boş bırakırsanız ürün adı ve açıklaması kullanılır. Reklam ajansınız özel
            başlık isterse buraya yazın.
          </p>
          <Input
            label="Google Başlığı"
            value={veri.meta_title}
            onChange={(e) => alanGuncelle('meta_title', e.target.value.slice(0, 70))}
            placeholder="Örn: İnegöl Lüks Köşe Takımı — Möbel İnegöl"
          />
          <p className="text-[11px] text-brand-ink/40 -mt-2">{(veri.meta_title || '').length}/70 karakter</p>
          <Textarea
            label="Google Açıklaması"
            value={veri.meta_description}
            onChange={(e) => alanGuncelle('meta_description', e.target.value.slice(0, 160))}
            placeholder="Arama sonucunda başlığın altında görünen 1-2 cümle"
            rows={2}
          />
          <p className="text-[11px] text-brand-ink/40 -mt-2">{(veri.meta_description || '').length}/160 karakter</p>
        </div>
      </details>

      {/* Çoklu dil — opsiyonel (boş bırakırsanız otomatik çevrilir) */}
      <details className="bg-brand-cream/50 rounded-xl p-4 border border-brand-gold/20">
        <summary className="cursor-pointer text-sm font-medium text-brand-dark flex items-center gap-2">
          <span className="text-brand-gold">🌐</span>
          Çoklu dil (EN/DE) — opsiyonel
          <span className="text-xs text-brand-ink/50 font-normal ml-auto">
            Boş = otomatik çeviri
          </span>
        </summary>
        <div className="mt-4 space-y-4">
          {[
            { lang: 'en', flag: '🇬🇧', label: 'İngilizce' },
            { lang: 'de', flag: '🇩🇪', label: 'Almanca' },
          ].map((sec) => (
            <div key={sec.lang} className="bg-white rounded-lg p-3 border border-brand-dark/5">
              <p className="text-xs font-semibold text-brand-ink/70 mb-2">
                {sec.flag} {sec.label}
              </p>
              <Input
                label="Ürün adı"
                value={veri.translations?.[sec.lang]?.name || ''}
                onChange={(e) => alanGuncelle('translations', {
                  ...veri.translations,
                  [sec.lang]: { ...(veri.translations?.[sec.lang] || {}), name: e.target.value },
                })}
                placeholder={sec.lang === 'en' ? 'Product name in English' : 'Produktname auf Deutsch'}
              />
              <Textarea
                label="Açıklama"
                value={veri.translations?.[sec.lang]?.description || ''}
                onChange={(e) => alanGuncelle('translations', {
                  ...veri.translations,
                  [sec.lang]: { ...(veri.translations?.[sec.lang] || {}), description: e.target.value },
                })}
                rows={3}
                placeholder={sec.lang === 'en' ? 'Description (optional)' : 'Beschreibung (optional)'}
                className="mt-2"
              />
            </div>
          ))}
          <p className="text-xs text-brand-ink/60 leading-relaxed">
            💡 Bu alanları boş bırakırsanız, kayıt sırasında 200+ mobilya terimi içeren sözlükle{' '}
            <strong>otomatik çevrilir</strong>. Tam istediğin şekilde olsun istiyorsan elle doldurabilirsin.
          </p>
        </div>
      </details>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Fiyat (₺)"
            type="number"
            step="0.01"
            min="0"
            inputMode="numeric"
            value={veri.base_price}
            onChange={(e) => alanGuncelle('base_price', e.target.value)}
            error={hatalar.base_price}
            placeholder="örn. 25000"
          />
          <p className="text-xs text-brand-ink/60 mt-1.5 leading-relaxed">
            <span className="font-medium">Sadece sayı yazın</span> · ₺ otomatik eklenir<br/>
            {veri.base_price && !isNaN(Number(veri.base_price)) && Number(veri.base_price) > 0 && (
              <span className="text-brand-gold font-medium">
                Görünecek: {formatFiyat(Number(veri.base_price))}
              </span>
            )}
            {(!veri.base_price || veri.base_price === '') && (
              <span className="text-brand-ink/50 italic">Boş bırakırsanız: "Fiyat için sorun&quot; gösterilir</span>
            )}
          </p>
        </div>

        <div>
          <Checkbox
            label="İndirimde"
            checked={veri.is_on_sale}
            onChange={(e) => alanGuncelle('is_on_sale', e.target.checked)}
          />
          {veri.is_on_sale && (
            <>
              <Input
                label="İndirimli Fiyat (₺)"
                type="number"
                step="0.01"
                min="0"
                inputMode="numeric"
                value={veri.sale_price}
                onChange={(e) => alanGuncelle('sale_price', e.target.value)}
                error={hatalar.sale_price}
                placeholder="Normal fiyattan küçük"
                className="mt-2"
              />
              {veri.sale_price && !isNaN(Number(veri.sale_price)) && Number(veri.sale_price) > 0 && (
                <p className="text-xs text-brand-gold font-medium mt-1">
                  Görünecek: {formatFiyat(Number(veri.sale_price))}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="border-t border-brand-dark/5 pt-5 space-y-3">
        <p className="text-sm font-medium text-brand-ink">Durum</p>
        <div className="flex flex-wrap gap-5">
          <Checkbox
            label="Yayında (sitede görünür)"
            checked={veri.is_active}
            onChange={(e) => alanGuncelle('is_active', e.target.checked)}
          />
          <Checkbox
            label="Öne çıkan (anasayfada görünür)"
            checked={veri.is_featured}
            onChange={(e) => alanGuncelle('is_featured', e.target.checked)}
          />
        </div>
        {veri.is_featured && (
          <div className="mt-3">
            <Input
              label='"Sizin için seçtiklerimiz" sırası (küçük sayı önce gelir)'
              type="number"
              value={veri.sort_order}
              onChange={(e) => alanGuncelle('sort_order', e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-brand-ink/50 mt-1">
              Örn. 1 = en başta, 2 = ikinci... Aynı sayıdakiler eklenme tarihine göre dizilir.
            </p>
          </div>
        )}
      </div>

      {/* Fotoğraf galerisi */}
      <div className="border-t border-brand-dark/5 pt-5">
        <MultiImageUploader
          label="Ürün Fotoğrafları"
          degerler={veri.images}
          onDegisim={(yeni) => alanGuncelle('images', yeni)}
          klasor="urunler"
          maksimum={20}
        />
      </div>

      {/* ─── DETAY BÖLÜMLERI (parça fiyatlandırma, ölçüler, açıklama maddeleri) ─── */}
      <div className="border-t border-brand-dark/5 pt-5 space-y-6">
        <div>
          <p className="text-sm font-medium text-brand-ink mb-1">Ürün Detayları</p>
          <p className="text-xs text-brand-ink/55">İsteğe bağlı. Parça fiyatları, ölçü tablosu ve açıklama maddeleri ürün sayfasında inobilya tarzı görüntülenir.</p>
        </div>

        {/* PARÇA FİYATLARI */}
        <ParcaListesi
          parts={veri.details.parts}
          onChange={(parts) => alanGuncelle('details', { ...veri.details, parts })}
        />

        {/* ÖLÇÜLER */}
        <OlcuListesi
          dimensions={veri.details.dimensions}
          onChange={(dimensions) => alanGuncelle('details', { ...veri.details, dimensions })}
        />

        {/* AÇIKLAMA MADDELERI */}
        <MaddeListesi
          bullets={veri.details.bullets}
          onChange={(bullets) => alanGuncelle('details', { ...veri.details, bullets })}
        />
      </div>

      {/* Aksiyonlar */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4 border-t border-brand-dark/5">
        <Button variant="ghost" onClick={onIptal} disabled={yukleniyor}>
          İptal
        </Button>
        <Button type="submit" variant="primary" yukleniyor={yukleniyor}>
          {ilkVeri ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════════════════════
// ALT BİLEŞENLER — Parça / Ölçü / Madde editörleri
// ════════════════════════════════════════════════════════════

function ParcaListesi({ parts, onChange }) {
  function ekle() {
    onChange([...parts, { ad: '', fiyat: '', varsayilan: false }]);
  }
  function sil(i) {
    onChange(parts.filter((_, idx) => idx !== i));
  }
  function guncelle(i, alan, deger) {
    onChange(parts.map((p, idx) => idx === i ? { ...p, [alan]: deger } : p));
  }

  return (
    <div className="bg-brand-cream/40 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-dark">Parça Fiyatları</p>
          <p className="text-xs text-brand-ink/55">Müşteri ürün sayfasında parçaları seçebilir, fiyat otomatik toplanır.</p>
        </div>
        <button type="button" onClick={ekle} className="text-xs font-medium text-brand-gold hover:text-brand-accent">
          + Parça Ekle
        </button>
      </div>

      {parts.length === 0 && (
        <p className="text-xs text-brand-ink/40 italic">Henüz parça yok. Eklemezsen ürün sayfasında parça seçici görünmez.</p>
      )}

      {parts.map((p, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-center bg-white rounded-lg p-2 border border-brand-dark/5">
          <input
            type="text"
            placeholder="Parça adı (örn: Üçlü Koltuk)"
            value={p.ad || ''}
            onChange={(e) => guncelle(i, 'ad', e.target.value)}
            className="col-span-6 px-3 py-2 text-sm rounded-md border border-brand-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Fiyat (TL)"
            value={p.fiyat ?? ''}
            onChange={(e) => guncelle(i, 'fiyat', e.target.value === '' ? '' : Number(e.target.value))}
            className="col-span-3 px-3 py-2 text-sm rounded-md border border-brand-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          />
          <label className="col-span-2 flex items-center gap-1.5 text-xs text-brand-ink/70 cursor-pointer">
            <input
              type="checkbox"
              checked={!!p.varsayilan}
              onChange={(e) => guncelle(i, 'varsayilan', e.target.checked)}
              className="accent-brand-gold"
            />
            Varsayılan
          </label>
          <button
            type="button"
            onClick={() => sil(i)}
            className="col-span-1 text-red-500 hover:text-red-700 text-sm"
            title="Sil"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function OlcuListesi({ dimensions, onChange }) {
  function ekle() {
    onChange([...dimensions, { ad: '', genislik: '', yukseklik: '', derinlik: '' }]);
  }
  function sil(i) {
    onChange(dimensions.filter((_, idx) => idx !== i));
  }
  function guncelle(i, alan, deger) {
    onChange(dimensions.map((d, idx) => idx === i ? { ...d, [alan]: deger } : d));
  }

  return (
    <div className="bg-brand-cream/40 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-dark">Ölçü Tablosu</p>
          <p className="text-xs text-brand-ink/55">Ürün sayfasında "Ürün Ölçüleri&quot; tablosu olarak görünür.</p>
        </div>
        <button type="button" onClick={ekle} className="text-xs font-medium text-brand-gold hover:text-brand-accent">
          + Ölçü Ekle
        </button>
      </div>

      {dimensions.length === 0 && (
        <p className="text-xs text-brand-ink/40 italic">Henüz ölçü yok.</p>
      )}

      {dimensions.map((d, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-center bg-white rounded-lg p-2 border border-brand-dark/5">
          <input
            type="text"
            placeholder="Parça adı (örn: Üçlü Koltuk)"
            value={d.ad || ''}
            onChange={(e) => guncelle(i, 'ad', e.target.value)}
            className="col-span-4 px-3 py-2 text-sm rounded-md border border-brand-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          />
          <input
            type="text"
            placeholder="Genişlik"
            value={d.genislik || ''}
            onChange={(e) => guncelle(i, 'genislik', e.target.value)}
            className="col-span-2 px-3 py-2 text-sm rounded-md border border-brand-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          />
          <input
            type="text"
            placeholder="Yükseklik"
            value={d.yukseklik || ''}
            onChange={(e) => guncelle(i, 'yukseklik', e.target.value)}
            className="col-span-2 px-3 py-2 text-sm rounded-md border border-brand-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          />
          <input
            type="text"
            placeholder="Derinlik"
            value={d.derinlik || ''}
            onChange={(e) => guncelle(i, 'derinlik', e.target.value)}
            className="col-span-3 px-3 py-2 text-sm rounded-md border border-brand-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          />
          <button
            type="button"
            onClick={() => sil(i)}
            className="col-span-1 text-red-500 hover:text-red-700 text-sm"
            title="Sil"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function MaddeListesi({ bullets, onChange }) {
  function ekle() {
    onChange([...bullets, '']);
  }
  function sil(i) {
    onChange(bullets.filter((_, idx) => idx !== i));
  }
  function guncelle(i, deger) {
    onChange(bullets.map((b, idx) => idx === i ? deger : b));
  }

  return (
    <div className="bg-brand-cream/40 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-dark">Açıklama Maddeleri</p>
          <p className="text-xs text-brand-ink/55">"Ürün Açıklamaları&quot; altında madde listesi olarak görünür.</p>
        </div>
        <button type="button" onClick={ekle} className="text-xs font-medium text-brand-gold hover:text-brand-accent">
          + Madde Ekle
        </button>
      </div>

      {bullets.length === 0 && (
        <p className="text-xs text-brand-ink/40 italic">Henüz madde yok.</p>
      )}

      {bullets.map((b, i) => (
        <div key={i} className="flex items-center gap-2 bg-white rounded-lg p-2 border border-brand-dark/5">
          <input
            type="text"
            placeholder="Madde metni (örn: İnegöl'de üretilmektedir)"
            value={b || ''}
            onChange={(e) => guncelle(i, e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-md border border-brand-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          />
          <button
            type="button"
            onClick={() => sil(i)}
            className="text-red-500 hover:text-red-700 text-sm w-8"
            title="Sil"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
