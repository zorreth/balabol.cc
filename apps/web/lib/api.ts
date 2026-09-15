import { User } from '@repo/schemas';
import { cookies } from 'next/headers';

export async function fetchCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  const res = await fetch(process.env.BACKEND_URL + '/v1/users/me', {
    method: 'GET',
    headers: {
      Cookie: `token=${token}`,
    },
  });

  if (res.status === 401) {
    return null;
  }

  return res.json();
}
