import { useState } from "react";

/* ================= CONFIG ================= */

const WINDOW_W = 10;
const WINDOW_H = 10;  // Square windows for professional look
const FLOOR_GAP = 8;     // Better vertical rhythm
const COLUMN_GAP = 16;  // Better horizontal spacing
const BUILDING_GAP = 20;
const WINDOW_PADDING = 8; // Professional padding from building edges
const SLANT_PADDING = 14; // Extra padding for slanted edges

const BUILDINGS = [
  { name: "Warehouse District", type: "flat", w: 65, h: 150 },
  { name: "The Flats", type: "slope-left", w: 75, h: 200 },
  { name: "Justice Center", type: "block", w: 85, h: 280 },

  { name: "Ernst & Young", type: "slope-right", w: 85, h: 340 },
  { name: "Carl B. Stokes", type: "curve", w: 100, h: 380 },
  { name: "Terminal Tower", type: "spire", w: 130, h: 650 },
  { name: "Key Tower", type: "pyramid", w: 160, h: 750 },
  { name: "200 Public Sq", type: "cut", w: 115, h: 550 },
  { name: "One Cleveland Center", type: "chisel", w: 95, h: 470 },
  { name: "Sherwin Williams", type: "notch", w: 110, h: 570 },

  { name: "The 9", type: "block", w: 80, h: 320 },
  { name: "PNC Center", type: "slope-left", w: 90, h: 350 },
  { name: "Federal Reserve", type: "block", w: 100, h: 210 },
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

      {/* Professional night sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 via-transparent to-transparent pointer-events-none" />

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
        // For pyramid, only use the rectangular base (exclude top pyramid section)
        const pyramidTopHeight = b.type === "pyramid" ? b.h * 0.07 : 0;
        const usableHeight = b.h - pyramidTopHeight;
        
        // Calculate padding based on building type
        const leftPadding = (b.type === "slope-left" || b.type === "cut" || b.type === "chisel" || b.type === "notch") 
          ? SLANT_PADDING 
          : WINDOW_PADDING;
        const rightPadding = (b.type === "slope-right" || b.type === "cut" || b.type === "chisel" || b.type === "notch") 
          ? SLANT_PADDING 
          : WINDOW_PADDING;
        const topPadding = WINDOW_PADDING;
        const bottomPadding = WINDOW_PADDING;
        
        const cols = Math.floor((b.w - leftPadding - rightPadding) / COLUMN_GAP);
        const rows = Math.floor((usableHeight - topPadding - bottomPadding) / (WINDOW_H + FLOOR_GAP));

        const windows = [];

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const x = leftPadding + c * COLUMN_GAP + COLUMN_GAP * 0.35;
            // Position from bottom, accounting for pyramid top exclusion
            const y = b.h - bottomPadding - (r + 1) * (WINDOW_H + FLOOR_GAP);
            
            // For pyramid, skip if window would be in the pyramid top section
            if (b.type === "pyramid") {
              const yFromTop = b.h - y;
              if (yFromTop < pyramidTopHeight) {
                continue;
              }
            }
            
            // For Terminal Tower (spire), skip if window would be in the decorative top
            if (b.type === "spire") {
              const yFromTop = b.h - y;
              const decorativeTopHeight = b.h * 0.12; // Exclude top 12% (spire + stepped top)
              if (yFromTop < decorativeTopHeight) {
                continue;
              }
            }
            
            // Check if window center and corners are within building bounds with extra margin for square windows
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
            
            // Check if window is fully within building shape with margin to keep it square
            if (isWindowFullyInBuilding(
              leftXPercent, rightXPercent, 
              topYPercent, bottomYPercent,
              centerXPercent, centerYPercent,
              b.type
            )) {
              
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
                    className={`w-full h-full rounded-sm transition-all duration-300 cursor-pointer
                      ${
                        isLit
                          ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9),0_0_24px_rgba(251,191,36,0.6),inset_0_0_8px_rgba(255,255,255,0.3)]"
                          : "bg-slate-700/30 hover:bg-slate-600/50 border border-slate-600/20"
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
            <div className="absolute inset-0 z-0">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <linearGradient id={`building-gradient-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path 
                  d={getSvgPath(b.type)} 
                  fill={`url(#building-gradient-${i})`}
                  className="drop-shadow-lg"
                />
              </svg>
              {/* Subtle vertical lines for depth */}
              <div className="absolute inset-0 border-x border-slate-700/20" />
            </div>

            {/* Windows - clipPath to prevent overflow beyond building shape */}
            <div
              className="absolute inset-0 z-10"
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

// Check if a window is fully within building bounds (keeps windows square)
function isWindowFullyInBuilding(
  leftX: number, rightX: number,
  topY: number, bottomY: number,
  centerX: number, centerY: number,
  type: string
): boolean {
  // For pyramid, exclude the top pyramid section entirely
  if (type === "pyramid") {
    // Only allow windows in the rectangular base (below 7% from top where pyramid starts)
    if (topY < 7) return false;
    // Check if window fits within the rectangular base with padding
    return leftX >= 6 && rightX <= 94 && topY >= 7 && bottomY <= 97;
  }
  
  // For other shapes, check all corners and center are within bounds
  const margin = 2; // Small margin to ensure window stays square
  
  switch (type) {
    case "spire": {
      // Terminal Tower: only in main rectangular body, not in spire/stepped top
      // Exclude the entire decorative top section (spire + stepped top)
      if (topY < 12) return false; // Exclude stepped top and spire (top 12%)
      // Ensure windows stay well within the main rectangular body
      return leftX >= 24 && rightX <= 76 && topY >= 12 && bottomY <= 96;
    }
    case "curve": {
      // Carl B. Stokes: exclude curved top, only rectangular base
      if (topY < 28) return false;
      return leftX >= margin && rightX <= (100 - margin) && topY >= 28 && bottomY <= 97;
    }
    case "slope-right": {
      // Sloping right edge - ensure window is well away from slope
      const slopeX = topY * 0.18;
      const minX = Math.max(margin, slopeX + 8); // Extra padding from slope
      return leftX >= minX && rightX <= (100 - margin) && topY >= margin && bottomY <= 97;
    }
    case "slope-left": {
      // Sloping left edge - ensure window is well away from slope
      const slopeX = 100 - (topY * 0.18);
      const maxX = Math.min(100 - margin, slopeX - 8); // Extra padding from slope
      return leftX >= margin && rightX <= maxX && topY >= margin && bottomY <= 97;
    }
    case "cut": {
      // 200 Public Square: exclude cut corner area
      if (topY < 16) return false;
      return leftX >= margin && rightX <= (100 - margin) && topY >= 16 && bottomY <= 97;
    }
    case "chisel": {
      // One Cleveland Center: exclude chiseled top
      if (topY < 16) return false;
      return leftX >= margin && rightX <= (100 - margin) && topY >= 16 && bottomY <= 97;
    }
    case "notch": {
      // Sherwin Williams: exclude notched top
      if (topY < 13) return false;
      return leftX >= margin && rightX <= (100 - margin) && topY >= 13 && bottomY <= 97;
    }
    default: {
      // Flat/block: simple rectangle with margins
      return leftX >= margin && rightX <= (100 - margin) && topY >= margin && bottomY <= 97;
    }
  }
}

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
      // Terminal Tower: Professional stepped art deco design with distinct spire
      // Small spire point, then clear stepped sections, then main body
      return "M50 0 L51 1.2 L51 2.5 L53 2.5 L53 4 L56 4 L56 5.5 L59 5.5 L59 7 L63 7 L63 8.5 L68 8.5 L68 10 L74 10 L74 11.5 L78 11.5 L78 96 L22 96 L22 11.5 L26 11.5 L26 10 L32 10 L32 8.5 L37 8.5 L37 7 L41 7 L41 5.5 L44 5.5 L44 4 L47 4 L47 2.5 L49 2.5 L49 1.2 Z";
    case "pyramid":
      // Key Tower: Professional pyramid with clear, visible top section
      // Pyramid starts at point, slopes down to rectangular base
      return "M50 0 L100 7 L100 97 L0 97 L0 7 Z";
    case "curve":
      // Carl B. Stokes: Smooth, professional curved top
      return "M0 28 Q50 -3 100 28 L100 97 L0 97 Z";
    case "slope-right":
      // Professional sloping right edge
      return "M0 0 L100 20 L100 97 L0 97 Z";
    case "slope-left":
      // Professional sloping left edge
      return "M0 20 L100 0 L100 97 L0 97 Z";
    case "cut":
      // 200 Public Square: Clean cut corner design
      return "M0 0 L88 0 L100 16 L100 97 L0 97 Z";
    case "chisel":
      // One Cleveland Center: Professional chiseled top
      return "M0 0 L68 0 L82 16 L100 16 L100 97 L0 97 Z";
    case "notch":
      // Sherwin Williams: Clean notched top
      return "M0 0 L68 0 L68 13 L100 13 L100 97 L0 97 Z";
    default:
      // Clean rectangular buildings
      return "M0 0 L100 0 L100 97 L0 97 Z";
  }
}

/* ================= HELPERS ================= */

function normalizePath(path: string) {
  return path.replace(/(\d+(\.\d+)?)/g, (n) => `${Number(n) / 100}`);
}
