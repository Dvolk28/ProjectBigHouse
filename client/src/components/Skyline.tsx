import { useState } from "react";

// --- CONFIGURATION ---
const WINDOW_W = 10; // Width of one window unit
const WINDOW_H = 14; // Height of one window unit
const GAP = 4;       // Gap between windows

const BUILDINGS = [
  // LEFT EXPANSION
  { name: "Warehouse District", type: "flat", w: 60, h: 140 },
  { name: "The Flats", type: "slope-left", w: 70, h: 180 },
  { name: "Justice Center", type: "block", w: 80, h: 260 },

  // MAIN SKYLINE
  { name: "Ernst & Young", type: "slope-right", w: 75, h: 320 },
  { name: "Carl B. Stokes", type: "curve", w: 90, h: 350 },
  
  // TERMINAL TOWER (Detailed Spire)
  { name: "Terminal Tower", type: "spire", w: 110, h: 580 },

  // KEY TOWER (The Big Pyramid)
  { name: "Key Tower", type: "pyramid", w: 140, h: 680 },

  // 200 PUBLIC SQUARE (Angled Roof)
  { name: "200 Public Sq", type: "slope-cut", w: 110, h: 500 },

  // ONE CLEVELAND CENTER (Chisel)
  { name: "One Cleveland Ctr", type: "chisel", w: 80, h: 420 },

  // SHERWIN WILLIAMS (Notched)
  { name: "Sherwin Williams", type: "notch", w: 100, h: 520 },

  // RIGHT EXPANSION
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
        // Calculate grid dimensions
        const cols = Math.floor((b.w - GAP) / (WINDOW_W + GAP));
        const rows = Math.floor((b.h - GAP) / (WINDOW_H + GAP));
        
        const windows = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // Calculate relative position (0.0 to 1.0) of this window's CENTER
            // We use this for the math checks
            const normX = (c + 0.5) / cols;
            const normY = (r + 0.5) / rows; // 0 is top, 1 is bottom

            // Strict math check: Does this window fit inside the building shape?
            if (isInsideShape(b.type, normX, normY)) {
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
                    top: r * (WINDOW_H + GAP) + GAP + 2, // +2 pushes windows slightly down from very top tip
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
          <div key={i} className="relative flex flex-col justify-end shrink-0" style={{ width: b.w, height: b.h }}>
            
            {/* 1. ACCURATE SHAPE BACKGROUND (SVG) */}
            <div className="absolute inset-0 z-0 text-slate-800 drop-shadow-2xl">
               <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d={getSvgPath(b.type)} fill="currentColor" />
               </svg>
               {/* Detail overlay */}
               <div className="absolute inset-0 border-x border-white/5 opacity-40 pointer-events-none" />
            </div>

            {/* 2. WINDOW LAYER */}
            <div className="relative z-10 w-full h-full">
               {windows}
            </div>

          </div>
        );
      })}
    </div>
  );
}

// --- GEOMETRY ENGINE ---

// 1. Math Check: Is window inside the shape? (x,y are 0..1)
function isInsideShape(type: string, x: number, y: number) {
  // MARGIN: Don't let windows touch the absolute edges
  if (x < 0.1 || x > 0.9) return false;
  if (y < 0.05) return false; // Keep tip clear

  switch (type) {
    case 'pyramid': // Key Tower
      // Tip starts at y=0, x=0.5. Widens linearly.
      // Triangle formula: |x - 0.5| < (y * slope)
      // At y=0.15 (tip), width should be 0. At y=1, width is 0.5 (radius).
      if (y < 0.15) return false; // Top 15% empty (spire/logo area)
      const allowedWidth = (y - 0.15) * 0.6; 
      return Math.abs(x - 0.5) < allowedWidth;

    case 'spire': // Terminal Tower
      // Complex shape: Spire top, widening base
      if (y < 0.25) {
         // Top spire: very thin, center only
         return Math.abs(x - 0.5) < 0.08;
      } else if (y < 0.4) {
         // Transition
         return Math.abs(x - 0.5) < 0.2;
      } else {
         // Base
         return true;
      }

    case 'slope-cut': // 200 Public Sq (Angled top)
      // Visual: /| (High right, Low left? Or High Left Low right?)
      // Standard angle usually cuts one corner. Let's cut Top-Left.
      // Equation: y must be greater than line from (0, 0.2) to (1, 0)
      // Actually let's do the "Slope Right" (High Left, Low Right)
      // y > x * slope
      // Keep it simple: Cut top-right corner.
      // Line from (0,0) to (1, 0.2)
      return y > (0.2 - 0.2 * x); // Gentle slope

    case 'slope-right': // Ernst & Young
       // Slopes down to the right
       // y > 0.15 * x
       return y > (0.15 * x);

    case 'slope-left': 
       // Slopes down to the left
       return y > (0.15 * (1-x));

    case 'curve': // Stokes
      // Dome top. Ellipse check.
      if (y < 0.2) {
        // x centered at 0.5.
        // x^2/a^2 + y^2/b^2 <= 1 (roughly)
        // simpler: must be below the curve y = 0.2 - 0.2 * sin(...)
        return y > (0.2 - 0.2 * Math.sin(x * Math.PI));
      }
      return true;

    case 'chisel': // One Cleveland
      // Steep cut on top right
      if (y < 0.2 && x > 0.6) return false;
      return true;

    case 'notch': // Sherwin
       // Step out top right
       if (y < 0.1 && x > 0.6) return false;
       return true;

    default: // Block / Flat
      return true;
  }
}

// 2. Visuals: SVG Paths (0-100 coordinate space)
function getSvgPath(type: string) {
  switch (type) {
    case 'pyramid': return 'M50,0 L100,20 L100,100 L0,100 L0,20 Z'; 
    case 'spire': return 'M50,0 L58,10 L58,30 L80,30 L80,100 L20,100 L20,30 L42,30 L42,10 Z';
    case 'slope-cut': return 'M0,0 L100,20 L100,100 L0,100 Z';
    case 'slope-right': return 'M0,0 L100,15 L100,100 L0,100 Z';
    case 'slope-left': return 'M0,15 L100,0 L100,100 L0,100 Z';
    case 'curve': return 'M0,20 Q50,-10 100,20 L100,100 L0,100 Z';
    case 'chisel': return 'M0,0 L60,5 L80,20 L100,20 L100,100 L0,100 Z';
    case 'notch': return 'M0,0 L65,0 L65,12 L100,12 L100,100 L0,100 Z';
    default: return 'M0,0 L100,0 L100,100 L0,100 Z';
  }
}
