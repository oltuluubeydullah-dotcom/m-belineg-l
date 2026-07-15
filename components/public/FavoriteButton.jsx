// ════════════════════════════════════════════════════════════
// FavoriteButton — Ürün kartında kalp ikonu
// Session bazlı, DB'ye kaydeder, admin panelde görünür
// ════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';

function getSessionId() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  let sid = localStorage.getItem('mobel_sid');
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem('mobel_sid', sid);
  }
  return sid;
}

export default function FavoriteButton({ productId, initialCount = 0, className = '' }) {
  const [isFav, setIsFav] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sid = getSessionId();
    if (!sid) return;
    fetch(`/api/favorite?sessionId=${sid}`)
      .then(r => r.json())
      .then(({ favorites }) => {
        if (favorites?.includes(productId)) setIsFav(true);
      })
      .catch(() => {});
  }, [productId]);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    const sid = getSessionId();
    try {
      const res = await fetch('/api/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, sessionId: sid }),
      });
      const data = await res.json();
      if (data.ok) {
        setIsFav(data.action === 'added');
        setCount(c => data.action === 'added' ? c + 1 : Math.max(0, c - 1));
      }
    } catch {}
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      className={`flex items-center gap-1 transition-all ${loading ? 'opacity-50' : 'hover:scale-110'} ${className}`}
    >
      {isFav
        ? <IconHeartFilled size={20} className="text-red-500" />
        : <IconHeart size={20} className="text-brand-ink/40 hover:text-red-400" />
      }
      {count > 0 && (
        <span className="text-xs text-brand-ink/50">{count}</span>
      )}
    </button>
  );
}
