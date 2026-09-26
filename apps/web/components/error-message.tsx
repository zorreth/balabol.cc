import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function ErrorMessage({ children }: { children?: React.ReactNode }) {
  const t = await getTranslations('Error');

  return (
    <div className="flex flex-col items-center p-8 text-center">
      <h1 className="font-bold text-3xl mb-4">{t('title')}</h1>
      <p className="mb-8">{children}</p>

      <Image
        src="/cat-loading.gif"
        alt="Cat loading"
        loading="eager"
        width={498}
        height={280}
        unoptimized
      />
    </div>
  );
}
