import Image from 'next/image';

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/zorreth/balabol.cc',
  },
  {
    name: 'Telegram',
    href: 'https://t.me/balabolcc',
  },
];

export function Footer() {
  return (
    <footer className="px-4 py-12 bg-accent mt-auto">
      <div className="flex justify-between items-center container mx-auto gap-2 flex-col sm:flex-row">
        <div className="flex flex-col gap-2 items-center sm:items-start">
          <Image
            src="/logo.svg"
            alt="logo"
            width={120}
            height={80}
            className="w-32 h-auto"
          />
          <span>&copy; 2026 Kirill Siukhin. All rights reserved.</span>
        </div>

        <div className="flex gap-4">
          {socials.map((s) => (
            <a className="hover:underline" key={s.href} href={s.href}>
              {s.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
