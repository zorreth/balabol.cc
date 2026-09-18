import Image from 'next/image';
import { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'Not Found - Balabol.cc',
};

export default function NotFound() {
  return (
    <>
      <Header />

      <div className="flex flex-col items-center text-center p-8">
        <h1 className="font-bold text-3xl mb-4">404 Not Found</h1>

        <p>This page cannot be found.</p>
        <p className="mb-8">
          Please check the URL or{' '}
          <a
            href="https://github.com/zorreth/balabol.cc/issues"
            className="font-semibold hover:underline"
          >
            leave an issue
          </a>{' '}
          if you think there is a mistake.
        </p>

        <Image
          src="/cat-error.gif"
          alt="cat error"
          loading="eager"
          width={498}
          height={328}
          unoptimized
        />
      </div>

      <Footer />
    </>
  );
}
