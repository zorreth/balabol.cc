import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';

import { LanguageSelect } from '@/features/i18n/language-select';

import { GitHub } from '../icons/github';
import { Telegram } from '../icons/telegram';

const socials = [
  {
    icon: <GitHub className="size-8" />,
    title: 'GitHub',
    href: 'https://github.com/zorreth/balabol.cc',
  },
  {
    icon: <Telegram className="size-8" />,
    title: 'Telegram',
    href: 'https://t.me/balabolcc',
  },
] as const;

export async function Footer() {
  const t = await getTranslations('Footer');
  const locale = await getLocale();

  return (
    <footer className="px-4 py-12 bg-accent mt-auto">
      <div className="flex justify-between items-center container mx-auto gap-2 flex-col sm:flex-row">
        <div className="flex flex-col gap-2 items-center sm:items-start text-center">
          <Image
            src="/logo.svg"
            width={340}
            height={80}
            alt="Logo"
            className="w-32 h-auto"
            loading="eager"
          />

          <LanguageSelect currentLocale={locale} />

          <span>{t('copyright')}</span>
        </div>

        <div className="flex gap-4">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              title={s.title}
              className="hover:scale-105 transition-transform"
              target="_blank"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
