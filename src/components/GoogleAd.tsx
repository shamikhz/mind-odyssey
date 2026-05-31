'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface GoogleAdProps {
  client: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
}

export default function GoogleAd({
  client,
  slot,
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
}: GoogleAdProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        // Only push if there are ads on the page that haven't been filled
        const unpushedAds = document.querySelectorAll('ins.adsbygoogle:not([data-ad-status="filled"])');
        if (unpushedAds.length > 0) {
          adsbygoogle.push({});
        }
      }
    } catch (err) {
      console.error('Google Ads push error:', err);
    }
  }, [pathname]);

  return (
    <div className="ad-container my-md flex justify-center items-center">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
