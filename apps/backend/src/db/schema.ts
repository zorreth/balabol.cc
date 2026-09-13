import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 64 }).notNull().unique(),
  displayName: varchar('display_name', { length: 64 }),
  bio: varchar({ length: 500 }),
  avatarUrl: varchar('avatar_url'),
  provider: varchar().notNull(),
  providerId: varchar('provider_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const links = pgTable('links', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 64 }).notNull(),
  url: varchar().notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const relations = defineRelations({ users, links }, (r) => ({
  links: {
    user: r.one.users({
      from: r.links.userId,
      to: r.users.id,
    }),
  },
  users: {
    links: r.many.links(),
  },
}));
