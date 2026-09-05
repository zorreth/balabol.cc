import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { describeRoute, resolver } from 'hono-openapi';
import * as v from 'valibot';

const responseSchema = v.object({
  username: v.string(),
  displayName: v.string(),
  bio: v.string(),
  avatarUrl: v.string(),
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
          'application/json': { schema: resolver(responseSchema) },
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

export default app;
