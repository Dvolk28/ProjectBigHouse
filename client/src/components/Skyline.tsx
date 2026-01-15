import { useRef, useEffect } from "react";

/* ================= CONFIG ================= */

const HEIGHT = 600;
const CANVAS_WIDTH = 1400;

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
  const windowMapRef = useRef<Map<number, { x: number; y: number; w: number; h: number }>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, HEIGHT);
    windowMapRef.current.clear();

    let xOffset = 40;
    let windowId = 1;

    for (const b of BUILDINGS) {
      // Calculate usable area for windows
      const usableWidth = b.w * 0.7; // 70% of building width
      const usableHeight = b.h * 0.8; // 80% of building height
      
      const cols = Math.floor(usableWidth / GAP_X);
      const rows = Math.floor(usableHeight / GAP_Y);
      
      // Center the window grid within the building
      const gridWidth = cols * GAP_X;
      const gridHeight = rows * GAP_Y;
      const startX = xOffset + (b.w - gridWidth) / 2;
      const startY = HEIGHT - b.h + (b.h - gridHeight) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * GAP_X;
          const y = startY + r * GAP_Y;

          // Check if window should be rendered based on building shape
          const relativeY = (y - (HEIGHT - b.h)) / b.h; // 0 to 1 from bottom to top
          const relativeX = (x - xOffset) / b.w; // 0 to 1 from left to right
          
          let shouldRender = true;
          
          // Adjust for building shapes
          if (b.type === "pyramid") {
            // Pyramid narrows as it goes up
            const widthAtHeight = 1 - (relativeY * 0.3);
            shouldRender = relativeX > (0.5 - widthAtHeight/2) && relativeX < (0.5 + widthAtHeight/2);
          } else if (b.type === "slope-left") {
            // Slopes from right down to left
            shouldRender = relativeX > (relativeY * 0.2);
          } else if (b.type === "slope-right") {
            // Slopes from left down to right
            shouldRender = relativeX < (1 - relativeY * 0.2);
          } else if (b.type === "spire") {
            // Narrow top section
            if (relativeY < 0.2) {
              shouldRender = relativeX > 0.35 && relativeX < 0.65;
            }
          } else if (b.type === "notch") {
            // Has a notch at top right
            if (relativeY < 0.15 && relativeX > 0.7) {
              shouldRender = false;
            }
          }

          if (shouldRender) {
            const lit = lights.some((l) => l.windowId === windowId);

            ctx.fillStyle = lit ? "#fbbf24" : "rgba(100,116,139,0.3)";
            ctx.fillRect(x, y, WINDOW_SIZE, WINDOW_SIZE);
            
            // Store window position for click detection
            windowMapRef.current.set(windowId, { x, y, w: WINDOW_SIZE, h: WINDOW_SIZE });
          }
          
          windowId++;
        }
      }

      xOffset += b.w + 20;
    }
  }, [lights]);

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
