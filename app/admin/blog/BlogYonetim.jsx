// ════════════════════════════════════════════════════════════
// Blog Yönetim — Admin
// ════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  IconPlus, IconEdit, IconTrash, IconPencil, IconEye, IconEyeOff,
  IconExternalLink, IconCalendar,
} from '@tabler/icons-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import BlogFormu from './BlogFormu';
import { useToast } from '@/context/ToastContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { revalidatePaths, blogRevalidatePaths } from '@/lib/revalidate';
import { formatTarih, cn } from '@/lib/utils';

export default function BlogYonetim({ ilkYazilar }) {
  const [yazilar, setYazilar] = useState(ilkYazilar);
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState(null);
  const [silOnay, setSilOnay] = useState(null);
  const [silYukleniyor, setSilYukleniyor] = useState(false);

  const { goster } = useToast();
  const supabase = getSupabaseClient();

  function yeniAc() {
    setDuzenlenen(null);
    setFormAcik(true);
  }

  async function duzenleAc(yazi) {
    // Liste hafif kolonlarla geliyor (content/translations yok) — düzenleme
    // için tam satırı id ile çek, sonra formu aç.
    try {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', yazi.id)
        .maybeSingle();
      setDuzenlenen(data || yazi);
    } catch {
      setDuzenlenen(yazi);
    }
    setFormAcik(true);
  }

  async function kaydet(veri) {
    try {
      if (duzenlenen) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(veri)
          .eq('id', duzenlenen.id)
          .select()
          .maybeSingle();
        if (error) throw error;
        const guncel = data || { ...duzenlenen, ...veri };
        setYazilar((m) => m.map((y) => (y.id === guncel.id ? guncel : y)));
        goster('Yazı güncellendi', 'basari');
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([veri])
          .select()
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          // RLS returning blocked → slug ile re-fetch
          const rf = await supabase.from('blog_posts').select('*').eq('slug', veri.slug).maybeSingle();
          if (!rf.data) throw new Error('Yazı eklendi ama veri okunamadı. Sayfayı yenileyin.');
          setYazilar((m) => [rf.data, ...m]);
        } else {
          setYazilar((m) => [data, ...m]);
        }
        goster('Yazı eklendi', 'basari');
      }
      revalidatePaths(blogRevalidatePaths(veri.slug)).catch(() => {});
      setFormAcik(false);
      setDuzenlenen(null);
    } catch (err) {
      const mesaj = err?.message?.includes('duplicate key')
        ? 'Bu slug zaten kullanılıyor, farklı bir slug girin.'
        : 'Kaydetme başarısız: ' + (err?.message || '');
      goster(mesaj, 'hata');
      throw err;
    }
  }

  async function silOnayla() {
    if (!silOnay) return;
    setSilYukleniyor(true);
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', silOnay.id);
      if (error) throw error;
      setYazilar((m) => m.filter((y) => y.id !== silOnay.id));
      goster('Yazı silindi', 'basari');
      revalidatePaths(blogRevalidatePaths(silOnay.slug)).catch(() => {});
      setSilOnay(null);
    } catch (err) {
      goster('Silme başarısız', 'hata');
    } finally {
      setSilYukleniyor(false);
    }
  }

  async function yayinlaToggle(yazi) {
    try {
      const guncellemeler = { is_published: !yazi.is_published };
      if (!yazi.is_published && !yazi.published_at) {
        guncellemeler.published_at = new Date().toISOString();
      }
      const { data, error } = await supabase
        .from('blog_posts')
        .update(guncellemeler)
        .eq('id', yazi.id)
        .select()
        .maybeSingle();
      if (error) throw error;
      const guncel = data || { ...yazi, ...guncellemeler };
      setYazilar((m) => m.map((y) => (y.id === guncel.id ? guncel : y)));
      goster(guncel.is_published ? 'Yazı yayınlandı' : 'Yayından kaldırıldı', 'basari');
      revalidatePaths(blogRevalidatePaths(yazi.slug)).catch(() => {});
    } catch (err) {
      goster('Güncelleme başarısız', 'hata');
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">
            Blog Yazıları
          </h1>
          <p className="text-brand-ink/60 mt-2">
            {yazilar.length} yazı — {yazilar.filter((y) => y.is_published).length} yayında
          </p>
        </div>
        <Button onClick={yeniAc} size="lg" variant="primary">
          <IconPlus size={18} />
          Yeni Yazı
        </Button>
      </div>

      {yazilar.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-card border border-brand-dark/5 text-center">
          <IconPencil size={48} className="mx-auto text-brand-ink/20 mb-3" />
          <p className="font-display text-xl text-brand-dark/60 mb-2">
            Henüz yazı yok
          </p>
          <p className="text-sm text-brand-ink/50 mb-6">
            İlk yazıyı ekleyerek başlayın. SEO için faydalı, müşterilere değer katan içerikler yazın.
          </p>
          <Button onClick={yeniAc} variant="primary">
            <IconPlus size={18} />
            İlk Yazıyı Ekle
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-dark/5 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider">Kapak</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider">Başlık</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider hidden md:table-cell">Tarih</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider">Durum</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-dark/5">
                {yazilar.map((y) => (
                  <tr key={y.id} className="hover:bg-brand-dark/[0.02]">
                    <td className="px-4 py-3">
                      <div className="w-14 h-10 rounded-md bg-brand-dark/5 overflow-hidden flex items-center justify-center">
                        {y.cover_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={y.cover_image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        ) : (
                          <IconPencil size={16} className="text-brand-ink/30" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-dark line-clamp-1">{y.title}</p>
                      <p className="text-xs text-brand-ink/50 line-clamp-1">/blog/{y.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-ink/60 hidden md:table-cell whitespace-nowrap">
                      <IconCalendar size={12} className="inline mr-1" />
                      {y.published_at ? formatTarih(y.published_at) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => yayinlaToggle(y)}
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                          y.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-brand-dark/5 text-brand-ink/60 hover:bg-brand-dark/10'
                        )}
                      >
                        {y.is_published ? <IconEye size={12} /> : <IconEyeOff size={12} />}
                        {y.is_published ? 'Yayında' : 'Taslak'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {y.is_published && (
                          <Link
                            href={`/blog/${y.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg text-brand-ink/60 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                            title="Sitede görüntüle"
                          >
                            <IconExternalLink size={18} />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => duzenleAc(y)}
                          className="p-2 rounded-lg text-brand-ink/60 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                          title="Düzenle"
                        >
                          <IconEdit size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSilOnay(y)}
                          className="p-2 rounded-lg text-brand-ink/60 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Sil"
                        >
                          <IconTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        acik={formAcik}
        kapat={() => { setFormAcik(false); setDuzenlenen(null); }}
        baslik={duzenlenen ? 'Yazıyı Düzenle' : 'Yeni Yazı'}
        altBaslik={duzenlenen?.title}
        size="xl"
      >
        <BlogFormu
          ilkVeri={duzenlenen}
          onKaydet={kaydet}
          onIptal={() => { setFormAcik(false); setDuzenlenen(null); }}
        />
      </Modal>

      <ConfirmDialog
        acik={!!silOnay}
        kapat={() => !silYukleniyor && setSilOnay(null)}
        baslik="Yazı silinecek"
        mesaj={silOnay ? `"${silOnay.title}" yazısı kalıcı olarak silinecek.` : ''}
        onayMetni="Evet, sil"
        onOnay={silOnayla}
        yukleniyor={silYukleniyor}
      />
    </>
  );
}
