'use client';

import { useEffect } from 'react';

/**
 * Client: replaces the root layout when it throws, so it must render <html> and <body> itself and
 * cannot rely on providers. Copy is inline because next-intl is unavailable here.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          background: '#F7F6FB',
          color: '#3E3A55',
          fontFamily: 'system-ui, sans-serif',
          padding: '4rem 1.5rem',
        }}
      >
        <main id="main">
          <h1 style={{ color: '#14122B', fontSize: '2rem', lineHeight: 1.12, margin: 0 }}>
            That didn&apos;t work.
          </h1>
          <p style={{ maxWidth: '36rem', fontSize: '1.1875rem', lineHeight: 1.6 }}>
            Try again in a moment. If it keeps happening, WhatsApp us and we&apos;ll sort it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              height: 50,
              padding: '0 24px',
              borderRadius: 10,
              border: 0,
              background: '#5A48B8',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
