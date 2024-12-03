'use client';

import { useEffect } from 'react';

export default function ClientWrapper({ children }) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      console.log('Telegram WebApp initialized:', tg.initDataUnsafe);
    } else {
      console.warn('Telegram WebApp SDK not detected.');
    }
  }, []);

  return <>{children}</>;
}
