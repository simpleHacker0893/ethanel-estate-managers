import { EthanelClerkProvider } from '@/components/auth/clerk-provider';
import { AppHeader } from '@/components/app/app-header';
import { authCopy } from '@/content/auth';
import { requireLandlord } from '@/lib/auth';

/**
 * Server. Landlord portal shell. Blocks on the guard (`instant = false`) before any child
 * renders; refuses anyone who is not the landlord of a property with the forbidden page.
 * Figures read live, never cached.
 */
export const instant = false;

export default async function LandlordLayout({ children }: LayoutProps<'/landlord'>) {
  await requireLandlord();
  return (
    <EthanelClerkProvider>
      <div className="min-h-dvh bg-mist-50">
        <AppHeader
          title={authCopy.app.landlord}
          links={[{ label: authCopy.app.landlord, href: '/landlord' }]}
        />
        <main id="main" className="container-x py-10">
          {children}
        </main>
      </div>
    </EthanelClerkProvider>
  );
}
