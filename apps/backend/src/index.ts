import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { Scalar } from '@scalar/hono-api-reference';
import { openAPIRouteHandler } from 'hono-openapi';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import auth from './routes/auth';
import users from './routes/users';

const app = new Hono();

app.use(logger());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ status: err.status, message: err.message }, err.status);
  }

  console.error(err.message);
  return c.json({ success: false, message: 'Internal Server Error' }, 500);
});

app.get(
  '/openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'Balabol.cc API',
        version: '1.0.0',
        description: 'The easiest social landing page hosting and link shortener',
      },
      servers: [
        {
          url: 'https://api.balabol.cc',
          description: 'Production Server',
        },
        {
          url: 'http://localhost:8080',
          description: 'Local Development Server',
        },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'token',
            description:
              'Use this to add JWT inside a cookie. Adds automatically after logging in via OAuth2.',
          },
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Use this to add JWT directly inside Authorization header.',
          },
        },
      },
    },
  }),
);

app.get(
  '/docs',
  Scalar({ url: '/openapi', authentication: { preferredSecurityScheme: 'cookieAuth' } }),
);

const v1 = new Hono();

v1.use(cors());

v1.route('/auth', auth);
v1.route('/users', users);

app.route('/v1', v1);

export default {
  port: 8080,
  fetch: app.fetch,
};
