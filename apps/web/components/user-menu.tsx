import Link from 'next/link';
import { fetchCurrentUser } from '@/lib/api';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { SignInModal } from './sign-in-modal';

export async function UserMenu() {
  const user = await fetchCurrentUser();

  if (user) {
    return (
      <Link href={`/${user.username}`} className="hover:scale-105 transition">
        <Avatar>
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
    );
  }

  return <SignInModal />;
}
