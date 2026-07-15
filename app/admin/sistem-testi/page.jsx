'use client';

import { useState } from 'react';
import { IconActivity, IconCheck, IconX } from '@tabler/icons-react';
import Button from '@/components/ui/Button';
import { getSupabaseClient } from '@/lib/supabase/client';
import { bucketTest } from '@/lib/imageUpload';

export default function SistemTestiPage() {
  const [test, setTest] = useState(null);
  const [calisiyor, setCalisiyor] = useState(false);

  async function testEt() {
    setCalisiyor(true);
    const supabase = getSupabaseClient();
    const sonuc = { zaman: new Date().toLocaleString('tr-TR') };

    // 1) Medya bucket testi
    const medya = await bucketTest(supabase);
    sonuc.medya = medya;

    // 2) Oturum/auth
    const { data: { user } } = await supabase.auth.getUser();
    sonuc.auth = user ? { ok: true, email: user.email } : { ok: false, hata: 'Giriş yapılmamış' };

    setTest(sonuc);
    setCalisiyor(false);
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">
          Sistem Testi
        </h1>
        <p className="text-brand-ink/60 mt-2">
          Storage bucket'ları, yetkileri ve genel sağlığı kontrol et.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-dark/10 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <IconActivity size={24} className="text-brand-gold" />
          <h2 className="font-display text-xl font-semibold text-brand-dark">
            Hızlı tanı
          </h2>
        </div>

        <Button
          type="button"
          variant="gold"
          onClick={testEt}
          disabled={calisiyor}
          yukleniyor={calisiyor}
        >
          {calisiyor ? 'Test ediliyor…' : 'Testi Başlat'}
        </Button>

        {test && (
          <div className="mt-6 space-y-3">
            <div className="text-xs text-brand-ink/50">Test zamanı: {test.zaman}</div>

            <Satir
              ad="Oturum (admin login)"
              durum={test.auth?.ok}
              detay={test.auth?.ok ? test.auth.email : test.auth?.hata}
            />

            <Satir
              ad="mobel-medya bucket (görsel yükleme)"
              durum={test.medya?.ok}
              detay={test.medya?.ok ? 'Yazma yetkisi var, MIME ve boyut OK' : test.medya?.hata}
              cozum={!test.medya?.ok && 'Sistem yöneticisi (ubivo) ile iletişime geçin — kurulum eksik.'}
            />
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-brand-dark/10 text-xs text-brand-ink/60 space-y-2">
          <p><strong>Görsel yükleme hatası alıyorsan</strong> önce buradan testi çalıştır. Tüm satırlar yeşilse her şey normal. Kırmızı varsa ubivo'ya yaz.</p>
          <p><strong>iPhone HEIC dosyaları</strong> otomatik JPG'ye çevrilir; ekstra ayara gerek yok.</p>
        </div>
      </div>
    </>
  );
}

function Satir({ ad, durum, detay, cozum }) {
  return (
    <div className={`rounded-lg p-3 border ${durum ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-start gap-3">
        {durum
          ? <IconCheck size={20} className="text-green-600 mt-0.5 shrink-0" />
          : <IconX size={20} className="text-red-600 mt-0.5 shrink-0" />}
        <div className="flex-1">
          <div className="font-medium text-brand-dark">{ad}</div>
          {detay && <div className="text-sm text-brand-ink/70 mt-0.5">{detay}</div>}
          {cozum && <div className="text-xs text-brand-gold mt-1.5 font-medium">💡 {cozum}</div>}
        </div>
      </div>
    </div>
  );
}
