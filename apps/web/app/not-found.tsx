import Image from 'next/image';
import { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('NotFoundPage');

  return {
    title: t('pageTitle'),
  } as Metadata;
}

export default async function NotFound() {
  const t = await getTranslations('NotFoundPage');

  return (
    <>
      <Header />

      <div className="flex flex-col items-center text-center p-8">
        <h1 className="font-bold text-3xl mb-4">{t('title')}</h1>

        <p>{t('desc1')}</p>

        <p className="mb-8">
          {t.rich('desc2', {
            issue: (chunks) => (
              <a
                href="https://github.com/zorreth/balabol.cc/issues"
                className="font-semibold hover:underline"
              >
                {chunks}
              </a>
            ),
          })}
        </p>

        <Image
          src="/cat-error.gif"
          alt="Cat error"
          loading="eager"
          width={498}
          height={328}
          unoptimized
        />
      </div>

      <Footer />
    </>
  );
}
