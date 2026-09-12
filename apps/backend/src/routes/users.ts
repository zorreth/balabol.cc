import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { describeRoute, resolver, validator } from 'hono-openapi';
import { jwt } from 'hono/jwt';
import { UserSchema, UserUpdateSchema, ErrorSchema } from '@repo/schemas';

const app = new Hono();

app.get(
  '/:username',
  describeRoute({
    description: "Get user's profile and links information by username",
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

    const user = await db.query.users.findFirst({
      where: { username },
      columns: {
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
      },
      with: {
        links: {
          columns: {
            id: true,
            name: true,
            url: true,
          },
        },
      },
    });

    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    return c.json(user);
  },
);

app.patch(
  '/me',
  describeRoute({
    description: 'Update the current user profile',
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
