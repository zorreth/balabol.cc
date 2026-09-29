'use server';

import { UserBase, UserUpdate } from '@repo/schemas';
import { updateUser } from '@/lib/api';

export async function updateUserAction(data: UserUpdate): Promise<UserBase> {
  return updateUser(data);
}
