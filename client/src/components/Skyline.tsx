import { useRef, useEffect, useState } from "react";

/* ================= CONFIG ================= */

const CANVAS_HEIGHT = 520;
const WINDOW = 10;
const GAP_X = 18;
const GAP_Y = 14;
const EDGE = 16;

const BUILDINGS = [
  { type: "flat", w: 80, h: 160 },
  { type: "slope-left", w: 90, h: 220 },
  { type: "block", w: 100, h: 300 },
  { type: "slope-right", w: 110, h: 360 },
  { type: "curve", w: 120, h: 390 },
  { type: "spire", w: 150, h: 500 },
  { type: "pyramid", w: 180, h: 520 },
  { type: "cut", w: 120, h: 420 },
  { type: "chisel", w: 110, h: 380 },
  { type: "notch", w: 120, h: 440 },
];

/* ================= MAIN ================= */

export function Skyline({ lights, onLightClick }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let xOffset = 40;
    let windowId = 1;

    for (const b of BUILDINGS) {
      const cols = Math.floor((b.w - EDGE * 2) / GAP_X);
      const rows = Math.floor((b.h - 40) / GAP_Y);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = xOffset + EDGE + c * GAP_X;
          const y = CANVAS_HEIGHT - (r + 1) * GAP_Y - 10;

          const lit = lights.some((l: any) => l.windowId === windowId);

          ctx.fillStyle = lit ? "#fbbf24" : "rgba(148,163,184,0.25)";
          ctx.fillRect(x, y, WINDOW, WINDOW);

          windowId++;
        }
      }

      xOffset += b.w + 28;
    }
  }, [lights]);

  return (
    <div className="relative w-full h-[520px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-purple-900/20" />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={2400}
        height={CANVAS_HEIGHT}
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
      />

      {/* Buildings */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end">
        {BUILDINGS.map((b, i) => (
          <svg
            key={i}
            width={b.w}
            height={b.h}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="mr-7"
          >
            <defs>
              <linearGradient id={`g-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <path d={getSvgPath(b.type)} fill={`url(#g-${i})`} />
          </svg>
        ))}
      </div>
    </div>
  );
}

/* ================= SHAPES ================= */

function getSvgPath(type: string) {
  switch (type) {
    case "spire":
      return "M50 0 L52 3 L56 6 L60 10 L60 16 L76 16 L76 100 L24 100 L24 16 L40 16 L40 10 L44 6 L48 3 Z";
    case "pyramid":
      return "M50 0 L100 10 L100 100 L0 100 L0 10 Z";
    case "curve":
      return "M0 30 Q50 -5 100 30 L100 100 L0 100 Z";
    case "slope-right":
      return "M0 0 L100 20 L100 100 L0 100 Z";
    case "slope-left":
      return "M0 20 L100 0 L100 100 L0 100 Z";
    case "cut":
      return "M0 0 L85 0 L100 15 L100 100 L0 100 Z";
    case "chisel":
      return "M0 0 L65 0 L80 15 L100 15 L100 100 L0 100 Z";
    case "notch":
      return "M0 0 L70 0 L70 12 L100 12 L100 100 L0 100 Z";
    default:
      return "M0 0 L100 0 L100 100 L0 100 Z";
  }
}
