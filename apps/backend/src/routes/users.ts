import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { describeRoute, resolver, validator } from 'hono-openapi';
import * as v from 'valibot';
import { jwt } from 'hono/jwt';

const UsernameSchema = v.pipe(
  v.string(),
  v.minLength(3, 'The minimum username length is 3 characters.'),
  v.maxLength(64, 'The maximum username length is 64 characters.'),
  v.regex(/^[a-zA-Z0-9]+$/, 'The username must be alphanumeric.'),
);

const DisplayNameSchema = v.pipe(
  v.string(),
  v.maxLength(64, 'The maximum display name length is 64 characters.'),
);

const UserSchema = v.object({
  username: UsernameSchema,
  displayName: DisplayNameSchema,
  bio: v.string(),
  avatarUrl: v.string(),
});

const UserUpdateSchema = v.object({
  username: v.optional(UsernameSchema),
  displayName: v.optional(DisplayNameSchema),
  bio: v.optional(v.string()),
});

const ErrorSchema = v.object({
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
          'application/json': { schema: resolver(UserSchema) },
        },
      },
      404: {
        description: 'User not found',
        content: {
          'application/json': { schema: resolver(ErrorSchema) },
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
          'application/json': { schema: resolver(UserSchema) },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': { schema: resolver(ErrorSchema) },
        },
      },
      404: {
        description: 'User not found',
        content: {
          'application/json': { schema: resolver(ErrorSchema) },
        },
      },
    },
  }),
  jwt({ secret: process.env.JWT_SECRET!, cookie: 'token', alg: 'HS256' }),
  validator('json', UserUpdateSchema),
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

    return c.json({
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      bio: updatedUser.bio,
      avatarUrl: updatedUser.avatarUrl,
    });
  },
);

export default app;
