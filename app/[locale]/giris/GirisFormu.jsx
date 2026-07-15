// ════════════════════════════════════════════════════════════
// Giriş Formu (Client Component)
// SECURITY FIX: /api/auth/login üzerinden server-side rate limit
// ════════════════════════════════════════════════════════════

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { IconMail, IconLock, IconLogin } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ISLETME } from '@/lib/constants';

export default function GirisFormu() {
  const [email, setEmail]           = useState('');
  const [sifre, setSifre]           = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata]             = useState(null);

  const { sessionKur } = useAuth();
  const { goster }     = useToast();
  const aramaParams    = useSearchParams();
  // Open redirect koruması: sadece /admin veya /admin/* kabul et
  const rawNext      = aramaParams.get('next') || '';
  const sonraNereye  = rawNext.startsWith('/admin') && !rawNext.startsWith('//') ? rawNext : '/admin';
  const hataParam      = aramaParams.get('error');

  // URL'den gelen hata parametresini güvenli şekilde (effect içinde) işle.
  // Render sırasında setState ÇAĞIRMAK React anti-pattern'idir.
  useEffect(() => {
    const mesajlar = {
      unauthorized: 'Bu hesap yönetici değil. Yetkili e-posta ile giriş yapın.',
      email_not_confirmed: 'E-posta adresiniz henüz onaylanmamış. Lütfen yöneticinizle iletişime geçin.',
    };
    if (hataParam && mesajlar[hataParam]) {
      setHata(mesajlar[hataParam]);
    }
  }, [hataParam]);

  async function handleSubmit(e) {
    e.preventDefault();
    setHata(null);

    if (!email || !sifre) {
      setHata('E-posta ve şifre gerekli');
      return;
    }

    setYukleniyor(true);
    try {
      // Server-side — rate limit + allowlist kontrolü burada yapılır
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: sifre }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        const errorMap = {
          too_many_attempts:   'Çok fazla deneme. Lütfen 5 dakika bekleyin.',
          unauthorized:        'Bu hesap yönetici değil.',
          invalid_credentials: 'E-posta veya şifre hatalı.',
          invalid_email:       'Geçerli bir e-posta adresi girin.',
          invalid_password:    'Şifre en az 6 karakter olmalıdır.',
          email_not_confirmed: 'E-posta adresiniz henüz onaylanmamış. Lütfen yöneticinizle iletişime geçin.',
        };
        setHata(errorMap[json.error] || 'Giriş başarısız. Bilgileri kontrol edin.');
        setYukleniyor(false);
        return;
      }

      // Server zaten session cookie'lerini Set-Cookie ile yazdı (mobil-güvenli).
      // Client session'ı da güncellemeyi dene ama BLOKLAMA — iOS'ta setSession
      // takılsa bile tam sayfa yönlendirmesinde middleware server cookie'siyle çalışır.
      try {
        await sessionKur(json.access_token, json.refresh_token);
      } catch (_) {
        /* best-effort — server cookie yeterli */
      }

      goster('Hoş geldiniz!', 'basari');

      // ÖNEMLİ: router.push yerine TAM SAYFA yönlendirmesi.
      // Tam yenileme ile middleware taze cookie ile çalışır, admin'i doğru tanır.
      window.location.assign(sonraNereye);
    } catch (_err) {
      setHata('Bağlantı hatası. Lütfen tekrar deneyin.');
      setYukleniyor(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marka/mobel-logo.png" alt="Möbel İnegöl"
            className="h-14 w-auto mx-auto" width="361" height="120" />
        </Link>

        <form onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-card p-8 md:p-10 border border-brand-dark/5">
          <h1 className="font-display text-2xl font-semibold text-brand-dark mb-2">
            Yönetim Girişi
          </h1>
          <p className="text-sm text-brand-ink/60 mb-8">
            Sadece yetkili kullanıcılar erişebilir.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <IconMail size={18} className="absolute left-3 top-9 text-brand-ink/40" />
              <Input label="E-posta" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz" required autoComplete="email" className="pl-10" />
            </div>

            <div className="relative">
              <IconLock size={18} className="absolute left-3 top-9 text-brand-ink/40" />
              <Input label="Şifre" type="password" value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password" className="pl-10" />
            </div>

            {hata && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {hata}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg"
              yukleniyor={yukleniyor} className="w-full">
              <IconLogin size={18} />
              {yukleniyor ? 'Giriş yapılıyor…' : 'Giriş Yap'}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-brand-dark/5 text-center">
            <Link href="/" className="text-sm text-brand-ink/60 hover:text-brand-teal transition-colors">
              ← Anasayfaya dön
            </Link>
          </div>
        </form>

        <p className="text-xs text-brand-ink/40 text-center mt-6">
          &copy; {new Date().getFullYear()} {ISLETME.ad} — <span className="text-brand-gold">by ubivo</span>
        </p>
      </div>
    </div>
  );
}
