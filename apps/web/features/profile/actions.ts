'use server';

import type { UserBase, UserUpdate } from '@repo/schemas';

import { updateUser } from './api';

export async function updateUserAction(data: UserUpdate): Promise<UserBase> {
  return updateUser(data);
}
