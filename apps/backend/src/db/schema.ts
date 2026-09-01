import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  username: varchar('username', { length: 64 }).primaryKey(),
  displayName: varchar('display_name', { length: 64 }),
  bio: varchar('bio', { length: 500 }),
  avatarUrl: varchar('avatar_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
