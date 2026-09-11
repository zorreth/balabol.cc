import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-3xl mb-2">Brand Assets</h1>

      <p>
        The Balabol.cc logo and icon are licensed under{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          className="font-semibold hover:underline"
        >
          CC-BY 4.0
        </a>
        .
      </p>

      <p className="mb-4">
        Both logo and icon use graphics from{' '}
        <a
          href="https://github.com/twitter/twemoji"
          target="_blank"
          className="font-semibold hover:underline"
        >
          Twemoji
        </a>
        , licensed under{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          className="font-semibold hover:underline"
        >
          CC-BY 4.0
        </a>
        .
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-2 items-center">
          <Image src="/logo.svg" alt="logo" width={340} height={80} />
          <a
            href="/logo.svg"
            className={buttonVariants({ variant: 'default', size: 'default' })}
            download="balabol-logo.svg"
          >
            Download Logo
          </a>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <Image src="/icon.svg" alt="icon" width={80} height={80} />
          <a
            href="/icon.svg"
            className={buttonVariants({ variant: 'default', size: 'default' })}
            download="balabol-icon.svg"
          >
            Download Icon
          </a>
        </div>
      </div>
    </div>
  );
}
