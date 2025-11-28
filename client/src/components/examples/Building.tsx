import Building, { BuildingData } from "../Building";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function BuildingExample() {
  const buildings: BuildingData[] = [
    { id: "1", name: "Tower 1", height: 200, width: 50, isLit: false, style: "modern" },
    { id: "2", name: "Key Tower", height: 280, width: 60, isLit: true, ownerName: "Alex Chen", goal: "To become a software engineer and build apps that help people", style: "spire" },
    { id: "3", name: "Terminal Tower", height: 240, width: 55, isLit: true, ownerName: "Maria Santos", goal: "Launch my own business by age 25", style: "tower" },
    { id: "4", name: "Classic Building", height: 180, width: 65, isLit: false, style: "classic" },
  ];

  return (
    <TooltipProvider>
      <div className="p-8" style={{ background: "linear-gradient(to bottom, #070b14, #0a0f1a)" }}>
        <div className="flex items-end justify-center gap-4">
          {buildings.map((building) => (
            <Building
              key={building.id}
              building={building}
              onLight={() => console.log(`Building ${building.id} clicked`)}
            />
          ))}
        </div>
        <p className="text-center text-white/50 text-sm mt-4">Hover over lit buildings to see tooltips</p>
      </div>
    </TooltipProvider>
  );
}
