import { useState } from "react";

// --- CONFIGURATION ---
// "type": Maps to both the visual SVG shape AND the window logic.
const BUILDINGS = [
  // --- LEFT EXPANSION ---
  { name: "Warehouse District", type: "flat", w: 50, h: 140 },
  { name: "Old River Rd", type: "flat", w: 55, h: 170 },
  { name: "The Flats", type: "slope-left", w: 60, h: 210 },
  { name: "Justice Center", type: "block", w: 75, h: 250 },

  // --- MAIN SKYLINE ---
  // Ernst & Young: Flat top, modern glass
  { name: "Ernst & Young", type: "flat", w: 70, h: 290 },

  // Carl B. Stokes: Distinctive curved top
  { name: "Carl B. Stokes", type: "curve", w: 85, h: 330 },
  
  // TERMINAL TOWER: Detailed Spire
  { name: "Terminal Tower", type: "spire", w: 100, h: 540 },

  // KEY TOWER: Iconic Pyramid
  { name: "Key Tower", type: "pyramid", w: 130, h: 620 },

  // 200 PUBLIC SQ: Angled Roof
  { name: "200 Public Sq", type: "slope-right", w: 110, h: 450 },

  // ONE CLEVELAND CENTER: Chisel Shape
  { name: "One Cleveland Ctr", type: "chisel", w: 75, h: 380 },

  // SHERWIN WILLIAMS: V-Notch / Step
  { name: "Sherwin Williams", type: "step-notch", w: 95, h: 490 },

  // --- RIGHT EXPANSION ---
  { name: "The 9", type: "flat", w: 65, h: 230 },
  { name: "PNC Center", type: "slope-left", w: 80, h: 300 },
  { name: "Fifth Third", type: "flat", w: 60, h: 190 },
  { name: "Federal Reserve", type: "flat", w: 90, h: 160 },
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
        // --- WINDOW GRID CALCULATION ---
        const cellW = 12; // Width of a window "unit"
        const cellH = 16; // Height of a window "unit"
        const cols = Math.floor(b.w / cellW);
        const rows = Math.floor(b.h / cellH);
        
        const windows = [];

        // Loop purely to generate window slots
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            
            // MATH CHECK: Does the window fit in the shape?
            // "shouldRender" ensures we respect margins and roof slopes.
            if (shouldRenderWindow(b.type, r, c, rows, cols)) {
              globalWindowCount++;
              const currentId = globalWindowCount;
              const lightData = getLight(currentId);
              const isLit = !!lightData;

              windows.push(
                <div 
                  key={`${i}-${r}-${c}`}
                  // Position windows absolutely within the grid relative to bottom-left
                  // We inverse 'r' so row 0 is at the top visually for calculations, but CSS places it correctly
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${(c / cols) * 100}%`,
                    top: `${(r / rows) * 100}%`,
                    width: `${100 / cols}%`,
                    height: `${100 / rows}%`,
                  }}
                >
                  <div
                    onClick={() => onLightClick(currentId)}
                    onMouseEnter={() => isLit && setHoveredLight(lightData)}
                    onMouseLeave={() => setHoveredLight(null)}
                    className={`
                      w-[60%] h-[70%] rounded-[1px] transition-all duration-300 cursor-pointer
                      ${isLit 
                        ? "bg-yellow-400 shadow-[0_0_10px_rgba(253,224,71,1)] z-10 scale-125" 
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
            
            {/* 1. VISUAL LAYER: The smooth SVG Shape */}
            <div className="absolute inset-0 z-0 text-slate-800 drop-shadow-2xl">
               <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d={getSvgPath(b.type)} fill="currentColor" />
               </svg>
               {/* Internal Detail Lines (adds realism) */}
               <div className="absolute inset-0 border-x border-white/5 opacity-50 pointer-events-none"></div>
            </div>

            {/* 2. LOGIC LAYER: The Windows */}
            <div className="relative z-10 w-full h-full">
              {windows}
            </div>

          </div>
        );
      })}
    </div>
  );
}

// --- SHAPE DEFINITIONS ---

// 1. VISUAL (SVG PATHS) - 0,0 is Top-Left, 100,100 is Bottom-Right
function getSvgPath(type: string) {
  switch (type) {
    case 'pyramid': return 'M50,0 L100,20 L100,100 L0,100 L0,20 Z'; // Key Tower
    case 'spire': return 'M50,0 L60,10 L60,25 L75,25 L75,100 L25,100 L25,25 L40,25 L40,10 Z'; // Terminal Tower
    case 'slope-right': return 'M0,15 L100,0 L100,100 L0,100 Z'; // 200 Public Sq
    case 'slope-left': return 'M0,0 L100,15 L100,100 L0,100 Z'; 
    case 'curve': return 'M0,15 Q50,-5 100,15 L100,100 L0,100 Z'; // Stokes
    case 'chisel': return 'M0,0 L70,5 L100,20 L100,100 L0,100 Z'; // One Cleveland
    case 'step-notch': return 'M0,0 L60,0 L60,10 L100,10 L100,100 L0,100 Z'; // Sherwin
    default: return 'M0,0 L100,0 L100,100 L0,100 Z'; // Flat Block
  }
}

// 2. LOGIC (WINDOW PLACEMENT)
// Returns TRUE if window is safely inside the shape.
// r=0 is TOP, r=rows-1 is BOTTOM.
function shouldRenderWindow(type: string, r: number, c: number, rows: number, cols: number) {
  const ny = r / rows; // 0.0 (top) -> 1.0 (bottom)
  const nx = c / cols; // 0.0 (left) -> 1.0 (right)
  
  // MARGINS: Never render windows on the strict left/right edge
  if (c === 0 || c === cols - 1) return false;
  // Never render on the very top row (leaves a roof cap)
  if (r === 0) return false;

  switch (type) {
    case 'pyramid':
      // Triangle Logic: y must be below the diagonal lines
      // Top 20% is just the tip, no windows
      if (ny < 0.2) return false;
      // Linear slope: The safe zone gets wider as we go down
      // At ny=0.2, valid width is ~0. At ny=1.0, valid width is full.
      const safeWidth = (ny - 0.2) / 0.8; 
      const distFromCenter = Math.abs(nx - 0.5);
      return distFromCenter < (safeWidth / 2);

    case 'spire':
      // Narrow central column at top
      if (ny < 0.25) {
         // Only center columns allowed in spire tip
         return nx > 0.4 && nx < 0.6;
      }
      return true;

    case 'slope-right':
      // Slope formula: y = -mx + b.
      // We clip the top-right corner.
      // Visual: /|  (Wait, slope-right usually means high right, low left? Or cut right?)
      // SVG was: M0,15 L100,0. This is "High Right".
      // Windows should stop if they are "above" the line connecting (0, 0.15) to (1, 0)
      const slopeLine = 0.15 - (0.15 * nx); 
      return ny > slopeLine;

    case 'slope-left':
      // High Left, Low Right. 
      // Line from (0,0) to (1, 0.15)
      const slopeLineL = 0.15 * nx;
      return ny > slopeLineL;

    case 'curve':
      // Dome: Keep windows inside an ellipse
      if (ny < 0.2) {
        // Simple parabolic check
        const curveLimit = 0.2 - (0.2 * Math.sin(nx * Math.PI));
        return ny > curveLimit;
      }
      return true;

    case 'chisel':
       // Top-Right corner cut off
       if (ny < 0.2 && nx > 0.7) return false;
       return true;

    case 'step-notch':
       // Top-Right corner missing (Step)
       if (ny < 0.1 && nx > 0.6) return false;
       return true;

    default:
      return true;
  }
}
