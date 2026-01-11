import { useState } from "react";

const CLEVELAND_BUILDINGS = [
  // Terminal Tower: Tiered spire
  { name: "Terminal Tower", type: "spire", height: "h-80", width: "w-24", windowRows: 8, windowCols: 3 },
  // The 9: Modern glass
  { name: "The 9", type: "flat", height: "h-52", width: "w-16", windowRows: 12, windowCols: 2 },
  // Key Tower: The big pyramid
  { name: "Key Tower", type: "pyramid", height: "h-96", width: "w-28", windowRows: 14, windowCols: 4 },
  // 200 Public Sq: Angled roof
  { name: "200 Public Sq", type: "angled", height: "h-72", width: "w-24", windowRows: 10, windowCols: 3 },
  // Generic fillers for density
  { name: "Ernst & Young", type: "flat", height: "h-48", width: "w-20", windowRows: 8, windowCols: 3 },
  { name: "PNC Center", type: "flat", height: "h-60", width: "w-20", windowRows: 10, windowCols: 3 },
];

export function Skyline({ lights, onLightClick }: { lights: any[], onLightClick: (id: number) => void }) {
  const [hoveredLight, setHoveredLight] = useState<any | null>(null);

  // Helper to find if a window is lit
  const getLight = (id: number) => lights.find((l) => l.windowId === id);

  let globalWindowCount = 0;

  return (
    // CONTAINER: Transparent background (blends into the Home page dark purple)
    <div className="relative w-full h-[600px] flex items-end justify-center gap-4 px-4 overflow-hidden">
      
      {/* HOVER TOOLTIP */}
      {hoveredLight && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
          <div className="bg-black/90 backdrop-blur-md border border-purple-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] text-center min-w-[200px]">
            <h3 className="text-lg font-bold text-white mb-1">{hoveredLight.name}</h3>
            <p className="text-purple-300 italic text-sm">"{hoveredLight.message}"</p>
          </div>
        </div>
      )}

      {/* RENDER BUILDINGS */}
      {CLEVELAND_BUILDINGS.map((building, bIndex) => {
        const windows = [];
        const totalWindows = building.windowRows * building.windowCols;

        for (let i = 0; i < totalWindows; i++) {
          globalWindowCount++;
          const currentId = globalWindowCount;
          const lightData = getLight(currentId);
          const isLit = !!lightData;

          windows.push(
            <div
              key={currentId}
              onClick={() => onLightClick(currentId)}
              onMouseEnter={() => isLit && setHoveredLight(lightData)}
              onMouseLeave={() => setHoveredLight(null)}
              className={`
                w-full h-full rounded-[1px] cursor-pointer transition-all duration-300
                ${isLit 
                  ? "bg-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.6)] z-10 scale-105" 
                  : "bg-white/5 hover:bg-white/10 border border-white/5"}
              `}
            />
          );
        }

        return (
          <div key={bIndex} className={`flex flex-col items-center justify-end group ${building.width}`}>
            
            {/* --- ROOF TOPPERS (The Cleveland Look) --- */}
            
            {/* Terminal Tower Spire */}
            {building.type === "spire" && (
              <div className="flex flex-col items-center relative top-1">
                <div className="w-1 h-16 bg-slate-800/80"></div>
                <div className="w-6 h-6 bg-slate-800/80 rounded-t-sm border-t border-white/10"></div>
                <div className="w-16 h-8 bg-slate-800/80 rounded-t-md border-t border-white/10"></div>
              </div>
            )}

            {/* Key Tower Pyramid */}
            {building.type === "pyramid" && (
               // CSS Triangle for the pyramid
               <div className="w-0 h-0 border-l-[35px] border-r-[35px] border-b-[50px] border-l-transparent border-r-transparent border-b-slate-800/90 relative top-1 drop-shadow-2xl"></div>
            )}

            {/* 200 Public Sq Angled Roof */}
            {building.type === "angled" && (
               <div className="w-full h-8 bg-slate-800/90 transform skew-y-6 border-t border-white/10 mb-[-5px] relative top-1"></div>
            )}

            {/* --- BUILDING BODY --- */}
            <div 
              className={`
                w-full ${building.height} bg-slate-900/90 backdrop-blur-sm border-x border-t border-white/10 relative p-2 shadow-2xl
                grid gap-1
              `}
              style={{
                gridTemplateColumns: `repeat(${building.windowCols}, 1fr)`,
                gridTemplateRows: `repeat(${building.windowRows}, 1fr)`,
                boxShadow: "0 0 50px rgba(0,0,0,0.5)" 
              }}
            >
              {/* Windows Grid */}
              {windows}
            </div>
          </div>
        );
      })}
    </div>
  );
}
