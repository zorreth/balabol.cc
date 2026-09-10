import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';

const notoSans = Noto_Sans({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Balabol.cc',
  description: 'The easiest social landing page hosting and link shortener',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn('h-full', 'antialiased', 'font-sans', notoSans.variable)}
    >
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
