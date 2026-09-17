import { AssistantMount } from '@/components/assistant/assistant-mount';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';

/** Server. Marketplace shares the public site shell. */
export default function MarketplaceLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      <main id="main" className="min-h-dvh bg-mist-50">
        {children}
      </main>
      <Footer />
      <AssistantMount />
    </>
  );
}
