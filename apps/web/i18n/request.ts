import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'ru'];
const defaultLocale = 'en';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  let locale = cookieStore.get('locale')?.value;

  if (!locale) {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');

    if (acceptLanguage) {
      const languages = new Negotiator({
        headers: { 'accept-language': acceptLanguage },
      }).languages();

      locale = match(languages, locales, defaultLocale);
    }
  }

  if (!locale) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
