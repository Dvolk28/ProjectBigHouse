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

export const illuminations = pgTable("illuminations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  windowId: integer("window_id").notNull(), // The unique number for each window (0-4999)
  name: text("name").notNull(),
  goal: text("goal").notNull(),
  color: text("color").notNull().default("yellow"),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

export const insertIlluminationSchema = createInsertSchema(illuminations).omit({
  timestamp: true,
});

export type Illumination = typeof illuminations.$inferSelect;
export type InsertIllumination = z.infer<typeof insertIlluminationSchema>;

export const illuminationRecordSchema = z.object({
  windowId: z.number().int().min(1).max(5000),
  name: z.string().min(2).max(50),
  goal: z.string().min(10).max(200),
  color: z.string().min(1).default("yellow"),
  timestamp: z.string(),
});

export const createIlluminationSchema = illuminationRecordSchema.omit({
  timestamp: true,
});

export type IlluminationRecord = z.infer<typeof illuminationRecordSchema>;
export type CreateIlluminationInput = z.infer<typeof createIlluminationSchema>;

// This keeps your form validation working
export const illuminateBuildingSchema = z.object({
  name: z.string().min(2).max(50),
  goal: z.string().min(10).max(200),
});
export type IlluminateBuilding = z.infer<typeof illuminateBuildingSchema>;
