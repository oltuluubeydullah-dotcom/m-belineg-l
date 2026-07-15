// ════════════════════════════════════════════════════════════
// Kategori Formu — Ekle / Düzenle
// ════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Input, Textarea, Checkbox, Select } from '@/components/ui/Input';
import ImageUploader from '@/components/ui/ImageUploader';
import { slugOlustur } from '@/lib/utils';
import { kategoriDogrula } from '@/lib/validators';
import { getSupabaseClient } from '@/lib/supabase/client';

const BOS = {
  name: '',
  slug: '',
  description: '',
  image_url: null,
  cover_product_id: null,
  discount_percent: 0,
  discount_cover_product_id: null,
  is_active: true,
  translations: {},
};

export default function KategoriFormu({ ilkVeri, onKaydet, onIptal }) {
  const [veri, setVeri] = useState(() => {
    if (ilkVeri) {
      return {
        name: ilkVeri.name || '',
        slug: ilkVeri.slug || '',
        description: ilkVeri.description || '',
        image_url: ilkVeri.image_url || null,
        cover_product_id: ilkVeri.cover_product_id || null,
        discount_percent: ilkVeri.discount_percent || 0,
        discount_cover_product_id: ilkVeri.discount_cover_product_id || null,
        is_active: ilkVeri.is_active !== false,
        translations: ilkVeri.translations || {},
      };
    }
    return BOS;
  });

  const [hatalar, setHatalar] = useState({});
  const [yukleniyor, setYukleniyor] = useState(false);

  // Kapak ürünü seçici için: bu kategorideki aktif ürünleri çek (sadece düzenlemede)
  const [kapakUrunler, setKapakUrunler] = useState([]);
  useEffect(() => {
    if (!ilkVeri?.id) return;
    let iptal = false;
    (async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from('products')
        .select('id, name')
        .eq('category_id', ilkVeri.id)
        .eq('is_active', true)
        .order('name', { ascending: true });
      if (!iptal) setKapakUrunler(data || []);
    })();
    return () => { iptal = true; };
  }, [ilkVeri?.id]);

  function alanGuncelle(alan, deger) {
    setVeri((m) => {
      const yeni = { ...m, [alan]: deger };
      if (alan === 'name' && !ilkVeri) {
        yeni.slug = slugOlustur(deger);
      }
      return yeni;
    });
    if (hatalar[alan]) {
      setHatalar((h) => { const yeni = { ...h }; delete yeni[alan]; return yeni; });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const dogrulaHatalari = kategoriDogrula(veri);
    if (dogrulaHatalari) {
      setHatalar(dogrulaHatalari);
      return;
    }

    // Auto-translate (admin manuel doldurmadıysa)
    let translations = veri.translations || {};
    try {
      const { urunCevir } = await import('@/lib/i18n/auto-translate');
      translations = urunCevir({ name: veri.name, description: veri.description }, translations);
    } catch (e) { console.warn('Otomatik çeviri atlandı:', e?.message); }

    const temiz = {
      ...veri,
      description: veri.description || null,
      translations,
    };

    setYukleniyor(true);
    try {
      await onKaydet(temiz);
    } catch (err) {
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ImageUploader
        label="Kapak Görseli"
        deger={veri.image_url}
        onDegisim={(url) => alanGuncelle('image_url', url)}
        klasor="kategoriler"
        aspect="aspect-[4/3]"
      />

      {ilkVeri?.id && (
        <div>
          <Select
            label="Kapak Ürünü (anasayfa kategori kartında görünür)"
            value={veri.cover_product_id || ''}
            onChange={(e) => alanGuncelle('cover_product_id', e.target.value || null)}
          >
            <option value="">Otomatik (kategorinin ilk ürün görseli)</option>
            {kapakUrunler.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </Select>
          <p className="text-xs text-brand-ink/50 mt-1">
            Seçilen ürünün ilk fotoğrafı kategori kapağı olur. Boş = otomatik.
          </p>
        </div>
      )}

      {/* v39: İndirimli Kategori bölümü ayarları (sadece 4 indirim kategorisinde anlamlı) */}
      {ilkVeri?.id && (
        <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-brand-dark">
            İndirimli Kategori Bölümü (anasayfa)
          </p>
          <Input
            label="İndirim Oranı (%) — 0 ise bu kategori indirim bölümünde gösterilmez"
            type="number"
            min="0"
            max="90"
            value={veri.discount_percent}
            onChange={(e) => alanGuncelle('discount_percent', Math.max(0, Math.min(90, parseInt(e.target.value || '0', 10))))}
          />
          <Select
            label="İndirim Kartı Kapak Ürünü"
            value={veri.discount_cover_product_id || ''}
            onChange={(e) => alanGuncelle('discount_cover_product_id', e.target.value || null)}
          >
            <option value="">Otomatik (kategorinin ilk ürün görseli)</option>
            {kapakUrunler.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </Select>
          <p className="text-xs text-brand-ink/50">
            Anasayfada "%X'e VARAN İNDİRİM" kartında bu görsel + oran kullanılır.
            Sadece Koltuk / Yatak Odası / Yemek Odası / Köşe Koltuk kategorilerinde gösterilir.
          </p>
        </div>
      )}

      <Input
        label="Kategori Adı"
        value={veri.name}
        onChange={(e) => alanGuncelle('name', e.target.value)}
        error={hatalar.name}
        placeholder="örn. Yatak Odası"
        required
      />

      <Input
        label="Slug (URL)"
        value={veri.slug}
        onChange={(e) => alanGuncelle('slug', e.target.value)}
        error={hatalar.slug}
        placeholder="yatak-odasi"
        required
      />

      <Textarea
        label="Açıklama (SEO için)"
        value={veri.description}
        onChange={(e) => alanGuncelle('description', e.target.value)}
        placeholder="Kategori sayfasının üstünde görünecek, Google'da meta description olarak kullanılacak metin."
        rows={3}
      />

      <Checkbox
        label="Yayında (sitede görünür)"
        checked={veri.is_active}
        onChange={(e) => alanGuncelle('is_active', e.target.checked)}
      />

      {/* Çoklu dil — opsiyonel */}
      <details className="bg-brand-cream/50 rounded-xl p-4 border border-brand-gold/20">
        <summary className="cursor-pointer text-sm font-medium text-brand-dark flex items-center gap-2">
          <span className="text-brand-gold">🌐</span>
          Çoklu dil (EN/DE) — opsiyonel
          <span className="text-xs text-brand-ink/50 font-normal ml-auto">Boş = otomatik çeviri</span>
        </summary>
        <div className="mt-4 space-y-3">
          {[
            { lang: 'en', flag: '🇬🇧', label: 'İngilizce' },
            { lang: 'de', flag: '🇩🇪', label: 'Almanca' },
          ].map((sec) => (
            <div key={sec.lang} className="bg-white rounded-lg p-3 border border-brand-dark/5">
              <p className="text-xs font-semibold text-brand-ink/70 mb-2">{sec.flag} {sec.label}</p>
              <Input
                label="Kategori adı"
                value={veri.translations?.[sec.lang]?.name || ''}
                onChange={(e) => alanGuncelle('translations', {
                  ...veri.translations,
                  [sec.lang]: { ...(veri.translations?.[sec.lang] || {}), name: e.target.value },
                })}
                placeholder={sec.lang === 'en' ? 'Bedroom Set' : 'Schlafzimmer-Set'}
              />
            </div>
          ))}
        </div>
      </details>

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
