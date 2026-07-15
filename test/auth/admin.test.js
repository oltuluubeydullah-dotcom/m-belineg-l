// ════════════════════════════════════════════════════════════
// Admin Email Allowlist Tests (KRİTİK — v11.6 güvenlik patch'i)
// ════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isAdminEmail, isAdminUser, getAdminEmails } from '@/lib/auth/admin';

describe('getAdminEmails', () => {
  const orig = process.env.ADMIN_EMAILS;
  afterEach(() => { process.env.ADMIN_EMAILS = orig; });

  it('virgülle ayrılmış listeyi parse eder', () => {
    process.env.ADMIN_EMAILS = 'a@x.com, b@y.com ,c@z.com';
    expect(getAdminEmails()).toEqual(['a@x.com', 'b@y.com', 'c@z.com']);
  });

  it('lowercase\'e çevirir', () => {
    process.env.ADMIN_EMAILS = 'ALI@X.COM';
    expect(getAdminEmails()).toEqual(['ali@x.com']);
  });

  it('boş env\'de BOŞ liste döner (güvenli — hardcoded admin yok)', () => {
    delete process.env.ADMIN_EMAILS;
    const list = getAdminEmails();
    expect(list).toEqual([]);
  });
});

describe('isAdminEmail', () => {
  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'ali@x.com,veli@y.com';
  });

  it('allowlist içindeki email\'i kabul eder', () => {
    expect(isAdminEmail('ali@x.com')).toBe(true);
    expect(isAdminEmail('veli@y.com')).toBe(true);
  });

  it('case-insensitive karşılaştırır', () => {
    expect(isAdminEmail('ALI@X.COM')).toBe(true);
    expect(isAdminEmail('Veli@Y.com')).toBe(true);
  });

  it('boşluk trim eder', () => {
    expect(isAdminEmail('  ali@x.com  ')).toBe(true);
  });

  it('allowlist dışı email\'i reddeder', () => {
    expect(isAdminEmail('attacker@evil.com')).toBe(false);
  });

  it('null/undefined/boş reddeder', () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail('')).toBe(false);
    expect(isAdminEmail('   ')).toBe(false);
  });

  it('string olmayan tip reddeder', () => {
    expect(isAdminEmail(123)).toBe(false);
    expect(isAdminEmail({})).toBe(false);
  });
});

describe('isAdminUser (Supabase user objesi)', () => {
  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'ali@x.com';
  });

  it('email_confirmed_at YOK ise reddeder (signup spam koruması)', () => {
    expect(isAdminUser({
      email: 'ali@x.com',
      email_confirmed_at: null,
    })).toBe(false);
  });

  it('email_confirmed_at + allowlist email kabul eder', () => {
    expect(isAdminUser({
      email: 'ali@x.com',
      email_confirmed_at: '2026-01-01T00:00:00Z',
    })).toBe(true);
  });

  it('email_confirmed_at var ama allowlist DIŞI reddeder', () => {
    expect(isAdminUser({
      email: 'attacker@evil.com',
      email_confirmed_at: '2026-01-01T00:00:00Z',
    })).toBe(false);
  });

  it('user null/undefined reddeder', () => {
    expect(isAdminUser(null)).toBe(false);
    expect(isAdminUser(undefined)).toBe(false);
    expect(isAdminUser({})).toBe(false);
  });
});
