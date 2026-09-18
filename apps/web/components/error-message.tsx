import Image from 'next/image';

export function ErrorMessage({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center p-8 text-center">
      <h1 className="font-bold text-3xl mb-4">Oh no! Error!</h1>
      <p className="mb-8">{children}</p>

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
