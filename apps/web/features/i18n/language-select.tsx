'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { setUserLocale } from './actions';

const langs = [
  { label: '🇬🇧 English', value: 'en' },
  { label: '🇷🇺 Русский', value: 'ru' },
] as const;

export function LanguageSelect({ currentLocale }: { currentLocale?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (lang: string | null) => {
    if (!lang) return;

    startTransition(async () => {
      await setUserLocale(lang);
      router.refresh();
    });
  };

  return (
    <Select
      items={langs}
      value={currentLocale || 'en'}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select language..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {langs.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
