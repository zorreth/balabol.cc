import { Context, Hono } from 'hono';
import { googleAuth } from '@hono/oauth-providers/google';
import { discordAuth } from '@hono/oauth-providers/discord';
import { githubAuth } from '@hono/oauth-providers/github';
import { db } from '../db';
import { links, users } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';
import {
  parseConnections,
  type DiscordConnection,
} from '../../utils/discord-connections';
import { getUniqueUsername } from '../../utils/username';

const app = new Hono();

async function addTokenCookie(c: Context, userId: number) {
  const expiresIn = 60 * 60 * 24 * 7;
  const exp = Math.floor(Date.now() / 1000) + expiresIn;

  const jwt = await sign(
    {
      sub: userId,
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
}

app.get(
  '/google',
  googleAuth({
    client_id: process.env.GOOGLE_ID!,
    client_secret: process.env.GOOGLE_SECRET!,
    scope: ['openid', 'profile', 'email'],
  }),
  async (c) => {
    const googleUser = c.get('user-google');

    if (!googleUser?.id) {
      return c.redirect(process.env.FRONTEND_URL! + '/error?cause=provider');
    }

    let [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.provider, 'google'), eq(users.providerId, googleUser.id)))
      .limit(1);

    if (!user) {
      // Replace the default size parameter =s96 with =s1024, providing larger avatar resolution.
      const highResAvatar =
        googleUser.picture?.replace(/=s\d+(-c)/, '=s1024') || googleUser.picture;

      const [createdUser] = await db
        .insert(users)
        .values({
          username: await getUniqueUsername(googleUser.name),
          displayName: googleUser.name,
          avatarUrl: highResAvatar,
          provider: 'google',
          providerId: googleUser.id,
        })
        .returning();

      user = createdUser;
    }

    if (!user) {
      return c.redirect(process.env.FRONTEND_URL! + '/error?cause=server');
    }

    addTokenCookie(c, user.id);
    return c.redirect(`${process.env.FRONTEND_URL!}/${user.username}`);
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
      return c.redirect(process.env.FRONTEND_URL! + '/error?cause=provider');
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
          username: await getUniqueUsername(discordUser.username),
          displayName: discordUser.global_name ?? discordUser.username,
          avatarUrl: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=1024`
            : null,
          provider: 'discord',
          providerId: discordUser.id,
        })
        .returning();

      if (!createdUser) {
        return c.redirect(process.env.FRONTEND_URL! + '/error?cause=server');
      }

      user = createdUser;

      try {
        const res = await fetch('https://discord.com/api/v10/users/@me/connections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const connections = (await res.json()) as DiscordConnection[];

        await db.insert(links).values(parseConnections(connections, user.id));
      } catch (err) {
        console.warn('Failed to fetch Discord connections:', err);
      }
    }

    await addTokenCookie(c, user.id);
    return c.redirect(`${process.env.FRONTEND_URL!}/${user.username}`);
  },
);

app.get(
  '/github',
  githubAuth({
    client_id: process.env.GITHUB_ID!,
    client_secret: process.env.GITHUB_SECRET!,
    scope: ['user:email'],
  }),
  async (c) => {
    const githubUser = c.get('user-github');

    if (!githubUser?.id) {
      return c.redirect(process.env.FRONTEND_URL! + '/error?cause=provider');
    }

    let [user] = await db
      .select()
      .from(users)
      .where(
        and(eq(users.provider, 'github'), eq(users.providerId, String(githubUser.id))),
      )
      .limit(1);

    if (!user) {
      let highResAvatar = githubUser.avatar_url;

      if (highResAvatar) {
        const url = new URL(highResAvatar);
        url.searchParams.set('size', '1024');
        highResAvatar = url.toString();
      }

      const [createdUser] = await db
        .insert(users)
        .values({
          username: await getUniqueUsername(githubUser.login),
          displayName: githubUser.name ?? githubUser.login,
          bio: githubUser.bio,
          avatarUrl: highResAvatar,
          provider: 'github',
          providerId: String(githubUser.id),
        })
        .returning();

      user = createdUser;
    }

    if (!user) {
      return c.redirect(process.env.FRONTEND_URL! + '/error?cause=server');
    }

    await addTokenCookie(c, user.id);
    return c.redirect(`${process.env.FRONTEND_URL!}/${user.username}`);
  },
);

export default app;
