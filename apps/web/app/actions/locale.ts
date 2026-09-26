'use server';

import { cookies } from 'next/headers';

export async function setUserLocale(locale: string) {
  const cookieStore = await cookies();

  cookieStore.set('locale', locale, {
    maxAge: 31536000, // 1 year
    path: '/',
    httpOnly: true,
  });
}
