import { ErrorMessage } from '@/components/error-message';
import { getTranslations } from 'next-intl/server';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { cause } = await searchParams;
  const t = await getTranslations('Error');

  let message = 'Something went wrong!';

  switch (cause) {
    case 'provider':
      message = t('provider');
      break;

    case 'server':
      message = t('server');
      break;
  }

  return <ErrorMessage>{message}</ErrorMessage>;
}
