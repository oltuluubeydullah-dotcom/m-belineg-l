// ════════════════════════════════════════════════════════════
// Global Error — Root layout bile çalışmazsa devreye girer
// ════════════════════════════════════════════════════════════
// Bu dosya kendi <html> ve <body>'sini sağlamalı.
// ════════════════════════════════════════════════════════════

'use client';

export default function GlobalError({ error: _error, reset }) {
  return (
    <html lang="tr">
      <body style={{
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#FAF7F2',
        color: '#1A1A1A',
        margin: 0,
        padding: '4rem 1rem',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '1.875rem',
            marginBottom: '0.5rem',
            color: '#0F1B2D',
            fontWeight: 600,
          }}>
            Sistem hatası
          </h1>
          <p style={{ color: 'rgba(26,26,26,0.7)', marginBottom: '2rem' }}>
            Site geçici olarak erişilemiyor. Lütfen birkaç dakika sonra tekrar deneyin.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#0F1B2D',
              color: '#FAF7F2',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
