import { jwt } from 'hono/jwt';

export const authenticate = jwt({
  secret: process.env.JWT_SECRET!,
  cookie: 'token',
  alg: 'HS256',
});
