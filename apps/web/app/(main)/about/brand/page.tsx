import { buttonVariants } from '@/components/ui/button';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Brand Assets - Balabol.cc',
  description: 'The official Balabol.cc logos and icons that are available to download',
};

export default async function Page() {
  const t = await getTranslations('BrandPage');

  return (
    <div className="flex flex-col items-center text-center p-8">
      <h1 className="font-bold text-3xl mb-4">{t('title')}</h1>

      <p>
        {t.rich('logoLicense', {
          license: (chunks) => (
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              className="font-semibold hover:underline"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      <p className="mb-8">
        {t.rich('twemojiLicense', {
          twemoji: (chunks) => (
            <a
              href="https://github.com/twitter/twemoji"
              target="_blank"
              className="font-semibold hover:underline"
            >
              {chunks}
            </a>
          ),
          license: (chunks) => (
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              className="font-semibold hover:underline"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-2 items-center">
          <Image src="/logo.svg" alt="logo" width={340} height={80} />
          <a
            href="/logo.svg"
            className={buttonVariants({ variant: 'default', size: 'default' })}
            download="balabol-logo.svg"
          >
            {t('downloadLogo')}
          </a>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <Image src="/icon.svg" alt="icon" width={80} height={80} />
          <a
            href="/icon.svg"
            className={buttonVariants({ variant: 'default', size: 'default' })}
            download="balabol-icon.svg"
          >
            {t('downloadIcon')}
          </a>
        </div>
      </div>
    </div>
  );
}
