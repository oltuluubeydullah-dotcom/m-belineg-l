'use client';

const BADGES = [
  {
    label: 'Nakit Ödemede İndirim',
    // Sarı daire içinde % ikonu
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="32" fill="#FEC401"/>
        <circle cx="32" cy="32" r="28" fill="#D9A400"/>
        <text x="32" y="42" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white" fontFamily="Arial">%</text>
      </svg>
    ),
    outerRing: '#F0DFAE',
    outerBg:   '#FFF6D6',
  },
  {
    label: 'Kredi Kartına Taksit İmkânı',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="32" fill="#1A1A1A"/>
        <rect x="12" y="20" width="40" height="26" rx="4" fill="white" opacity="0.95"/>
        <rect x="12" y="28" width="40" height="7" fill="#1A1A1A"/>
        <rect x="16" y="38" width="10" height="4" rx="1" fill="#FEC401"/>
        <rect x="28" y="38" width="6" height="4" rx="1" fill="#D9A400"/>
      </svg>
    ),
    outerRing: '#D9D9D9',
    outerBg:   '#FAFAFA',
  },
  {
    label: 'Hızlı Servis Ağı',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="32" fill="#FEC401"/>
        <rect x="8" y="24" width="36" height="20" rx="3" fill="white" opacity="0.95"/>
        <rect x="8" y="24" width="36" height="8" rx="3" fill="#1A1A1A" opacity="0.35"/>
        <circle cx="18" cy="47" r="5" fill="white" stroke="#1A1A1A" strokeWidth="2"/>
        <circle cx="36" cy="47" r="5" fill="white" stroke="#1A1A1A" strokeWidth="2"/>
        <polygon points="44,28 56,34 56,40 44,40" fill="white" opacity="0.9"/>
        <line x1="13" y1="30" x2="30" y2="30" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
        <line x1="13" y1="35" x2="25" y2="35" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    outerRing: '#F0DFAE',
    outerBg:   '#FFF6D6',
  },
  {
    label: 'Anında İletişim',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="32" fill="#1A1A1A"/>
        {/* Avatar — baş */}
        <circle cx="32" cy="22" r="10" fill="white" opacity="0.95"/>
        {/* Avatar — gövde */}
        <path d="M14 54 Q14 40 32 40 Q50 40 50 54" fill="white" opacity="0.95"/>
        {/* Kulaklık */}
        <path d="M18 22 Q18 8 32 8 Q46 8 46 22" fill="none" stroke="white" strokeWidth="3" opacity="0.7"/>
        <rect x="14" y="20" width="6" height="10" rx="3" fill="#FEC401"/>
        <rect x="44" y="20" width="6" height="10" rx="3" fill="#FEC401"/>
      </svg>
    ),
    outerRing: '#D9D9D9',
    outerBg:   '#FAFAFA',
  },
];

export default function TrustBadges() {
  return (
    <section
      className="w-full py-10 md:py-14"
      style={{
        background:
          'linear-gradient(135deg, #FEC401 0%, #D9A400 100%)',
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {BADGES.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center group">
              {/* Dış halka — beyaz zemin, turkuaz üstünde belirgin */}
              <div
                className="relative mb-4 p-3 rounded-full transition-transform group-hover:scale-105 bg-white/95"
                style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.35)' }}
              >
                {/* İkon — 60x60 */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-md">
                  {icon}
                </div>
                {/* Ripple animasyon halkası */}
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 scale-100 group-hover:scale-125 transition-all duration-500"
                  style={{ boxShadow: '0 0 0 4px rgba(255,255,255,0.5)' }}
                />
              </div>
              <p className="text-sm md:text-base font-semibold text-white leading-snug px-2 drop-shadow-sm">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
