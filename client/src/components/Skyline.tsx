import { useState } from "react";

// The Cleveland Skyline Configuration
const BUILDINGS = [
  { name: "Terminal Tower", height: "h-64", width: "w-16", windows: 24, style: "spire" },
  { name: "Key Tower", height: "h-96", width: "w-20", windows: 40, style: "pyramid" },
  { name: "200 Public Sq", height: "h-80", width: "w-16", windows: 32, style: "flat" },
  { name: "Tower City", height: "h-40", width: "w-24", windows: 20, style: "flat" },
  { name: "The 9", height: "h-48", width: "w-12", windows: 16, style: "flat" },
  { name: "PNC Center", height: "h-52", width: "w-14", windows: 20, style: "flat" },
  { name: "Justice Center", height: "h-56", width: "w-20", windows: 24, style: "flat" },
  { name: "Hilton", height: "h-64", width: "w-16", windows: 24, style: "modern" },
  { name: "Carl B. Stokes", height: "h-52", width: "w-14", windows: 20, style: "flat" },
  { name: "55 Public Sq", height: "h-44", width: "w-14", windows: 16, style: "flat" },
];

export function Skyline({ lights, onLightClick }: { lights: any[], onLightClick: (id: number) => void }) {
  const [hoveredLight, setHoveredLight] = useState<any | null>(null);

  // Helper: Find if a specific window ID has a light data object
  const getLight = (id: number) => lights.find((l) => l.windowId === id);

  let windowCounter = 0;

  return (
    <div className="relative w-full min-h-[600px] flex items-end justify-center gap-2 px-4 overflow-x-auto bg-gradient-to-b from-slate-900 to-slate-800 pb-0">
      
      {/* HOVER TOOLTIP: Shows when you mouse over a lit window */}
      {hoveredLight && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-purple-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] text-center w-64">
            <h3 className="text-lg font-bold text-white mb-1">{hoveredLight.name}</h3>
            <p className="text-purple-300 italic text-sm">"{hoveredLight.message}"</p>
          </div>
        </div>
      )}

      {/* RENDER BUILDINGS */}
      {BUILDINGS.map((building, bIndex) => {
        const windows = [];
        for (let i = 0; i < building.windows; i++) {
          windowCounter++;
          const currentId = windowCounter;
          const lightData = getLight(currentId);
          const isLit = !!lightData;

          windows.push(
            <div
              key={currentId}
              onClick={() => onLightClick(currentId)}
              onMouseEnter={() => isLit && setHoveredLight(lightData)}
              onMouseLeave={() => setHoveredLight(null)}
              className={`
                w-full h-3 mb-1 rounded-sm cursor-pointer transition-all duration-300
                ${isLit 
                  ? "bg-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.9)] z-10" 
                  : "bg-slate-700/50 hover:bg-slate-600 border border-white/5"}
              `}
            />
          );
        }

        return (
          <div key={bIndex} className={`flex flex-col items-center justify-end ${building.width}`}>
            {/* Building Toppers */}
            {building.style === "spire" && <div className="w-1 h-12 bg-slate-600 mb-0"></div>}
            {building.style === "pyramid" && <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-transparent border-b-slate-800 mb-0"></div>}
            
            {/* Building Body */}
            <div className={`w-full ${building.height} bg-slate-800 border-t border-white/10 p-1 flex flex-col-reverse gap-1 shadow-2xl`}>
              {windows}
            </div>
          </div>
        );
      })}
    </div>
  );
}
