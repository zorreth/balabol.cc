import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from './ui/button';

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
          alt="logo"
          className="hover:scale-105 transition"
          width={140}
          height={80}
        />
      </Link>

      <div>
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

      <Button size="lg">Sign In</Button>
    </header>
  );
}
