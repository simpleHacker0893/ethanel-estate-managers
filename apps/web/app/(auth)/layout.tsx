import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { EthanelClerkProvider } from '@/components/auth/clerk-provider';

/** Server. Sign-in, sign-up and the post-sign-in router, inside the marketing shell. */
export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <EthanelClerkProvider>
      <Header />
      <main id="main" className="min-h-dvh bg-mist-50">
        {children}
      </main>
      <Footer />
    </EthanelClerkProvider>
  );
}
