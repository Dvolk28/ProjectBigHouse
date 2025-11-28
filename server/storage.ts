import { type User, type InsertUser, type Building } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllBuildings(): Promise<Building[]>;
  getBuilding(id: string): Promise<Building | undefined>;
  getUnlitBuildings(): Promise<Building[]>;
  illuminateBuilding(id: string, ownerName: string, goal: string): Promise<Building | undefined>;
  initializeBuildings(): Promise<void>;
}

const initialBuildingsData: Omit<Building, "isLit" | "ownerName" | "goal">[] = [
  { id: "b1", name: "Building 1", height: 100, width: 28, style: "modern", zIndex: 1 },
  { id: "b2", name: "Building 2", height: 140, width: 32, style: "classic", zIndex: 2 },
  { id: "b3", name: "Building 3", height: 180, width: 38, style: "modern", zIndex: 3 },
  { id: "b4", name: "200 Public Square", height: 220, width: 50, style: "tower", zIndex: 4 },
  { id: "b5", name: "Building 5", height: 260, width: 42, style: "modern", zIndex: 5 },
  { id: "b6", name: "Key Tower", height: 320, width: 58, style: "spire", zIndex: 10 },
  { id: "b7", name: "Terminal Tower", height: 280, width: 52, style: "tower", zIndex: 8 },
  { id: "b8", name: "Building 8", height: 240, width: 44, style: "classic", zIndex: 6 },
  { id: "b9", name: "Building 9", height: 200, width: 40, style: "modern", zIndex: 4 },
  { id: "b10", name: "Building 10", height: 160, width: 36, style: "tower", zIndex: 3 },
  { id: "b11", name: "Building 11", height: 130, width: 34, style: "modern", zIndex: 2 },
  { id: "b12", name: "Building 12", height: 110, width: 30, style: "classic", zIndex: 1 },
  { id: "b13", name: "Building 13", height: 90, width: 26, style: "modern", zIndex: 1 },
  { id: "b14", name: "Building 14", height: 150, width: 35, style: "tower", zIndex: 2 },
  { id: "b15", name: "Building 15", height: 190, width: 42, style: "classic", zIndex: 3 },
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private buildings: Map<string, Building>;

  constructor() {
    this.users = new Map();
    this.buildings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllBuildings(): Promise<Building[]> {
    return Array.from(this.buildings.values());
  }

  async getBuilding(id: string): Promise<Building | undefined> {
    return this.buildings.get(id);
  }

  async getUnlitBuildings(): Promise<Building[]> {
    return Array.from(this.buildings.values()).filter(b => !b.isLit);
  }

  async illuminateBuilding(id: string, ownerName: string, goal: string): Promise<Building | undefined> {
    const building = this.buildings.get(id);
    if (!building || building.isLit) {
      return undefined;
    }
    
    const updatedBuilding: Building = {
      ...building,
      isLit: true,
      ownerName,
      goal,
    };
    
    this.buildings.set(id, updatedBuilding);
    return updatedBuilding;
  }

  async initializeBuildings(): Promise<void> {
    if (this.buildings.size === 0) {
      for (const buildingData of initialBuildingsData) {
        const building: Building = {
          ...buildingData,
          isLit: false,
          ownerName: null,
          goal: null,
        };
        this.buildings.set(building.id, building);
      }
    }
  }
}

export const storage = new MemStorage();
