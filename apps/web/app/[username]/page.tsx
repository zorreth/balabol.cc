import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchUserByUsername } from '@/lib/api';
import { ErrorMessage } from '@/components/error-message';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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

  try {
    user = await fetchUserByUsername(username);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return <ErrorMessage>{error.message}</ErrorMessage>;
    } else {
      return <ErrorMessage>Unknown error</ErrorMessage>;
    }
  }

  if (!user) {
    return notFound();
  }

  return (
    <main className="flex flex-col items-center p-8">
      <Avatar size="xl">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{user.username.at(0)?.toUpperCase()}</AvatarFallback>
      </Avatar>
    </main>
  );
}
