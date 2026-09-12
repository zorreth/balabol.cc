import * as v from 'valibot';

export const ErrorSchema = v.object({
  status: v.number(),
  message: v.string(),
});
