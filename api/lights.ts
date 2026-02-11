import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const lights = pgTable("lights", {
  id: serial("id").primaryKey(),
  windowId: integer("window_id").notNull(),
  name: text("name").notNull(),
  goal: text("goal").notNull(),
  color: text("color").notNull(),
  timestamp: text("timestamp").notNull(),
});

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const allLights = await db.select().from(lights);
      return res.status(200).json(
        allLights.map(({ id: _id, ...light }) => light),
      );
    }

    if (req.method === "POST") {
      const body = req.body;
      const timestamp = new Date().toISOString();
      const [newLight] = await db
        .insert(lights)
        .values({
          windowId: body.windowId,
          name: body.name,
          goal: body.goal,
          color: body.color || "yellow",
          timestamp,
        })
        .returning();

      const { id: _id, ...light } = newLight;
      return res.status(201).json(light);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error", details: String(error) });
  }
}
