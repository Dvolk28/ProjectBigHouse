import { useState } from "react";

const BUILDINGS = [
  { name: "Ernst & Young Tower", type: "block", w: 70, h: 280, windows: 100 },
  { name: "Carl B. Stokes Building", type: "curved-top", w: 80, h: 320, windows: 140 },
  { name: "Terminal Tower", type: "terminal", w: 100, h: 520, windows: 450 },
  { name: "Key Tower", type: "pyramid", w: 120, h: 600, windows: 600 },
  { name: "200 Public Sq", type: "slope-right", w: 110, h: 450, windows: 350 },
  { name: "One Cleveland Center", type: "chisel", w: 70, h: 380, windows: 150 },
  { name: "Sherwin Williams HQ", type: "v-top", w: 90, h: 480, windows: 300 },
  { name: "The 9", type: "block", w: 60, h: 220, windows: 80 },
];

export function Skyline({ lights, onLightClick }: { lights: any[], onLightClick: (id: number) => void }) {
  const [hoveredLight, setHoveredLight] = useState<any | null>(null);
  const getLight = (id: number) => lights.find((l) => l.windowId === id);

  let globalWindowCount = 0;

  return (
    <div className="relative w-full max-w-[1600px] h-full flex items-end justify-center px-4 gap-2 lg:gap-3 overflow-x-auto">
      
      {/* TOOLTIP */}
      {hoveredLight && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
          <div className="bg-neutral-900/90 backdrop-blur-md border border-yellow-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.3)] text-center min-w-[200px]">
            <h3 className="text-lg font-bold text-white mb-1">{hoveredLight.name}</h3>
            <p className="text-yellow-200 italic text-sm">"{hoveredLight.message}"</p>
          </div>
        </div>
      )}

      {BUILDINGS.map((b, i) => {
        const windows = [];
        const cols = Math.floor(b.w / 10);
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
                rounded-[1px] cursor-pointer transition-all duration-300
                ${isLit 
                  ? "bg-yellow-400 shadow-[0_0_8px_rgba(253,224,71,0.8)] z-10" 
                  : "bg-white/10 hover:bg-white/20"} 
              `}
              // Increased default bg opacity slightly for better visibility
              style={{ width: "100%", height: "100%" }}
            />
          );
        }

        const clipPathValue = getClipPath(b.type);

        return (
          <div key={i} className="relative flex flex-col justify-end group shrink-0" style={{ width: b.w, height: b.h }}>
            
            {/* SVG BACKGROUND LAYER */}
            {/* Updated color from text-slate-900 to text-slate-800 for lighter buildings */}
            <div className="absolute inset-0 z-0 text-slate-800 drop-shadow-2xl">
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                {b.type === "block" && <rect x="0" y="5" width="100" height="95" fill="currentColor" />}
                {b.type === "pyramid" && <path d="M50,0 L100,12 L100,100 L0,100 L0,12 Z" fill="currentColor" />}
                {b.type === "slope-right" && <path d="M0,8 L100,0 L100,100 L0,100 Z" fill="currentColor" />}
                {b.type === "chisel" && <path d="M0,0 L80,5 L100,20 L100,100 L0,100 Z" fill="currentColor" />}
                {b.type === "curved-top" && <path d="M0,10 Q50,0 100,10 L100,100 L0,100 Z" fill="currentColor" />}
                {b.type === "terminal" && (
                  <path d="M45,0 L55,0 L55,8 L70,8 L70,20 L85,20 L85,100 L15,100 L15,20 L30,20 L30,8 L45,8 Z" fill="currentColor" />
                )}
                {b.type === "v-top" && (
                   <path d="M0,0 L50,10 L100,0 L100,100 L0,100 Z" fill="currentColor" />
                )}
              </svg>
              
              {/* Border Overlay */}
              <div className="absolute inset-0 border-x border-t border-white/20 opacity-50" 
                   style={{ clipPath: clipPathValue }}></div>
            </div>

            {/* WINDOW GRID */}
            {/* Added clipPath here so windows don't spill over */}
            <div className="relative z-10 grid gap-[2px] p-2"
                 style={{
                   gridTemplateColumns: `repeat(${cols}, 1fr)`,
                   height: "100%", 
                   marginTop: "auto",
                   clipPath: clipPathValue
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

// Clip paths matching SVG shapes
function getClipPath(type: string) {
  switch(type) {
    case 'pyramid': return 'polygon(50% 0%, 100% 12%, 100% 100%, 0% 100%, 0% 12%)';
    case 'slope-right': return 'polygon(0% 8%, 100% 0%, 100% 100%, 0% 100%)';
    case 'chisel': return 'polygon(0% 0%, 80% 5%, 100% 20%, 100% 100%, 0% 100%)';
    case 'curved-top': return 'polygon(0% 10%, 50% 0%, 100% 10%, 100% 100%, 0% 100%)';
    case 'terminal': return 'polygon(45% 0%, 55% 0%, 55% 8%, 70% 8%, 70% 20%, 85% 20%, 85% 100%, 15% 100%, 15% 20%, 30% 20%, 30% 8%, 45% 8%)';
    case 'v-top': return 'polygon(0% 0%, 50% 10%, 100% 0%, 100% 100%, 0% 100%)';
    default: return 'none';
  }
}
