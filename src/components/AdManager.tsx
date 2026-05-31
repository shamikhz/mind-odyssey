'use client';

import React from 'react';
import Script from 'next/script';
import { useGame } from '@/contexts/GameContext';

export default function AdManager() {
  const { state } = useGame();

  // If the user has purchased "Remove Ads", do not inject the AdSense script
  if (state.adsRemoved) {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8017926549395034"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
