import Link from 'next/link';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { SignInModal } from './sign-in-modal';
import { fetchCurrentUser } from './api';

export async function UserMenu() {
  let user = null;

  try {
    user = await fetchCurrentUser();
  } catch (error) {
    console.error(error);
  }

  if (user) {
    return (
      <Link
        href={`/${user.username}`}
        className="hover:scale-105 transition"
        aria-label="User profile"
      >
        <Avatar>
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{user.username.at(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
    );
  }

  return <SignInModal />;
}
