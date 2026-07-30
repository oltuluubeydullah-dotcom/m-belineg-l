// ════════════════════════════════════════════════════════════
// KategoriShowcase — Hero'nun hemen altı (v53)
// ════════════════════════════════════════════════════════════
// Her kategori için özel çizim (SVG) illüstrasyon — Möbel İnegöl
// renk paleti (altın #FEC401 · siyah #1A1A1A · krem). Damla formunda
// (yuvarlatılmış) kartlar, kategori sayfasına linkli.
// ════════════════════════════════════════════════════════════

import { Link } from '@/lib/i18n/navigation';
import { getLocalizedName } from '@/lib/i18n/auto-translate';

const D = '#1A1A1A';   // siyah
const G = '#FEC401';   // altın
const GD = '#D9A400';  // koyu altın
const CR = '#FFF6D6';  // açık altın/krem

// ─── Kategori slug → özel SVG illüstrasyon ───
const ILLO = {
  'koltuk-takimi': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <ellipse cx="120" cy="152" rx="92" ry="8" fill={D} opacity="0.06" />
      <rect x="38" y="52" width="164" height="46" rx="16" fill={D} />
      <rect x="30" y="68" width="22" height="58" rx="11" fill={D} />
      <rect x="188" y="68" width="22" height="58" rx="11" fill={D} />
      <rect x="52" y="60" width="60" height="34" rx="9" fill={G} opacity="0.9" />
      <rect x="128" y="60" width="60" height="34" rx="9" fill={G} opacity="0.9" />
      <rect x="48" y="90" width="144" height="36" rx="11" fill={G} />
      <line x1="96" y1="92" x2="96" y2="124" stroke={GD} strokeWidth="3" />
      <line x1="144" y1="92" x2="144" y2="124" stroke={GD} strokeWidth="3" />
      <rect x="54" y="126" width="7" height="16" rx="2" fill={D} />
      <rect x="179" y="126" width="7" height="16" rx="2" fill={D} />
    </svg>
  ),
  'kose-koltuk': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <ellipse cx="122" cy="154" rx="98" ry="8" fill={D} opacity="0.06" />
      <rect x="34" y="58" width="120" height="44" rx="15" fill={D} />
      <rect x="150" y="58" width="56" height="86" rx="15" fill={D} />
      <rect x="26" y="72" width="20" height="56" rx="10" fill={D} />
      <rect x="44" y="66" width="48" height="30" rx="8" fill={G} opacity="0.9" />
      <rect x="96" y="66" width="52" height="30" rx="8" fill={G} opacity="0.9" />
      <rect x="42" y="94" width="108" height="34" rx="10" fill={G} />
      <rect x="152" y="94" width="52" height="50" rx="10" fill={G} />
      <rect x="48" y="128" width="7" height="15" rx="2" fill={D} />
      <rect x="138" y="128" width="7" height="15" rx="2" fill={D} />
      <rect x="188" y="144" width="7" height="14" rx="2" fill={D} />
    </svg>
  ),
  'yatak-odasi': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <ellipse cx="120" cy="152" rx="96" ry="8" fill={D} opacity="0.06" />
      <rect x="36" y="46" width="128" height="52" rx="14" fill={D} />
      <rect x="44" y="86" width="124" height="30" rx="8" fill="#ffffff" stroke={D} strokeWidth="3" />
      <rect x="30" y="96" width="150" height="26" rx="8" fill={G} />
      <rect x="56" y="66" width="40" height="26" rx="7" fill={CR} />
      <rect x="104" y="66" width="40" height="26" rx="7" fill={CR} />
      <rect x="34" y="120" width="8" height="20" rx="2" fill={D} />
      <rect x="168" y="120" width="8" height="20" rx="2" fill={D} />
      <rect x="182" y="92" width="30" height="30" rx="5" fill={D} />
      <circle cx="197" cy="80" r="7" fill={G} />
    </svg>
  ),
  'yemek-odasi': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <ellipse cx="120" cy="156" rx="86" ry="8" fill={D} opacity="0.06" />
      <ellipse cx="120" cy="96" rx="74" ry="16" fill={G} />
      <ellipse cx="120" cy="92" rx="74" ry="16" fill={CR} stroke={D} strokeWidth="2" />
      <rect x="116" y="104" width="8" height="34" fill={D} />
      <ellipse cx="120" cy="140" rx="24" ry="6" fill={D} />
      <path d="M52 92 q-14 0 -14 22 v20 h14 z" fill={D} />
      <path d="M188 92 q14 0 14 22 v20 h-14 z" fill={D} />
      <rect x="70" y="52" width="8" height="42" rx="3" fill={GD} />
      <ellipse cx="82" cy="48" rx="16" ry="10" fill={G} />
    </svg>
  ),
  'tv-unitesi': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <ellipse cx="120" cy="152" rx="92" ry="8" fill={D} opacity="0.06" />
      <rect x="58" y="34" width="124" height="72" rx="7" fill={D} />
      <rect x="64" y="40" width="112" height="60" rx="4" fill={CR} />
      <path d="M96 100 h48 l6 10 h-60 z" fill={D} />
      <rect x="40" y="116" width="160" height="26" rx="6" fill={G} />
      <rect x="48" y="122" width="42" height="14" rx="3" fill={D} opacity="0.85" />
      <rect x="150" y="122" width="42" height="14" rx="3" fill={D} opacity="0.85" />
      <rect x="52" y="142" width="7" height="12" rx="2" fill={D} />
      <rect x="181" y="142" width="7" height="12" rx="2" fill={D} />
    </svg>
  ),
  'bebek-genc-odasi': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <ellipse cx="120" cy="154" rx="96" ry="8" fill={D} opacity="0.06" />
      <rect x="28" y="70" width="96" height="44" rx="10" fill={D} />
      <rect x="34" y="80" width="86" height="24" rx="6" fill={G} />
      <rect x="24" y="56" width="12" height="58" rx="4" fill={D} />
      <rect x="52" y="62" width="34" height="20" rx="6" fill={CR} />
      <rect x="24" y="114" width="8" height="18" rx="2" fill={D} />
      <rect x="116" y="114" width="8" height="18" rx="2" fill={D} />
      <rect x="146" y="96" width="66" height="10" rx="3" fill={D} />
      <rect x="150" y="106" width="8" height="28" rx="2" fill={D} />
      <rect x="200" y="106" width="8" height="28" rx="2" fill={D} />
      <rect x="168" y="60" width="30" height="36" rx="3" fill={G} />
      <circle cx="183" cy="52" r="8" fill={GD} />
    </svg>
  ),
  'masa-sandalye-set': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <ellipse cx="120" cy="156" rx="88" ry="8" fill={D} opacity="0.06" />
      <rect x="60" y="84" width="120" height="12" rx="4" fill={G} />
      <rect x="66" y="96" width="8" height="42" rx="2" fill={D} />
      <rect x="166" y="96" width="8" height="42" rx="2" fill={D} />
      <rect x="40" y="70" width="10" height="68" rx="3" fill={D} />
      <rect x="36" y="70" width="20" height="26" rx="6" fill={CR} stroke={D} strokeWidth="2" />
      <rect x="190" y="70" width="10" height="68" rx="3" fill={D} />
      <rect x="184" y="70" width="20" height="26" rx="6" fill={CR} stroke={D} strokeWidth="2" />
    </svg>
  ),
  'sehpa-aksesuar': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <ellipse cx="120" cy="150" rx="90" ry="8" fill={D} opacity="0.06" />
      <rect x="54" y="104" width="132" height="12" rx="4" fill={G} />
      <rect x="62" y="116" width="8" height="26" rx="2" fill={D} />
      <rect x="170" y="116" width="8" height="26" rx="2" fill={D} />
      <path d="M104 104 q-8 -34 6 -46 q14 12 6 46 z" fill={D} />
      <path d="M120 60 q10 -18 26 -20 q-6 16 -22 22 z" fill={G} />
      <path d="M118 62 q-8 -14 -22 -16 q4 12 18 18 z" fill={GD} />
      <rect x="128" y="90" width="26" height="16" rx="3" fill={D} opacity="0.85" />
    </svg>
  ),
};

const Fallback = (
  <svg viewBox="0 0 240 180" className="w-full h-full">
    <ellipse cx="120" cy="150" rx="80" ry="8" fill={D} opacity="0.06" />
    <rect x="66" y="70" width="108" height="50" rx="12" fill={D} />
    <rect x="74" y="80" width="92" height="30" rx="8" fill={G} />
  </svg>
);

export default function KategoriShowcase({ kategoriler = [], locale, kicker, title, titleEm, inspect }) {
  const liste = (kategoriler || []).filter((k) => k && k.slug);
  if (!liste.length) return null;

  return (
    <section className="container mx-auto py-8 md:py-14">
      <div className="text-center mb-8 md:mb-12">
        <p className="text-brand-accent font-medium tracking-widest uppercase text-xs sm:text-sm mb-2">
          {kicker}
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight">
          {title} <span className="italic text-brand-gold">{titleEm}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {liste.map((k) => {
          const ad = getLocalizedName(k, locale);
          return (
            <Link
              key={k.slug}
              href={`/kategori/${k.slug}`}
              aria-label={ad}
              className="group flex flex-col items-center"
            >
              {/* Damla/yuvarlatılmış kart */}
              <div className="relative w-full aspect-square rounded-[2rem] bg-white border border-brand-gold/25 shadow-card overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-card-h group-hover:border-brand-gold">
                {/* Krem zemin blob */}
                <div className="absolute inset-3 rounded-[1.6rem] bg-gradient-to-br from-brand-teallt to-white" />
                {/* İllüstrasyon */}
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-7">
                  {ILLO[k.slug] || Fallback}
                </div>
                {/* Alt altın şerit */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-70" />
              </div>
              {/* İsim + İncele */}
              <p className="mt-3 text-center text-sm md:text-base font-semibold uppercase tracking-wide text-brand-dark leading-snug group-hover:text-brand-teal2 transition-colors">
                {ad}
              </p>
              <span className="mt-0.5 text-[11px] md:text-xs text-brand-muted group-hover:text-brand-gold transition-colors">
                {inspect} →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
