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
  resetLights(): Promise<void>;
  initializeBuildings(): Promise<void>;
}

const initialBuildingsData: Omit<Building, "isLit" | "ownerName" | "goal">[] = [
  { id: "b1", name: "Society Tower", height: 90, width: 28, style: "modern", zIndex: 1 },
  { id: "b2", name: "Celebrezze Building", height: 130, width: 35, style: "fedReserve", zIndex: 2 },
  { id: "b3", name: "One Cleveland Center", height: 170, width: 40, style: "huntington", zIndex: 3 },
  { id: "b4", name: "Federal Reserve Bank", height: 120, width: 45, style: "fedReserve", zIndex: 2 },
  { id: "b5", name: "Huntington Building", height: 200, width: 42, style: "huntington", zIndex: 5 },
  { id: "b6", name: "PNC Center", height: 240, width: 48, style: "pnc", zIndex: 6 },
  { id: "b7", name: "Key Tower", height: 320, width: 60, style: "keyTower", zIndex: 10 },
  { id: "b8", name: "Terminal Tower", height: 280, width: 55, style: "terminalTower", zIndex: 9 },
  { id: "b9", name: "200 Public Square", height: 260, width: 52, style: "publicSquare", zIndex: 8 },
  { id: "b10", name: "Tower at Erieview", height: 220, width: 38, style: "erieview", zIndex: 7 },
  { id: "b11", name: "55 Public Square", height: 180, width: 44, style: "modern", zIndex: 4 },
  { id: "b12", name: "EY Tower", height: 150, width: 36, style: "modern", zIndex: 3 },
  { id: "b13", name: "Justice Center", height: 140, width: 50, style: "classic", zIndex: 2 },
  { id: "b14", name: "Ritz-Carlton", height: 110, width: 32, style: "classic", zIndex: 1 },
  { id: "b15", name: "Sherwin-Williams HQ", height: 100, width: 30, style: "modern", zIndex: 1 },
  { id: "b16", name: "AECOM Building", height: 160, width: 38, style: "modern", zIndex: 4 },
  { id: "b17", name: "Diamond Building", height: 140, width: 35, style: "classic", zIndex: 3 },
  { id: "b18", name: "North Point Tower", height: 180, width: 42, style: "modern", zIndex: 5 },
  { id: "b19", name: "Standard Building", height: 210, width: 40, style: "tower", zIndex: 6 },
  { id: "b20", name: "Rhodes Tower", height: 190, width: 38, style: "modern", zIndex: 5 },
  { id: "b21", name: "US Bank Centre", height: 150, width: 34, style: "modern", zIndex: 3 },
  { id: "b22", name: "Penton Media Design Center", height: 130, width: 40, style: "classic", zIndex: 2 },
  { id: "b23", name: "Ohio Bell Building", height: 170, width: 44, style: "tower", zIndex: 4 },
  { id: "b24", name: "Hanna Building", height: 110, width: 36, style: "classic", zIndex: 2 },
  { id: "b25", name: "Euclid Tower", height: 140, width: 32, style: "modern", zIndex: 1 },
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private buildings: Map<string, Building>;

  constructor() {
        this.users = new Map();
        this.buildings = new Map();

        // Force load buildings immediately
        initialBuildingsData.forEach((buildingData) => {
            const building: Building = {
                ...buildingData,
                isLit: false,
                ownerName: null,
                goal: null,
            };
            this.buildings.set(building.id, building);
        });
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

  async resetLights(): Promise<void> {
    for (const [id, building] of this.buildings) {
      this.buildings.set(id, {
        ...building,
        isLit: false,
        ownerName: null,
        goal: null,
      });
    }
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
