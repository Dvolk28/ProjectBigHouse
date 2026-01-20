import { useRef, useEffect, useState } from "react";

/* ================= CONFIG ================= */

const HEIGHT = 600;
const CANVAS_WIDTH = 1200;

const WINDOW_SIZE = 8;
const GAP_X = 12;
const GAP_Y = 12;

const BUILDINGS = [
  { type: "flat", w: 120, h: 280 },
  { type: "slope-left", w: 100, h: 180 },
  { type: "spire", w: 140, h: 380 },
  { type: "pyramid", w: 160, h: 480 },
  { type: "block", w: 130, h: 320 },
  { type: "slope-right", w: 110, h: 220 },
  { type: "notch", w: 140, h: 380 },
  { type: "flat", w: 100, h: 160 },
];

/* ================= COMPONENT ================= */

export default function Skyline({
  lights = [],
  onLightClick,
}: {
  lights: { windowId: number; name?: string; goal?: string }[];
  onLightClick?: (id: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowMapRef = useRef<
    Map<number, { x: number; y: number; w: number; h: number }>
  >(new Map());

  const [hoveredWindow, setHoveredWindow] = useState<{
    windowId: number;
    name?: string;
    goal?: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, HEIGHT);
    windowMapRef.current.clear();

    const svgs = container.querySelectorAll("svg");
    let windowId = 1;

    svgs.forEach((svg, i) => {
      const b = BUILDINGS[i];
      const rect = svg.getBoundingClientRect();
      const crect = container.getBoundingClientRect();
      const xOffset = rect.left - crect.left;
      const bottom = HEIGHT - b.h;

      const rows = Math.floor((b.h * 0.9) / GAP_Y);

      for (let r = 0; r < rows; r++) {
        const y = bottom + 12 + r * GAP_Y;
        const yNorm = ((y - bottom) / b.h) * 100;

        let leftX = xOffset;
        let rightX = xOffset + b.w;

        /* ===== SHAPE BOUNDS ===== */

        if (b.type === "slope-left" && yNorm < 20) {
          const pct = ((20 - yNorm) / 20) * 100;
          leftX = xOffset + (pct / 100) * b.w;
        }

        if (b.type === "slope-right" && yNorm < 20) {
          const pct = 100 - ((20 - yNorm) / 20) * 100;
          rightX = xOffset + (pct / 100) * b.w;
        }

        if (b.type === "spire") {
          const t = r / rows;
          const width =
            t < 0.12 ? 0.18 + t * 1.5 : 0.52;
          const w = b.w * width;
          leftX = xOffset + (b.w - w) / 2;
          rightX = leftX + w;
        }

        if (b.type === "pyramid") {
          const t = r / rows;
          const width =
            t < 0.1 ? 0.25 + t * 4.8 : 0.73;
          const w = b.w * width;
          leftX = xOffset + (b.w - w) / 2;
          rightX = leftX + w;
        }

        if (b.type === "notch" && yNorm < 12) {
          rightX = xOffset + b.w * 0.7;
        }

        /* ===== WINDOW FILL ===== */

        const available = rightX - leftX;
        const cols = Math.floor(available / GAP_X);

        for (let c = 0; c < cols; c++) {
          const x = leftX + c * GAP_X;
          drawWindow(ctx, x, y, windowId, lights);
          windowId++;
        }
      }
    });
  }, [lights]);

  function drawWindow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    id: number,
    lights: { windowId: number }[]
  ) {
    const lit = lights.some((l) => l.windowId === id);
    ctx.fillStyle = lit ? "#fbbf24" : "rgba(100,116,139,0.3)";
    ctx.fillRect(x, y, WINDOW_SIZE, WINDOW_SIZE);
    windowMapRef.current.set(id, {
      x,
      y,
      w: WINDOW_SIZE,
      h: WINDOW_SIZE,
    });
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onLightClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * CANVAS_WIDTH) / rect.width;
    const y = ((e.clientY - rect.top) * HEIGHT) / rect.height;

    for (const [id, b] of windowMapRef.current) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        onLightClick(id);
        break;
      }
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * CANVAS_WIDTH) / rect.width;
    const y = ((e.clientY - rect.top) * HEIGHT) / rect.height;

    for (const [id, b] of windowMapRef.current) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        const data = lights.find((l) => l.windowId === id);
        if (data?.name || data?.goal) {
          setHoveredWindow({
            windowId: id,
            name: data.name,
            goal: data.goal,
            x: e.clientX,
            y: e.clientY,
          });
          return;
        }
      }
    }
    setHoveredWindow(null);
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: HEIGHT }}>
      <div
        ref={containerRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: CANVAS_WIDTH, height: HEIGHT }}
      >
        <div className="absolute bottom-0 left-0 flex items-end gap-5">
          {BUILDINGS.map((b, i) => (
            <svg
              key={i}
              width={b.w}
              height={b.h}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
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

        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={HEIGHT}
          onClick={handleClick}
          onMouseMove={handleMove}
          onMouseLeave={() => setHoveredWindow(null)}
          className="absolute bottom-0 left-0 cursor-pointer"
        />
      </div>

      {hoveredWindow && (
        <div
          className="fixed z-50 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-600 pointer-events-none"
          style={{ left: hoveredWindow.x + 15, top: hoveredWindow.y - 60 }}
        >
          {hoveredWindow.name && (
            <div className="font-semibold text-amber-400">
              {hoveredWindow.name}
            </div>
          )}
          {hoveredWindow.goal && (
            <div className="text-sm text-slate-300 mt-1">
              {hoveredWindow.goal}
            </div>
          )}
        </div>
      )}
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
    case "slope-right":
      return "M0 0 L100 20 L100 100 L0 100 Z";
    case "slope-left":
      return "M0 20 L100 0 L100 100 L0 100 Z";
    case "notch":
      return "M0 0 L70 0 L70 12 L100 12 L100 100 L0 100 Z";
    default:
      return "M0 0 L100 0 L100 100 L0 100 Z";
  }
}
