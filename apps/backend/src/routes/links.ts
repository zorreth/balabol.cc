import { Hono } from 'hono';
import { describeRoute, validator, resolver } from 'hono-openapi';
import { jwt } from 'hono/jwt';
import { db } from '../db';
import { links } from '../db/schema';
import { HTTPException } from 'hono/http-exception';
import { ErrorSchema, LinkCreateSchema, LinkSchema } from '@repo/schemas';

const app = new Hono();

app.post(
  '/',
  describeRoute({
    description: 'Create a new link for the current user',
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      201: {
        description: 'Successfully created link',
        content: {
          'application/json': { schema: resolver(LinkSchema) },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': { schema: resolver(ErrorSchema) },
        },
      },
    },
  }),
  jwt({ secret: process.env.JWT_SECRET!, cookie: 'token', alg: 'HS256' }),
  validator('json', LinkCreateSchema),
  async (c) => {
    const payload = c.get('jwtPayload') as { sub: number };
    const userId = payload.sub;

    const body = c.req.valid('json');

    try {
      const [link] = await db
        .insert(links)
        .values({
          name: body.name,
          url: body.url,
          userId,
        })
        .returning({
          id: links.id,
          name: links.name,
          url: links.url,
        });

      return c.json(link, 201);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new HTTPException(401, {
          message: 'User account no longer exists',
        });
      }

      console.error(error);
      throw new HTTPException(500, { message: 'Internal Server Error' });
    }
  },
);

export default app;
