// ════════════════════════════════════════════════════════════
// Talepler Listesi — Müşteri sipariş geçmişi
// ════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  IconMessageCircle, IconPhone, IconMapPin,
  IconBrandWhatsapp, IconNote, IconPackage, IconSearch,
  IconExternalLink,
} from '@tabler/icons-react';
import Modal from '@/components/ui/Modal';
import { formatFiyat, formatTarih } from '@/lib/utils';
import { ROTALAR } from '@/lib/constants';

export default function TaleplerListe({ ilkTalepler }) {
  const [talepler] = useState(ilkTalepler);
  const [arama, setArama] = useState('');
  const [detay, setDetay] = useState(null);

  const filtrelenmis = talepler.filter((t) => {
    if (!arama) return true;
    const q = arama.toLowerCase();
    return (
      t.customer_name?.toLowerCase().includes(q) ||
      t.customer_phone?.includes(q) ||
      t.customer_address?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">
          Müşteri Talepleri
        </h1>
        <p className="text-brand-ink/60 mt-2">
          {talepler.length} talep — WhatsApp'a gönderilen tüm siparişler
        </p>
      </div>

      {/* Arama */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-brand-dark/5 mb-6">
        <div className="relative">
          <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40" />
          <input
            type="text"
            placeholder="Ad, telefon veya adrese göre ara…"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-brand-dark/15 rounded-lg
                       focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30"
          />
        </div>
      </div>

      {/* Liste */}
      {filtrelenmis.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-card border border-brand-dark/5 text-center">
          <IconMessageCircle size={48} className="mx-auto text-brand-ink/20 mb-3" />
          <p className="font-display text-xl text-brand-dark/60 mb-2">
            {talepler.length === 0 ? 'Henüz talep yok' : 'Sonuç bulunamadı'}
          </p>
          <p className="text-sm text-brand-ink/50">
            {talepler.length === 0
              ? 'Müşteriler sipariş formu doldurduğunda burada görünecek.'
              : 'Farklı bir arama deneyin.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-dark/5 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider">Tarih</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider">Müşteri</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider hidden md:table-cell">Telefon</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider hidden lg:table-cell">Ürün</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider hidden lg:table-cell">Tutar</th>
                  <th className="px-4 py-3 text-xs font-semibold text-brand-ink/70 uppercase tracking-wider text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-dark/5">
                {filtrelenmis.map((t) => {
                  const urunSayisi = (t.cart_items || []).reduce(
                    (a, x) => a + (x.qty || 1), 0
                  );
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-brand-dark/[0.02] cursor-pointer"
                      onClick={() => setDetay(t)}
                    >
                      <td className="px-4 py-3 text-sm text-brand-ink/70 whitespace-nowrap">
                        <p className="font-medium text-brand-dark">
                          {new Date(t.created_at).toLocaleDateString('tr-TR')}
                        </p>
                        <p className="text-xs text-brand-ink/50">
                          {new Date(t.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-brand-dark">{t.customer_name}</p>
                        <p className="text-xs text-brand-ink/50 line-clamp-1">
                          {t.customer_address || '—'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm hidden md:table-cell">
                        <a
                          href={`tel:+${t.customer_phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-brand-gold transition-colors"
                        >
                          {t.customer_phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm hidden lg:table-cell">
                        <span className="font-medium">{urunSayisi}</span>
                        <span className="text-brand-ink/50"> ürün</span>
                      </td>
                      <td className="px-4 py-3 text-sm hidden lg:table-cell">
                        {t.total_estimate ? (
                          <span className="font-medium">{formatFiyat(t.total_estimate)}</span>
                        ) : (
                          <span className="text-brand-ink/40 text-xs">Sor</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={`https://wa.me/${t.customer_phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-full transition-colors"
                          title="WhatsApp'tan ulaş"
                        >
                          <IconBrandWhatsapp size={14} />
                          Ara
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detay modal */}
      <Modal
        acik={!!detay}
        kapat={() => setDetay(null)}
        baslik={detay?.customer_name}
        altBaslik={detay ? `${formatTarih(detay.created_at)} - ${new Date(detay.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}` : ''}
        size="lg"
      >
        {detay && (
          <div className="space-y-5">
            {/* Müşteri bilgileri */}
            <div className="bg-brand-dark/[0.02] rounded-xl p-4 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <IconPhone size={16} className="text-brand-gold mt-0.5 shrink-0" />
                <a href={`tel:+${detay.customer_phone}`} className="hover:text-brand-gold font-medium">
                  {detay.customer_phone}
                </a>
              </div>
              {detay.customer_address && (
                <div className="flex items-start gap-2">
                  <IconMapPin size={16} className="text-brand-gold mt-0.5 shrink-0" />
                  <p>{detay.customer_address}</p>
                </div>
              )}
              {detay.customer_note && (
                <div className="flex items-start gap-2">
                  <IconNote size={16} className="text-brand-gold mt-0.5 shrink-0" />
                  <p className="italic">{detay.customer_note}</p>
                </div>
              )}
            </div>

            {/* Sepet kalemleri */}
            <div>
              <h3 className="font-medium text-brand-dark mb-3">
                Sepetteki Ürünler ({(detay.cart_items || []).length})
              </h3>
              <div className="space-y-2">
                {(detay.cart_items || []).map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-white border border-brand-dark/5 rounded-lg">
                    <div className="w-14 h-14 rounded-md bg-brand-dark/5 shrink-0 overflow-hidden">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-ink/30">
                          <IconPackage size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={ROTALAR.urun(item.slug)}
                        target="_blank"
                        className="font-medium text-brand-dark hover:text-brand-gold transition-colors line-clamp-1 inline-flex items-center gap-1"
                      >
                        {item.name}
                        <IconExternalLink size={12} />
                      </Link>
                      <p className="text-xs text-brand-ink/60 mt-1">
                        {item.qty} adet
                        {item.price > 0 && ` × ${formatFiyat(item.price)}`}
                      </p>
                    </div>
                    {item.price > 0 && (
                      <p className="font-medium text-sm text-brand-dark shrink-0">
                        {formatFiyat(item.price * item.qty)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {detay.total_estimate && (
                <div className="mt-4 pt-4 border-t border-brand-dark/10 flex justify-between items-baseline">
                  <span className="font-medium text-brand-dark">Yaklaşık Toplam</span>
                  <span className="font-display text-xl font-semibold text-brand-dark">
                    {formatFiyat(detay.total_estimate)}
                  </span>
                </div>
              )}
            </div>

            {/* Aksiyonlar */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-brand-dark/5">
              <a
                href={`https://wa.me/${detay.customer_phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium text-sm transition-colors"
              >
                <IconBrandWhatsapp size={18} />
                WhatsApp'tan Yaz
              </a>
              <a
                href={`tel:+${detay.customer_phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-brand-dark/15 text-brand-dark rounded-full font-medium text-sm hover:bg-brand-dark/5 transition-colors"
              >
                <IconPhone size={18} />
                Ara
              </a>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
