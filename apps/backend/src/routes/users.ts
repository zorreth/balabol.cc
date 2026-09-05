import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { describeRoute, resolver, validator } from 'hono-openapi';
import * as v from 'valibot';
import { jwt } from 'hono/jwt';
import { bearerAuth } from 'hono/bearer-auth';

const userSchema = v.object({
  username: v.string(),
  displayName: v.string(),
  bio: v.string(),
  avatarUrl: v.string(),
});

const userUpdateSchema = v.object({
  username: v.optional(v.string()),
  displayName: v.optional(v.string()),
  bio: v.optional(v.string()),
});

const errorSchema = v.object({
  status: v.number(),
  message: v.string(),
});

const app = new Hono();

app.get(
  '/:username',
  describeRoute({
    description: 'Get user by username',
    responses: {
      200: {
        description: 'Successfully retrieved user',
        content: {
          'application/json': { schema: resolver(userSchema) },
        },
      },
      404: {
        description: 'User not found',
        content: {
          'application/json': { schema: resolver(errorSchema) },
        },
      },
    },
  }),
  async (c) => {
    const username = c.req.param('username');

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    return c.json({
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    });
  },
);

app.patch(
  '/me',
  describeRoute({
    description: 'Update the current authorized user information',
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully updated user',
        content: {
          'application/json': { schema: resolver(userSchema) },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': { schema: resolver(errorSchema) },
        },
      },
      404: {
        description: 'User not found',
        content: {
          'application/json': { schema: resolver(errorSchema) },
        },
      },
    },
  }),
  jwt({ secret: process.env.JWT_SECRET!, cookie: 'token', alg: 'HS256' }),
  validator('json', userUpdateSchema),
  async (c) => {
    const payload = c.get('jwtPayload') as { sub: number };
    const userId = payload.sub;

    const body = c.req.valid('json');

    const [updatedUser] = await db
      .update(users)
      .set({
        username: body.username,
        displayName: body.displayName,
        bio: body.bio,
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    return c.json(updatedUser);
  },
);

export default app;
