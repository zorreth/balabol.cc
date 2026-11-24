import { getTranslations } from 'next-intl/server';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { GitHub } from '@/components/icons/github';
import { Discord } from '@/components/icons/discord';
import { Google } from '@/components/icons/google';
import { cn } from '@/lib/utils';

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
              'bg-muted text-bg-muted-foreground hover:bg-muted text-base h-12 gap-3',
            )}
          >
            <Discord /> {t('discord')}
          </a>

          <a
            href={`${process.env.BACKEND_URL}/v1/auth/github`}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'bg-muted text-bg-muted-foreground hover:bg-muted text-base h-12 gap-3',
            )}
          >
            <GitHub /> {t('github')}
          </a>

          <a
            href={`${process.env.BACKEND_URL}/v1/auth/google`}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'bg-muted text-bg-muted-foreground hover:bg-muted text-base h-12 gap-3',
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
