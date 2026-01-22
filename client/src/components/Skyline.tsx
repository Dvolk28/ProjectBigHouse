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
  { type: "spire", w: 140, h: 380 },      // ← spire fix
  { type: "pyramid", w: 160, h: 480 },    // ← shifted down
  { type: "block", w: 130, h: 320 },
  { type: "slope-right", w: 110, h: 220 },
  { type: "notch", w: 140, h: 380 },      // ← shifted down
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
  const windowMapRef = useRef<Map<number, { x: number; y: number; w: number; h: number }>>(new Map());
  const [hoveredWindow, setHoveredWindow] = useState<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, HEIGHT);
    windowMapRef.current.clear();

    const buildingEls = container.querySelectorAll("svg");
    let windowId = 1;

    buildingEls.forEach((svgEl, i) => {
      const b = BUILDINGS[i];
      const rect = svgEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const xOffset = rect.left - containerRect.left;

      // ↓ GLOBAL DOWN SHIFT FOR PROBLEM BUILDINGS
      const yBase =
        HEIGHT - b.h +
        (b.type === "pyramid" || b.type === "notch" || b.type === "spire" ? 22 : 12);

      /* ===== FLAT / BLOCK ===== */
      if (b.type === "flat" || b.type === "block") {
        const cols = Math.floor((b.w * 0.7) / GAP_X);
        const rows = Math.floor((b.h * 0.85) / GAP_Y);
        const startX = xOffset + (b.w - cols * GAP_X) / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            draw(ctx, startX + c * GAP_X, yBase + r * GAP_Y);
          }
        }
      }

      /* ===== PYRAMID (SHIFTED DOWN) ===== */
      else if (b.type === "pyramid") {
        const rows = Math.floor((b.h * 0.82) / GAP_Y);

        for (let r = 0; r < rows; r++) {
          const width = b.w * 0.65;
          const cols = Math.floor(width / GAP_X);
          const startX = xOffset + (b.w - cols * GAP_X) / 2;

          for (let c = 0; c < cols; c++) {
            draw(ctx, startX + c * GAP_X, yBase + r * GAP_Y);
          }
        }
      }

      /* ===== SPIRE (ONE CENTER COLUMN ONLY) ===== */
      else if (b.type === "spire") {
        const rows = Math.floor((b.h * 0.75) / GAP_Y);
        const centerX = xOffset + b.w / 2 - WINDOW_SIZE / 2;

        for (let r = 0; r < rows; r++) {
          draw(ctx, centerX, yBase + r * GAP_Y);
        }
      }

      /* ===== SLOPE LEFT / RIGHT ===== */
      else if (b.type === "slope-left" || b.type === "slope-right") {
        const rows = Math.floor((b.h * 0.85) / GAP_Y);
        const cols = Math.floor((b.w * 0.65) / GAP_X);
        const startX = xOffset + (b.w - cols * GAP_X) / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            draw(ctx, startX + c * GAP_X, yBase + r * GAP_Y);
          }
        }
      }

      /* ===== NOTCH (SHIFTED DOWN) ===== */
      else if (b.type === "notch") {
        const rows = Math.floor((b.h * 0.8) / GAP_Y);
        const cols = Math.floor((b.w * 0.65) / GAP_X);
        const startX = xOffset + (b.w - cols * GAP_X) / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            draw(ctx, startX + c * GAP_X, yBase + r * GAP_Y);
          }
        }
      }

      function draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
        const lit = lights.some((l) => l.windowId === windowId);
        ctx.fillStyle = lit ? "#fbbf24" : "rgba(100,116,139,0.28)";
        ctx.fillRect(x, y, WINDOW_SIZE, WINDOW_SIZE);
        windowMapRef.current.set(windowId, { x, y, w: WINDOW_SIZE, h: WINDOW_SIZE });
        windowId++;
      }
    });
  }, [lights]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onLightClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    const y = (e.clientY - rect.top) * (HEIGHT / rect.height);

    for (const [id, b] of windowMapRef.current) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        onLightClick(id);
        break;
      }
    }
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
            <svg key={i} width={b.w} height={b.h} viewBox="0 0 100 100" preserveAspectRatio="none">
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
          className="absolute bottom-0 left-0 cursor-pointer"
        />
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
