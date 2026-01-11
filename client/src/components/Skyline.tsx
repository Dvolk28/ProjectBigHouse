import { useState } from "react";

const BUILDINGS = [
  // --- LEFT EXPANSION ---
  { name: "Warehouse District", type: "flat", w: 50, h: 160, windows: 40 },
  { name: "Old River Rd", type: "flat", w: 55, h: 190, windows: 45 },
  { name: "The Flats", type: "flat", w: 60, h: 220, windows: 55 },
  { name: "Justice Center", type: "flat", w: 75, h: 260, windows: 80 },

  // --- MAIN SKYLINE ---
  // Ernst & Young (Flat top)
  { name: "Ernst & Young", type: "flat", w: 70, h: 300, windows: 100 },

  // Carl B. Stokes (Curved top)
  { name: "Carl B. Stokes", type: "curved", w: 85, h: 340, windows: 130 },
  
  // TERMINAL TOWER (Spire top)
  { name: "Terminal Tower", type: "spire", w: 100, h: 560, windows: 280 },

  // KEY TOWER (Pyramid top - NO LOGO)
  { name: "Key Tower", type: "pyramid", w: 130, h: 640, windows: 400 },

  // 200 PUBLIC SQ (Angled roof)
  { name: "200 Public Sq", type: "angle-right", w: 110, h: 480, windows: 280 },

  // ONE CLEVELAND CENTER (Chisel)
  { name: "One Cleveland Ctr", type: "chisel", w: 75, h: 400, windows: 140 },

  // SHERWIN WILLIAMS (V-Shape)
  { name: "Sherwin Williams", type: "v-shape", w: 95, h: 520, windows: 260 },

  // --- RIGHT EXPANSION ---
  { name: "The 9", type: "flat", w: 65, h: 250, windows: 70 },
  { name: "PNC Center", type: "flat", w: 80, h: 320, windows: 90 },
  { name: "Fifth Third", type: "flat", w: 60, h: 210, windows: 50 },
  { name: "Federal Reserve", type: "flat", w: 90, h: 170, windows: 40 },
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
        // Larger windows = less crowded. 
        // Divider 12 gives a nice chunky window size.
        const cols = Math.floor(b.w / 12); 

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
                w-full aspect-[4/5] rounded-[1px] cursor-pointer transition-all duration-300
                ${isLit 
                  ? "bg-yellow-400 shadow-[0_0_12px_rgba(253,224,71,1)] z-10 scale-110" 
                  : "bg-white/10 hover:bg-white/30"} 
              `}
            />
          );
        }

        // Get the specific shape for clipping
        const clipShape = getClipPath(b.type);

        return (
          <div key={i} className="relative flex flex-col justify-end group shrink-0" style={{ width: b.w, height: b.h }}>
            
            {/* 1. DARK BACKGROUND SHAPE (The "Building" itself) */}
            <div className="absolute inset-0 z-0 text-slate-800 drop-shadow-2xl">
               {/* We just fill the whole rect, the clip-path on the parent handles the shape */}
               <div className="w-full h-full bg-current opacity-90" style={{ clipPath: clipShape }} />
               
               {/* Optional: Add a subtle border overlay for definition */}
               <div className="absolute inset-0 border-white/10 border-t border-x opacity-30 pointer-events-none" 
                    style={{ clipPath: clipShape }} />
            </div>

            {/* 2. WINDOW GRID */}
            {/* We apply the SAME clip-path to the grid so windows get cut cleanly at the edge */}
            <div className="relative z-10 grid gap-[4px] px-[4px] pb-[4px] pt-[8px]"
                 style={{
                   gridTemplateColumns: `repeat(${cols}, 1fr)`,
                   height: "100%", 
                   alignContent: "end", 
                   clipPath: clipShape // This ensures windows "fit" the building exactly
                 }}
            >
              {windows}
            </div>

          </div>
        );
      })}
    </div>
  );
}

// Helper: Define the shape of the building
function getClipPath(type: string) {
  switch(type) {
    case 'pyramid': return 'polygon(50% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)';
    case 'angle-right': return 'polygon(0% 10%, 100% 0%, 100% 100%, 0% 100%)';
    case 'chisel': return 'polygon(0% 0%, 75% 5%, 100% 15%, 100% 100%, 0% 100%)';
    case 'curved': return 'polygon(0% 10%, 20% 2%, 50% 0%, 80% 2%, 100% 10%, 100% 100%, 0% 100%)'; // Approx curve with polygon
    case 'spire': return 'polygon(50% 0%, 60% 10%, 70% 10%, 70% 25%, 85% 25%, 85% 100%, 15% 100%, 15% 25%, 30% 25%, 30% 10%, 40% 10%)';
    case 'v-shape': return 'polygon(0% 0%, 50% 10%, 100% 0%, 100% 100%, 0% 100%)';
    default: return 'none'; // Flat top
  }
}
