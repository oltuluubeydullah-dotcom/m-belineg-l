// ════════════════════════════════════════════════════════════
// Admin — Şifre Değiştirme Bölümü
// ════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { IconLock, IconEye, IconEyeOff, IconCheck } from '@tabler/icons-react';

export default function SifreDegistir() {
  const supabase = getSupabaseClient();
  const [yeniSifre, setYeniSifre]     = useState('');
  const [tekrar, setTekrar]           = useState('');
  const [goster1, setGoster1]         = useState(false);
  const [goster2, setGoster2]         = useState(false);
  const [yukleniyor, setYukleniyor]   = useState(false);
  const [mesaj, setMesaj]             = useState(null); // {tip: 'ok'|'hata', text}

  async function handleSubmit(e) {
    e.preventDefault();
    setMesaj(null);

    if (yeniSifre.length < 8) {
      setMesaj({ tip: 'hata', text: 'Şifre en az 8 karakter olmalı.' });
      return;
    }
    if (yeniSifre !== tekrar) {
      setMesaj({ tip: 'hata', text: 'Şifreler eşleşmiyor.' });
      return;
    }

    setYukleniyor(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: yeniSifre });
      if (error) throw error;
      setMesaj({ tip: 'ok', text: 'Şifre başarıyla güncellendi.' });
      setYeniSifre('');
      setTekrar('');
    } catch (err) {
      setMesaj({ tip: 'hata', text: err.message || 'Şifre güncellenemedi.' });
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-subtle mt-6">
      <div className="flex items-center gap-2 mb-5">
        <IconLock size={20} className="text-brand-teal" />
        <h2 className="font-display text-lg font-semibold text-brand-dark">Şifre Değiştir</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        {/* Yeni şifre */}
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1.5">Yeni Şifre</label>
          <div className="relative">
            <input
              type={goster1 ? 'text' : 'password'}
              value={yeniSifre}
              onChange={e => setYeniSifre(e.target.value)}
              placeholder="En az 8 karakter"
              autoComplete="new-password"
              required
              className="w-full border border-brand-subtle rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
            />
            <button type="button" onClick={() => setGoster1(g => !g)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark">
              {goster1 ? <IconEyeOff size={18}/> : <IconEye size={18}/>}
            </button>
          </div>
        </div>

        {/* Tekrar */}
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1.5">Yeni Şifre (Tekrar)</label>
          <div className="relative">
            <input
              type={goster2 ? 'text' : 'password'}
              value={tekrar}
              onChange={e => setTekrar(e.target.value)}
              placeholder="Şifreyi tekrar girin"
              autoComplete="new-password"
              required
              className="w-full border border-brand-subtle rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
            />
            <button type="button" onClick={() => setGoster2(g => !g)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark">
              {goster2 ? <IconEyeOff size={18}/> : <IconEye size={18}/>}
            </button>
          </div>
        </div>

        {/* Mesaj */}
        {mesaj && (
          <div className={`text-sm px-4 py-2.5 rounded-xl ${
            mesaj.tip === 'ok'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {mesaj.tip === 'ok' && <IconCheck size={14} className="inline mr-1"/>}
            {mesaj.text}
          </div>
        )}

        <button
          type="submit"
          disabled={yukleniyor}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: '#FEC401' }}
        >
          {yukleniyor ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </button>
      </form>
    </div>
  );
}
