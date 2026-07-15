// ════════════════════════════════════════════════════════════
// ServiceWorkerRegister — DEVRE DIŞI (v16)
// ════════════════════════════════════════════════════════════
// PWA/Service Worker kaldırıldı. Bozuk precache beyaz ekrana yol
// açıyordu. Bu bileşen artık SW KAYDETMEZ; aksine daha önce kayıtlı
// kalmış eski SW'leri temizler (kill-switch sw.js zaten kendini
// imha ediyor; bu ek bir güvenlik ağı).
// ════════════════════════════════════════════════════════════

'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Daha önce kayıtlı SW varsa kaldır
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        for (const reg of registrations) {
          reg.unregister().catch(() => {});
        }
      })
      .catch(() => {});

    // Artık kalmış cache'leri de temizle
    if (typeof caches !== 'undefined') {
      caches.keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .catch(() => {});
    }
  }, []);

  return null;
}
