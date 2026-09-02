import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 64 }).unique(),
  displayName: varchar('display_name', { length: 64 }),
  bio: varchar('bio', { length: 500 }),
  avatarUrl: varchar('avatar_url'),
  provider: varchar('provider').notNull(),
  providerId: varchar('provider_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
