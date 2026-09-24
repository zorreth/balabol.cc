import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Menu } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';
import { UserMenu } from './user-menu';
import { getT } from 'next-i18next/server';

export async function Header() {
  const { t } = await getT('header');

  const navItems = [
    {
      name: t('about'),
      href: '/',
    },
    {
      name: t('brand'),
      href: '/about/brand',
    },
    {
      name: t('opensource'),
      href: 'https://github.com/zorreth/balabol.cc',
    },
  ];

  return (
    <header className="container mx-auto p-4 flex justify-between items-center">
      <Sheet>
        <SheetTrigger
          render={<Button variant="ghost" size="icon-lg" className="md:hidden" />}
        >
          <Menu />
        </SheetTrigger>

        <SheetContent side="left">
          <div className="flex flex-col gap-4 p-4">
            {navItems.map((item) => (
              <SheetClose key={item.href}>
                <Link
                  href={item.href}
                  className={buttonVariants({ variant: 'link', size: 'default' })}
                >
                  {item.name}
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/">
        <Image
          src="/logo.svg"
          width={340}
          height={80}
          alt="Logo"
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

      <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
        <UserMenu />
      </Suspense>
    </header>
  );
}
