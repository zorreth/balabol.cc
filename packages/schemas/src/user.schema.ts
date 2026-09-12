import * as v from 'valibot';
import { LinkSchema } from './link.schema';

export const UsernameSchema = v.pipe(
  v.string(),
  v.minLength(3, 'The minimum username length is 3 characters.'),
  v.maxLength(64, 'The maximum username length is 64 characters.'),
  v.regex(/^[a-zA-Z0-9]+$/, 'The username must be alphanumeric.'),
);

export const DisplayNameSchema = v.pipe(
  v.string(),
  v.maxLength(64, 'The maximum display name length is 64 characters.'),
);

export const UserSchema = v.object({
  username: UsernameSchema,
  displayName: DisplayNameSchema,
  bio: v.string(),
  avatarUrl: v.string(),
  links: v.array(LinkSchema),
});

export const UserUpdateSchema = v.object({
  username: v.optional(UsernameSchema),
  displayName: v.optional(DisplayNameSchema),
  bio: v.optional(v.string()),
});
