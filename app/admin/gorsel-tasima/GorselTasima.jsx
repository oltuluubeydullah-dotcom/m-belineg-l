// ════════════════════════════════════════════════════════════
// Görsel Taşıma — mevcut Supabase Storage görsellerini R2'ye taşır
// ════════════════════════════════════════════════════════════
// /api/admin/gorsel-tasima route'unu `bitti:true` gelene kadar
// döngüyle çağırır. Kalıcı hata alan birimleri `atla` listesine
// ekler (sonsuz döngü yok). Canlıda güvenli — idempotent.
// ════════════════════════════════════════════════════════════

'use client';

import { useState, useRef, useEffect } from 'react';
import {
  IconCloudUpload, IconCheck, IconLoader2, IconX,
} from '@tabler/icons-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export default function GorselTasima() {
  const [calisiyor, setCalisiyor] = useState(false);
  const [bitti, setBitti] = useState(false);
  const [tasinan, setTasinan] = useState(0);
  const [hataSayi, setHataSayi] = useState(0);
  const [kalan, setKalan] = useState(null);   // ilk turdan sonra dolar
  const [gunluk, setGunluk] = useState([]);   // son işlemler
  const [teshis, setTeshis] = useState(null);   // R2 env durumu
  const { goster } = useToast();
  const iptalRef = useRef(false);

  // Açılışta R2 env teşhisini çek
  useEffect(() => {
    let iptal = false;
    fetch('/api/admin/gorsel-tasima', { method: 'GET' })
      .then((r) => r.json())
      .then((j) => { if (!iptal && j?.ok) setTeshis(j); })
      .catch(() => {});
    return () => { iptal = true; };
  }, []);

  function logEkle(satir) {
    setGunluk((g) => [satir, ...g].slice(0, 40));
  }

  async function basla() {
    setCalisiyor(true);
    setBitti(false);
    setTasinan(0);
    setHataSayi(0);
    setKalan(null);
    setGunluk([]);
    iptalRef.current = false;

    const atla = [];
    let toplamTasinan = 0;
    let toplamHata = 0;

    try {
      // Güvenlik tavanı: en fazla 500 tur (binlerce görsel bile biter).
      for (let tur = 0; tur < 500; tur++) {
        if (iptalRef.current) { logEkle('⏹️ Durduruldu.'); break; }

        const res = await fetch('/api/admin/gorsel-tasima', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ atla }),
        });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || !json.ok) {
          const mesaj = json?.error || `Sunucu hatası (${res.status})`;
          logEkle('❌ ' + mesaj);
          goster(mesaj, 'hata');
          break;
        }

        if (json.bitti) {
          setBitti(true);
          setKalan(0);
          logEkle('🎉 Tüm görseller R2\'ye taşındı.');
          goster('Taşıma tamamlandı', 'basari');
          break;
        }

        if (typeof json.kalanGorsel === 'number') setKalan(json.kalanGorsel);

        for (const it of json.islenen || []) {
          if (it.durum === 'tasindi') {
            toplamTasinan += it.tasinan || 1;
            logEkle(`✅ ${it.tablo} — ${it.tasinan || 1} görsel taşındı`);
          } else if (it.durum === 'kismi') {
            toplamTasinan += it.tasinan || 0;
            toplamHata += 1;
            atla.push(it.anahtar); // kalanları tekrar denemesin
            logEkle(`⚠️ ${it.tablo} — kısmi (${it.tasinan} taşındı, kalan hata: ${it.hata || ''})`);
          } else {
            toplamHata += 1;
            atla.push(it.anahtar);
            logEkle(`❌ ${it.tablo} — ${it.hata || 'hata'}`);
          }
        }
        setTasinan(toplamTasinan);
        setHataSayi(toplamHata);
      }
    } catch (e) {
      logEkle('❌ ' + (e?.message || 'Beklenmeyen hata'));
      goster(e?.message || 'Beklenmeyen hata', 'hata');
    } finally {
      setCalisiyor(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">
          Görsel Taşıma
        </h1>
        <p className="text-brand-ink/60 mt-2">
          Daha önce Supabase Storage'a yüklenmiş görselleri Cloudflare R2'ye taşır.
        </p>
      </div>

      {/* Bilgi kutusu */}
      <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-5 mb-6 text-sm text-brand-ink/80 space-y-2">
        <p className="font-semibold text-brand-dark">Nasıl çalışır?</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ürün, kategori, blog ve hero görsellerinden Supabase'de kalanları bulur.</li>
          <li>Her birini R2'ye kopyalar ve bağlantıyı <code>cdn.mobelinegol.com</code>'a günceller.</li>
          <li>Parça parça çalışır; sekmeyi <b>açık tut</b>. İstediğin an durdurabilir, sonra kaldığı yerden devam ettirebilirsin.</li>
          <li>Güvenli: taşınan görseller tekrar işlenmez. Eski görseller, taşınana kadar çalışmaya devam eder.</li>
        </ul>
        <p className="text-xs text-brand-ink/60">
          ⚠️ Önce Vercel'de R2 env değişkenleri girilmiş ve Redeploy yapılmış olmalı. Değilse buton "R2 yapılandırılmamış" hatası verir.
        </p>
      </div>

      {/* R2 env teşhisi */}
      {teshis && (
        <div className={`rounded-2xl p-5 mb-6 border text-sm ${
          teshis.aktif
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <p className="font-semibold text-brand-dark mb-2">
            {teshis.aktif
              ? '✅ R2 aktif — taşımaya hazır'
              : '❌ R2 aktif değil — aşağıdaki eksik değişkeni Vercel\'e girip Redeploy yap'}
          </p>
          <ul className="space-y-1 font-mono text-xs">
            {Object.entries(teshis.durum || {}).map(([k, v]) => (
              <li key={k} className="flex items-center gap-2">
                {v
                  ? <IconCheck size={15} className="text-green-600 shrink-0" />
                  : <IconX size={15} className="text-red-600 shrink-0" />}
                <span className={v ? 'text-brand-ink/70' : 'text-red-700 font-semibold'}>{k}</span>
                {!v && <span className="text-red-600">← eksik</span>}
              </li>
            ))}
          </ul>
          {teshis.public_url_deger && (
            <p className="text-xs text-brand-ink/60 mt-2">
              Public URL: <code>{teshis.public_url_deger}</code> · Bucket: <code>{teshis.bucket_deger || '—'}</code>
            </p>
          )}
          {!teshis.service_client && (
            <p className="text-xs text-red-700 mt-2 font-semibold">
              ⚠️ SUPABASE_SERVICE_ROLE_KEY de eksik — taşıma DB güncellemesi yapamaz.
            </p>
          )}
        </div>
      )}

      {/* Durum panosu */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-4 text-center">
          <div className="text-2xl font-bold text-brand-teal">{tasinan}</div>
          <div className="text-xs text-brand-ink/60 mt-1">Taşınan görsel</div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-4 text-center">
          <div className="text-2xl font-bold text-brand-dark">{kalan == null ? '—' : kalan}</div>
          <div className="text-xs text-brand-ink/60 mt-1">Kalan (tahmini)</div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-4 text-center">
          <div className={`text-2xl font-bold ${hataSayi ? 'text-red-600' : 'text-brand-ink/30'}`}>{hataSayi}</div>
          <div className="text-xs text-brand-ink/60 mt-1">Hata</div>
        </div>
      </div>

      {/* Aksiyon */}
      <div className="flex items-center gap-3 mb-6">
        {!calisiyor ? (
          <Button variant="primary" size="lg" onClick={basla}>
            <IconCloudUpload size={18} />
            {bitti || tasinan > 0 ? 'Tekrar Tara / Devam Et' : 'Taşımayı Başlat'}
          </Button>
        ) : (
          <>
            <Button variant="ghost" size="lg" disabled>
              <IconLoader2 size={18} className="animate-spin" />
              Taşınıyor…
            </Button>
            <button
              type="button"
              onClick={() => { iptalRef.current = true; }}
              className="text-sm text-brand-ink/60 hover:text-red-600 underline"
            >
              Durdur
            </button>
          </>
        )}
        {bitti && (
          <span className="inline-flex items-center gap-1 text-brand-teal font-semibold text-sm">
            <IconCheck size={18} /> Tamamlandı
          </span>
        )}
      </div>

      {/* Günlük */}
      {gunluk.length > 0 && (
        <div className="bg-brand-navy/95 text-brand-cream rounded-2xl p-4 font-mono text-xs max-h-80 overflow-y-auto space-y-1">
          {gunluk.map((satir, i) => (
            <div key={i} className="whitespace-pre-wrap leading-relaxed">{satir}</div>
          ))}
        </div>
      )}
    </div>
  );
}
