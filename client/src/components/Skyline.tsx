import { useState } from "react";

// --- CONFIGURATION ---
const WINDOW_W = 10;
const WINDOW_H = 14;
const GAP = 4;

const BUILDINGS = [
  // Left Expansion
  { name: "Warehouse District", type: "flat", w: 60, h: 140 },
  { name: "The Flats", type: "slope-left", w: 70, h: 180 },
  { name: "Justice Center", type: "block", w: 80, h: 260 },

  // Main Skyline
  { name: "Ernst & Young", type: "slope-right", w: 75, h: 320 },
  { name: "Carl B. Stokes", type: "curve", w: 90, h: 350 },
  { name: "Terminal Tower", type: "spire", w: 110, h: 580 }, // The one with the spill issue
  { name: "Key Tower", type: "pyramid", w: 140, h: 680 },
  { name: "200 Public Sq", type: "slope-cut", w: 110, h: 500 },
  { name: "One Cleveland Ctr", type: "chisel", w: 80, h: 420 },
  { name: "Sherwin Williams", type: "notch", w: 100, h: 520 },

  // Right Expansion
  { name: "The 9", type: "block", w: 70, h: 280 },
  { name: "PNC Center", type: "slope-left", w: 85, h: 320 },
  { name: "Federal Reserve", type: "block", w: 95, h: 180 },
];

export function Skyline({ lights, onLightClick }: { lights: any[], onLightClick: (id: number) => void }) {
  const [hoveredLight, setHoveredLight] = useState<any | null>(null);
  const getLight = (id: number) => lights.find((l) => l.windowId === id);

  let globalWindowCount = 0;

  return (
    <div className="relative w-full max-w-[2400px] h-full flex items-end justify-center px-4 gap-2 overflow-x-auto overflow-y-hidden pb-0 scrollbar-hide">
      
      {/* Tooltip */}
      {hoveredLight && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
          <div className="bg-neutral-900/95 backdrop-blur-md border border-purple-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] text-center min-w-[200px]">
            <h3 className="text-lg font-bold text-white mb-1">{hoveredLight.name}</h3>
            <p className="text-purple-200 italic text-sm">"{hoveredLight.message}"</p>
          </div>
        </div>
      )}

      {BUILDINGS.map((b, i) => {
        // Simple Grid Logic
        const cols = Math.floor((b.w - GAP) / (WINDOW_W + GAP));
        const rows = Math.floor((b.h - GAP) / (WINDOW_H + GAP));
        
        const windows = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            
            // --- THE FIX: Simple bounds checks to stop spilling ---
            let visible = true;
            const rowPct = r / rows; // 0 = top, 1 = bottom
            const colPct = c / cols; // 0 = left, 1 = right

            if (b.type === 'spire') {
              // Terminal Tower Fix: 
              // If we are in the top 30%, only allow the middle ~30% of columns
              if (rowPct < 0.3) {
                 if (colPct < 0.35 || colPct > 0.65) visible = false;
              }
            }
            else if (b.type === 'pyramid') {
              // Key Tower: Simple triangle clip
              // As we go up (rowPct gets smaller), valid width gets narrower
              // rowPct 0.2 (top tip) -> allow very narrow
              const centerDist = Math.abs(colPct - 0.5);
              const allowedWidth = rowPct * 0.8; // Simple slope factor
              if (centerDist > allowedWidth + 0.1) visible = false;
            }
            else if (b.type === 'slope-right') {
              // High Left, Low Right (or vice versa, adjusting to keep inside)
              if (rowPct < 0.2 && colPct > 0.5) visible = false; 
            }
             else if (b.type === 'slope-left') {
              if (rowPct < 0.2 && colPct < 0.5) visible = false; 
            }
            else if (b.type === 'chisel') {
              if (rowPct < 0.15 && colPct > 0.6) visible = false;
            }
            
            // -----------------------------------------------------

            if (visible) {
              globalWindowCount++;
              const currentId = globalWindowCount;
              const lightData = getLight(currentId);
              const isLit = !!lightData;

              windows.push(
                <div
                  key={`${i}-${r}-${c}`}
                  className="absolute"
                  style={{
                    left: c * (WINDOW_W + GAP) + GAP,
                    top: r * (WINDOW_H + GAP) + GAP,
                    width: WINDOW_W,
                    height: WINDOW_H,
                  }}
                >
                  <div
                    onClick={() => onLightClick(currentId)}
                    onMouseEnter={() => isLit && setHoveredLight(lightData)}
                    onMouseLeave={() => setHoveredLight(null)}
                    className={`
                      w-full h-full rounded-[1px] transition-all duration-300 cursor-pointer
                      ${isLit 
                        ? "bg-yellow-400 shadow-[0_0_8px_rgba(253,224,71,1)] z-10 scale-125" 
                        : "bg-white/10 hover:bg-white/30"}
                    `}
                  />
                </div>
              );
            }
          }
        }

        return (
          <div 
            key={i} 
            className="relative flex flex-col justify-end group shrink-0" 
            style={{ width: b.w, height: b.h }}
          >
            {/* Building Shape (CSS Background) */}
            <div 
                className={`absolute inset-0 z-0 bg-slate-800/80 backdrop-blur-sm border border-white/10 shadow-2xl transition-all duration-500
                ${getShapeClass(b.type)}`} 
            />
            
            {/* Windows Container */}
            <div className="relative z-10 w-full h-full">
              {windows}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Simple CSS shapes (Clip-paths) to match the logic
function getShapeClass(type: string) {
  switch (type) {
    case 'pyramid': return 'clip-path-polygon-[50%_0,_100%_100%,_0_100%]'; // Triangle
    case 'spire': return 'clip-path-polygon-[50%_0,_60%_15%,_60%_30%,_100%_30%,_100%_100%,_0_100%,_0_30%,_40%_30%,_40%_15%]'; // Terminal Tower Shape
    case 'slope-right': return 'clip-path-polygon-[0_0,_100%_15%,_100%_100%,_0_100%]';
    case 'slope-left': return 'clip-path-polygon-[0_15%,_100%_0,_100%_100%,_0_100%]';
    case 'slope-cut': return 'clip-path-polygon-[20%_0,_100%_20%,_100%_100%,_0_100%]';
    case 'chisel': return 'clip-path-polygon-[0_0,_60%_5%,_100%_25%,_100%_100%,_0_100%]';
    case 'curve': return 'rounded-t-[40px]';
    case 'notch': return 'clip-path-polygon-[0_0,_70%_0,_70%_10%,_100%_10%,_100%_100%,_0_100%]';
    default: return 'rounded-t-md';
  }
}
