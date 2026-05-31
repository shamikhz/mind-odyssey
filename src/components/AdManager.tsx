'use client';

import { useGame } from '@/contexts/GameContext';
import Script from 'next/script';
import { useEffect } from 'react';

export default function AdManager() {
  const { state } = useGame();

  // If ads are removed, inject a style to hide any residual AdSense tags/placeholders
  useEffect(() => {
    if (state.adsRemoved) {
      const style = document.createElement('style');
      style.id = 'hide-ads-style';
      style.innerHTML = `
        .adsbygoogle { display: none !important; }
        ins.adsbygoogle { display: none !important; }
        google-auto-placed { display: none !important; }
        iframe[src*="ad-"] { display: none !important; }
        .ad-sidebar { display: none !important; }
      `;
      document.head.appendChild(style);
      
      return () => {
        const el = document.getElementById('hide-ads-style');
        if (el) el.remove();
      };
    }
  }, [state.adsRemoved]);

  // Don't load the script if ads are removed
  if (state.adsRemoved) return null;

  return (
    <Script
      id="adsense-script"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8017926549395034"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
