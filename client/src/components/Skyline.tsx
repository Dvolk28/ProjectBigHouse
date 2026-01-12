import { useState, useMemo } from "react";

// --- CONFIGURATION ---
const GAP = 2; // Spacing between windows

const BUILDINGS = [
  // Left Expansion
  { name: "Warehouse District", type: "flat", w: 60, h: 140 },
  { name: "The Flats", type: "slope-left", w: 70, h: 180 },
  { name: "Justice Center", type: "block", w: 80, h: 260 },
  // Main Skyline
  { name: "Ernst & Young", type: "slope-right", w: 75, h: 320 },
  { name: "Carl B. Stokes", type: "curve", w: 90, h: 350 },
  { name: "Terminal Tower", type: "spire", w: 110, h: 580 },
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

  // Helper to find if a specific window ID is lit by a user
  const getLight = (id: number) => lights.find((l) => l.windowId === id);

  // Global counter to assign unique IDs to every window across all buildings
  let globalWindowCount = 0;

  return (
    <div className="relative w-full max-w-[2400px] h-full flex items-end justify-center px-4 gap-2 overflow-x-auto overflow-y-hidden pb-0 scrollbar-hide">
      
      {/* Tooltip for User Lights */}
      {hoveredLight && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
          <div className="bg-neutral-900/95 backdrop-blur-md border border-purple-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] text-center min-w-[200px]">
            <h3 className="text-lg font-bold text-white mb-1">{hoveredLight.name}</h3>
            <p className="text-purple-200 italic text-sm">"{hoveredLight.message}"</p>
          </div>
        </div>
      )}

      {/* Render Each Building */}
      {BUILDINGS.map((b, i) => {
        // Calculate Grid Dimensions
        // We use a fixed column count based on width to keep windows equal size
        const gridCols = Math.floor(b.w / 12); 
        const totalWindows = gridCols * Math.floor(b.h / 15);

        return (
          <div 
            key={i} 
            className="relative flex flex-col justify-end overflow-hidden shrink-0 group"
            style={{ width: b.w, height: b.h }}
          >
            {/* 1. Background Shape (Dark Silhouette) */}
            <div className="absolute inset-0 bg-slate-900/95 -z-10" />
            
            {/* 2. Windows Grid */}
            <div 
              className="w-full h-full grid gap-[2px] px-[4px] content-end"
              style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
            >
              {Array.from({ length: totalWindows }).map((_, idx) => {
                // Determine if this slot is a valid window or empty space (for shape)
                const isVisible = shouldShowWindow(idx, totalWindows, gridCols, b.type);
                
                if (!isVisible) {
                  return <div key={idx} className="pointer-events-none" />; 
                }

                // Increment global ID only for visible windows
                globalWindowCount++;
                const currentId = globalWindowCount;
                const userLight = getLight(currentId);
                
                // Logic: Is it lit by a user? OR is it randomly lit for city ambiance?
                // We use a stable seed (idx + i * 100) so lights don't flicker on re-render
                const isRandomlyLit = (Math.sin(idx + i * 100) * 10000) % 1 > 0.85; 
                const isLit = !!userLight || isRandomlyLit;

                return (
                  <div
                    key={idx}
                    className="relative w-full aspect-[2/3]"
                    onClick={() => onLightClick(currentId)}
                    onMouseEnter={() => userLight && setHoveredLight(userLight)}
                    onMouseLeave={() => setHoveredLight(null)}
                  >
                    <div 
                      className={`
                        w-full h-full rounded-[1px] transition-all duration-500
                        ${isLit 
                          ? 'bg-yellow-300 shadow-[0_0_6px_rgba(253,224,71,0.6)] opacity-100' 
                          : 'bg-white/5 hover:bg-white/20 opacity-100'
                        }
                        ${!!userLight ? 'shadow-[0_0_12px_rgba(234,179,8,0.9)] bg-yellow-400 z-10' : ''} 
                      `} 
                    />
                  </div>
                );
              })}
            </div>

            {/* Optional: Subtle border for building definition */}
            <div className="absolute inset-0 border-x border-white/5 pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
}

// --- HELPER LOGIC: Building Shapes ---
// Decides if a grid cell should have a window based on the building type
function shouldShowWindow(index: number, total: number, cols: number, type: string) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const totalRows = Math.ceil(total / cols);
  
  // Normalize position from 0 to 1 for consistent shape math
  const rowPct = row / totalRows; // 0 = Top, 1 = Bottom
  const colPct = col / cols;      // 0 = Left, 1 = Right

  switch (type) {
    case 'spire': // Terminal Tower style
      if (rowPct < 0.25) return colPct > 0.4 && colPct < 0.6; // Needle tip
      if (rowPct < 0.5) return colPct > 0.3 && colPct < 0.7;  // Mid section
      return true; // Base
    case 'pyramid': // Key Tower style
      const centerDist = Math.abs(0.5 - colPct);
      return centerDist < (rowPct * 0.5 + 0.1); 
    case 'slope-right': 
      return (1 - colPct) > (0.4 - rowPct); 
    case 'slope-left':
      return colPct > (0.4 - rowPct);
    case 'notch':
       return !(rowPct < 0.1 && colPct > 0.6); 
    case 'curve':
        if (rowPct < 0.2) return colPct > 0.3 && colPct < 0.7;
        return true;
    default:
      return true; 
  }
}
