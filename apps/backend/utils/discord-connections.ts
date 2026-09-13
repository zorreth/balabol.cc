import { links } from '../src/db/schema';

const SUPPORTED_PLATFORMS = [
  'bluesky',
  'twitter',
  'reddit',
  'facebook',
  'youtube',
  'twitch',
  'spotify',
  'github',
  'domain',
  'steam',
  'paypal',
] as const;

type ConnectionType = (typeof SUPPORTED_PLATFORMS)[number];

export type DiscordConnection = {
  id: string;
  name: string;
  type: ConnectionType;
  visibility: number;
};

export function parseConnections(
  connections: DiscordConnection[],
  userId: number,
): (typeof links.$inferInsert)[] {
  return connections
    .filter((conn) => conn.visibility && SUPPORTED_PLATFORMS.includes(conn.type))
    .map((conn) => {
      switch (conn.type) {
        case 'bluesky':
          return {
            name: 'Bluesky',
            url: `https://bsky.app/profile/${conn.name}`,
            userId,
          };
        case 'twitter':
          return {
            name: 'X',
            url: `https://x.com/${conn.name}`,
            userId,
          };
        case 'reddit':
          return {
            name: 'Reddit',
            url: `https://www.reddit.com/user/${conn.name}`,
            userId,
          };
        case 'facebook':
          return {
            name: 'Facebook',
            url: `https://facebook.com/${conn.name}`,
            userId,
          };
        case 'youtube':
          return {
            name: 'YouTube',
            url: `https://www.youtube.com/channel/${conn.id}`,
            userId,
          };
        case 'twitch':
          return {
            name: 'Twitch',
            url: `https://www.twitch.tv/${conn.name}`,
            userId,
          };
        case 'spotify':
          return {
            name: 'Spotify',
            url: `https://open.spotify.com/user/${conn.id}`,
            userId,
          };
        case 'github':
          return {
            name: 'GitHub',
            url: `https://github.com/${conn.name}`,
            userId,
          };
        case 'domain':
          return {
            name: 'Website',
            url: `https://${conn.name}`,
            userId,
          };
        case 'steam':
          return {
            name: 'Steam',
            url: `https://steamcommunity.com/profiles/${conn.id}`,
            userId,
          };
        case 'paypal':
          return {
            name: 'PayPal',
            url: `https://paypal.me/${conn.name}`,
            userId,
          };
      }
    });
}
