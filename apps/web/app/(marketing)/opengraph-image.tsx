import { ImageResponse } from 'next/og';

import { site } from '@/content/site';
import { landing } from '@/content/landing';

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Server. Static at build: no request data. System fonts only (no font fetch at build). */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: '#0B1026',
        color: '#F3F1FA',
        fontFamily: 'Georgia, serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: '#EA5D9B',
            color: '#0B1026',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 600,
          }}
        >
          E
        </div>
        <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -0.5 }}>{site.name}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            fontSize: 22,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#F28BB8',
            fontFamily: 'sans-serif',
            fontWeight: 700,
          }}
        >
          {landing.hero.eyebrow}
        </div>
        <div
          style={{
            fontSize: 76,
            lineHeight: 1.08,
            fontWeight: 600,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {landing.hero.title}
        </div>
      </div>
      <div style={{ fontSize: 26, color: '#B7B3D1', fontFamily: 'sans-serif' }}>
        {landing.hero.launchLine}
      </div>
    </div>,
    size,
  );
}
