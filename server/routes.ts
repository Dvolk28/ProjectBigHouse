import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createIlluminationSchema, illuminateBuildingSchema, type IlluminationRecord } from "@shared/schema";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

const lights: IlluminationRecord[] = [];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Initialize buildings on server start
  await storage.initializeBuildings();

  // Get all buildings
  app.get("/api/buildings", async (_req, res) => {
    try {
      const buildings = await storage.getAllBuildings();
      res.json(buildings);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      res.status(500).json({ message: "Failed to fetch buildings" });
    }
  });

  // Illuminate a random unlit building
  app.post("/api/illuminate", async (req, res) => {
    try {
      const data = illuminateBuildingSchema.parse(req.body);
      
      // Get all unlit buildings
@@ -44,50 +46,75 @@ export async function registerRoutes(
      
      // Illuminate the building
      const illuminatedBuilding = await storage.illuminateBuilding(
        selectedBuilding.id,
        data.name,
        data.goal
      );
      
      if (!illuminatedBuilding) {
        return res.status(500).json({ 
          message: "Failed to illuminate building" 
        });
      }
      
      res.json(illuminatedBuilding);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error illuminating building:", error);
      res.status(500).json({ message: "Failed to illuminate building" });
    }
  });

  app.get("/api/lights", async (_req, res) => {
    res.json(lights);
  });

  app.post("/api/lights", async (req, res) => {
    try {
      const parsed = createIlluminationSchema.parse(req.body);
      const newLight: IlluminationRecord = {
        ...parsed,
        timestamp: new Date().toISOString(),
      };

      lights.push(newLight);
      res.status(201).json(newLight);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error saving light:", error);
      res.status(500).json({ message: "Failed to save light" });
    }
  });

  // Get stats (lit count and total)
  app.get("/api/stats", async (_req, res) => {
    try {
      const buildings = await storage.getAllBuildings();
      const litCount = buildings.filter(b => b.isLit).length;
      res.json({
        litCount,
        totalCount: buildings.length,
        availableCount: buildings.length - litCount
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Reset all lights
  app.post("/api/reset", async (_req, res) => {
    try {
      await storage.resetLights();
      res.json({ message: "Skyline reset successfully" });
    } catch (error) {
      console.error("Error resetting skyline:", error);
      res.status(500).json({ message: "Failed to reset skyline" });
    }
