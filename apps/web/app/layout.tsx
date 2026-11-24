import './globals.css';

import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { cn } from '@/lib/utils';

const openSans = Open_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Balabol.cc',
  description: 'A free and open-source link-in-bio platform.',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn('h-full font-sans antialiased', openSans.variable)}>
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
