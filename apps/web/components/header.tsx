import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from './ui/button';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { AuthButton } from './auth-button';
import { Suspense } from 'react';
import { Skeleton } from './ui/skeleton';

const navItems = [
  {
    name: 'About',
    href: '/',
  },
  {
    name: 'Brand',
    href: '/about/brand',
  },
  {
    name: 'Example',
    href: '/about/example',
  },
];

export function Header() {
  return (
    <header className="container mx-auto p-4 flex justify-between items-center">
      <Link href="/">
        <Image
          src="/logo.svg"
          width={340}
          height={80}
          alt="logo"
          className="hover:scale-105 transition w-36 h-auto"
          loading="eager"
        />
      </Link>

      <div className="hidden md:flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={buttonVariants({ variant: 'link', size: 'default' })}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <Suspense fallback={<Skeleton className="size-10 rounded-full" />}>
        <AuthButton className="hidden md:flex" />
      </Suspense>

      <Sheet>
        <SheetTrigger
          render={<Button size="icon-lg" variant="ghost" className="md:hidden" />}
        >
          <MenuIcon />
        </SheetTrigger>

        <SheetContent showCloseButton={true}>
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col items-start">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={buttonVariants({ variant: 'link', size: 'lg' })}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <Suspense fallback={<Skeleton className="h-10 w-full rounded-full" />}>
              <AuthButton />
            </Suspense>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
