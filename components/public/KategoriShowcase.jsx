// ════════════════════════════════════════════════════════════
// KategoriShowcase — Hero'nun hemen altı (v54 · premium illüstrasyon)
// ════════════════════════════════════════════════════════════
// Her kategori için özel çizim (SVG) illüstrasyon — Möbel İnegöl
// paleti: altın gradyan (#FFDE6E→#FEC401→#DE9E00) · kömür (#242424) ·
// krem highlight (#FFF3CC). Damla formunda kartlar, kategori sayfasına link.
// ════════════════════════════════════════════════════════════

import { Link } from '@/lib/i18n/navigation';
import { getLocalizedName } from '@/lib/i18n/auto-translate';

// Ortak degrade tanımı (her illüstrasyonda benzersiz id ile çağrılır)
function Golds({ id }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFDF74" />
        <stop offset="0.55" stopColor="#FEC401" />
        <stop offset="1" stopColor="#DE9E00" />
      </linearGradient>
    </defs>
  );
}

const CH = '#242424';   // kömür (frame)
const CH2 = '#161616';  // derin
const HL = '#FFF3CC';   // krem highlight
const SURF = '#FFFBF0'; // krem yüzey
const SEAM = '#C88E00'; // dikiş/koyu altın
const SH = '#1A1A1A';   // gölge

const shadow = (cx, rx) => <ellipse cx={cx} cy="152" rx={rx} ry="9" fill={SH} opacity="0.07" />;

const ILLO = {
  'koltuk-takimi': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <Golds id="g-koltuk" />
      {shadow(120, 94)}
      <rect x="40" y="50" width="160" height="50" rx="18" fill={CH} />
      <rect x="54" y="58" width="60" height="36" rx="11" fill="url(#g-koltuk)" />
      <rect x="126" y="58" width="60" height="36" rx="11" fill="url(#g-koltuk)" />
      <path d="M60 65 q26 -5 48 0" stroke={HL} strokeWidth="2.5" fill="none" opacity="0.55" />
      <rect x="30" y="66" width="24" height="60" rx="12" fill={CH} />
      <rect x="186" y="66" width="24" height="60" rx="12" fill={CH} />
      <rect x="35" y="70" width="6" height="48" rx="3" fill={CH2} opacity="0.5" />
      <rect x="48" y="92" width="144" height="38" rx="13" fill="url(#g-koltuk)" />
      <line x1="96" y1="96" x2="96" y2="126" stroke={SEAM} strokeWidth="3" />
      <line x1="144" y1="96" x2="144" y2="126" stroke={SEAM} strokeWidth="3" />
      <path d="M58 100 q40 -5 78 0" stroke={HL} strokeWidth="2.5" fill="none" opacity="0.5" />
      <path d="M58 130 l-4 14 h9 z" fill={CH} />
      <path d="M182 130 l4 14 h-9 z" fill={CH} />
    </svg>
  ),
  'kose-koltuk': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <Golds id="g-kose" />
      {shadow(124, 98)}
      <rect x="32" y="56" width="118" height="46" rx="16" fill={CH} />
      <rect x="150" y="56" width="58" height="88" rx="16" fill={CH} />
      <rect x="24" y="70" width="22" height="58" rx="11" fill={CH} />
      <rect x="44" y="64" width="50" height="32" rx="9" fill="url(#g-kose)" />
      <rect x="98" y="64" width="50" height="32" rx="9" fill="url(#g-kose)" />
      <rect x="42" y="94" width="108" height="34" rx="11" fill="url(#g-kose)" />
      <rect x="152" y="96" width="52" height="48" rx="11" fill="url(#g-kose)" />
      <line x1="96" y1="98" x2="96" y2="124" stroke={SEAM} strokeWidth="3" />
      <path d="M50 102 q34 -4 66 0" stroke={HL} strokeWidth="2.5" fill="none" opacity="0.5" />
      <path d="M50 128 l-4 14 h9 z" fill={CH} />
      <path d="M136 128 l4 14 h-9 z" fill={CH} />
      <path d="M188 144 l4 13 h-9 z" fill={CH} />
    </svg>
  ),
  'yatak-odasi': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <Golds id="g-yatak" />
      {shadow(112, 96)}
      <rect x="30" y="42" width="132" height="54" rx="16" fill={CH} />
      <rect x="42" y="52" width="52" height="34" rx="10" fill={CH2} opacity="0.5" />
      <rect x="98" y="52" width="52" height="34" rx="10" fill={CH2} opacity="0.5" />
      <rect x="44" y="82" width="104" height="26" rx="8" fill={SURF} stroke={CH} strokeWidth="2.5" />
      <rect x="52" y="66" width="42" height="24" rx="8" fill={SURF} />
      <rect x="100" y="66" width="42" height="24" rx="8" fill={SURF} />
      <path d="M24 100 h150 v14 q0 8 -8 8 h-134 q-8 0 -8 -8 z" fill="url(#g-yatak)" />
      <path d="M24 106 q75 -8 150 0" stroke={HL} strokeWidth="2.5" fill="none" opacity="0.5" />
      <rect x="30" y="120" width="8" height="20" rx="2" fill={CH} />
      <rect x="160" y="120" width="8" height="20" rx="2" fill={CH} />
      <rect x="176" y="92" width="32" height="30" rx="5" fill={CH} />
      <rect x="182" y="118" width="6" height="14" rx="2" fill={CH} />
      <rect x="196" y="118" width="6" height="14" rx="2" fill={CH} />
      <circle cx="192" cy="80" r="8" fill="url(#g-yatak)" />
      <rect x="190" y="80" width="4" height="14" fill={CH} />
    </svg>
  ),
  'yemek-odasi': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <Golds id="g-yemek" />
      {shadow(120, 88)}
      <path d="M48 88 q-16 2 -18 26 v18 h16 v-16 q0 -14 14 -18 z" fill={CH} />
      <path d="M192 88 q16 2 18 26 v18 h-16 v-16 q0 -14 -14 -18 z" fill={CH} />
      <ellipse cx="120" cy="98" rx="76" ry="17" fill="url(#g-yemek)" />
      <ellipse cx="120" cy="93" rx="76" ry="17" fill={SURF} stroke={CH} strokeWidth="2.5" />
      <path d="M60 90 q60 -9 120 0" stroke={HL} strokeWidth="2.5" fill="none" opacity="0.6" />
      <rect x="115" y="106" width="10" height="30" fill={CH} />
      <ellipse cx="120" cy="138" rx="26" ry="6" fill={CH} />
      <rect x="72" y="52" width="8" height="44" rx="3" fill={SEAM} />
      <path d="M84 46 q10 -16 26 -16 q-4 16 -22 22 z" fill="url(#g-yemek)" />
      <path d="M80 48 q-10 -12 -24 -12 q4 12 20 16 z" fill={SEAM} />
    </svg>
  ),
  'tv-unitesi': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <Golds id="g-tv" />
      {shadow(120, 92)}
      <rect x="56" y="30" width="128" height="74" rx="8" fill={CH} />
      <rect x="62" y="36" width="116" height="62" rx="4" fill={SURF} />
      <path d="M62 40 l70 30 M62 60 l40 34" stroke="#FFE9A8" strokeWidth="3" opacity="0.5" />
      <path d="M96 100 h48 l7 12 h-62 z" fill={CH} />
      <rect x="38" y="116" width="164" height="28" rx="7" fill="url(#g-tv)" />
      <path d="M46 121 q74 -4 148 0" stroke={HL} strokeWidth="2.5" fill="none" opacity="0.5" />
      <rect x="48" y="123" width="44" height="14" rx="3" fill={CH} opacity="0.85" />
      <rect x="148" y="123" width="44" height="14" rx="3" fill={CH} opacity="0.85" />
      <path d="M52 144 l-3 12 h8 z" fill={CH} />
      <path d="M188 144 l3 12 h-8 z" fill={CH} />
    </svg>
  ),
  'bebek-genc-odasi': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <Golds id="g-genc" />
      {shadow(120, 98)}
      <rect x="22" y="54" width="12" height="60" rx="4" fill={CH} />
      <rect x="26" y="70" width="88" height="16" rx="6" fill={CH} />
      <rect x="34" y="82" width="86" height="24" rx="7" fill="url(#g-genc)" />
      <path d="M40 88 q40 -5 72 0" stroke={HL} strokeWidth="2" fill="none" opacity="0.5" />
      <rect x="42" y="62" width="34" height="20" rx="7" fill={SURF} />
      <rect x="22" y="106" width="8" height="18" rx="2" fill={CH} />
      <rect x="112" y="106" width="8" height="18" rx="2" fill={CH} />
      <rect x="146" y="94" width="66" height="9" rx="3" fill="url(#g-genc)" />
      <rect x="150" y="103" width="8" height="26" rx="2" fill={CH} />
      <rect x="200" y="103" width="8" height="26" rx="2" fill={CH} />
      <rect x="166" y="58" width="30" height="36" rx="4" fill={CH} />
      <circle cx="181" cy="52" r="8" fill="url(#g-genc)" />
      <rect x="179" y="52" width="4" height="8" fill={CH} />
    </svg>
  ),
  'masa-sandalye-set': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <Golds id="g-masa" />
      {shadow(120, 88)}
      <rect x="58" y="80" width="124" height="14" rx="5" fill="url(#g-masa)" />
      <path d="M66 82 q54 -4 108 0" stroke={HL} strokeWidth="2" fill="none" opacity="0.5" />
      <rect x="66" y="94" width="8" height="44" rx="2" fill={CH} />
      <rect x="166" y="94" width="8" height="44" rx="2" fill={CH} />
      <rect x="38" y="66" width="20" height="30" rx="7" fill="url(#g-masa)" />
      <rect x="40" y="94" width="8" height="44" rx="2" fill={CH} />
      <rect x="54" y="94" width="8" height="44" rx="2" fill={CH} />
      <rect x="182" y="66" width="20" height="30" rx="7" fill="url(#g-masa)" />
      <rect x="192" y="94" width="8" height="44" rx="2" fill={CH} />
      <rect x="178" y="94" width="8" height="44" rx="2" fill={CH} />
    </svg>
  ),
  'sehpa-aksesuar': (
    <svg viewBox="0 0 240 180" className="w-full h-full">
      <Golds id="g-sehpa" />
      {shadow(120, 90)}
      <rect x="52" y="102" width="136" height="15" rx="5" fill="url(#g-sehpa)" />
      <path d="M60 105 q60 -4 120 0" stroke={HL} strokeWidth="2" fill="none" opacity="0.5" />
      <rect x="62" y="117" width="8" height="26" rx="2" fill={CH} />
      <rect x="170" y="117" width="8" height="26" rx="2" fill={CH} />
      <path d="M150 92 h26 v10 h-26 z" fill={CH} opacity="0.85" />
      <path d="M104 102 q-9 -36 6 -50 q15 14 6 50 z" fill={CH} />
      <path d="M122 58 q11 -20 28 -22 q-6 18 -24 24 z" fill="url(#g-sehpa)" />
      <path d="M118 60 q-9 -15 -24 -17 q4 13 20 19 z" fill={SEAM} />
      <path d="M120 60 q1 -14 2 -22" stroke={CH} strokeWidth="2.5" fill="none" />
    </svg>
  ),
};

const Fallback = (
  <svg viewBox="0 0 240 180" className="w-full h-full">
    <Golds id="g-fb" />
    {shadow(120, 80)}
    <rect x="64" y="66" width="112" height="52" rx="14" fill={CH} />
    <rect x="72" y="78" width="96" height="30" rx="9" fill="url(#g-fb)" />
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
        <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">
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
              <div className="relative w-full aspect-square rounded-[2rem] bg-white border border-brand-gold/25 shadow-card overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-card-h group-hover:border-brand-gold">
                <div className="absolute inset-3 rounded-[1.6rem] bg-gradient-to-br from-brand-teallt via-white to-white" />
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-7">
                  {ILLO[k.slug] || Fallback}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-70" />
              </div>
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
