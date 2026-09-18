import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
