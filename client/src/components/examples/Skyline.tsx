import Skyline from "../Skyline";
import { BuildingData } from "../Building";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function SkylineExample() {
  const buildings: BuildingData[] = [
    { id: "1", name: "Building 1", height: 120, width: 35, isLit: false, style: "modern", zIndex: 1 },
    { id: "2", name: "Building 2", height: 160, width: 40, isLit: true, ownerName: "Jordan Lee", goal: "Become a doctor", style: "classic", zIndex: 2 },
    { id: "3", name: "Key Tower", height: 280, width: 55, isLit: true, ownerName: "Sam Wilson", goal: "Start a tech company", style: "spire", zIndex: 5 },
    { id: "4", name: "Building 4", height: 200, width: 45, isLit: false, style: "tower", zIndex: 3 },
    { id: "5", name: "Terminal Tower", height: 240, width: 50, isLit: true, ownerName: "Riley Chen", goal: "Travel the world", style: "tower", zIndex: 4 },
    { id: "6", name: "Building 6", height: 180, width: 42, isLit: false, style: "modern", zIndex: 2 },
    { id: "7", name: "Building 7", height: 140, width: 38, isLit: true, ownerName: "Taylor Kim", goal: "Write a bestselling novel", style: "classic", zIndex: 1 },
  ];

  return (
    <TooltipProvider>
      <div className="h-[400px]" style={{ background: "linear-gradient(to bottom, #070b14, #0a0f1a)" }}>
        <Skyline buildings={buildings} onBuildingClick={(id) => console.log(`Building ${id} clicked`)} />
      </div>
    </TooltipProvider>
  );
}
