import { useState } from "react";

// "bodyH" = The percentage of the building height that is the rectangular "safe zone" for windows.
// The rest (top) is the dark roof/spire.
const BUILDINGS = [
  // --- LEFT EXPANSION ---
  { name: "Warehouse District", type: "flat", w: 50, h: 160, windows: 24, bodyH: 100 },
  { name: "Old River Rd", type: "flat", w: 55, h: 190, windows: 28, bodyH: 100 },
  { name: "The Flats", type: "flat", w: 60, h: 220, windows: 35, bodyH: 100 },
  { name: "Justice Center", type: "flat", w: 75, h: 260, windows: 60, bodyH: 98 },

  // --- MAIN SKYLINE ---
  // Ernst & Young (Flat top)
  { name: "Ernst & Young", type: "flat", w: 70, h: 300, windows: 90, bodyH: 96 },

  // Carl B. Stokes (Curved top - windows stop before curve)
  { name: "Carl B. Stokes", type: "curved", w: 85, h: 340, windows: 110, bodyH: 85 },
  
  // TERMINAL TOWER (Spire top)
  { name: "Terminal Tower", type: "spire", w: 100, h: 560, windows: 280, bodyH: 60 },

  // KEY TOWER (Pyramid top + Logo)
  { name: "Key Tower", type: "pyramid", w: 130, h: 640, windows: 400, bodyH: 78, hasLogo: true },

  // 200 PUBLIC SQ (Angled roof)
  { name: "200 Public Sq", type: "angle-right", w: 110, h: 480, windows: 250, bodyH: 85 },

  // ONE CLEVELAND CENTER (Chisel)
  { name: "One Cleveland Ctr", type: "chisel", w: 75, h: 400, windows: 130, bodyH: 82 },

  // SHERWIN WILLIAMS (V-Shape)
  { name: "Sherwin Williams", type: "v-shape", w: 95, h: 520, windows: 280, bodyH: 88 },

  // --- RIGHT EXPANSION ---
  { name: "The 9", type: "flat", w: 65, h: 250, windows: 70, bodyH: 94 },
  { name: "PNC Center", type: "flat", w: 80, h: 320, windows: 90, bodyH: 98 },
  { name: "Fifth Third", type: "flat", w: 60, h: 210, windows: 50, bodyH: 100 },
  { name: "Federal Reserve", type: "flat", w: 90, h: 170, windows: 40, bodyH: 100 },
];

export function Skyline({ lights, onLightClick }: { lights: any[], onLightClick: (id: number) => void }) {
  const [hoveredLight, setHoveredLight] = useState<any | null>(null);
  const getLight = (id: number) => lights.find((l) => l.windowId === id);

  let globalWindowCount = 0;

  return (
    <div className="relative w-full max-w-[2200px] h-full flex items-end justify-center px-4 gap-1 sm:gap-2 overflow-x-auto overflow-y-hidden pb-0">
      
      {/* TOOLTIP */}
      {hoveredLight && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
          <div className="bg-neutral-900/95 backdrop-blur-md border border-purple-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] text-center min-w-[200px]">
            <h3 className="text-lg font-bold text-white mb-1">{hoveredLight.name}</h3>
            <p className="text-purple-200 italic text-sm">"{hoveredLight.message}"</p>
          </div>
        </div>
      )}

      {BUILDINGS.map((b, i) => {
        const windows = [];
        // Define columns strictly based on width so they align nicely
        const cols = Math.floor(b.w / 10); 

        for (let w = 0; w < b.windows; w++) {
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
                aspect-square rounded-[1px] cursor-pointer transition-all duration-300
                ${isLit 
                  ? "bg-yellow-400 shadow-[0_0_8px_rgba(253,224,71,0.9)] z-10 scale-110" 
                  : "bg-white/10 hover:bg-white/30"} 
              `}
            />
          );
        }

        return (
          <div key={i} className="relative flex flex-col justify-end group shrink-0" style={{ width: b.w, height: b.h }}>
            
            {/* 1. BUILDING SHAPE & ROOF (SVG) */}
            <div className="absolute inset-0 z-0 text-slate-800 drop-shadow-2xl">
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Main Body Rect (The safe zone) */}
                <rect x="0" y={100 - b.bodyH} width="100" height={b.bodyH} fill="currentColor" />
                
                {/* Roof Shapes (Drawing purely the top part) */}
                {b.type === "pyramid" && <path d="M50,0 L100,22 L0,22 Z" fill="currentColor" />}
                {b.type === "angle-right" && <path d="M0,15 L100,0 L100,15 L0,15 Z" fill="currentColor" />}
                {b.type === "chisel" && <path d="M0,0 L80,5 L100,18 L0,18 Z" fill="currentColor" />}
                {b.type === "curved" && <path d="M0,15 Q50,0 100,15 Z" fill="currentColor" />}
                {b.type === "v-shape" && <path d="M0,0 L50,12 L100,0 L100,12 L0,12 Z" fill="currentColor" />}
                {b.type === "spire" && (
                   <path d="M45,0 L55,0 L55,10 L70,10 L70,30 L85,30 L85,40 L15,40 L15,30 L30,30 L30,10 L45,10 Z" fill="currentColor" />
                )}
              </svg>
              
              {/* KEY TOWER LOGO (Subtle Key Shape) */}
              {b.hasLogo && (
                <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-6 h-6 opacity-40 z-20 text-white">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                         <path d="M7 14C5.9 14 5 13.1 5 12C5 10.9 5.9 10 7 10C8.1 10 9 10.9 9 12C9 13.1 8.1 14 7 14M12.6 10C11.8 7.7 9.6 6 7 6C3.7 6 1 8.7 1 12C1 15.3 3.7 18 7 18C9.6 18 11.8 16.3 12.6 14H16V18H20V14H23V10H12.6Z" />
                    </svg>
                </div>
              )}

              {/* Subtle vertical definition lines */}
              <div className="absolute inset-x-0 bottom-0 border-r border-white/5 h-full opacity-30" />
            </div>

            {/* 2. WINDOW GRID */}
            {/* Constrained strictly to the body height so they never look "cut off" */}
            <div className="relative z-10 grid gap-[3px] px-[4px] pb-[4px]"
                 style={{
                   gridTemplateColumns: `repeat(${cols}, 1fr)`,
                   height: `${b.bodyH}%`, 
                   alignContent: "end", // Ensures windows stack from bottom up
                 }}
            >
              {windows
