// ════════════════════════════════════════════════════════════
// Blog Formu v2 — Kategori + Okuma Süresi + Etiketler + Kapak
// ════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Input, Textarea, Checkbox } from '@/components/ui/Input';
import ImageUploader from '@/components/ui/ImageUploader';
import { slugOlustur } from '@/lib/utils';

const KATEGORILER = [
  { value: 'dekorasyon',       label: '🛋️ Dekorasyon & Tasarım' },
  { value: 'satin-alma-rehberi', label: '🛍️ Satın Alma Rehberi' },
  { value: 'bakim-onarim',     label: '🔧 Bakım & Onarım' },
  { value: 'yasam-tarzlari',   label: '✨ Yaşam Tarzları' },
  { value: 'genel',            label: '📝 Genel' },
];

const BOS = {
  title: '', slug: '', excerpt: '', content: '',
  cover_image: null, is_published: false,
  category: 'genel', read_time_min: 5, tags: '',
};

export default function BlogFormu({ ilkVeri, onKaydet, onIptal }) {
  const [veri, setVeri] = useState(() => {
    if (ilkVeri) {
      return {
        title:         ilkVeri.title || '',
        slug:          ilkVeri.slug || '',
        excerpt:       ilkVeri.excerpt || '',
        content:       ilkVeri.content || '',
        cover_image:   ilkVeri.cover_image || null,
        is_published:  !!ilkVeri.is_published,
        category:      ilkVeri.category || 'genel',
        read_time_min: ilkVeri.read_time_min || 5,
        tags:          (ilkVeri.tags || []).join(', '),
      };
    }
    return BOS;
  });

  const [hatalar, setHatalar] = useState({});
  const [yukleniyor, setYukleniyor] = useState(false);

  function alanGuncelle(alan, deger) {
    setVeri((m) => {
      const yeni = { ...m, [alan]: deger };
      if (alan === 'title' && !ilkVeri) yeni.slug = slugOlustur(deger);
      return yeni;
    });
    if (hatalar[alan]) setHatalar((h) => { const y = { ...h }; delete y[alan]; return y; });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const h = {};
    if (!veri.title || veri.title.length < 3) h.title = 'Başlık en az 3 karakter olmalı';
    if (!veri.slug || !/^[a-z0-9-]+$/.test(veri.slug)) h.slug = 'Geçerli bir slug girin';
    if (!veri.content || veri.content.length < 20) h.content = 'İçerik en az 20 karakter olmalı';
    if (Object.keys(h).length) { setHatalar(h); return; }
    setYukleniyor(true);
    try {
      const tagsArr = veri.tags
        ? veri.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      await onKaydet({
        ...veri,
        tags: tagsArr,
        read_time_min: Number(veri.read_time_min) || 5,
      });
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Kapak Görseli */}
      <ImageUploader
        label="Kapak Görseli (Admin panelden yükle)"
        deger={veri.cover_image}
        onDegisim={(url) => alanGuncelle('cover_image', url)}
        klasor="blog"
        aspect="aspect-video"
      />

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium text-brand-dark mb-1.5">Kategori</label>
        <select
          value={veri.category}
          onChange={(e) => alanGuncelle('category', e.target.value)}
          className="w-full border border-brand-dark/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
        >
          {KATEGORILER.map(k => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
      </div>

      <Input
        label="Başlık"
        value={veri.title}
        onChange={(e) => alanGuncelle('title', e.target.value)}
        error={hatalar.title}
        placeholder="örn. Modern Yatak Odası Dekorasyon Rehberi 2025"
        required
      />

      <Input
        label="Slug (URL)"
        value={veri.slug}
        onChange={(e) => alanGuncelle('slug', e.target.value)}
        error={hatalar.slug}
        placeholder="modern-yatak-odasi-dekorasyon-rehberi-2025"
        required
      />

      <Input
        label="Tahmini Okuma Süresi (dakika)"
        type="number"
        min={1}
        max={60}
        value={veri.read_time_min}
        onChange={(e) => alanGuncelle('read_time_min', e.target.value)}
        placeholder="5"
      />

      <Textarea
        label="Özet (Liste ve SEO için)"
        value={veri.excerpt}
        onChange={(e) => alanGuncelle('excerpt', e.target.value)}
        placeholder="Yazının kısa özeti (1-2 cümle, max 200 karakter)"
        rows={2}
        maxLength={200}
      />

      <Input
        label="Etiketler (virgülle ayır)"
        value={veri.tags}
        onChange={(e) => alanGuncelle('tags', e.target.value)}
        placeholder="yatak odası, dekorasyon, mobilya seçimi"
      />

      <div>
        <Textarea
          label="İçerik (Markdown destekli)"
          value={veri.content}
          onChange={(e) => alanGuncelle('content', e.target.value)}
          error={hatalar.content}
          placeholder={`Yazının tam içeriği...\n\nParagrafları boş satır ile ayır.\n\n## Alt başlık böyle yazılır\n\n### Daha küçük başlık böyle yazılır\n\n**Kalın metin** ve *italik metin* desteklenir.`}
          rows={16}
          required
          className="font-mono text-sm"
        />
        <p className="text-xs text-brand-ink/50 mt-1">
          💡 <code className="bg-brand-dark/5 px-1 rounded">## Başlık</code> ile alt başlık,{' '}
          <code className="bg-brand-dark/5 px-1 rounded">**kalın**</code> ile bold,{' '}
          <code className="bg-brand-dark/5 px-1 rounded">*italik*</code> ile italik.
        </p>
      </div>

      <Checkbox
        label="Yayında (sitede görünür)"
        checked={veri.is_published}
        onChange={(e) => alanGuncelle('is_published', e.target.checked)}
      />

      <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4 border-t border-brand-dark/5">
        <Button variant="ghost" onClick={onIptal} disabled={yukleniyor}>İptal</Button>
        <Button type="submit" variant="primary" yukleniyor={yukleniyor}>
          {ilkVeri ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}
