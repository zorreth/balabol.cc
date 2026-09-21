import * as v from 'valibot';
import { LinkSchema } from './link.schema';

const UsernameSchema = v.pipe(
  v.string('A username must be string.'),
  v.minLength(3, 'The minimum username length is 3 characters.'),
  v.maxLength(64, 'The maximum username length is 64 characters.'),
  v.regex(/^[a-zA-Z0-9]+$/, 'The username must be alphanumeric.'),
);

const DisplayNameSchema = v.pipe(
  v.string('A display name must be string.'),
  v.maxLength(64, 'The maximum display name length is 64 characters.'),
);

export const UserBaseSchema = v.object({
  username: UsernameSchema,
  displayName: DisplayNameSchema,
  bio: v.string(),
  avatarUrl: v.string(),
});

export type UserBase = v.InferInput<typeof UserBaseSchema>;

export const UserSchema = v.object({
  ...UserBaseSchema.entries,
  links: v.array(LinkSchema),
});

export type User = v.InferInput<typeof UserSchema>;

export const UserUpdateSchema = v.object({
  username: v.optional(UsernameSchema),
  displayName: v.optional(DisplayNameSchema),
  bio: v.optional(v.string()),
});

export type UserUpdate = v.InferInput<typeof UserUpdateSchema>;

const AvatarSchema = v.pipe(
  v.file('Please select an image file.'),
  v.mimeType(['image/jpeg', 'image/png'], 'Please select a JPEG or PNG file.'),
  v.maxSize(1024 * 1024 * 5, 'Please select a file smaller than 5 MB.'),
);

export const AvatarUpdateSchema = v.object({
  avatar: AvatarSchema,
});
