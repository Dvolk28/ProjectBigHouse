import { useState, useEffect } from "react";
import { Building } from "./Building";

// This simulates the Cleveland Skyline shape
// heights are relative (CSS h-xx), widths are relative
const CITY_LAYOUT = [
  { name: "Terminal Tower", height: "h-64", width: "w-16", windows: 24, style: "spire" },
  { name: "Key Tower", height: "h-96", width: "w-20", windows: 40, style: "pyramid" },
  { name: "200 Public Sq", height: "h-80", width: "w-16", windows: 32, style: "flat" },
  { name: "Tower City", height: "h-40", width: "w-24", windows: 20, style: "flat" },
  { name: "Ernst & Young", height: "h-56", width: "w-14", windows: 18, style: "slope" },
  { name: "The 9", height: "h-48", width: "w-12", windows: 16, style: "flat" },
  { name: "PNC Center", height: "h-52", width: "w-14", windows: 20, style: "flat" },
  { name: "State Theater", height: "h-24", width: "w-32", windows: 12, style: "flat" },
  { name: "Fifth Third", height: "h-60", width: "w-14", windows: 22, style: "flat" },
  { name: "Federal Building", height: "h-72", width: "w-16", windows: 28, style: "grid" },
  { name: "Justice Center", height: "h-56", width: "w-20", windows: 24, style: "flat" },
  { name: "Hilton", height: "h-64", width: "w-16", windows: 24, style: "modern" },
  { name: "Carl B. Stokes", height: "h-52", width: "w-14", windows: 20, style: "flat" },
  { name: "55 Public Sq", height: "h-44", width: "w-14", windows: 16, style: "flat" },
  { name: "One Cleveland", height: "h-48", width: "w-14", windows: 18, style: "flat" },
];

export function Skyline({ lights, onLightClick }: { lights: any[], onLightClick: (id: number) => void }) {
  const [hoveredLight, setHoveredLight] = useState<any | null>(null);

  // Helper to find if a window is lit
  const getLight = (globalIndex: number) => lights.find((l) => l.windowId === globalIndex);

  let globalWindowCount = 0;

  return (
    <div className="relative w-full min-h-[600px] flex items-end justify-center gap-2 px-4 overflow-x-auto bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]">
      
      {/* BACKGROUND STARS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-50"></div>
        <div className="absolute top-20 right-40 w-1 h-1 bg-white rounded-full opacity-30"></div>
        <div className="absolute top-40 left-1/4 w-1 h-1 bg-white rounded-full opacity-60"></div>
      </div>

      {/* HOVER TOOLTIP (Appears when you mouse over a light) */}
      {hoveredLight && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-[0_0_30px_rgba(138,43,226,0.6)] text-center animate-fade-in-up">
            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{hoveredLight.name}</h3>
            <p className="text-purple-200 italic">"{hoveredLight.message}"</p>
          </div>
        </div>
      )}

      {/* RENDER THE BUILDINGS */}
      {CITY_LAYOUT.map((building, bIndex) => {
        const buildingWindows = [];
        
        // Generate windows for this building
        for (let i = 0; i < building.windows; i++) {
          globalWindowCount++;
          const currentId = globalWindowCount;
          const lightData = getLight(currentId);
          const isLit = !!lightData;

          buildingWindows.push(
            <div
              key={currentId}
              onClick={() => onLightClick(currentId)}
              onMouseEnter={() => isLit && setHoveredLight(lightData)}
              onMouseLeave={() => setHoveredLight(null)}
              className={`
                w-full h-3 mb-1 rounded-sm cursor-pointer transition-all duration-500
                ${isLit 
                  ? "bg-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.8)] scale-110 z-10" 
                  : "bg-gray-800/50 hover:bg-gray-700 hover:scale-105 border border-white/5"}
              `}
            />
          );
        }

        return (
          <div key={bIndex} className={`flex flex-col justify-end items-center ${building.width}`}>
            {/* Building Top/Spire Logic */}
            {building.style === "spire" && <div className="w-1 h-12 bg-gray-700 mb-[-2px] mx-auto"></div>}
            {building.style === "pyramid" && <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[40px] border-l-transparent border-r-transparent border-b-gray-800 mx-auto mb-[-1px]"></div>}
            
            {/* The Building Body */}
            <div className={`w-full ${building.height} bg-[#1e1e24] border-t border-l border-r border-white/10 relative p-1 flex flex-col-reverse flex-wrap gap-1 shadow-2xl overflow-hidden`}>
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
              {buildingWindows}
            </div>
          </div>
        );
      })}
    </div>
  );
}
