// ════════════════════════════════════════════════════════════
// Auth Context — Kullanıcı Oturumu (Client-side)
// ════════════════════════════════════════════════════════════
// Admin sayfalarında "kim giriş yapmış" bilgisini tutar.
// Logout ve kullanıcı değişimi event'lerini dinler.
// ════════════════════════════════════════════════════════════

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [yukleniyor, setYukleniyor] = useState(!initialUser);
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    // İlk yükleme: mevcut oturumu kontrol et
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setYukleniyor(false);
    });

    // Auth değişimlerini dinle (giriş, çıkış, token yenileme)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (event === 'SIGNED_OUT') {
          router.push('/giris');
          router.refresh();
        }
        if (event === 'SIGNED_IN') {
          router.refresh();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  /** E-posta + şifre ile giriş (direkt Supabase) */
  async function girisYap(email, sifre) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: sifre,
    });
    if (error) throw error;
    return data;
  }

  /** Server-side login'den gelen token ile session kur */
  async function sessionKur(accessToken, refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
    return data;
  }

  /** Çıkış yap */
  async function cikisYap() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  return (
    <AuthContext.Provider value={{ user, yukleniyor, girisYap, sessionKur, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Auth hook'u — herhangi bir client component'te kullanılabilir.
 * Örnek: const { user, cikisYap } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth sadece <AuthProvider> içinde kullanılabilir.');
  }
  return ctx;
}
