import { useState } from "react";

// --- CONFIGURATION FOR THE CLEVELAND SKYLINE ---
const CLEVELAND_BUILDINGS = [
  { name: "Terminal Tower", type: "spire", height: "h-80", width: "w-24", windowRows: 8, windowCols: 3 },
  { name: "The 9", type: "flat", height: "h-52", width: "w-16", windowRows: 12, windowCols: 2 },
  { name: "Key Tower", type: "pyramid", height: "h-96", width: "w-28", windowRows: 14, windowCols: 4 },
  { name: "200 Public Sq", type: "angled", height: "h-72", width: "w-24", windowRows: 10, windowCols: 3 },
  { name: "Ernst & Young", type: "flat", height: "h-48", width: "w-20", windowRows: 8, windowCols: 3 },
  { name: "PNC Center", type: "flat", height: "h-60", width: "w-20", windowRows: 10, windowCols: 3 },
  { name: "Fifth Third", type: "flat", height: "h-56", width: "w-16", windowRows: 9, windowCols: 2 },
  { name: "Justice Center", type: "flat", height: "h-64", width: "w-24", windowRows: 10, windowCols: 3 },
  { name: "Hilton", type: "modern", height: "h-72", width: "w-20", windowRows: 12, windowCols: 3 },
  { name: "Carl B. Stokes", type: "flat", height: "h-52", width: "w-16", windowRows: 8, windowCols: 2 },
];

export function Skyline({ lights, onLightClick }: { lights: any[], onLightClick: (id: number) => void }) {
  const [hoveredLight, setHoveredLight] = useState<any | null>(null);

  // Helper to find if a window is lit
  const getLight = (id: number) => lights.find((l) => l.windowId === id);

  let globalWindowCount = 0;

  return (
    // MAIN CONTAINER - Dark Purple Gradient (No Blue Box)
    <div className="relative w-full h-[700px] flex items-end justify-center gap-4 px-4 overflow-hidden bg-gradient-to-t from-[#1a0b2e] via-[#2d1b4e] to-[#0f0518]">
      
      {/* BACKGROUND STARS */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
         <div className="absolute top-24 right-1/4 w-1 h-1 bg-white rounded-full opacity-40"></div>
         <div className="absolute top-1/3 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-50"></div>
      </div>

      {/* HOVER TOOLTIP */}
      {hoveredLight && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-fade-in-up">
          <div className="bg-black/80 backdrop-blur-md border border-purple-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] text-center min-w-[200px]">
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
                  ? "bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.8)] z-10 scale-110" 
                  : "bg-white/10 hover:bg-white/20 border border-white/5"}
              `}
            />
          );
        }

        return (
          <div key={bIndex} className={`flex flex-col items-center justify-end group ${building.width}`}>
            
            {/* --- ROOF TOPPERS (The "Cleveland" Look) --- */}
            
            {/* Terminal Tower Spire */}
            {building.type === "spire" && (
              <div className="flex flex-col items-center">
                <div className="w-1 h-12 bg-slate-700"></div>
                <div className="w-4 h-4 bg-slate-700 rounded-t-sm"></div>
                <div className="w-12 h-6 bg-slate-800 rounded-t-md border-t border-white/20"></div>
              </div>
            )}

            {/* Key Tower Pyramid */}
            {building.type === "pyramid" && (
               <div className="w-0 h-0 border-l-[35px] border-r-[35px] border-b-[50px] border-l-transparent border-r-transparent border-b-slate-800 relative top-1"></div>
            )}

            {/* 200 Public Sq Angled Roof */}
            {building.type === "angled" && (
               <div className="w-full h-8 bg-slate-800 transform skew-y-6 border-t border-white/10 mb-[-5px]"></div>
            )}

            {/* --- BUILDING BODY --- */}
            <div 
              className={`
                w-full ${building.height} bg-[#1e1b2e] border border-white/10 relative p-2 shadow-2xl
                grid gap-1
              `}
              style={{
                gridTemplateColumns: `repeat(${building.windowCols}, 1fr)`,
                gridTemplateRows: `repeat(${building.windowRows}, 1fr)`
              }}
            >
              {/* Subtle Gradient Overlay on the building face */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent pointer-events-none"></div>
              {windows}
            </div>
          </div>
        );
      })}
    </div>
  );
}
