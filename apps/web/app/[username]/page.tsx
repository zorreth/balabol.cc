import Image from 'next/image';
import Link from 'next/link';
import { cn } from 'cn';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft, Share } from 'lucide-react';
import { fetchCurrentUser, fetchUserByUsername } from '@/lib/api';
import { buttonVariants } from '@/components/ui/button';
import { ErrorMessage } from '@/components/error-message';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  return {
    title: username,
    description: `${username}'s social links and profile on Balabol.cc`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  let user = null;
  let currentUser = null;

  try {
    user = await fetchUserByUsername(username);
    currentUser = await fetchCurrentUser();
  } catch (error) {
    console.error('Failed to fetch user:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return (
      <>
        <Header />
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <Footer />
      </>
    );
  }

  if (!user) {
    return notFound();
  }

  return (
    <>
      {currentUser && (
        <header className="flex justify-between fixed w-screen px-4 top-4">
          <Link
            href="/"
            className={buttonVariants({ variant: 'secondary', size: 'icon-lg' })}
          >
            <ChevronLeft />
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="secondary" size="icon-lg">
              <Share />
            </Button>

            <div className="flex items-center gap-2">
              <Switch id="edit-mode" />
              <Label htmlFor="edit-mode">Edit Mode</Label>
            </div>
          </div>
        </header>
      )}

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
    </>
  );
}
