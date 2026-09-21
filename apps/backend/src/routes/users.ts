import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { describeRoute, resolver, validator } from 'hono-openapi';
import {
  UserSchema,
  UserUpdateSchema,
  ErrorSchema,
  AvatarUpdateSchema,
  UserBaseSchema,
} from '@repo/schemas';
import { authenticate } from '../../utils/authenticate';
import { bodyLimit } from 'hono/body-limit';
import { mkdir } from 'node:fs/promises';

const app = new Hono();

const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const AVATAR_DIR = './static/avatars';

await mkdir(AVATAR_DIR, { recursive: true });

app.get(
  '/me',
  describeRoute({
    description: 'Get the current user profile',
    tags: ['Users'],
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved user',
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
    },
  }),
  authenticate,
  async (c) => {
    const payload = c.get('jwtPayload') as { sub: number };
    const userId = payload.sub;

    const user = await db.query.users.findFirst({
      where: { id: userId },
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
      throw new HTTPException(401, { message: 'User account no longer exists' });
    }

    return c.json(user);
  },
);

app.get(
  '/:username',
  describeRoute({
    description: 'Get the user profile by username',
    tags: ['Users'],
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
    tags: ['Users'],
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully updated user',
        content: {
          'application/json': { schema: resolver(UserBaseSchema) },
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
  authenticate,
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
      .returning({
        username: users.username,
        displayName: users.displayName,
        bio: users.bio,
        avatarUrl: users.avatarUrl,
      });

    if (!updatedUser) {
      throw new HTTPException(401, { message: 'User account no longer exists' });
    }

    return c.json(updatedUser);
  },
);

app.post(
  '/me/avatar',
  describeRoute({
    description: 'Update the current user avatar',
    tags: ['Users'],
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully updated user avatar',
        content: {
          'application/json': { schema: resolver(UserBaseSchema) },
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
  bodyLimit({ maxSize: 1024 * 1024 * 5 }),
  authenticate,
  validator('form', AvatarUpdateSchema),
  async (c) => {
    const payload = c.get('jwtPayload') as { sub: number };
    const userId = payload.sub;

    const { avatar } = c.req.valid('form');

    const extension = extensions[avatar.type] || 'png';

    const filename = `${userId}.${extension}`;
    const filepath = `${AVATAR_DIR}/${filename}`;

    await Bun.write(filepath, avatar);

    const url = `${process.env.BACKEND_URL}/static/avatars/${filename}`;

    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          avatarUrl: url,
        })
        .where(eq(users.id, userId))
        .returning({
          username: users.username,
          displayName: users.displayName,
          bio: users.bio,
          avatarUrl: users.avatarUrl,
        });

      if (!updatedUser) {
        throw new HTTPException(401, { message: 'User account no longer exists' });
      }

      return c.json(updatedUser);
    } catch (error) {
      await Bun.file(filepath).delete();

      throw error;
    }
  },
);

export default app;
