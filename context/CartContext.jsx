// ════════════════════════════════════════════════════════════
// Sepet Context (CartContext)
// ════════════════════════════════════════════════════════════
// localStorage tabanlı sepet — backend yok, sadece tarayıcıda.
// Müşteri checkout'a basınca sepet WhatsApp mesajına gömülür.
// ════════════════════════════════════════════════════════════
// NOT: Bu Paket 1'de henüz kullanılmıyor, Paket 3'te aktive olacak.
// Şimdiden hazır olsun diye iskelet eklendi.
// ════════════════════════════════════════════════════════════

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_ANAHTARLARI } from '@/lib/constants';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [sepet, setSepet] = useState([]);
  const [yuklendi, setYuklendi] = useState(false);

  // localStorage'dan yükle (sadece tarayıcıda)
  useEffect(() => {
    try {
      const kaydedilen = localStorage.getItem(STORAGE_ANAHTARLARI.sepet);
      if (kaydedilen) setSepet(JSON.parse(kaydedilen));
    } catch (e) {
      console.warn('Sepet okunamadı:', e);
    }
    setYuklendi(true);
  }, []);

  // Her değişiklikte localStorage'a kaydet
  useEffect(() => {
    if (!yuklendi) return;  // İlk yükleme bitmeden yazma
    try {
      localStorage.setItem(STORAGE_ANAHTARLARI.sepet, JSON.stringify(sepet));
    } catch (e) {
      console.warn('Sepet kaydedilemedi:', e);
    }
  }, [sepet, yuklendi]);

  /** Sepete ürün ekle (varsa miktarı artır) */
  function ekle(urun, adet = 1) {
    // Analitik: sepete ekleme olayını kaydet (fire-and-forget, akışı bloklamaz)
    try {
      fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'sepete_ekleme',
          product_id: urun?.id,
          path: typeof window !== 'undefined' ? window.location.pathname : null,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch (_) { /* no-op */ }

    setSepet((mevcut) => {
      const idx = mevcut.findIndex((x) => x.id === urun.id);
      if (idx >= 0) {
        const yeni = [...mevcut];
        yeni[idx] = { ...yeni[idx], qty: yeni[idx].qty + adet };
        return yeni;
      }
      return [...mevcut, { ...urun, qty: adet }];
    });
  }

  /** Sepetten ürün çıkar */
  function cikar(urunId) {
    setSepet((mevcut) => mevcut.filter((x) => x.id !== urunId));
  }

  /** Miktar güncelle (0 olunca otomatik çıkarır) */
  function miktarGuncelle(urunId, yeniAdet) {
    if (yeniAdet < 1) return cikar(urunId);
    setSepet((mevcut) =>
      mevcut.map((x) => (x.id === urunId ? { ...x, qty: yeniAdet } : x))
    );
  }

  /** Sepeti tamamen boşalt */
  function temizle() {
    setSepet([]);
  }

  /** Toplam ürün sayısı (badge için) */
  const toplamAdet = sepet.reduce((acc, x) => acc + (x.qty || 1), 0);

  /** Yaklaşık toplam tutar (fiyatı olan ürünler için) */
  const toplamTutar = sepet.reduce(
    (acc, x) => acc + ((x.price || 0) * (x.qty || 1)),
    0
  );

  return (
    <CartContext.Provider
      value={{ sepet, ekle, cikar, miktarGuncelle, temizle, toplamAdet, toplamTutar }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Sepet hook'u — herhangi bir client component'te kullanılabilir.
 *
 * Örnek:
 *   const { sepet, ekle, toplamAdet } = useCart();
 */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart sadece <CartProvider> içinde kullanılabilir.');
  }
  return ctx;
}
