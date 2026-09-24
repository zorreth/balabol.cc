import './globals.css';

import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { cn } from '@/lib/utils';
import {
  generateI18nStaticParams,
  getResources,
  getT,
  initServerI18next,
} from 'next-i18next/server';
import { I18nProvider } from 'next-i18next/client';
import i18nConfig from '@/i18n.config';

initServerI18next(i18nConfig);

export async function generateStaticParams() {
  return generateI18nStaticParams();
}

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Balabol.cc',
  description: 'A free and open-source link-in-bio platform.',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const { i18n, lng } = await getT();
  const resources = getResources(i18n);

  return (
    <html
      lang="en"
      className={cn('h-full', 'antialiased', 'font-sans', montserrat.variable)}
    >
      <body className="flex flex-col min-h-screen">
        <I18nProvider language={lng} resources={resources}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
