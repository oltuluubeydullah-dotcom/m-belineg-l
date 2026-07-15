// ════════════════════════════════════════════════════════════
// Möbel İnegöl Service Worker — KILL-SWITCH (v16)
// ════════════════════════════════════════════════════════════
// Önceki SW sürümleri bozuk precache (silinmiş /marka/logo-siyah.png
// vb.) yüzünden beyaz ekrana yol açıyordu. Bu sürüm SW'yi tamamen
// devre dışı bırakır: tüm cache'leri siler, kendini kaydından düşürür
// ve açık tüm sekmeleri yeniler. Eski SW'ler kullanıcı cihazlarında
// böylece kökten temizlenir.
// ════════════════════════════════════════════════════════════

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      // Tüm cache'leri sil
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (_) {}

    try {
      // Kendini kayıttan düşür
      await self.registration.unregister();
    } catch (_) {}

    try {
      // Açık tüm sekmeleri yenile → temiz, SW'siz sayfa yüklensin
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        client.navigate(client.url);
      }
    } catch (_) {}
  })());
});

// Hiçbir fetch'i yakalama — her şey doğrudan network'e gitsin
