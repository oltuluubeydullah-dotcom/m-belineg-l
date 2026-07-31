// ════════════════════════════════════════════════════════════
// Admin / Toplu Yükleme — Aktif UI (v9.0)
// ════════════════════════════════════════════════════════════
// ZIP seç → yükle → ilerleme bar → rapor tablosu.
// API: /api/admin/toplu-yukleme
// ════════════════════════════════════════════════════════════

'use client';

import { useState, useRef } from 'react';
import {
  IconCloudUpload, IconFolder, IconCheck, IconAlertTriangle, IconRefresh, IconFileZip,
} from '@tabler/icons-react';
import Button from '@/components/ui/Button';
import { getSupabaseClient } from '@/lib/supabase/client';

// Supabase Free tier max upload: 50 MB. Pro plan'a yükseltirsen 50 GB olabilir.
const MAX_BOYUT = 50 * 1024 * 1024;
const MAX_BOYUT_LABEL = '50 MB';

export default function TopluYuklemePage() {
  const [dosya, setDosya] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [rapor, setRapor] = useState(null);
  const [hata, setHata] = useState(null);
  const [asama, setAsama] = useState(''); // "Yükleniyor..." / "İşleniyor..."
  const [_yuklemeYuzde, setYuklemeYuzde] = useState(0);
  const fileRef = useRef(null);

  const dosyaSec = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/\.zip$/i.test(f.name)) {
      setHata('Sadece .zip dosyası kabul edilir (.rar desteklenmiyor).');
      return;
    }
    if (f.size > MAX_BOYUT) {
      setHata(`Dosya çok büyük (${(f.size / 1024 / 1024).toFixed(1)} MB). Maksimum ${MAX_BOYUT_LABEL}. Daha büyük dosya için arşivi parçalara böl.`);
      return;
    }
    setHata(null);
    setRapor(null);
    setDosya(f);
  };

  const yukle = async () => {
    if (!dosya) return;
    setYukleniyor(true);
    setHata(null);
    setRapor(null);
    setYuklemeYuzde(0);

    try {
      const supabase = getSupabaseClient();
      const benzersiz = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const path = `_arsiv/${benzersiz}-${dosya.name}`;

      // ─── 1) Direkt Supabase Storage'a yükle (büyük dosyalar için) ───
      setAsama('Arşiv Storage\'a yükleniyor…');
      const { error: upErr } = await supabase.storage
        .from('mobel-arsiv')
        .upload(path, dosya, {
          upsert: false,
          contentType: dosya.type || 'application/octet-stream',
        });

      if (upErr) {
        // Bucket yoksa veya yetkisizse
        if (upErr.message?.includes('Bucket') || upErr.message?.includes('not found')) {
          throw new Error('Arşiv bucket kurulu değil — sql/21-mobel-arsiv-bucket.sql\'i Supabase SQL Editor\'da çalıştırın.');
        }
        // Supabase Free plan boyut limit hatası
        if (upErr.message?.includes('exceeded') || upErr.message?.includes('maximum')) {
          throw new Error(`Dosya Supabase'in izin verdiği boyutu aştı. Free plan: ${MAX_BOYUT_LABEL}. Pro plana yükseltirsen 50 GB'a kadar çıkar. Şimdilik arşivi 50 MB altı parçalara böl.`);
        }
        throw upErr;
      }

      setYuklemeYuzde(100);

      // ─── 2) API'yi CHUNK'lı tetikle — büyük arşivde 504 olmasın ────
      // offset ile bitene (done) kadar döngüyle çağır, raporu biriktir.
      setAsama('Arşiv işleniyor, ürünler ekleniyor…');
      const toplu = {
        kategoriler: { eklenen: 0 },
        urunler: { eklenen: 0, atlanan: 0 },
        resimler: { yuklenen: 0 },
        detay: [],
        hatalar: [],
      };
      let offset = 0;
      let toplam = 0;
      let hataOldu = false;

      // Güvenlik tavanı: sonsuz döngü olmasın (ürün başına 1 tur yeterli).
      for (let tur = 0; tur < 5000; tur++) {
        const res = await fetch('/api/admin/toplu-yukleme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, filename: dosya.name, offset }),
        });

        // Yanıt JSON değilse (örn. 413, 504, plain text)
        let data;
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          data = await res.json();
        } else {
          const txt = await res.text();
          throw new Error(`Sunucu yanıtı (${res.status}): ${txt.slice(0, 200)}`);
        }

        if (!res.ok || !data.ok) {
          setHata(data.error || 'İşleme başarısız');
          hataOldu = true;
          break;
        }

        toplam = data.toplam || toplam;
        toplu.kategoriler.eklenen += data.kategoriler?.eklenen || 0;
        toplu.urunler.eklenen += data.urunler?.eklenen || 0;
        toplu.urunler.atlanan += data.urunler?.atlanan || 0;
        toplu.resimler.yuklenen += data.resimler?.yuklenen || 0;
        if (Array.isArray(data.detay)) toplu.detay.push(...data.detay);
        if (Array.isArray(data.hatalar)) toplu.hatalar.push(...data.hatalar);

        const yeniOffset = data.sonrakiOffset ?? offset;
        setAsama(`Ürünler işleniyor… ${Math.min(yeniOffset, toplam)}/${toplam}`);
        if (toplam) setYuklemeYuzde(Math.round((Math.min(yeniOffset, toplam) / toplam) * 100));

        // İlerleme yoksa (takılma) sonsuz döngüyü kes.
        if (yeniOffset <= offset && !data.done) {
          toplu.hatalar.push('İşleme ilerlemedi — durduruldu.');
          break;
        }
        offset = yeniOffset;
        if (data.done) break;
      }

      if (!hataOldu) setRapor(toplu);
      else if (toplu.detay.length || toplu.hatalar.length) setRapor(toplu);
    } catch (e) {
      setHata('Hata: ' + (e?.message || 'bilinmeyen'));
    } finally {
      setYukleniyor(false);
      setAsama('');
    }
  };

  const resetle = () => {
    setDosya(null);
    setRapor(null);
    setHata(null);
    setAsama('');
    setYuklemeYuzde(0);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">
          Toplu Yükleme
        </h1>
        <p className="text-brand-ink/60 mt-2">
          Tek ZIP ile yüzlerce ürünü hızlıca yükleyin.
        </p>
      </div>

      {/* ─── Beklenen ZIP yapısı (her zaman görünür) ──────────── */}
      <div className="bg-white rounded-2xl p-6 border border-brand-dark/5 shadow-card mb-6">
        <div className="flex items-center gap-2 mb-3 text-brand-gold">
          <IconFolder size={18} />
          <span className="text-xs font-semibold tracking-widest uppercase">
            Beklenen ZIP Yapısı
          </span>
        </div>
        <pre className="text-xs md:text-sm text-brand-ink/80 font-mono leading-relaxed overflow-x-auto">
{`ÜRÜNLER.zip
├── Koltuk Takımı/
│   ├── Beyaz Lüks Koltuk/
│   │   ├── 1.jpg     ← ana görsel
│   │   ├── 2.jpg
│   │   └── 3.jpg
│   └── Modern Köşe/
│       └── 1.jpg
└── Yatak Odası/
    └── ...

Kategori klasörü → Ürün klasörü → Resimler.
Resimler 1.jpg, 2.jpg... olarak sırayla yüklenir.`}
        </pre>
        <p className="text-xs text-brand-ink/50 mt-3 leading-relaxed">
          ✓ Kategori yoksa otomatik oluşturulur · ✓ Aynı isimli ürün varsa atlanır · ✓ Görseller Storage&apos;a otomatik yüklenir
        </p>
      </div>

      {/* ─── DROP ZONE ──────────────────────────────────────── */}
      {!rapor && (
        <div className="bg-gradient-to-br from-brand-gold/5 to-brand-cream rounded-2xl p-8 md:p-12
                        border-2 border-dashed border-brand-gold/30 text-center mb-6">
          {!dosya ? (
            <>
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-brand-gold/15 flex items-center justify-center">
                <IconCloudUpload size={40} className="text-brand-gold" strokeWidth={1.8} />
              </div>
              <h2 className="font-display text-xl md:text-2xl font-semibold text-brand-dark mb-2">
                Arşiv dosyasını seçin
              </h2>
              <p className="text-sm text-brand-ink/60 mb-2">
                Yukarıdaki yapıda hazırlanmış <strong>.zip</strong> dosyasını yükleyin
              </p>
              <p className="text-xs text-brand-ink/40 mb-6">
                Maksimum dosya boyutu: <strong>{MAX_BOYUT_LABEL}</strong> (Supabase Free plan). Daha büyük için parçalara böl.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".zip,application/zip"
                onChange={dosyaSec}
                className="hidden"
                id="zip-upload"
              />
              <label
                htmlFor="zip-upload"
                className="btn-primary cursor-pointer inline-flex"
              >
                <IconFileZip size={20} />
                Dosya Seç
              </label>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-gold/15 flex items-center justify-center">
                <IconFileZip size={32} className="text-brand-gold" />
              </div>
              <p className="font-medium text-brand-dark mb-1">{dosya.name}</p>
              <p className="text-xs text-brand-ink/60 mb-6">
                {(dosya.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetle}
                  disabled={yukleniyor}
                >
                  Değiştir
                </Button>
                <Button
                  type="button"
                  variant="gold"
                  onClick={yukle}
                  disabled={yukleniyor}
                  yukleniyor={yukleniyor}
                >
                  {yukleniyor ? 'İşlem sürüyor…' : 'Yüklemeyi Başlat'}
                </Button>
              </div>
              {asama && (
                <p className="mt-4 text-xs text-brand-ink/60 animate-pulse">
                  {asama}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* ─── HATA ─────────────────────────────────────────────── */}
      {hata && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <IconAlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-800 mb-1">Yükleme başarısız</p>
            <p className="text-sm text-red-700">{hata}</p>
          </div>
        </div>
      )}

      {/* ─── RAPOR ────────────────────────────────────────────── */}
      {rapor && (() => {
        const hataSayisi = rapor.hatalar?.length || 0;
        const taslakSayisi = rapor.urunler?.taslak || 0;
        const uyariVar = hataSayisi > 0 || taslakSayisi > 0;
        return (
        <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${uyariVar ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
              {uyariVar ? <IconAlertTriangle size={26} /> : <IconCheck size={28} strokeWidth={2.5} />}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-brand-dark">
                {uyariVar
                  ? `Tamamlandı — ${hataSayisi > 0 ? `${hataSayisi} uyarı` : ''}${hataSayisi > 0 && taslakSayisi > 0 ? ', ' : ''}${taslakSayisi > 0 ? `${taslakSayisi} taslak ürün` : ''}`
                  : 'Yükleme Tamamlandı'}
              </h2>
              <p className="text-sm text-brand-ink/60">
                {taslakSayisi > 0
                  ? 'Görseli yüklenemeyen ürünler TASLAK (pasif) kaydedildi — Ürünler sayfasından görsel ekleyip yayına alın.'
                  : 'İşte rapor:'}
              </p>
            </div>
          </div>

          {/* Özet kartları */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-brand-cream rounded-xl p-4 text-center">
              <p className="font-display text-2xl text-brand-dark">{rapor.kategoriler.eklenen}</p>
              <p className="text-xs text-brand-ink/60 mt-1">Yeni kategori</p>
            </div>
            <div className="bg-brand-cream rounded-xl p-4 text-center">
              <p className="font-display text-2xl text-green-700">{rapor.urunler.eklenen}</p>
              <p className="text-xs text-brand-ink/60 mt-1">Eklenen ürün</p>
            </div>
            <div className="bg-brand-cream rounded-xl p-4 text-center">
              <p className="font-display text-2xl text-brand-gold">{rapor.resimler.yuklenen}</p>
              <p className="text-xs text-brand-ink/60 mt-1">Yüklenen görsel</p>
            </div>
            <div className="bg-brand-cream rounded-xl p-4 text-center">
              <p className="font-display text-2xl text-brand-ink/60">{rapor.urunler.atlanan}</p>
              <p className="text-xs text-brand-ink/60 mt-1">Atlanan</p>
            </div>
          </div>

          {/* Detay listesi */}
          {rapor.detay?.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-brand-dark mb-2">Detay</h3>
              <div className="bg-brand-cream/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <ul className="text-xs text-brand-ink/80 space-y-1 font-mono">
                  {rapor.detay.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* Hatalar */}
          {rapor.hatalar?.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                <IconAlertTriangle size={16} />
                Hatalar ({rapor.hatalar.length})
              </h3>
              <div className="bg-red-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <ul className="text-xs text-red-800 space-y-1">
                  {rapor.hatalar.map((h, i) => <li key={i}>• {h}</li>)}
                </ul>
              </div>
            </div>
          )}

          <Button onClick={resetle} variant="primary">
            <IconRefresh size={18} />
            Yeni Yükleme
          </Button>
        </div>
        );
      })()}
    </>
  );
}
