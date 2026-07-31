'use client';

import { useState } from 'react';
import { IconTrash, IconEye, IconEyeOff, IconStarFilled, IconRosetteDiscountCheck, IconExternalLink } from '@tabler/icons-react';
import { useToast } from '@/context/ToastContext';
import { createClient } from '@/lib/supabase/client';
import Sayfalama from '@/components/admin/Sayfalama';
import { revalidatePaths, tumSiteRevalidatePaths } from '@/lib/revalidate';

export default function YorumlarYonetim({ baslangic, sayimlar, filtre, sayfa, sayfaBoyutu, toplam }) {
  const [yorumlar, setYorumlar] = useState(baslangic);
  const [sayim, setSayim] = useState(sayimlar); // sekme sayıları — aksiyonlarda güncellenir
  const { goster } = useToast();
  const supabase = createClient();

  // Sekme linki (filtre değişince sayfa 1'e döner).
  const filtreHref = (v) => (v === 'all' ? '?' : `?filtre=${v}`);
  // Sayfalama linki — aktif filtreyi korur.
  const hrefYap = (n) => {
    const p = new URLSearchParams();
    if (filtre !== 'all') p.set('filtre', filtre);
    if (n > 1) p.set('sayfa', String(n));
    const qs = p.toString();
    return qs ? `?${qs}` : '?';
  };

  const gizleToggle = async (id, mevcut) => {
    try {
      const { error } = await supabase.from('reviews').update({ is_hidden: !mevcut }).eq('id', id);
      if (error) throw error;
      // Sayımları güncelle (mevcut=gizli mi). Yeni durum: !mevcut.
      setSayim((s) => ({
        ...s,
        hidden: s.hidden + (mevcut ? -1 : 1),
        shown: s.shown + (mevcut ? 1 : -1),
      }));
      // Aktif filtreyle artık uyuşmuyorsa listeden çıkar; 'all'da yerinde çevir.
      if (filtre === 'all') {
        setYorumlar((p) => p.map((y) => (y.id === id ? { ...y, is_hidden: !mevcut } : y)));
      } else {
        setYorumlar((p) => p.filter((y) => y.id !== id));
      }
      goster(mevcut ? 'Yorum yayınlandı' : 'Yorum gizlendi', 'basari');
      revalidatePaths(tumSiteRevalidatePaths()).catch(() => {});
    } catch (e) {
      goster('Hata: ' + e.message, 'hata');
    }
  };

  const dogrulaToggle = async (id, mevcut) => {
    try {
      const { error } = await supabase.from('reviews').update({ is_verified: !mevcut }).eq('id', id);
      if (error) throw error;
      setYorumlar((p) => p.map((y) => (y.id === id ? { ...y, is_verified: !mevcut } : y)));
      goster(mevcut ? 'Doğrulama kaldırıldı' : 'Doğrulanmış müşteri rozeti verildi', 'basari');
      revalidatePaths(tumSiteRevalidatePaths()).catch(() => {});
    } catch (e) {
      goster('Hata: ' + e.message, 'hata');
    }
  };

  const sil = async (id) => {
    if (!confirm('Bu yorumu kalıcı olarak silmek istediğinizden emin misiniz?')) return;
    try {
      const silinen = yorumlar.find((y) => y.id === id);
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      setYorumlar((p) => p.filter((y) => y.id !== id));
      setSayim((s) => ({
        all: Math.max(0, s.all - 1),
        hidden: Math.max(0, s.hidden - (silinen?.is_hidden ? 1 : 0)),
        shown: Math.max(0, s.shown - (silinen?.is_hidden ? 0 : 1)),
      }));
      goster('Yorum silindi', 'basari');
      revalidatePaths(tumSiteRevalidatePaths()).catch(() => {});
    } catch (e) {
      goster('Hata: ' + e.message, 'hata');
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">Müşteri Yorumları</h1>
        <p className="text-brand-ink/60 mt-2">
          Toplam {sayim.all} yorum. Beğenmediklerini gizle veya sil. WhatsApp'tan sipariş veren müşteriyse "Doğrulanmış" rozeti ver.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { v: 'all',    l: `Tümü (${sayim.all})` },
          { v: 'shown',  l: `Yayında (${sayim.shown})` },
          { v: 'hidden', l: `Gizli (${sayim.hidden})` },
        ].map((s) => (
          <a
            key={s.v}
            href={filtreHref(s.v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filtre === s.v ? 'bg-brand-dark text-brand-cream' : 'bg-brand-cream text-brand-ink hover:bg-brand-dark/5'
            }`}
          >
            {s.l}
          </a>
        ))}
      </div>

      {yorumlar.length === 0 ? (
        <p className="text-center py-16 text-brand-ink/50">Bu filtrede yorum yok.</p>
      ) : (
        <ul className="space-y-3">
          {yorumlar.map((y) => (
            <li key={y.id} className={`bg-white rounded-xl border p-4 md:p-5 ${y.is_hidden ? 'border-brand-dark/10 opacity-60' : 'border-brand-dark/5'}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-brand-dark">{y.name}</span>
                    {y.is_verified && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                        <IconRosetteDiscountCheck size={12} />
                        Doğrulanmış
                      </span>
                    )}
                    <span className="text-xs text-brand-ink/50">· {new Date(y.created_at).toLocaleString('tr-TR')}</span>
                    <span className="text-xs uppercase tracking-wider text-brand-ink/40">{y.locale}</span>
                  </div>
                  {y.products && (
                    <a href={`/urun/${y.products.slug}`} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-brand-gold hover:underline inline-flex items-center gap-1">
                      <IconExternalLink size={12} />
                      {y.products.name}
                    </a>
                  )}
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {[1,2,3,4,5].map((i) => (
                      <IconStarFilled key={i} size={14} className={i <= y.rating ? 'text-brand-gold' : 'text-brand-ink/15'} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => dogrulaToggle(y.id, y.is_verified)}
                    title={y.is_verified ? 'Doğrulamayı kaldır' : 'Doğrula'}
                    className={`p-1.5 rounded-md hover:bg-brand-cream ${y.is_verified ? 'text-green-700' : 'text-brand-ink/40'}`}
                  >
                    <IconRosetteDiscountCheck size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => gizleToggle(y.id, y.is_hidden)}
                    title={y.is_hidden ? 'Yayınla' : 'Gizle'}
                    className="p-1.5 rounded-md text-brand-ink/60 hover:bg-brand-cream"
                  >
                    {y.is_hidden ? <IconEye size={18} /> : <IconEyeOff size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => sil(y.id)}
                    title="Sil"
                    className="p-1.5 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-brand-ink/85 leading-relaxed whitespace-pre-wrap mt-2">
                {y.text}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Sayfalama sayfa={sayfa} toplam={toplam} sayfaBoyutu={sayfaBoyutu} hrefYap={hrefYap} />
    </>
  );
}
