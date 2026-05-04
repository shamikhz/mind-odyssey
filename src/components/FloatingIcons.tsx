'use client';

import React, { useMemo } from 'react';

const icons = ['🧩', '🎯', '💡', '🔮', '⚡', '🎲', '🧠', '♟️', '🏆', '🔢', '✨', '🎨'];

export default function FloatingIcons() {
  const items = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      icon: icons[i % icons.length],
      left: `${Math.random() * 100}%`,
      size: `${1.2 + Math.random() * 1.5}rem`,
      duration: `${15 + Math.random() * 25}s`,
      delay: `${-Math.random() * 20}s`,
      opacity: 0.04 + Math.random() * 0.04,
    }))
  , []);

  return (
    <div className="floating-bg" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={i}
          className="floating-icon"
          style={{
            left: item.left,
            fontSize: item.size,
            animationDuration: item.duration,
            animationDelay: item.delay,
            opacity: item.opacity,
          }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}
