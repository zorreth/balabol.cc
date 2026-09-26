import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { cn } from 'cn';
import { buttonVariants } from './ui/button';
import { GitHub } from './icons/github';
import { Discord } from './icons/discord';
import { Google } from './icons/google';
import { getTranslations } from 'next-intl/server';

export async function SignInModal() {
  const t = await getTranslations('SignInModal');

  return (
    <Dialog>
      <DialogTrigger render={<Button size="lg" />}>{t('buttonText')}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {t('title')}
          </DialogTitle>

          <DialogDescription className="text-center">
            {t.rich('description', {
              br: () => <br />,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <a
            href={`${process.env.BACKEND_URL}/v1/auth/discord`}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'bg-[#5865F2] hover:bg-[#5865F2] text-base h-12 gap-3',
            )}
          >
            <Discord /> {t('discord')}
          </a>

          <a
            href={`${process.env.BACKEND_URL}/v1/auth/github`}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'bg-black hover:bg-black text-base h-12 gap-3',
            )}
          >
            <GitHub /> {t('github')}
          </a>

          <a
            href={`${process.env.BACKEND_URL}/v1/auth/google`}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'bg-[#4285F4] hover:bg-[#4285F4] text-base h-12 gap-3',
            )}
          >
            <Google /> {t('google')}
          </a>
        </div>

        <span className="text-center text-xs text-muted-foreground">{t('footer')}</span>
      </DialogContent>
    </Dialog>
  );
}
