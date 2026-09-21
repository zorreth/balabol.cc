import { Hono } from 'hono';
import { describeRoute, validator, resolver } from 'hono-openapi';
import { db } from '../db';
import { links } from '../db/schema';
import { HTTPException } from 'hono/http-exception';
import {
  ErrorSchema,
  LinkCreateSchema,
  LinkSchema,
  LinkUpdateSchema,
} from '@repo/schemas';
import { and, eq } from 'drizzle-orm';
import { authenticate } from '../../utils/authenticate';

const app = new Hono();

app.post(
  '/',
  describeRoute({
    description: 'Create a new link',
    tags: ['Links'],
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
  authenticate,
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

app.delete(
  '/:id',
  describeRoute({
    description: 'Delete link by ID',
    tags: ['Links'],
    responses: {
      204: {
        description: 'Successfully deleted link',
      },
      404: {
        description: 'Link not found',
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

    const linkId = c.req.param('id');

    const deletedRows = await db
      .delete(links)
      .where(and(eq(links.id, Number(linkId)), eq(links.userId, userId)))
      .returning();

    if (!deletedRows.length) {
      throw new HTTPException(404, { message: 'Link not found' });
    }

    return c.body(null, 204);
  },
);

app.patch(
  '/:id',
  describeRoute({
    description: 'Update link by ID',
    tags: ['Links'],
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully updated link',
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
      404: {
        description: 'Link not found',
        content: {
          'application/json': { schema: resolver(ErrorSchema) },
        },
      },
    },
  }),
  authenticate,
  validator('json', LinkUpdateSchema),
  async (c) => {
    const payload = c.get('jwtPayload') as { sub: number };
    const userId = payload.sub;

    const linkIdParam = c.req.param('id');
    const linkId = parseInt(linkIdParam);

    if (isNaN(linkId)) {
      throw new HTTPException(400, { message: 'Invalid link ID format' });
    }

    const body = c.req.valid('json');

    const [updatedLink] = await db
      .update(links)
      .set({
        name: body.name,
        url: body.url,
      })
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .returning({
        id: links.id,
        name: links.name,
        url: links.url,
      });

    if (!updatedLink) {
      throw new HTTPException(404, { message: 'Link not found' });
    }

    return c.json(updatedLink);
  },
);

export default app;
