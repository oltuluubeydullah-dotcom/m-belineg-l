// ════════════════════════════════════════════════════════════
// Toast Context — Bildirim sistemi
// ════════════════════════════════════════════════════════════
// Başarı/hata/uyarı mesajları sağ üstte 3 sn göründükten sonra kaybolur.
// Kullanım: const { goster } = useToast(); goster('Kaydedildi', 'basari');
// ════════════════════════════════════════════════════════════

'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';

const ToastContext = createContext(null);

const TIPLER = {
  basari:  { renk: 'bg-green-500',  icon: IconCheck },
  hata:    { renk: 'bg-red-500',    icon: IconX },
  uyari:   { renk: 'bg-amber-500',  icon: IconAlertTriangle },
  bilgi:   { renk: 'bg-blue-500',   icon: IconInfoCircle },
};

export function ToastProvider({ children }) {
  const [toastlar, setToastlar] = useState([]);

  const goster = useCallback((mesaj, tip = 'bilgi', sure = 3000) => {
    const id = Date.now() + Math.random();
    setToastlar((mevcut) => [...mevcut, { id, mesaj, tip }]);
    setTimeout(() => {
      setToastlar((mevcut) => mevcut.filter((t) => t.id !== id));
    }, sure);
  }, []);

  const kapat = useCallback((id) => {
    setToastlar((mevcut) => mevcut.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ goster }}>
      {children}

      {/* Toast container — sağ üst köşede stack */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toastlar.map((t) => {
          const stil = TIPLER[t.tip] || TIPLER.bilgi;
          const Icon = stil.icon;
          return (
            <div
              key={t.id}
              className={`${stil.renk} text-white px-4 py-3 rounded-xl shadow-card-h
                          flex items-start gap-3 animate-slide-up cursor-pointer
                          hover:opacity-90 transition-opacity`}
              onClick={() => kapat(t.id)}
            >
              <Icon size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium flex-1">{t.mesaj}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast sadece <ToastProvider> içinde kullanılabilir.');
  }
  return ctx;
}
