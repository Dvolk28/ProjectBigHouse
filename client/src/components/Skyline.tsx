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
  { name: "Terminal Tower", type: "spire", w: 110, h: 580 }, // The problem child
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
        // 1. GRID MATH: How many windows fit?
        const cols = Math.floor((b.w - GAP) / (WINDOW_W + GAP));
        const rows = Math.floor((b.h - GAP) / (WINDOW_H + GAP));
        
        const windows = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            
            // 2. SPILL GUARD: Prevent windows from floating outside
            if (shouldRenderWindow(b.type, r, c, rows, cols)) {
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
                    top: r * (WINDOW_H + GAP) + GAP + 2, // +2 nudges them down just enough to not clip the very tip
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
          <div key={i} className="relative flex flex-col justify-end group shrink-0" style={{ width: b.w, height: b.h }}>
            
            {/* BACKGROUND SHAPE (SVG) - Keeps it looking like Cleveland */}
            <div className="absolute inset-0 z-0 text-slate-800 drop-shadow-2xl">
               <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d={getSvgPath(b.type)} fill="currentColor" />
               </svg>
               <div className="absolute inset-0 border-x border-white/5 opacity-40 pointer-events-none" />
            </div>

            {/* WINDOWS */}
            <div className="relative z-10 w-full h-full">
              {windows}
            </div>

          </div>
        );
      })}
    </div>
  );
}

// --- LOGIC: KEEPS WINDOWS INSIDE ---
// Returns TRUE if the window is safe to render.
function shouldRenderWindow(type: string, r: number, c: number, rows: number, cols: number) {
  const rowPct = r / rows; // 0.0 (top) -> 1.0 (bottom)
  const colPct = c / cols; // 0.0 (left) -> 1.0 (right)

  // Always hide the very first row (r=0) on pointy buildings to prevent "floating point" windows
  if (r === 0 && ['spire', 'pyramid', 'slope-cut'].includes(type)) return false;

  switch (type) {
    case 'spire': // TERMINAL TOWER
      // The Spire is thin at the top (0-30%), then gets wider.
      if (rowPct < 0.3) {
        // Top 30%: Only allow the middle 25% of columns
        return colPct > 0.37 && colPct < 0.63;
      }
      return true; // The base is full width

    case 'pyramid': // KEY TOWER
      // Triangle shape.
      // Top 15% is just the antenna/tip, no windows.
      if (rowPct < 0.15) return false;
      
      // As we go down (rowPct increases), the allowed width increases.
      // Logic: distance from center (0.5) must be less than current width/2
      const distFromCenter = Math.abs(colPct - 0.5);
      const safeWidth = rowPct * 0.65; // Multiplier controls steepness
      return distFromCenter < safeWidth;

    case 'slope-right':
      // Cut top-left corner? Or Top-Right?
      // "Slope Right" usually means high-left, low-right.
      // Reject if Top-Right corner (small row, large col)
      // Visual: [\]
      if (rowPct < 0.2 && colPct > 0.5) return false;
      return true;

    case 'slope-left':
      // Visual: [/]
      // Reject if Top-Left corner (small row, small col)
      if (rowPct < 0.2 && colPct < 0.5) return false;
      return true;

    case 'slope-cut': // 200 Public Sq
      // Angled roof, cuts one corner.
      if (rowPct < 0.15 && colPct > 0.6) return false;
      return true;

    case 'chisel':
      // One Cleveland Center: Steep cut top right
      if (rowPct < 0.2 && colPct > 0.6) return false;
      return true;
      
    case 'notch':
      // Sherwin: Notch out top right
      if (rowPct < 0.1 && colPct > 0.65) return false;
      return true;
    
    case 'curve':
        // Stokes: Dome top.
        // If at the very top (first 15%), only allow middle windows
        if (rowPct < 0.15) {
            return colPct > 0.3 && colPct < 0.7;
        }
        return true;

    default:
      return true;
  }
}

// --- VISUALS: SHAPES ---
function getSvgPath(type: string) {
  switch (type) {
    case 'pyramid': return 'M50,0 L100,20 L100,100 L0,100 L0,20 Z'; 
    case 'spire': return 'M50,0 L60,10 L60,25 L80,25 L80,100 L20,100 L20,25 L40,25 L40,10 Z'; // Custom Terminal Tower shape
    case 'slope-cut': return 'M0,0 L100,20 L100,100 L0,100 Z';
    case 'slope-right': return 'M0,0 L100,15 L100,100 L0,100 Z';
    case 'slope-left': return 'M0,15 L100,0 L100,100 L0,100 Z';
    case 'curve': return 'M0,20 Q50,-10 100,20 L100,100 L0,100 Z';
    case 'chisel': return 'M0,0 L60,5 L80,20 L100,20 L100,100 L0,100 Z';
    case 'notch': return 'M0,0 L65,0 L65,12 L100,12 L100,100 L0,100 Z';
    default: return 'M0,0 L100,0 L100,100 L0,100 Z';
  }
}


