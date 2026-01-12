import { useState } from "react";

/* ================= CONFIG ================= */

const WINDOW_W = 10;
const WINDOW_H = 14;
const GAP = 4;

const BUILDINGS = [
  { name: "Warehouse District", type: "flat", w: 60, h: 140 },
  { name: "The Flats", type: "slope-left", w: 70, h: 180 },
  { name: "Justice Center", type: "block", w: 80, h: 260 },

  { name: "Ernst & Young", type: "slope-right", w: 75, h: 320 },
  { name: "Carl B. Stokes", type: "curve", w: 90, h: 350 },
  { name: "Terminal Tower", type: "spire", w: 110, h: 580 },
  { name: "Key Tower", type: "pyramid", w: 140, h: 680 },
  { name: "200 Public Sq", type: "cut", w: 110, h: 500 },
  { name: "One Cleveland Center", type: "chisel", w: 80, h: 420 },
  { name: "Sherwin Williams", type: "notch", w: 100, h: 520 },

  { name: "The 9", type: "block", w: 70, h: 280 },
  { name: "PNC Center", type: "slope-left", w: 85, h: 320 },
  { name: "Federal Reserve", type: "block", w: 95, h: 180 },
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
    <div className="relative w-full max-w-[2400px] h-full flex items-end justify-center gap-3 px-4 overflow-x-auto scrollbar-hide">

      {/* Tooltip */}
      {hoveredLight && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-neutral-900/95 border border-purple-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <h3 className="text-lg font-bold text-white">{hoveredLight.name}</h3>
            <p className="text-purple-200 italic text-sm">"{hoveredLight.message}"</p>
          </div>
        </div>
      )}

      {BUILDINGS.map((b, i) => {
        const cols = Math.ceil(b.w / (WINDOW_W + GAP));
        const rows = Math.ceil(b.h / (WINDOW_H + GAP));

        const windows = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            globalWindowCount++;
            const id = globalWindowCount;
            const light = getLight(id);
            const isLit = !!light;

            windows.push(
              <div
                key={`${i}-${r}-${c}`}
                className="absolute"
                style={{
                  left: c * (WINDOW_W + GAP),
                  top: r * (WINDOW_H + GAP),
                  width: WINDOW_W,
                  height: WINDOW_H,
                }}
              >
                <div
                  onClick={() => onLightClick(id)}
                  onMouseEnter={() => isLit && setHoveredLight(light)}
                  onMouseLeave={() => setHoveredLight(null)}
                  className={`w-full h-full rounded-[1px] transition-all duration-300 cursor-pointer
                    ${isLit
                      ? "bg-yellow-400 shadow-[0_0_8px_rgba(253,224,71,1)] scale-125"
                      : "bg-white/10 hover:bg-white/30"}
                  `}
                />
              </div>
            );
          }
        }

        return (
          <div
            key={i}
            className="relative shrink-0 flex justify-end"
            style={{ width: b.w, height: b.h }}
          >
            {/* Clip Definition */}
            <svg width="0" height="0">
              <defs>
                <clipPath id={`clip-${i}`} clipPathUnits="objectBoundingBox">
                  <path d={normalizePath(getSvgPath(b.type))} />
                </clipPath>
              </defs>
            </svg>

            {/* Building Shape */}
            <div className="absolute inset-0 text-slate-800 drop-shadow-2xl">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <path d={getSvgPath(b.type)} fill="currentColor" />
              </svg>
              <div className="absolute inset-0 border-x border-white/5 opacity-40" />
            </div>

            {/* Windows (CLIPPED) */}
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

/* ================= SVG SHAPES ================= */

function getSvgPath(type: string) {
  switch (type) {
    case "spire": // Terminal Tower
      return "M50 0 L56 8 L56 22 L72 22 L72 100 L28 100 L28 22 L44 22 L44 8 Z";

    case "pyramid": // Key Tower
      return "M50 0 L95 22 L95 100 L5 100 L5 22 Z";

    case "curve": // Stokes
      return "M0 25 Q50 -10 100 25 L100 100 L0 100 Z";

    case "slope-right":
      return "M0 0 L100 18 L100 100 L0 100 Z";

    case "slope-left":
      return "M0 18 L100 0 L100 100 L0 100 Z";

    case "cut": // 200 Public Sq
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
