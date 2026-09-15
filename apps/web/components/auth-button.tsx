import { cn } from 'cn';
import { Button, buttonVariants } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { GitHub } from './icons/github';
import { Discord } from './icons/discord';
import { Google } from './icons/google';
import { fetchCurrentUser } from '@/lib/api';
import Link from 'next/link';

export async function AuthButton({ className }: { className?: string }) {
  const user = await fetchCurrentUser();

  if (user) {
    return (
      <Link href={`/${user.username}`} className="hover:scale-105 transition">
        <img
          src={user.avatarUrl}
          alt={`${user.username}'s profile picture`}
          className="rounded-full border-2"
          width={48}
          height={48}
        />
      </Link>
    );
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button size="lg" className={className} />}>
        Sign In
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Sign into Balabol.cc
          </DialogTitle>

          <DialogDescription className="text-center">
            Make your own profile in seconds.
            <br />
            Sign in using one of the OAuth2 providers:
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <a
            href={`${process.env.BACKEND_URL}/v1/auth/discord`}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'bg-[#5865F2] hover:bg-[#5865F2] text-base h-12 gap-3',
            )}
          >
            <Discord /> Sign in with Discord
          </a>

          <a
            href={`${process.env.BACKEND_URL}/v1/auth/github`}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'bg-black hover:bg-black text-base h-12 gap-3',
            )}
          >
            <GitHub /> Sign in with GitHub
          </a>

          <a
            href={`${process.env.BACKEND_URL}/v1/auth/google`}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'bg-[#4285F4] hover:bg-[#4285F4] text-base h-12 gap-3',
            )}
          >
            <Google /> Sign in with Google
          </a>
        </div>

        <span className="text-center text-xs text-muted-foreground">
          The initial profile information will be retrieved from the selected provider.
          You&apos;ll be able to change it anytime.
        </span>
      </DialogContent>
    </Dialog>
  );
}
