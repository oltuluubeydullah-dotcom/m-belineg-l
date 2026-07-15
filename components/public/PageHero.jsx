// ════════════════════════════════════════════════════════════
// PageHero — Statik sayfa başlık şeridi (KVKK, Hakkımızda vs)
// ════════════════════════════════════════════════════════════

import { Link } from '@/lib/i18n/navigation';
import { ROTALAR } from '@/lib/constants';

export default function PageHero({ baslik, altBaslik, breadcrumb = [] }) {
  return (
    <div className="section-band">
      <div className="container mx-auto text-center">
        {breadcrumb.length > 0 && (
          <div className="text-xs text-white/70 font-sans font-medium tracking-widest uppercase mb-3 flex items-center justify-center gap-2 flex-wrap">
            <Link href={ROTALAR.anasayfa} className="hover:text-white transition-colors">
              Anasayfa
            </Link>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                <span>/</span>
                {b.href ? (
                  <Link href={b.href} className="hover:text-brand-teal transition-colors">{b.ad}</Link>
                ) : (
                  <span>{b.ad}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-white drop-shadow-md">
          {baslik}
        </h1>
        {altBaslik && (
          <p className="text-white/90 font-sans mt-4 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {altBaslik}
          </p>
        )}
      </div>
    </div>
  );
}
