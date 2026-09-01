import { Hono } from 'hono';
import { openAPIRouteHandler } from 'hono-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import { jwt, type JwtVariables } from 'hono/jwt';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import auth from './routes/auth';
import users from './routes/users';

const app = new Hono<{ Variables: JwtVariables }>();

app.use(logger());
app.use('/v1/*', cors());
app.use(
  '/v1/*',
  jwt({
    secret: process.env.JWT_SECRET!,
    alg: 'HS256',
    cookie: 'token',
  }),
);

app.get(
  '/openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'Balabol.cc API',
        version: '1.0.0',
        description: 'The simplest link shortener & social landing hosting',
      },
      servers: [
        {
          url: 'https://api.balabol.cc/v1',
          description: 'Production',
        },
      ],
    },
  }),
);
app.get('/docs', Scalar({ url: '/openapi' }));

app.route('/auth', auth);
app.route('/users', users);

export default app;
