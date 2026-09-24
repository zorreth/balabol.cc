'use client';

import Link from 'next/link';
import { User } from '@repo/schemas';
import { ChevronLeft, Share, SquarePen } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button, buttonVariants } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Field, FieldGroup, FieldSet, FieldLabel } from '../ui/field';
import { useEffect, useState } from 'react';
import { ProfileView } from './profile-view';

export function ProfileEdit({ user }: { user: User }) {
  const [isEdit, setIsEdit] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

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
            <Label htmlFor="edit-mode">Edit Mode</Label>
          </div>
        </div>
      </header>

      {isEdit ? (
        <main className="flex flex-col items-center py-8 px-2">
          <Avatar size="xl" className="relative mb-4 hover:opacity-80 cursor-pointer group">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.username.at(0)?.toUpperCase()}</AvatarFallback>

            <SquarePen
              className="absolute top-1/2 left-1/2 -translate-1/2 hidden group-hover:block"
              color="white"
              size={48}
            />
          </Avatar>

          <FieldSet className="max-w-96 w-full">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="display-name">Display Name</FieldLabel>
                <Input
                  defaultValue={user.displayName || user.username}
                  id="display-name"
                  placeholder="Cool Balabol"
                  className="text-center font-bold"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Textarea
                  defaultValue={user.bio}
                  id="bio"
                  placeholder="My name is Balabol, I live at balabol.cc, my phone is Nokia 3310, my credit card number is ..."
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <Button>Update</Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </main>
      ) : (
        <ProfileView user={user} />
      )}
    </>
  );
}
