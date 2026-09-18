import { ErrorMessage } from '@/components/error-message';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { cause } = await searchParams;

  let message = 'Something went wrong!';

  switch (cause) {
    case 'provider':
      message =
        'Failed to request user data from the OAuth2 provider! Please, try again.';
      break;

    case 'server':
      message = 'Failed to create a new user. Please, try again.';
      break;
  }

  return <ErrorMessage>{message}</ErrorMessage>;
}
