'use client';

import { useChangeLanguage } from 'next-i18next/client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useTranslation } from 'react-i18next';

const langs = [
  { label: '🇬🇧 English', value: 'en' },
  { label: '🇷🇺 Русский', value: 'ru' },
];

export function LanguageSelect() {
  const changeLanguage = useChangeLanguage();
  const { i18n } = useTranslation();

  const handleChange = async (lang: string | null) => {
    if (lang) await changeLanguage(lang);
  };

  return (
    <Select items={langs} onValueChange={handleChange} value={i18n.language}>
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
