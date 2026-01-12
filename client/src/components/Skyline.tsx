import { useState } from "react";

/* ================= CONFIG ================= */

const WINDOW_W = 8;
const WINDOW_H = 14;
const FLOOR_GAP = 6;     // vertical rhythm
const COLUMN_GAP = 14;  // horizontal spacing
const BUILDING_GAP = 18;

const BUILDINGS = [
  { name: "Warehouse District", type: "flat", w: 60, h: 140 },
  { name: "The Flats", type: "slope-left", w: 70, h: 180 },
  { name: "Justice Center", type: "block", w: 80, h: 260 },

  { name: "Ernst & Young", type: "slope-right", w: 80, h: 320 },
  { name: "Carl B. Stokes", type: "curve", w: 95, h: 360 },
  { name: "Terminal Tower", type: "spire", w: 120, h: 600 },
  { name: "Key Tower", type: "pyramid", w: 150, h: 700 },
  { name: "200 Public Sq", type: "cut", w: 110, h: 520 },
  { name: "One Cleveland Center", type: "chisel", w: 90, h: 440 },
  { name: "Sherwin Williams", type: "notch", w: 105, h: 540 },

  { name: "The 9", type: "block", w: 75, h: 300 },
  { name: "PNC Center", type: "slope-left", w: 85, h: 330 },
  { name: "Federal Reserve", type: "block", w: 95, h: 190 },
];

/* ================= MAIN ================= */

export function Skyline({
  lights,
  onLightClick,
}: {
  lights: any[];
  onLightClick: (id: number) => void;
}) {
  const [hoveredLight, setHoveredLight] = useState<any | null>(null);
  const getLight = (id: number) => lights.find((l) => l.windowId === id);

  let globalWindowCount = 0;

  return (
    <div className="relative w-full max-w-[2400px] h-full flex items-end justify-center px-4 overflow-x-auto scrollbar-hide">

      {/* Ambient purple city glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Tooltip */}
      {hoveredLight && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-neutral-900/95 border border-purple-500/50 p-4 rounded-xl shadow-[0_0_35px_rgba(168,85,247,0.45)]">
            <h3 className="text-lg font-bold text-white">{hoveredLight.name}</h3>
            <p className="text-purple-200 italic text-sm">"{hoveredLight.message}"</p>
          </div>
        </div>
      )}

      {BUILDINGS.map((b, i) => {
        const cols = Math.floor(b.w / COLUMN_GAP);
        const rows = Math.floor(b.h / (WINDOW_H + FLOOR_GAP));

        const windows = [];

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            globalWindowCount++;
            const id = globalWindowCount;
            const light = getLight(id);
            const isLit = !!light;

            windows.push(
              <div
                key={`${i}-${c}-${r}`}
                className="absolute"
                style={{
                  left: c * COLUMN_GAP + COLUMN_GAP * 0.35,
                  top: b.h - (r + 1) * (WINDOW_H + FLOOR_GAP),
                  width: WINDOW_W,
                  height: WINDOW_H,
                }}
              >
                <div
                  onClick={() => onLightClick(id)}
                  onMouseEnter={() => isLit && setHoveredLight(light)}
                  onMouseLeave={() => setHoveredLight(null)}
                  className={`w-full h-full rounded-[1px] transition-all duration-300 cursor-pointer
                    ${
                      isLit
                        ? "bg-yellow-300 shadow-[0_0_10px_rgba(168,85,247,0.8),0_0_18px_rgba(253,224,71,0.9)]"
                        : "bg-white/15 hover:bg-white/40"
                    }
                  `}
                />
              </div>
            );
          }
        }

        return (
          <div
            key={i}
            className="relative shrink-0"
            style={{
              width: b.w,
              height: b.h,
              marginRight: BUILDING_GAP,
            }}
          >
            {/* Clip path */}
            <svg width="0" height="0">
              <defs>
                <clipPath id={`clip-${i}`} clipPathUnits="objectBoundingBox">
                  <path d={normalizePath(getSvgPath(b.type))} />
                </clipPath>
              </defs>
            </svg>

            {/* Building body */}
            <div className="absolute inset-0 text-slate-900 drop-shadow-2xl">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <path d={getSvgPath(b.type)} fill="currentColor" />
              </svg>
              <div className="absolute inset-0 border-x border-white/5 opacity-40" />
            </div>

            {/* Windows */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: `url(#clip-${i})`,
                WebkitClipPath: `url(#clip-${i})`,
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

/* ================= SHAPES ================= */

function getSvgPath(type: string) {
  switch (type) {
    case "spire":
      return "M50 0 L56 8 L56 22 L72 22 L72 100 L28 100 L28 22 L44 22 L44 8 Z";
    case "pyramid":
      return "M50 0 L95 22 L95 100 L5 100 L5 22 Z";
    case "curve":
      return "M0 25 Q50 -10 100 25 L100 100 L0 100 Z";
    case "slope-right":
      return "M0 0 L100 18 L100 100 L0 100 Z";
    case "slope-left":
      return "M0 18 L100 0 L100 100 L0 100 Z";
    case "cut":
      return "M0 0 L85 0 L100 15 L100 100 L0 100 Z";
    case "chisel":
      return "M0 0 L65 0 L80 15 L100 15 L100 100 L0 100 Z";
    case "notch":
      return "M0 0 L65 0 L65 12 L100 12 L100 100 L0 100 Z";
    default:
      return "M0 0 L100 0 L100 100 L0 100 Z";
  }
}

/* ================= HELPERS ================= */

function normalizePath(path: string) {
  return path.replace(/(\d+(\.\d+)?)/g, (n) => `${Number(n) / 100}`);
}
