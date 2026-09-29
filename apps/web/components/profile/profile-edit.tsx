'use client';

import Link from 'next/link';
import { User, UserUpdateSchema } from '@repo/schemas';
import { ChevronLeft, Share, SquarePen } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button, buttonVariants } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Field, FieldGroup, FieldSet, FieldLabel, FieldError } from '../ui/field';
import { useEffect, useState } from 'react';
import { ProfileView } from './profile-view';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { updateUserAction } from '@/app/actions/user';

export function ProfileEdit({ user }: { user: User }) {
  const [isEdit, setIsEdit] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: valibotResolver(UserUpdateSchema),
    defaultValues: {
      username: user.username,
      displayName: user.displayName || user.username,
      bio: user.bio ?? '',
    },
  });

  const t = useTranslations('Profile');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setIsEdit(params.has('edit'));
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const url = new URL(window.location.href);

    if (isEdit) {
      url.searchParams.set('edit', '1');
    } else {
      url.searchParams.delete('edit');
    }

    window.history.pushState({}, '', url);
  }, [isEdit, hasMounted]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateUserAction(data);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <header className="flex justify-between fixed w-screen px-4 top-4">
        <Link
          href="/"
          className={buttonVariants({ variant: 'secondary', size: 'icon-lg' })}
        >
          <ChevronLeft />
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="secondary" size="icon-lg">
            <Share />
          </Button>

          <div className="flex items-center gap-2">
            <Switch id="edit-mode" checked={isEdit} onCheckedChange={setIsEdit} />
            <Label htmlFor="edit-mode">{t('editMode')}</Label>
          </div>
        </div>
      </header>

      {isEdit ? (
        <main className="flex flex-col items-center py-8 px-2">
          <Avatar
            size="xl"
            className="relative mb-4 hover:opacity-80 cursor-pointer group"
          >
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.username.at(0)?.toUpperCase()}</AvatarFallback>

            <SquarePen
              className="absolute top-1/2 left-1/2 -translate-1/2 hidden group-hover:block"
              color="white"
              size={48}
            />
          </Avatar>

          <form onSubmit={onSubmit} className="max-w-96 w-full">
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="displayName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>{t('displayName')}</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder={t('displayNamePlaceholder')}
                        className="text-center font-bold"
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="username"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>{t('username')}</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder={t('usernamePlaceholder')}
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="bio"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>{t('bio')}</FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder={t('bioPlaceholder')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Button type="submit">{t('update')}</Button>
              </FieldGroup>
            </FieldSet>
          </form>
        </main>
      ) : (
        <ProfileView user={user} />
      )}
    </>
  );
}
