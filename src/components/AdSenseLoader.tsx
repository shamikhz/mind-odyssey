'use client';
import { useGame } from '@/contexts/GameContext';
import Script from 'next/script';
import { useEffect } from 'react';

export default function AdSenseLoader() {
  const { state } = useGame();

  useEffect(() => {
    if (state.adsRemoved) {
      document.body.classList.add('ads-removed');
    } else {
      document.body.classList.remove('ads-removed');
    }
  }, [state.adsRemoved]);

  if (state.adsRemoved) return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8017926549395034"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
