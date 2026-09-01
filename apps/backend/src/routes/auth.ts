import { Hono } from 'hono';
import { googleAuth } from '@hono/oauth-providers/google';
import { discordAuth } from '@hono/oauth-providers/discord';
import { githubAuth } from '@hono/oauth-providers/github';

const app = new Hono();

app.get('/google', googleAuth({ scope: ['openid', 'profile', 'email'] }), async (c) => {
  const googleUser = c.get('user-google');
  return c.redirect(process.env.FRONTEND_URL! + '/me/settings');
});

app.get('/discord', discordAuth({ scope: ['identify', 'email'] }), async (c) => {
  const discordUser = c.get('user-discord');
  return c.redirect(process.env.FRONTEND_URL! + '/me/settings');
});

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
