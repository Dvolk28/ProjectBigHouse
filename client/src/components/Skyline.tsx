import { useState, useMemo } from "react";

// --- CONFIGURATION ---
// Adjust density here. Smaller = more detailed, higher window count.
const CELL_W = 14; 
const CELL_H = 18; 

type BuildingConfig = {
  name: string;
  type: 'block' | 'pyramid' | 'spire' | 'slope-right' | 'slope-left' | 'step-right' | 'step-left' | 'curve' | 'chisel';
  w: number; // Width in pixels
  h: number; // Height in pixels
  offset?: number; // Optional horizontal shift for variety
};

const BUILDINGS: BuildingConfig[] = [
  // --- FAR LEFT ---
  { name: "Warehouse District", type: "step-right", w: 50, h: 140 },
  { name: "Old River Rd", type: "block", w: 55, h: 170 },
  { name: "The Flats", type: "slope-left", w: 60, h: 210 },
  { name: "Justice Center", type: "block", w: 75, h: 250 },

  // --- MAIN SKYLINE ---
  { name: "Ernst & Young", type: "slope-right", w: 70, h: 290 },
  { name: "Carl B. Stokes", type: "curve", w: 85, h: 330 },
  
  // TERMINAL TOWER (Spire)
  { name: "Terminal Tower", type: "spire", w: 100, h: 540 },

  // KEY TOWER (Pyramid)
  { name: "Key Tower", type: "pyramid", w: 130, h: 620 },

  // 200 PUBLIC SQ (Angled)
  { name: "200 Public Sq", type: "slope-right", w: 110, h: 450 },

  // ONE CLEVELAND CENTER (Chisel)
  { name: "One Cleveland Ctr", type: "chisel", w: 75, h: 380 },

  // SHERWIN WILLIAMS (V-Top / Notch)
  { name: "Sherwin Williams", type: "step-left", w: 95, h: 490 },

  // --- FAR RIGHT ---
  { name: "The 9", type: "block", w: 65, h: 230 },
  { name: "PNC Center", type: "slope-left", w: 80, h: 300 },
  { name: "Fifth Third", type: "block", w: 60, h: 190 },
  { name: "Federal Reserve", type: "block", w: 90, h: 160 },
];

export function Skyline({ lights, onLightClick }: { lights: any[], onLightClick: (id: number) => void }) {
  const [hoveredLight, setHoveredLight] = useState<any | null>(null);

  // Helper to find light data
  const getLight = (id: number) => lights.find((l) => l.windowId === id);

  // Global counter to assign IDs sequentially across all buildings
  let globalWindowCount = 0;

  return (
    <div className="relative w-full max-w-[2400px] h-full flex items-end justify-center px-4 gap-1 overflow-x-auto overflow-y-hidden pb-0 scrollbar-hide">
      
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
        // Calculate Grid Dimensions
        const cols = Math.floor(b.w / CELL_W);
        const rows = Math.floor(b.h / CELL_H);
        
        // Generate Cells
        const cells = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // Determine if this cell is part of the building shape
            const isBuilding = checkShape(b.type, r, c, rows, cols);
            
            if (isBuilding) {
              globalWindowCount++;
              const currentId = globalWindowCount;
              const lightData = getLight(currentId);
              const isLit = !!lightData;

              cells.push(
                <div 
                  key={`${i}-${r}-${c}`}
                  className="relative flex items-center justify-center bg-slate-800" // Building "Wall" Color
                >
                  <div
                    onClick={() => onLightClick(currentId)}
                    onMouseEnter={() => isLit && setHoveredLight(lightData)}
                    onMouseLeave={() => setHoveredLight(null)}
                    className={`
                      w-[70%] h-[70%] rounded-[1px] transition-all duration-300 cursor-pointer
                      ${isLit 
                        ? "bg-yellow-400 shadow-[0_0_8px_rgba(253,224,71,1)] z-10 scale-110" 
                        : "bg-white/10 hover:bg-white/30"}
                    `}
                  />
                </div>
              );
            } else {
              // Sky / Transparent Cell (Keeps the grid aligned)
              cells.push(<div key={`${i}-${r}-${c}`} className="invisible" />);
            }
          }
        }

        return (
          <div 
            key={i} 
            className="flex flex-col justify-end shrink-0"
            style={{ width: cols * CELL_W, height: rows * CELL_H }}
          >
            <div 
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                width: '100%',
                height: '100%'
              }}
            >
              {cells}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- SHAPE LOGIC ---
// Returns TRUE if the cell (r,c) is inside the building shape.
// r=0 is TOP, r=rows-1 is BOTTOM.
function checkShape(type: string, r: number, c: number, rows: number, cols: number): boolean {
  // Normalize coordinates (0 to 1) for easier math
  const ny = r / rows; // 0 (top) -> 1 (bottom)
  const nx = c / cols; // 0 (left) -> 1 (right)
  const center = 0.5;

  switch(type) {
    case 'block':
      return true;

    case 'pyramid':
      // Triangle shape: Width increases as we go down
      // Top row (ny=0) is very narrow. Bottom (ny=1) is full.
      const width = ny; 
      const dist = Math.abs(nx - center);
      // We add a small base width (0.1) so the tip isn't invisible
      return dist <= (width * 0.5 + 0.05);

    case 'spire':
      // Steep spike at top, wider base at bottom
      const distS = Math.abs(nx - center);
      if (ny < 0.4) {
        // Top 40%: Thin spire
        return distS < 0.1; 
      } else {
        // Bottom 60%: Widens out
        const baseWidth = (ny - 0.4) * 0.7 + 0.1;
        return distS < baseWidth;
      }

    case 'slope-right':
      // Cut top-left corner
      // Keep if col index > inverse row index roughly
      // visual: /|
      return nx >= (1 - ny) * 0.8 - 0.2;

    case 'slope-left':
      // Cut top-right corner
      // visual: |\
      return nx <= ny * 0.8 + 0.2;

    case 'step-right':
      // Steps up to the right
      if (nx > 0.6 && ny < 0.3) return false;
      if (nx > 0.8 && ny < 0.6) return false;
      return true;
    
    case 'step-left':
        // Steps up to the left
        if (nx < 0.4 && ny < 0.3) return false;
        if (nx < 0.2 && ny < 0.6) return false;
        return true;

    case 'chisel':
      // Cut both top corners
      const distC = Math.abs(nx - center);
      if (ny < 0.15) {
        return distC < 0.2; // Narrow top
      }
      return true;

    case 'curve':
      // Rounded top (dome-ish)
      if (ny < 0.2) {
        const distCurve = Math.abs(nx - center);
        // Ellipse equation approx
        return (distCurve * distCurve) + (1 - ny * 5) < 0.2; 
      }
      return true;

    default:
      return true;
  }
}
