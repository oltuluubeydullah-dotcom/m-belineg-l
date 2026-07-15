# 🧪 Kanı Mobilya — Test Rehberi (v11.6)

> Şu an `package.json`'da `npm test` script'i YOK. Regression koruması için
> en azından kritik yardımcı fonksiyonların testi olmalı. Bu rehber Vitest
> ile hızlı bir başlangıç.

---

## 1) Vitest Kur

```bash
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

## 2) `vitest.config.js` ekle

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

## 3) `test/setup.js`

```javascript
import '@testing-library/jest-dom';
```

## 4) `package.json` script ekle

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 5) Öncelikli Test Kapsamı

### a) Admin email allowlist (v11.6 KRİTİK)
`test/auth/admin.test.js`:

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAdminEmail, isAdminUser } from '@/lib/auth/admin';

describe('isAdminEmail', () => {
  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'ali@x.com,veli@y.com';
  });

  it('allowlist email\'i kabul eder', () => {
    expect(isAdminEmail('ali@x.com')).toBe(true);
    expect(isAdminEmail('VELI@Y.COM')).toBe(true); // case-insensitive
  });

  it('allowlist dışı email\'i reddeder', () => {
    expect(isAdminEmail('attacker@evil.com')).toBe(false);
  });

  it('boş/null değerleri reddeder', () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail('')).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });
});

describe('isAdminUser', () => {
  it('email_confirmed_at olmadan reddeder', () => {
    expect(isAdminUser({ email: 'ali@x.com', email_confirmed_at: null })).toBe(false);
  });

  it('confirmed + allowlist\'te ise kabul eder', () => {
    expect(isAdminUser({
      email: 'ali@x.com',
      email_confirmed_at: '2026-01-01T00:00:00Z',
    })).toBe(true);
  });
});
```

### b) Türkçe locale tuzakları
`test/utils/locale.test.js`:

```javascript
import { describe, it, expect } from 'vitest';

describe('Türkçe lowercase tuzakları', () => {
  it('toLowerCase İ harfini bozar (regression engeli)', () => {
    const trBozuk = 'İSTANBUL'.toLowerCase();
    const trDogru = 'İSTANBUL'.toLocaleLowerCase('tr-TR');
    expect(trDogru).toBe('i̇stanbul'); // i + combining dot
    expect(trBozuk.length).not.toBe(trDogru.length);
    // Tüm kod toLocaleLowerCase('tr-TR') kullanmalı
  });
});
```

### c) Cart total recompute (server-side)
`test/api/inquiries.test.js`:

```javascript
import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/inquiries/route';

vi.mock('@/lib/supabase/service', () => ({
  getServiceClient: () => ({
    from: () => ({
      select: () => ({ in: () => Promise.resolve({ data: [
        { id: 'a', name: 'Test', slug: 't', base_price: 100, sale_price: null, is_on_sale: false, images: [] }
      ] }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'i1' }, error: null }) }) }),
    }),
  }),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: () => Promise.resolve({ ok: true }),
  getClientIP: () => '127.0.0.1',
}));

vi.mock('@/lib/profanity', () => ({
  kufurIceriyorMu: () => false,
}));

describe('POST /api/inquiries — price tampering guard', () => {
  it('Client fiyatı 0 attığında server gerçek fiyatla kayıt yapar', async () => {
    const req = new Request('http://localhost/api/inquiries', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'Test Müşteri',
        customer_phone: '5425165442',
        cart_items: [{ id: 'a', price: 0, qty: 2 }],  // Client tampered
      }),
      headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.total_estimate).toBe(200);  // 100 * 2 (server fiyatı)
    expect(json._meta?.tampering).toBe(true);  // Tespit edildi
  });
});
```

---

## 6) CI'da Çalıştır

`.github/workflows/test.yml`:

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run test:run
```

GitHub Actions → her push'ta otomatik koşar, hata varsa PR merge'i bloklar.

---

## 7) E2E (Playwright) — İleride

Playwright Vercel preview deploy'larına otomatik koşulabilir:

```bash
npm i -D @playwright/test
npx playwright install
```

Test örnek:
```javascript
test('Sepete ekle → checkout → WhatsApp aç', async ({ page }) => {
  await page.goto('https://kani-mobilya-preview.vercel.app');
  await page.click('text=Ürünleri Keşfet');
  await page.click('article:first-child');
  await page.click('button:has-text("Sepete Ekle")');
  // ...
});
```

---

## 8) Minimum Viable Test Kapsamı

Teslime kadar şu testler yazılmalı:
- ✅ `isAdminEmail` allowlist (KRİTİK)
- ✅ `checkoutDogrula` validator
- ⏳ Cart total server recompute
- ⏳ Profanity filter (false positive yok)
- ⏳ Image upload magic byte tespit (JPEG/PNG/HEIC ayırt)

5 test = ~30 dakika emek, gelecekte regression'ları yakalar.

---

**by ubivo — v11.6**
