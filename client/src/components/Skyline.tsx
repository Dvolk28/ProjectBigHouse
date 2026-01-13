import { useState, useMemo } from "react";

/* ================= CONFIG ================= */

const WINDOW = 10;
const FLOOR_GAP = 10;
const COLUMN_GAP = 18;
const EDGE = 14;

const BUILDING_GAP = 28;
const TERMINAL_GAP = 56;

const BUILDINGS = [
  { name: "Warehouse", type: "flat", w: 70, h: 160 },
  { name: "Flats", type: "slope-left", w: 80, h: 210 },
  { name: "Justice", type: "block", w: 95, h: 290 },

  { name: "Ernst", type: "slope-right", w: 100, h: 350 },
  { name: "Stokes", type: "curve", w: 115, h: 390 },
  { name: "Terminal Tower", type: "spire", w: 150, h: 660 },
  { name: "Key Tower", type: "pyramid", w: 180, h: 760 },
  { name: "Public Sq", type: "cut", w: 125, h: 560 },
  { name: "Cleveland Center", type: "chisel", w: 110, h: 480 },
  { name: "Sherwin", type: "notch", w: 125, h: 580 },
];

/* ================= MAIN ================= */

export function Skyline({ lights, onLightClick }: any) {
  const [hovered, setHovered] = useState<any>(null);

  let idCounter = 0;

  return (
    <div className="relative w-full min-h-[900px] overflow-visible flex items-end justify-center px-8">

      {/* Background */}
      <div className="absolute inset-0 -top-32 bg-gradient-to-t from-black via-slate-900 to-slate-950" />
      <div className="absolute inset-0 -top-32 bg-purple-900/20" />

      {/* Tooltip */}
      {hovered && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-black/90 border border-purple-500/40 px-4 py-3 rounded-xl">
            <h3 className="font-bold text-white">{hovered.name}</h3>
            <p className="text-purple-200 italic text-sm">
              "{hovered.message}"
            </p>
          </div>
        </div>
      )}

      {BUILDINGS.map((b, i) => {
        const cols = Math.floor((b.w - EDGE * 2) / COLUMN_GAP);
        const rows = Math.floor((b.h - 60) / (WINDOW + FLOOR_GAP));

        const windows = useMemo(() => {
          const out = [];
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              idCounter++;

              const x = EDGE + c * COLUMN_GAP;
              const y = b.h - 36 - r * (WINDOW + FLOOR_GAP);

              // Storytelling lighting pattern
              const residential = r % 4 === 0;
              const light = lights.find((l: any) => l.windowId === idCounter);
              const lit = !!light;

              out.push(
                <div
                  key={`${i}-${r}-${c}`}
                  className="absolute"
                  style={{ left: x, top: y, width: WINDOW, height: WINDOW }}
                >
                  <div
                    onClick={() => onLightClick(idCounter)}
                    onMouseEnter={() => lit && setHovered(light)}
                    onMouseLeave={() => setHovered(null)}
                    className={`w-full h-full rounded-sm transition
                      ${
                        lit
                          ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                          : residential
                          ? "bg-slate-600/25"
                          : "bg-slate-700/30"
                      }`}
                  />
                </div>
              );
            }
          }
          return out;
        }, [lights]);

        const gap = b.type === "spire" ? TERMINAL_GAP : BUILDING_GAP;

        return (
          <div
            key={i}
            className="relative shrink-0 overflow-visible"
            style={{ width: b.w, height: b.h, marginRight: gap }}
          >
            {/* Building */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0"
            >
              <defs>
                <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
              </defs>
              <path d={getSvgPath(b.type)} fill={`url(#grad-${i})`} />
            </svg>

            {/* Terminal Tower Crown */}
            {b.type === "spire" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40px] h-[120px]
                              bg-purple-500/40 blur-xl pointer-events-none" />
            )}

            {/* Windows */}
            <div className="absolute inset-0 overflow-hidden">
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
      return "M50 0 L52 2 L54 4 L56 6 L60 8 L60 14 L76 14 L76 96 L24 96 L24 14 L40 14 L40 8 L44 6 L46 4 L48 2 Z";
    case "pyramid":
      return "M50 0 L100 8 L100 96 L0 96 L0 8 Z";
    case "curve":
      return "M0 28 Q50 -6 100 28 L100 96 L0 96 Z";
    case "slope-right":
      return "M0 0 L100 20 L100 96 L0 96 Z";
    case "slope-left":
      return "M0 20 L100 0 L100 96 L0 96 Z";
    case "cut":
      return "M0 0 L88 0 L100 16 L100 96 L0 96 Z";
    case "chisel":
      return "M0 0 L68 0 L82 16 L100 16 L100 96 L0 96 Z";
    case "notch":
      return "M0 0 L68 0 L68 12 L100 12 L100 96 L0 96 Z";
    default:
      return "M0 0 L100 0 L100 96 L0 96 Z";
  }
}
