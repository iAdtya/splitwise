import {
  pgTable,
  serial,
  text,
  varchar,
  date,
  timestamp,
  foreignKey,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  default_currency: varchar("default_currency", { length: 10 }).notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  members: text("members").array().notNull(),
  date: date("date").notNull(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export type InsertExpense = typeof expenses.$inferInsert;
export type SelectExpense = typeof expenses.$inferSelect;

export const balances = pgTable("balances", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  balance_with_user_id: integer("balance_with_user_id").notNull().references(() => users.id),
  balance_amount: numeric("balance_amount", {precision: 10, scale: 2}).notNull(),
});

export type InsertBalance = typeof balances.$inferInsert;
export type SelectBalance = typeof balances.$inferSelect;

