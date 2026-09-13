import { eq } from 'drizzle-orm';
import { db } from '../src/db';
import { users } from '../src/db/schema';

const ADJECTIVES = [
  'Exciting',
  'Chilly',
  'Fabulous',
  'Gloomy',
  'Magical',
  'Cool',
  'Colorful',
  'Hopeful',
  'Smiling',
  'Shy',
];

const ANIMALS = [
  'Tiger',
  'Beaver',
  'Mustang',
  'Puma',
  'Dolphin',
  'Wildcat',
  'Llama',
  'Mongoose',
  'Kitten',
  'Monkey',
];

function getRandomSuffix(): number {
  return Math.floor(Math.random() * 900) + 100;
}

function getRandomUsername(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adjective}${animal}${getRandomSuffix()}`;
}

export async function getUniqueUsername(name?: string): Promise<string> {
  if (!name || !/^[a-zA-Z0-9_\- ]+$/.test(name)) {
    return getRandomUsername();
  }

  let username = name.replaceAll(' ', '').trim();

  const foundUsers = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (foundUsers.length > 0) {
    username = `${username}${getRandomSuffix()}`;
  }

  return username;
}
