// ════════════════════════════════════════════════════════════
// AdminShell — Admin paneli görsel iskeleti
// ════════════════════════════════════════════════════════════
// Sidebar + üst bar + içerik. Logout client tarafında.
// ════════════════════════════════════════════════════════════

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconLayoutDashboard, IconPackage, IconCategory,
  IconMessageCircle, IconSettings, IconExternalLink, IconLogout,
  IconMenu2, IconX, IconArticle,
  IconBook, IconFileText, IconBrandWhatsapp, IconStarFilled,
  IconSpeakerphone,
  IconActivity,
} from '@tabler/icons-react';
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

const ADMIN_MENU = [
  { ad: 'Panel',              href: '/admin',                       icon: IconLayoutDashboard, sonEk: true },
  { ad: 'Ürünler',            href: '/admin/urunler',               icon: IconPackage },
  { ad: 'Kategoriler',        href: '/admin/kategoriler',           icon: IconCategory },
  { ad: 'Blog',               href: '/admin/blog',                  icon: IconArticle },
  { ad: 'Talepler',           href: '/admin/talepler',              icon: IconMessageCircle },
  { ad: 'Yorumlar',           href: '/admin/yorumlar',              icon: IconStarFilled },
  { ad: 'Pazarlama',          href: '/admin/pazarlama',             icon: IconSpeakerphone, sonEk: true },
  // Hero Bannerlar admin panelinden gizlendi (hero kod tarafından yönetiliyor —
  // 6 slide sabit). Sayfa/kod duruyor; sadece menüden çıkarıldı.
  { ad: 'Sayfa İçerikleri',   href: '/admin/sayfalar',              icon: IconFileText },
  { ad: 'WhatsApp Şablonları',href: '/admin/whatsapp-sablonlari',   icon: IconBrandWhatsapp },
  { ad: 'Ayarlar',            href: '/admin/ayarlar',               icon: IconSettings, sonEk: true },
  { ad: 'Kullanım Kılavuzu',  href: '/admin/kilavuz',               icon: IconBook },
  { ad: 'Sistem Testi',       href: '/admin/sistem-testi',          icon: IconActivity },
];

export default function AdminShell({ children, user }) {
  const [mobilAcik, setMobilAcik] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cikisYap } = useAuth();
  const { goster } = useToast();

  // v12.3 HIZ: Sidebar link'in üzerine gelince hedef sayfayı arka planda prefetch et
  // Next.js default prefetch'i `force-dynamic` route'larda devre dışı; manuel açıyoruz
  const onHoverPrefetch = useCallback((href) => {
    try { router.prefetch(href); } catch (_) { /* no-op */ }
  }, [router]);

  async function handleCikis() {
    try {
      await cikisYap();
      goster('Çıkış yapıldı', 'bilgi');
    } catch (err) {
      goster('Çıkış yapılamadı', 'hata');
    }
  }

  return (
    <div className="min-h-screen flex bg-brand-cream">
      {/* MOBİL TOGGLE */}
      <button
        type="button"
        onClick={() => setMobilAcik(!mobilAcik)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-brand-navy text-white rounded-lg shadow-card-h"
        aria-label="Menü"
      >
        {mobilAcik ? <IconX size={20} /> : <IconMenu2 size={20} />}
      </button>

      {/* MOBİL BACKDROP */}
      {mobilAcik && (
        <div
          className="md:hidden fixed inset-0 bg-brand-navy/60 z-30"
          onClick={() => setMobilAcik(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={cn(
        'fixed md:sticky top-0 left-0 h-screen w-72 bg-[#1A1A1A] text-brand-cream',
        'flex flex-col shrink-0 z-40 transition-transform duration-300',
        'border-r border-white/5',
        mobilAcik ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Logo */}
        <Link
          href="/admin"
          onClick={() => setMobilAcik(false)}
          className="px-5 py-5 border-b border-white/5 block"
        >
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/marka/mobel-logo-white.png"
              alt="Möbel İnegöl"
              className="h-9 w-auto object-contain"
              width="361"
              height="120"
            />
            <div>
              <span className="font-display text-lg font-semibold text-brand-cream leading-none">
                Möbel İnegöl
              </span>
              <p className="text-[10px] text-brand-cream/40 tracking-[0.18em] uppercase mt-0.5">
                Yönetim
              </p>
            </div>
          </div>
        </Link>

        {/* Menü */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {ADMIN_MENU.map((item, i) => {
            const Icon = item.icon;
            const aktif = item.sonEk
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobilAcik(false)}
                onMouseEnter={() => onHoverPrefetch(item.href)}
                onFocus={() => onHoverPrefetch(item.href)}
                prefetch={true}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium transition-colors',
                  item.sonEk && i > 0 && 'mt-2 pt-2 border-t border-white/5',
                  aktif
                    ? 'bg-brand-teal/15 text-brand-teal'
                    : 'text-brand-cream/75 hover:bg-white/5 hover:text-brand-cream'
                )}
              >
                <Icon size={18} stroke={1.8} />
                {item.ad}
              </Link>
            );
          })}
        </nav>

        {/* Kullanıcı bilgisi */}
        {user && (
          <div className="px-5 pt-3 pb-2 border-t border-white/5">
            <p className="text-[10px] text-brand-cream/40 uppercase tracking-wider">Giriş</p>
            <p className="text-xs text-brand-cream/80 truncate">{user.email}</p>
          </div>
        )}

        {/* Alt bağlantılar */}
        <div className="px-3 pb-2 space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-md
                       text-[13px] text-brand-cream/60 hover:text-brand-teal hover:bg-white/5 transition-colors"
          >
            <IconExternalLink size={16} stroke={1.8} />
            Siteyi Görüntüle
          </a>
          <button
            type="button"
            onClick={handleCikis}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md
                       text-[13px] text-brand-cream/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <IconLogout size={16} stroke={1.8} />
            Çıkış Yap
          </button>
        </div>

        {/* by ubivo */}
        <div className="px-5 pb-3 text-[10px] text-brand-cream/25">
          <span className="opacity-60">by</span>{' '}
          <a
            href="https://www.byubivo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-teal/70 font-medium hover:text-brand-teal transition-colors"
            aria-label="by ubivo — yeni sekmede aç"
          >
            ubivo
          </a>
        </div>
      </aside>

      {/* İÇERİK */}
      <main className="flex-1 overflow-x-auto min-w-0">
        <div className="p-6 md:p-10 max-w-7xl pt-16 md:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
