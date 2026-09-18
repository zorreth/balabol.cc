import { ErrorResponse, User } from '@repo/schemas';
import { cookies } from 'next/headers';

export async function fetchCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  const res = await fetch(`${process.env.BACKEND_URL}/v1/users/me`, {
    method: 'GET',
    headers: {
      Cookie: `token=${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      return null;
    }

    const json = (await res.json()) as ErrorResponse;
    throw new Error(json.message);
  }

  return (await res.json()) as User;
}

export async function fetchUserByUsername(username: string): Promise<User | null> {
  const res = await fetch(
    `${process.env.BACKEND_URL}/v1/users/${encodeURIComponent(username)}`,
  );

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    const json = (await res.json()) as ErrorResponse;
    throw new Error(json.message);
  }

  return (await res.json()) as User;
}
