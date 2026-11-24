import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ErrorMessage } from '@/components/error-message';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProfileView } from '@/features/profile/profile-view';
import { ProfileEdit } from '@/features/profile/profile-edit';
import { fetchUserByUsername } from '@/features/profile/api';
import { fetchCurrentUser } from '@/features/auth/api';

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

  return currentUser ? <ProfileEdit user={user} /> : <ProfileView user={user} />;
}
