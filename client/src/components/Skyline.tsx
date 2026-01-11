import { useState } from "react";

// Added "Huntington" and "Key Center" fillers to widen the view further
const BUILDINGS = [
  // --- FAR LEFT EXPANSION ---
  { name: "Warehouse District", type: "block", w: 50, h: 160, windows: 60 },
  { name: "Old River Rd", type: "slope-left", w: 55, h: 190, windows: 70 },
  { name: "The Flats", type: "block", w: 60, h: 220, windows: 80 },
  { name: "Justice Center", type: "block", w: 75, h: 260, windows: 100 },

  // --- MAIN SKYLINE ---
  { name: "Ernst & Young", type: "block", w: 70, h: 290, windows: 120 },
  { name: "Carl B. Stokes", type: "curved-top", w: 85, h: 330, windows: 150 },
  
  // TERMINAL TOWER 
  { name: "Terminal Tower", type: "terminal", w: 100, h: 540, windows: 450 },

  // KEY TOWER 
  { name: "Key Tower", type: "pyramid", w: 130, h: 620, windows: 600 },

  // 200 PUBLIC SQ
  { name: "200 Public Sq", type: "slope-right", w: 110, h: 460, windows: 350 },

  // ONE CLEVELAND CENTER 
  { name: "One Cleveland Ctr", type: "chisel", w: 75, h: 390, windows: 180 },

  // SHERWIN WILLIAMS 
  { name: "Sherwin Williams", type: "v-top", w: 95, h: 500, windows: 320 },

  // --- RIGHT SIDE EXPANSION ---
  { name: "The 9", type: "block", w: 65, h: 240, windows: 100 },
  { name: "PNC Center", type: "block", w: 80, h: 310, windows: 130 },
  { name: "Fifth Third", type: "block", w: 60, h: 200, windows: 80 },
  { name: "Federal Reserve", type: "block", w: 90, h: 170, windows: 70 },
  { name: "Superior Building", type: "block", w: 50, h: 140, windows: 50 },
];

export function Skyline({ lights, onLightClick }: { lights: any[], onLightClick: (id: number) => void }) {
  const [hoveredLight, setHoveredLight] = useState<any | null>(null);

  const getLight = (id: number) => lights.find((l) => l.windowId === id);

  let globalWindowCount = 0;

  return (
    // Max width increased to 2000px for full immersive width
    <div className="relative w-full max-w-[2000px] h-full flex items-end justify-center px-4 gap-1 sm:gap-2 overflow-x-auto overflow-y-hidden pb-0">
      
      {/* TOOLTIP */}
      {hoveredLight && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
          <div className="bg-neutral-900/90 backdrop-blur-md border border-purple-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] text-center min-w-[200px]">
            <h3 className="text-lg font-bold text-white mb-1">{hoveredLight.name}</h3>
            <p className="text-purple-200 italic text-sm">"{hoveredLight.message}"</p>
          </div>
        </div>
      )}

      {BUILDINGS.map((b, i) => {
        const windows = [];
        // Increased density: Divider changed from 12 to 9. 
        // This makes windows smaller, so they look better when "cut" by the roof.
        const cols = Math.floor(b.w / 9); 
        const rows = Math.ceil(b.windows / cols);

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
                w-full h-full rounded-[0.5px] cursor-pointer transition-all duration-300
                ${isLit 
                  ? "bg-yellow-400 shadow-[0_0_8px_rgba(253,224,71,0.9)] z-10" 
                  : "bg-white/10 hover:bg-white/30"} 
              `}
            />
          );
        }

        // Get the clip path for BOTH the building body AND the windows
        const clipShape = getClipPath(b.type);

        return (
          <div key={i} className="relative flex flex-col justify-end group shrink-0" style={{ width: b.w, height: b.h }}>
            
            {/* SVG SHAPE BACKGROUND */}
            <div className="absolute inset-0 z-0 text-slate-800 drop-shadow-2xl">
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                {b.type === "block" && <rect x="0" y="2" width="100" height="98" fill="currentColor" />}
                
                {b.type === "pyramid" && <path d="M50,0 L100,15 L100,100 L0,100 L0,15 Z" fill="currentColor" />}
                
                {b.type === "slope-right" && <path d="M0,10 L100,0 L100,100 L0,100 Z" fill="currentColor" />}
                {b.type === "slope-left" && <path d="M0,0 L100,10 L100,100 L0,100 Z" fill="currentColor" />}
                
                {b.type === "chisel" && <path d="M0,0 L80,5 L100,20 L100,100 L0,100 Z" fill="currentColor" />}
                
                {b.type === "curved-top" && <path d="M0,12 Q50,0 100,12 L100,100 L0,100 Z" fill="currentColor" />}
                
                {b.type === "terminal" && (
                  <path d="M45,0 L55,0 L55,10 L70,10 L70,22 L85,22 L85,100 L15,100 L15,22 L30,22 L30,10 L45,10 Z" fill="currentColor" />
                )}

                {b.type === "v-top" && (
                   <path d="M0,0 L50,12 L100,0 L100,100 L0,100 Z" fill="currentColor" />
                )}
              </svg>
              
              {/* Border Overlay */}
              <div className="absolute inset-0 border-x border-t border-white/20 opacity-40" 
                   style={{ clipPath: clipShape }}></div>
            </div>

            {/* WINDOW GRID CONTAINER */}
            {/* 1. Height is 100% so windows go all the way up. */}
            {/* 2. clipPath is applied here so they don't spill out. */}
            {/* 3. Padding pushes them slightly in so they don't touch the very edge. */}
            <div className="relative z-10 grid gap-[3px] px-[4px] pb-[4px] pt-[4px]"
                 style={{
                   gridTemplateColumns: `repeat(${cols}, 1fr)`,
                   height: "100%", 
                   marginTop: "auto",
                   clipPath: clipShape // This cuts the windows at the roof line
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

// Helper: Ensure these match the SVG paths exactly so the windows align with the building body
function getClipPath(type: string) {
  switch(type) {
    case 'pyramid': return 'polygon(50% 0%, 100% 15%, 100% 100%, 0% 100%, 0% 15%)';
    case 'slope-right': return 'polygon(0% 10%, 100% 0%, 100% 100%, 0% 100%)';
    case 'slope-left': return 'polygon(0% 0%, 100% 10%, 100% 100%, 0% 100%)';
    case 'chisel': return 'polygon(0% 0%, 80% 5%, 100% 20%, 100% 100%, 0% 100%)';
    case 'curved-top': return 'polygon(0% 12%, 50% 0%, 100% 12%, 100% 100%, 0% 100%)';
    case 'terminal': return 'polygon(45% 0%, 55% 0%, 55% 10%, 70% 10%, 70% 22%, 85% 22%, 85% 100%, 15% 100%, 15% 22%, 30% 22%, 30% 10%, 45% 10%)';
    case 'v-top': return 'polygon(0% 0%, 50% 12%, 100% 0%, 100% 100%, 0% 100%)';
    default: return 'none';
  }
}
