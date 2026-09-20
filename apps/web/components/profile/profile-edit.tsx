'use client';

import Link from 'next/link';
import { User } from '@repo/schemas';
import { ChevronLeft, Share } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button, buttonVariants } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Field, FieldGroup, FieldSet, FieldLabel } from '../ui/field';
import { useState } from 'react';
import { ProfileView } from './profile-view';

export function ProfileEdit({ user }: { user: User }) {
  const [isEdit, setIsEdit] = useState(false);

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
            <Switch id="edit-mode" onCheckedChange={setIsEdit} />
            <Label htmlFor="edit-mode">Edit Mode</Label>
          </div>
        </div>
      </header>

      {isEdit ? (
        <main className="flex flex-col items-center py-8 px-2">
          <Avatar size="xl" className="mb-4">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.username.at(0)?.toUpperCase()}</AvatarFallback>
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
