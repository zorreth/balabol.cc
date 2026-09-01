import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 64 }).unique(),
  displayName: varchar('display_name', { length: 64 }),
  bio: varchar('bio', { length: 500 }),
  avatarUrl: varchar('avatar_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const identities = pgTable('identities', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  provider: varchar('provider').notNull(),
  providerId: varchar('provider_id').notNull(),
});

export const relations = defineRelations({ users, identities }, (r) => ({
  identities: {
    user: r.one.users({
      from: r.identities.userId,
      to: r.users.id,
    }),
  },
}));
