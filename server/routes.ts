import type { Express } from "express";
import type { Server } from "http";
import {
  createIlluminationSchema,
  illuminationRecordListSchema,
  illuminationRecordSchema,
  skylineStatsSchema,
  type IlluminationRecord,
} from "@shared/schema";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

const TOTAL_WINDOWS = 5000;
const lightsByWindowId = new Map<number, IlluminationRecord>();

const getOrderedLights = () =>
  Array.from(lightsByWindowId.values()).sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/lights", (_req, res) => {
    const lights = illuminationRecordListSchema.parse(getOrderedLights());
    res.json(lights);
  });

  app.post("/api/lights", (req, res) => {
    try {
      const parsed = createIlluminationSchema.parse(req.body);
      const timestamp = new Date().toISOString();

      const newLight: IlluminationRecord = {
        ...parsed,
        timestamp,
      };

      lightsByWindowId.set(newLight.windowId, newLight);
      res.status(201).json(illuminationRecordSchema.parse(newLight));
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error saving light:", error);
      res.status(500).json({ message: "Failed to save light" });
    }
  });

  app.get("/api/stats", (_req, res) => {
    const litCount = lightsByWindowId.size;
    const stats = skylineStatsSchema.parse({
      litCount,
      totalCount: TOTAL_WINDOWS,
      availableCount: TOTAL_WINDOWS - litCount,
    });
    res.json(stats);
  });

  app.post("/api/reset", (_req, res) => {
    lightsByWindowId.clear();
    res.json({ message: "Skyline reset successfully" });
  });

  return httpServer;
}
