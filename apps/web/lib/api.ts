import { ErrorResponse, User, UserBase, UserUpdate } from '@repo/schemas';
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

export async function updateUser(newUser: UserUpdate): Promise<UserBase> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Authorization token not found');
  }

  const res = await fetch(`${process.env.BACKEND_URL}/v1/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${token}`,
    },
    body: JSON.stringify(newUser),
  });

  if (!res.ok) {
    const json = (await res.json()) as ErrorResponse;
    throw new Error(json.message);
  }

  return (await res.json()) as UserBase;
}
