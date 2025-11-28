import Skyline from "../Skyline";
import { BuildingData } from "../Building";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function SkylineExample() {
  const buildings: BuildingData[] = [
    { id: "1", name: "Society Tower", height: 90, width: 28, isLit: false, style: "modern", zIndex: 1 },
    { id: "2", name: "Federal Reserve", height: 120, width: 45, isLit: true, ownerName: "Jordan Lee", goal: "Become a doctor", style: "fedReserve", zIndex: 2 },
    { id: "3", name: "Key Tower", height: 320, width: 60, isLit: true, ownerName: "Sam Wilson", goal: "Start a tech company", style: "keyTower", zIndex: 10 },
    { id: "4", name: "PNC Center", height: 240, width: 48, isLit: false, style: "pnc", zIndex: 6 },
    { id: "5", name: "Terminal Tower", height: 280, width: 55, isLit: true, ownerName: "Riley Chen", goal: "Travel the world", style: "terminalTower", zIndex: 9 },
    { id: "6", name: "200 Public Square", height: 260, width: 52, isLit: false, style: "publicSquare", zIndex: 8 },
    { id: "7", name: "Erieview", height: 220, width: 38, isLit: true, ownerName: "Taylor Kim", goal: "Write a bestselling novel", style: "erieview", zIndex: 7 },
  ];

  return (
    <TooltipProvider>
      <div className="h-[450px]" style={{ background: "linear-gradient(to bottom, #070b14, #0a0f1a)" }}>
        <Skyline buildings={buildings} onBuildingClick={(id) => console.log(`Building ${id} clicked`)} />
      </div>
    </TooltipProvider>
  );
}
