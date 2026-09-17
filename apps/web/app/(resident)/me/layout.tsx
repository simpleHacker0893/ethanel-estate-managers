import { EthanelClerkProvider } from '@/components/auth/clerk-provider';
import { AppHeader } from '@/components/app/app-header';
import { authCopy } from '@/content/auth';
import { requireResident } from '@/lib/auth';

/**
 * Server. Resident surface shell (Serwist PWA later). Blocks on the guard (`instant = false`)
 * before any child renders; refuses anyone without a lease with the forbidden page.
 */
export const instant = false;

export default async function ResidentLayout({ children }: LayoutProps<'/me'>) {
  await requireResident();
  return (
    <EthanelClerkProvider>
      <div className="min-h-dvh bg-mist-50">
        <AppHeader
          title={authCopy.app.resident}
          links={[{ label: authCopy.app.resident, href: '/me' }]}
        />
        <main id="main" className="container-x py-10">
          {children}
        </main>
      </div>
    </EthanelClerkProvider>
  );
}
