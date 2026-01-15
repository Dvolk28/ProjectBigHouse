import { useRef, useEffect } from "react";

/* ================= CONFIG ================= */

const HEIGHT = 600;
const CANVAS_WIDTH = 1200;

const WINDOW_SIZE = 8;
const GAP_X = 12;
const GAP_Y = 12;

// Simplified building set matching the first design
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
  lights: { windowId: number }[];
  onLightClick?: (id: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowMapRef = useRef<Map<number, { x: number; y: number; w: number; h: number }>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, HEIGHT);
    windowMapRef.current.clear();

    // Get actual building elements to measure their positions
    const buildingElements = container.querySelectorAll('svg');
    let windowId = 1;

    buildingElements.forEach((svgEl, buildingIndex) => {
      const b = BUILDINGS[buildingIndex];
      const rect = svgEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Get actual x position relative to container
      const xOffset = rect.left - containerRect.left;
      const buildingBottom = HEIGHT - b.h;
      
      // Custom window layout for each building type
      if (b.type === "flat") {
        // Simple rectangular building
        const cols = Math.floor((b.w * 0.7) / GAP_X);
        const rows = Math.floor((b.h * 0.85) / GAP_Y);
        const startX = xOffset + (b.w * 0.15);
        const startY = buildingBottom + 25;
        
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
            const y = startY + r * GAP_Y;
            renderWindow(ctx, x, y, windowId, lights);
            windowId++;
          }
        }
      } else if (b.type === "block") {
        // Simple rectangular building
        const cols = Math.floor((b.w * 0.7) / GAP_X);
        const rows = Math.floor((b.h * 0.85) / GAP_Y);
        const startX = xOffset + (b.w * 0.15);
        const startY = buildingBottom + 25;
        
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
            const y = startY + r * GAP_Y;
            renderWindow(ctx, x, y, windowId, lights);
            windowId++;
          }
        }
      } else if (b.type === "pyramid") {
        // Pyramid - gets narrower toward top
        const rows = Math.floor((b.h * 0.85) / GAP_Y);
        const startY = buildingBottom + 25;
        
        for (let r = 0; r < rows; r++) {
          const relativeY = r / rows; // 0 at bottom, 1 at top
          const widthAtRow = b.w * (0.9 - relativeY * 0.5); // Narrows as goes up
          const cols = Math.floor((widthAtRow * 0.7) / GAP_X);
          const startX = xOffset + (b.w - cols * GAP_X) / 2;
          
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
            const y = startY + r * GAP_Y;
            renderWindow(ctx, x, y, windowId, lights);
            windowId++;
          }
        }
      } else if (b.type === "spire") {
        // Spire with narrow top section
        const rows = Math.floor((b.h * 0.85) / GAP_Y);
        const startY = buildingBottom + 25;
        
        for (let r = 0; r < rows; r++) {
          const relativeY = r / rows;
          let cols;
          
          if (relativeY > 0.85) {
            // Top spire - very narrow
            cols = Math.floor((b.w * 0.25) / GAP_X);
          } else {
            // Main body
            cols = Math.floor((b.w * 0.65) / GAP_X);
          }
          
          const startX = xOffset + (b.w - cols * GAP_X) / 2;
          
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
            const y = startY + r * GAP_Y;
            renderWindow(ctx, x, y, windowId, lights);
            windowId++;
          }
        }
      } else if (b.type === "slope-left") {
        // Slopes from right side down to left
        const rows = Math.floor((b.h * 0.8) / GAP_Y);
        const startY = buildingBottom + 25;
        
        for (let r = 0; r < rows; r++) {
          const relativeY = r / rows;
          const leftCutoff = (1 - relativeY) * 0.2; // More cut off at bottom
          const availableWidth = b.w * (1 - leftCutoff);
          const cols = Math.floor((availableWidth * 0.7) / GAP_X);
          const startX = xOffset + b.w * leftCutoff + 10;
          
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
            const y = startY + r * GAP_Y;
            renderWindow(ctx, x, y, windowId, lights);
            windowId++;
          }
        }
      } else if (b.type === "slope-right") {
        // Slopes from left side down to right
        const rows = Math.floor((b.h * 0.8) / GAP_Y);
        const startY = buildingBottom + 25;
        
        for (let r = 0; r < rows; r++) {
          const relativeY = r / rows;
          const rightCutoff = (1 - relativeY) * 0.2; // More cut off at bottom
          const availableWidth = b.w * (1 - rightCutoff);
          const cols = Math.floor((availableWidth * 0.7) / GAP_X);
          const startX = xOffset + 10;
          
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
            const y = startY + r * GAP_Y;
            renderWindow(ctx, x, y, windowId, lights);
            windowId++;
          }
        }
      } else if (b.type === "notch") {
        // Building with notch cut out at top right
        const rows = Math.floor((b.h * 0.85) / GAP_Y);
        const startY = buildingBottom + 25;
        
        for (let r = 0; r < rows; r++) {
          const relativeY = r / rows;
          let cols = Math.floor((b.w * 0.7) / GAP_X);
          let startX = xOffset + (b.w * 0.15);
          
          // Remove windows in notch area (top right)
          if (relativeY > 0.88) {
            cols = Math.floor((b.w * 0.5) / GAP_X); // Shorter row
          }
          
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
            const y = startY + r * GAP_Y;
            renderWindow(ctx, x, y, windowId, lights);
            windowId++;
          }
        }
      }
    });
  }, [lights]);

  function renderWindow(ctx: CanvasRenderingContext2D, x: number, y: number, id: number, lights: { windowId: number }[]) {
    const lit = lights.some((l) => l.windowId === id);
    ctx.fillStyle = lit ? "#fbbf24" : "rgba(100,116,139,0.3)";
    ctx.fillRect(x, y, WINDOW_SIZE, WINDOW_SIZE);
    windowMapRef.current.set(id, { x, y, w: WINDOW_SIZE, h: WINDOW_SIZE });
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onLightClick) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find clicked window
    for (const [id, bounds] of windowMapRef.current.entries()) {
      if (
        x >= bounds.x &&
        x <= bounds.x + bounds.w &&
        y >= bounds.y &&
        y <= bounds.y + bounds.h
      ) {
        onLightClick(id);
        break;
      }
    }
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: HEIGHT }}>
      {/* Skyline wrapper */}
      <div
        ref={containerRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: CANVAS_WIDTH, height: HEIGHT }}
      >
        {/* Buildings - behind windows */}
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
              <path 
                d={getSvgPath(b.type)} 
                fill={`url(#g-${i})`}
              />
            </svg>
          ))}
        </div>

        {/* Windows - on top and clickable */}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={HEIGHT}
          onClick={handleCanvasClick}
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
    case "block":
      return "M0 0 L100 0 L100 100 L0 100 Z";
    default:
      return "M0 0 L100 0 L100 100 L0 100 Z";
  }
}
