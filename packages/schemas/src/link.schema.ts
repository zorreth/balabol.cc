import * as v from 'valibot';

const LinkNameSchema = v.pipe(
  v.string('The link name must be string.'),
  v.maxLength(64, 'The maximum link name length is 64 characters.'),
);

const LinkUrlSchema = v.pipe(
  v.string('The link URL must be string.'),
  v.url('The link URL is badly formatted.'),
);

export const LinkSchema = v.object({
  id: v.number(),
  name: LinkNameSchema,
  url: LinkUrlSchema,
});

export type Link = v.InferInput<typeof LinkSchema>;

export const LinkCreateSchema = v.object({
  name: LinkNameSchema,
  url: LinkUrlSchema,
});

export type LinkCreate = v.InferInput<typeof LinkCreateSchema>;

export const LinkUpdateSchema = v.object({
  name: v.optional(LinkNameSchema),
  url: v.optional(LinkUrlSchema),
});

export type LinkUpdate = v.InferInput<typeof LinkUpdateSchema>;
