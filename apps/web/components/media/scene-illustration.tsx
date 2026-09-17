import type { SceneId } from '@/content/images';

import { cn } from '@ethanel/ui/lib/cn';

/**
 * Server. Brand illustrations in the Ethanel palette, drawn as inline SVG so every image slot has
 * a finished fallback with no network. Decorative unless `label` is given.
 */
const P = {
  navy950: '#0B1026',
  navy900: '#131A3A',
  navy800: '#1D2650',
  navy700: '#283472',
  iris700: '#5A48B8',
  iris600: '#6C5BC9',
  iris200: '#D9D2F5',
  iris100: '#E9E5FA',
  iris50: '#F4F2FC',
  pink700: '#B3286A',
  pink500: '#EA5D9B',
  pink400: '#F28BB8',
  pink200: '#F9C6DC',
  pink100: '#FCE4EF',
  mist100: '#EFEDF6',
  mist200: '#E0DDEB',
  mist300: '#C9C5D8',
  mist500: '#6F6A85',
  ink: '#14122B',
  frost: '#F3F1FA',
  teal: '#2E9E74',
  teal100: '#E3F5EC',
  mpesa: '#3EB54A',
  whatsapp: '#25D366',
} as const;

function Sky({ dark = false }: { dark?: boolean }) {
  return (
    <>
      <rect width="400" height="300" fill={dark ? P.navy900 : P.iris50} />
      <circle cx="330" cy="62" r="26" fill={dark ? P.pink400 : P.pink200} />
      <path
        d="M0 226 C90 200 150 240 220 218 S330 196 400 214 V300 H0Z"
        fill={dark ? P.navy800 : P.iris100}
      />
    </>
  );
}

function Person({
  x,
  y,
  tone,
  dark = false,
}: {
  x: number;
  y: number;
  tone: string;
  dark?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="-34" r="14" fill={dark ? P.frost : P.ink} opacity={dark ? 0.9 : 0.85} />
      <path d="M-22 40 C-22 6 -14 -6 0 -6 S22 6 22 40Z" fill={tone} />
    </g>
  );
}

function scene(id: SceneId, initials?: string) {
  switch (id) {
    case 'letting-office':
    case 'rentals':
      return (
        <>
          <Sky />
          <rect x="60" y="86" width="120" height="150" rx="6" fill={P.navy800} />
          <rect x="196" y="120" width="84" height="116" rx="6" fill={P.iris700} />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={74 + c * 34}
                y={100 + r * 32}
                width="20"
                height="18"
                rx="2"
                fill={P.pink200}
              />
            )),
          )}
          {[0, 1, 2].map((r) => (
            <rect key={r} x="212" y={134 + r * 30} width="52" height="16" rx="2" fill={P.iris200} />
          ))}
          <rect x="296" y="160" width="60" height="76" rx="6" fill={P.pink500} />
          <rect x="310" y="176" width="32" height="10" rx="2" fill={P.navy950} />
          <rect x="310" y="196" width="32" height="10" rx="2" fill={P.navy950} />
          <rect x="0" y="236" width="400" height="64" fill={P.mist200} />
        </>
      );
    case 'for-sale':
      return (
        <>
          <Sky />
          <path
            d="M120 150 L200 90 L280 150 V236 H120Z"
            fill={P.pink100}
            stroke={P.pink500}
            strokeWidth="6"
          />
          <rect x="182" y="176" width="36" height="60" fill={P.pink500} />
          <rect x="140" y="170" width="30" height="26" rx="2" fill={P.iris200} />
          <rect x="230" y="170" width="30" height="26" rx="2" fill={P.iris200} />
          <rect x="0" y="236" width="400" height="64" fill={P.mist200} />
        </>
      );
    case 'land':
    case 'land-site-visit':
      return (
        <>
          <Sky />
          <path d="M0 236 L400 236 L400 300 L0 300Z" fill={P.teal100} />
          <path d="M40 236 L360 236" stroke={P.teal} strokeWidth="3" strokeDasharray="10 8" />
          {[70, 170, 270].map((x) => (
            <g key={x}>
              <rect x={x} y="180" width="8" height="56" fill={P.navy800} />
              <rect x={x - 4} y="172" width="16" height="14" rx="2" fill={P.pink500} />
            </g>
          ))}
          <Person x={330} y={230} tone={P.iris700} />
        </>
      );
    case 'lease-land':
      return (
        <>
          <Sky />
          <path d="M0 236 L400 236 L400 300 L0 300Z" fill={P.teal100} />
          {[40, 100, 160, 220, 280, 340].map((x) => (
            <path key={x} d={`M${x} 236 q10 -40 20 0`} fill={P.teal} />
          ))}
          <rect x="250" y="150" width="90" height="70" rx="6" fill={P.navy800} />
          <rect x="262" y="164" width="66" height="10" rx="2" fill={P.iris200} />
          <rect x="262" y="184" width="40" height="10" rx="2" fill={P.pink400} />
        </>
      );
    case 'landlord':
      return (
        <>
          <Sky />
          <rect x="220" y="80" width="150" height="156" rx="8" fill={P.navy800} />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={236 + c * 42}
                y={96 + r * 42}
                width="26"
                height="26"
                rx="3"
                fill={P.pink200}
              />
            )),
          )}
          <Person x={120} y={230} tone={P.iris700} />
          <rect
            x="52"
            y="150"
            width="88"
            height="60"
            rx="6"
            fill={P.frost}
            stroke={P.mist200}
            strokeWidth="2"
          />
          <rect x="62" y="160" width="60" height="6" rx="3" fill={P.ink} />
          <rect x="62" y="174" width="44" height="6" rx="3" fill={P.mist300} />
          <rect x="62" y="188" width="68" height="6" rx="3" fill={P.teal} />
          <rect x="0" y="236" width="400" height="64" fill={P.mist200} />
        </>
      );
    case 'caretaker':
      return (
        <>
          <Sky />
          <rect x="40" y="100" width="200" height="136" rx="6" fill={P.navy800} />
          <rect x="60" y="120" width="60" height="44" rx="3" fill={P.iris200} />
          <rect x="140" y="120" width="60" height="44" rx="3" fill={P.iris200} />
          <rect x="60" y="180" width="60" height="44" rx="3" fill={P.pink200} />
          <rect x="140" y="180" width="60" height="56" rx="3" fill={P.pink500} />
          <Person x={300} y={230} tone={P.pink500} />
          <rect x="318" y="150" width="34" height="58" rx="6" fill={P.ink} />
          <rect x="324" y="158" width="22" height="34" rx="2" fill={P.whatsapp} />
          <rect x="0" y="236" width="400" height="64" fill={P.mist200} />
        </>
      );
    case 'residents':
      return (
        <>
          <Sky />
          <rect x="120" y="70" width="160" height="166" rx="8" fill={P.iris700} />
          {[0, 1, 2, 3].map((r) => (
            <rect key={r} x="140" y={88 + r * 38} width="120" height="22" rx="3" fill={P.iris200} />
          ))}
          <Person x={70} y={230} tone={P.pink500} />
          <Person x={330} y={230} tone={P.teal} />
          <rect
            x="20"
            y="130"
            width="70"
            height="40"
            rx="10"
            fill={P.frost}
            stroke={P.mist200}
            strokeWidth="2"
          />
          <rect x="30" y="142" width="36" height="6" rx="3" fill={P.whatsapp} />
          <rect x="30" y="154" width="50" height="6" rx="3" fill={P.mist300} />
          <rect x="0" y="236" width="400" height="64" fill={P.mist200} />
        </>
      );
    case 'kiambu-hills':
      return (
        <>
          <rect width="400" height="300" fill={P.iris50} />
          <circle cx="90" cy="70" r="30" fill={P.pink200} />
          <path d="M0 200 C80 140 140 150 220 190 S330 170 400 130 V300 H0Z" fill={P.teal100} />
          <path
            d="M0 240 C90 200 170 220 250 240 S350 250 400 220 V300 H0Z"
            fill={P.teal}
            opacity="0.55"
          />
          {[60, 130, 200, 270, 340].map((x, i) => (
            <path key={x} d={`M${x} ${262 - (i % 2) * 8} q12 -30 24 0`} fill={P.teal} />
          ))}
          <rect x="290" y="176" width="40" height="30" rx="3" fill={P.frost} />
          <path d="M286 178 L310 160 L334 178Z" fill={P.pink500} />
        </>
      );
    case 'founders':
      return (
        <>
          <Sky />
          <rect x="60" y="150" width="280" height="24" rx="6" fill={P.navy800} />
          <rect
            x="120"
            y="120"
            width="160"
            height="30"
            rx="4"
            fill={P.frost}
            stroke={P.mist200}
            strokeWidth="2"
          />
          <rect x="132" y="130" width="90" height="5" rx="2" fill={P.ink} />
          <rect x="132" y="139" width="60" height="5" rx="2" fill={P.pink500} />
          <Person x={100} y={230} tone={P.iris700} />
          <Person x={300} y={230} tone={P.pink500} />
          <rect x="0" y="236" width="400" height="64" fill={P.mist200} />
        </>
      );
    case 'portrait':
      return (
        <>
          <rect width="400" height="300" fill={P.iris100} />
          <circle cx="200" cy="150" r="96" fill={P.iris200} />
          <text
            x="200"
            y="168"
            textAnchor="middle"
            fontFamily="Fraunces, Georgia, serif"
            fontWeight="600"
            fontSize="64"
            fill={P.iris700}
          >
            {initials ?? '·'}
          </text>
        </>
      );
    case 'press':
      return (
        <>
          <rect width="400" height="300" fill={P.navy950} />
          <rect x="60" y="80" width="140" height="140" rx="30" fill={P.pink500} />
          <text
            x="130"
            y="176"
            textAnchor="middle"
            fontFamily="Fraunces, Georgia, serif"
            fontWeight="600"
            fontSize="96"
            fill={P.navy950}
          >
            E
          </text>
          {[P.iris700, P.pink500, P.teal, P.frost].map((c, i) => (
            <rect key={c} x={230} y={84 + i * 34} width="110" height="24" rx="6" fill={c} />
          ))}
        </>
      );
    case 'careers':
      return (
        <>
          <Sky dark />
          <rect x="50" y="150" width="300" height="20" rx="6" fill={P.navy700} />
          {[100, 200, 300].map((x, i) => (
            <Person
              key={x}
              x={x}
              y={230}
              tone={[P.iris600, P.pink500, P.teal][i] ?? P.iris600}
              dark
            />
          ))}
          <rect x="70" y="112" width="80" height="40" rx="4" fill={P.frost} />
          <rect x="250" y="112" width="80" height="40" rx="4" fill={P.frost} />
          <rect x="80" y="122" width="56" height="5" rx="2" fill={P.ink} />
          <rect x="260" y="122" width="40" height="5" rx="2" fill={P.pink700} />
        </>
      );
    default:
      return <Sky />;
  }
}

export function SceneIllustration({
  scene: id,
  label,
  initials,
  className,
}: {
  scene: SceneId;
  /** Accessible name; omit for decorative use. */
  label?: string;
  initials?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn('block h-full w-full', className)}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {scene(id, initials)}
    </svg>
  );
}
