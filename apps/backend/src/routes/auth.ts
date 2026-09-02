import { Hono } from 'hono';
import { googleAuth } from '@hono/oauth-providers/google';
import { discordAuth } from '@hono/oauth-providers/discord';
import { githubAuth } from '@hono/oauth-providers/github';
import { db } from '../db';
import { users } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';

const app = new Hono();

app.get(
  '/google',
  googleAuth({
    client_id: process.env.GOOGLE_ID!,
    client_secret: process.env.GOOGLE_SECRET!,
    scope: ['openid', 'profile', 'email'],
  }),
  async (c) => {
    const googleUser = c.get('user-google');
    return c.redirect(process.env.FRONTEND_URL! + '/me/settings');
  },
);

app.get(
  '/discord',
  discordAuth({
    client_id: process.env.DISCORD_ID!,
    client_secret: process.env.DISCORD_SECRET!,
    scope: ['identify', 'email', 'connections'],
  }),
  async (c) => {
    const discordUser = c.get('user-discord');
    const token = c.get('token')?.token;

    if (!discordUser?.id) {
      return c.redirect(process.env.FRONTEND_URL! + '/me/auth?error=provider');
    }

    let [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.provider, 'discord'), eq(users.providerId, discordUser.id)))
      .limit(1);

    if (!user) {
      const [createdUser] = await db
        .insert(users)
        .values({
          displayName: discordUser.global_name ?? discordUser.username,
          provider: 'discord',
          providerId: discordUser.id,
        })
        .returning();

      try {
        const res = await fetch('https://discord.com/api/v10/users/@me/connections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // TODO: Add connections as user links
        // const connections = await res.json();
      } catch (err) {
        console.warn('Failed to fetch Discord connections:', err);
      }

      user = createdUser;
    }

    if (!user) {
      return c.redirect(process.env.FRONTEND_URL! + '/me/auth?error=server');
    }

    const expiresIn = 60 * 60 * 24 * 7;

    const exp = Math.floor(Date.now() / 1000) + expiresIn;

    const jwt = await sign(
      {
        sub: user.id,
        exp,
      },
      process.env.JWT_SECRET!,
    );

    setCookie(c, 'token', jwt, {
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
    });

    return c.redirect(process.env.FRONTEND_URL! + '/me/settings');
  },
);

app.get(
  '/github',
  githubAuth({
    client_id: process.env.GITHUB_ID!,
    client_secret: process.env.GITHUB_SECRET!,
  }),
  async (c) => {
    const githubUser = c.get('user-github');
    return c.redirect(process.env.FRONTEND_URL! + '/me/settings');
  },
);

export default app;
