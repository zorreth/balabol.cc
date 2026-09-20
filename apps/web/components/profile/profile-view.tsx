import { User } from '@repo/schemas';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { buttonVariants } from '../ui/button';
import { cn } from 'cn';
import Image from 'next/image';
import Link from 'next/link';

export function ProfileView({ user }: { user: User }) {
  return (
    <main className="flex flex-col items-center py-8 px-2">
      <Avatar size="xl" className="mb-4">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{user.username.at(0)?.toUpperCase()}</AvatarFallback>
      </Avatar>

      <h1 className="font-bold text-4xl mb-8">{user.displayName || user.username}</h1>

      {user.bio && <p>{user.bio}</p>}

      <div className="flex flex-col gap-2 max-w-80 w-full mb-8">
        {user.links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'w-full text-base h-12 gap-3',
            )}
          >
            {link.name}
          </a>
        ))}
      </div>

      <Link href="/" className="flex flex-col items-center transition hover:scale-105">
        <span className="text-xs tracking-wide font-bold">POWERED BY</span>

        <Image
          src="/logo.svg"
          alt="logo"
          width={340}
          height={80}
          className="w-32 h-auto"
          loading="eager"
        />
      </Link>
    </main>
  );
}
