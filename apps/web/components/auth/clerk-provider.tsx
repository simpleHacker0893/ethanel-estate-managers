import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';

/**
 * Server. Wraps only the route groups that render Clerk UI (sign-in, sign-up, dashboard,
 * landlord portal, resident surface). Marketing and marketplace stay free of Clerk so they keep
 * prerendering static without a script from the Frontend API. Appearance maps the Ethanel tokens
 * onto Clerk's components: iris primary, radius 10, Manrope.
 */
export function EthanelClerkProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/after-sign-in"
      signUpFallbackRedirectUrl="/after-sign-in"
      appearance={{
        variables: {
          colorPrimary: '#5a48b8',
          colorForeground: '#14122b',
          colorMutedForeground: '#6f6a85',
          colorBackground: '#ffffff',
          colorInput: '#ffffff',
          colorInputForeground: '#14122b',
          colorDanger: '#e04e5f',
          borderRadius: '10px',
          fontFamily: 'var(--font-manrope), ui-sans-serif, system-ui, sans-serif',
        },
        elements: {
          card: 'rounded-card border border-mist-200 shadow-none',
          formButtonPrimary: 'h-[50px] rounded-button text-label-m font-semibold',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
