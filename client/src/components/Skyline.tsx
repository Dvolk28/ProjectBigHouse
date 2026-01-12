import { useState } from "react";

/* ================= CONFIG ================= */

const WINDOW_W = 8;
const WINDOW_H = 14;
const FLOOR_GAP = 6;     // vertical rhythm
const COLUMN_GAP = 14;  // horizontal spacing
const BUILDING_GAP = 18;
const WINDOW_PADDING = 4; // Padding from building edges to prevent clipping

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
        const cols = Math.floor((b.w - WINDOW_PADDING * 2) / COLUMN_GAP);
        const rows = Math.floor((b.h - WINDOW_PADDING * 2) / (WINDOW_H + FLOOR_GAP));

        const windows = [];

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const x = WINDOW_PADDING + c * COLUMN_GAP + COLUMN_GAP * 0.35;
            const y = b.h - WINDOW_PADDING - (r + 1) * (WINDOW_H + FLOOR_GAP);
            
            // Check if window center and corners are within building bounds
            const windowCenterX = x + WINDOW_W / 2;
            const windowCenterY = y + WINDOW_H / 2;
            const windowTopY = y;
            const windowBottomY = y + WINDOW_H;
            const windowLeftX = x;
            const windowRightX = x + WINDOW_W;
            
            // Convert to percentage coordinates for shape checking
            const centerXPercent = (windowCenterX / b.w) * 100;
            const centerYPercent = ((b.h - windowCenterY) / b.h) * 100;
            const topYPercent = ((b.h - windowTopY) / b.h) * 100;
            const bottomYPercent = ((b.h - windowBottomY) / b.h) * 100;
            const leftXPercent = (windowLeftX / b.w) * 100;
            const rightXPercent = (windowRightX / b.w) * 100;
            
            // Check if window is within building shape
            if (isPointInBuilding(centerXPercent, centerYPercent, b.type) &&
                isPointInBuilding(leftXPercent, topYPercent, b.type) &&
                isPointInBuilding(rightXPercent, topYPercent, b.type) &&
                isPointInBuilding(leftXPercent, bottomYPercent, b.type) &&
                isPointInBuilding(rightXPercent, bottomYPercent, b.type)) {
              
              globalWindowCount++;
              const id = globalWindowCount;
              const light = getLight(id);
              const isLit = !!light;

              windows.push(
                <div
                  key={`${i}-${c}-${r}`}
                  className="absolute"
                  style={{
                    left: x,
                    top: y,
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

// Check if a point (x, y in percentage 0-100) is within the building shape
function isPointInBuilding(x: number, y: number, type: string): boolean {
  // y=0 is top, y=100 is bottom
  // x=0 is left, x=100 is right
  
  switch (type) {
    case "spire": {
      // Terminal Tower: stepped top with spire
      if (y > 96) return false; // Below building
      if (y < 3) {
        // In spire area (top 3%)
        const centerX = 50;
        const spireWidth = 8 + (y * 2); // Wider at bottom
        return Math.abs(x - centerX) < spireWidth / 2;
      }
      if (y < 12) {
        // In stepped top area
        const centerX = 50;
        const stepWidth = 22 + (y * 1.5);
        return Math.abs(x - centerX) < stepWidth / 2;
      }
      // Main body
      return x >= 23 && x <= 77;
    }
    case "pyramid": {
      // Key Tower: pyramid shape
      if (y > 97) return false;
      const topX = 50;
      const slope = 0.45; // How much the sides slope
      const minX = topX - (y * slope);
      const maxX = topX + (y * slope);
      return x >= minX && x <= maxX;
    }
    case "curve": {
      // Carl B. Stokes: curved top
      if (y > 97) return false;
      if (y < 25) {
        // Curved top section
        const curveHeight = 25 - y;
        const curveOffset = Math.pow(curveHeight / 25, 2) * 10;
        return x >= curveOffset && x <= (100 - curveOffset);
      }
      return x >= 0 && x <= 100;
    }
    case "slope-right": {
      // Sloping right edge
      if (y > 97) return false;
      const slopeStart = y * 0.18;
      return x >= slopeStart && x <= 100;
    }
    case "slope-left": {
      // Sloping left edge
      if (y > 97) return false;
      const slopeEnd = 100 - (y * 0.18);
      return x >= 0 && x <= slopeEnd;
    }
    case "cut": {
      // 200 Public Square: cut corner
      if (y > 97) return false;
      if (y < 15) {
        const cutSlope = (15 - y) * 0.15;
        return x >= 0 && x <= (85 + cutSlope);
      }
      return x >= 0 && x <= 100;
    }
    case "chisel": {
      // One Cleveland Center: chiseled top
      if (y > 97) return false;
      if (y < 15) {
        const chiselSlope = (15 - y) * 0.15;
        return (x >= 0 && x <= (65 + chiselSlope)) || (x >= 80 && x <= 100);
      }
      return x >= 0 && x <= 100;
    }
    case "notch": {
      // Sherwin Williams: notched top
      if (y > 97) return false;
      if (y < 12) {
        // In notched area - windows can be on left or right side, but not in the notch gap
        return (x >= 0 && x <= 65) || (x >= 65 && x <= 100);
      }
      return x >= 0 && x <= 100;
    }
    default: {
      // Flat/block: simple rectangle
      if (y > 97) return false;
      return x >= 0 && x <= 100;
    }
  }
}

function getSvgPath(type: string) {
  switch (type) {
    case "spire":
      // Terminal Tower: more accurate stepped art deco top with spire
      return "M50 0 L54 3 L54 8 L60 8 L60 12 L70 12 L70 96 L30 96 L30 12 L40 12 L40 8 L46 8 L46 3 Z";
    case "pyramid":
      // Key Tower: more accurate pyramid with steeper sides
      return "M50 0 L97 3 L97 97 L3 97 L3 3 Z";
    case "curve":
      // Carl B. Stokes: smoother curve
      return "M0 25 Q50 -5 100 25 L100 97 L0 97 Z";
    case "slope-right":
      // Sloping right edge
      return "M0 0 L100 18 L100 97 L0 97 Z";
    case "slope-left":
      // Sloping left edge
      return "M0 18 L100 0 L100 97 L0 97 Z";
    case "cut":
      // 200 Public Square: cut corner
      return "M0 0 L85 0 L100 15 L100 97 L0 97 Z";
    case "chisel":
      // One Cleveland Center: chiseled top
      return "M0 0 L65 0 L80 15 L100 15 L100 97 L0 97 Z";
    case "notch":
      // Sherwin Williams: notched top
      return "M0 0 L65 0 L65 12 L100 12 L100 97 L0 97 Z";
    default:
      return "M0 0 L100 0 L100 97 L0 97 Z";
  }
}

/* ================= HELPERS ================= */

function normalizePath(path: string) {
  return path.replace(/(\d+(\.\d+)?)/g, (n) => `${Number(n) / 100}`);
}
