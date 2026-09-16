import Image from 'next/image';

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

  return (
    <div className="flex flex-col items-center p-8 text-center">
      <h1 className="font-bold text-3xl mb-4">Oh no! Error!</h1>
      <p className="mb-8">{message}</p>

      <Image
        src="/cat-loading.gif"
        alt="cat loading"
        className="mb-8"
        loading="eager"
        width={498}
        height={280}
        unoptimized
      />
    </div>
  );
}
