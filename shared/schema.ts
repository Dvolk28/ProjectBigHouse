import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const buildings = pgTable("buildings", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  height: integer("height").notNull(),
  width: integer("width").notNull(),
  style: text("style").notNull().default("modern"),
  zIndex: integer("z_index").notNull().default(1),
  isLit: boolean("is_lit").notNull().default(false),
  ownerName: text("owner_name"),
  goal: text("goal"),
});

export const insertBuildingSchema = createInsertSchema(buildings).omit({
  id: true,
});

export const illuminateBuildingSchema = z.object({
  name: z.string().min(2).max(50),
  goal: z.string().min(10).max(200),
});

export type InsertBuilding = z.infer<typeof insertBuildingSchema>;
export type Building = typeof buildings.$inferSelect;
export type IlluminateBuilding = z.infer<typeof illuminateBuildingSchema>;
