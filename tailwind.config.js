/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './context/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ════════════════════════════════════════════════════════════
        // Möbel İnegöl — Renk Sistemi (Altın Sarısı · Siyah · Beyaz)
        // Logo: Altın sarısı zemin (#FEC401) + Siyah serif "M!" (#1A1A1A)
        // Class adları (navy/gold/teal) korunur — değerler logodan alındı
        // ════════════════════════════════════════════════════════════
        brand: {
          // Ana renkler — logodaki siyah ve altın sarısı
          navy:   '#1A1A1A',  // Logo siyahı (header yazı, footer, aksan)
          gold:   '#FEC401',  // Logo altın sarısı (ana marka rengi)
          // Vurgu tonları (logo sarısı türevleri)
          teal:   '#FEC401',  // Ana vurgu, CTA, hover (logo sarısı)
          teal2:  '#D9A400',  // Koyu altın — hover durumu
          teallt: '#FFF6D6',  // Çok açık altın — section zemini
          // Nötr / zemin
          white:  '#FFFFFF',  // Saf beyaz (kart ve sayfa zemini)
          cream:  '#FAF8F3',  // Hafif krem (sayfa zemini)
          light:  '#FFF6D6',  // Açık altın (kategori kartı hover)
          // Yazı renkleri
          dark:   '#1A1A1A',  // Logo siyahı = koyu yazı (navy ile aynı)
          darker: '#111111',  // Daha derin hover
          ink:    '#2D2D2D',  // Gövde yazı (koyu gri)
          muted:  '#7A7A7A',  // İkincil yazı (açıklama, meta)
          subtle: '#E8E4DC',  // Border, divider
          // Eskiyle uyumluluk için takma adlar
          accent: '#FEC401',  // Eski accent → turkuaz
        },
        badge: {
          sale: '#E53E3E',    // İNDİRİM kırmızısı
        },
      },
      fontFamily: {
        display: ['Poppins', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        sans:    ['Poppins', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card':    '0 2px 12px rgba(10, 22, 40, 0.06)',
        'card-h':  '0 8px 28px rgba(254, 196, 1, 0.18)',
        'teal':    '0 4px 20px rgba(254, 196, 1, 0.35)',
        'gold':    '0 4px 16px rgba(254, 196, 1, 0.35)',
      },
      animation: {
        'fade-in':       'fadeIn 0.25s ease-out',
        'slide-up':      'slideUp 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
        'pulse-teal':    'pulseTeal 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseTeal: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          md: '2rem',
          lg: '3rem',
        },
      },
    },
  },
  plugins: [],
};
