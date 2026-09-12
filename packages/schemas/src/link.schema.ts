import * as v from 'valibot';

export const LinkNameSchema = v.pipe(
  v.string(),
  v.maxLength(64, 'The maximum link name length is 64 characters.'),
);

export const LinkUrlSchema = v.pipe(
  v.string(),
  v.url('The link URL is badly formatted.'),
);

export const LinkSchema = v.object({
  id: v.number(),
  name: LinkNameSchema,
  url: LinkUrlSchema,
});

export const LinkCreateSchema = v.object({
  name: LinkNameSchema,
  url: LinkUrlSchema,
});
