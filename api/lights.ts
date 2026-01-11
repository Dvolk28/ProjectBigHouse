import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

// 1. Setup the connection to your Neon Database
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// 2. Define what the "Lights" table looks like
// (This matches the structure we set up earlier)
const lights = pgTable('lights', {
  id: serial('id').primaryKey(),
  windowId: integer('window_id').notNull(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  color: text('color').notNull(),
});

// 3. The Function that handles the "Illuminate" button
export default async function handler(req: any, res: any) {
  // Allow the browser to talk to this function (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // SCENARIO A: The website asks "Which lights are on?" (GET)
    if (req.method === 'GET') {
      const allLights = await db.select().from(lights);
      return res.status(200).json(allLights);
    }

    // SCENARIO B: You click "Illuminate" (POST)
    if (req.method === 'POST') {
      const body = req.body;
      
      // Save the new light to Neon
      const newLight = await db.insert(lights).values({
        windowId: body.windowId,
        name: body.name,
        message: body.message || "",
        color: body.color || "yellow"
      }).returning();

      return res.status(200).json(newLight[0]);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: String(error) });
  }
}
