import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';

/** Server. Public marketing shell: header, main landmark, footer. */
export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      <main id="main" className="min-h-dvh">
        {children}
      </main>
      <Footer />
    </>
  );
}
