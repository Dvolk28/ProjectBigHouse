import { useRef, useEffect, useState } from "react";

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
  lights: { windowId: number; name?: string; goal?: string }[];
  onLightClick?: (id: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowMapRef = useRef<Map<number, { x: number; y: number; w: number; h: number }>>(new Map());
  const [hoveredWindow, setHoveredWindow] = useState<{ windowId: number; name?: string; goal?: string; x: number; y: number } | null>(null);

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
      if (b.type === "flat" || b.type === "block") {
        // Simple rectangular buildings
        const cols = Math.floor((b.w * 0.7) / GAP_X);
        const rows = Math.floor((b.h * 0.88) / GAP_Y);
        const gridWidth = cols * GAP_X;
        const startX = xOffset + (b.w - gridWidth) / 2;
        const startY = buildingBottom + 15;
        
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
            const y = startY + r * GAP_Y;
            renderWindow(ctx, x, y, windowId, lights);
            windowId++;
          }
        }
      } else if (b.type === "pyramid") {
        // Pyramid: M50 0 L100 10 L100 100 L0 100 L0 10 Z
        // Starts narrow at top, gets wider toward bottom
        const rows = Math.floor((b.h * 0.88) / GAP_Y);
        
        for (let r = 0; r < rows; r++) {
          const relativeY = r / rows; // 0 at top, 1 at bottom
          // Top 10% is tapered, then expands
          let widthPercent;
          if (relativeY < 0.08) {
            widthPercent = 0.25 + (relativeY / 0.08) * 0.45; // 25% to 70%
          } else {
            widthPercent = 0.7;
          }
          
          const rowWidth = b.w * widthPercent;
          const cols = Math.floor(rowWidth / GAP_X);
          const startX = xOffset + (b.w - cols * GAP_X) / 2;
          const y = buildingBottom + 15 + r * GAP_Y;
          
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
            renderWindow(ctx, x, y, windowId, lights);
            windowId++;
          }
        }
      } else if (b.type === "spire") {
        // Spire: M50 0 L52 3 L56 6 L60 10 L60 16 L76 16 L76 100 L24 100 L24 16 L40 16 L40 10 L44 6 L48 3 Z
        // Very narrow top spire, then medium section, then wide body
        const rows = Math.floor((b.h * 0.85) / GAP_Y);
        
        for (let r = 0; r < rows; r++) {
          const relativeY = r / rows;
          let widthPercent;
          
          if (relativeY < 0.10) {
            // Very narrow spire top
            widthPercent = 0.2;
          } else if (relativeY < 0.16) {
            // Medium transition section
            widthPercent = 0.35;
          } else {
            // Wide body (but keep within the 24-76 range = 52% of building)
            widthPercent = 0.52;
          }
          
          const rowWidth = b.w * widthPercent;
          const cols = Math.floor(rowWidth / GAP_X);
          const startX = xOffset + (b.w - cols * GAP_X) / 2;
          const y = buildingBottom + 15 + r * GAP_Y;
          
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
            renderWindow(ctx, x, y, windowId, lights);
            windowId++;
          }
        }
      } else if (b.type === "slope-left") {
        // Slope-left: M0 20 L100 0 L100 100 L0 100 Z
        // Starts 20% down on left side, full height on right
        const rows = Math.floor((b.h * 0.85) / GAP_Y);
        
        for (let r = 0; r < rows; r++) {
          const relativeY = r / rows;
          // Left side starts at 20% down, calculate available width
          const leftCutPercent = 0.2; // Left starts 20% from top
          
          if (relativeY < leftCutPercent) {
            // In the sloped section - width increases as we go down
            const slopeProgress = relativeY / leftCutPercent;
            const availableWidth = b.w * (0.5 + slopeProgress * 0.25);
            const cols = Math.floor(availableWidth / GAP_X);
            const startX = xOffset + b.w * (1 - (0.5 + slopeProgress * 0.25)) + 5;
            const y = buildingBottom + 15 + r * GAP_Y;
            
            for (let c = 0; c < cols; c++) {
              const x = startX + c * GAP_X;
              renderWindow(ctx, x, y, windowId, lights);
              windowId++;
            }
          } else {
            // Full width section
            const cols = Math.floor((b.w * 0.75) / GAP_X);
            const gridWidth = cols * GAP_X;
            const startX = xOffset + (b.w - gridWidth) / 2;
            const y = buildingBottom + 15 + r * GAP_Y;
            
            for (let c = 0; c < cols; c++) {
              const x = startX + c * GAP_X;
              renderWindow(ctx, x, y, windowId, lights);
              windowId++;
            }
          }
        }
      } else if (b.type === "slope-right") {
        // Slope-right: M0 0 L100 20 L100 100 L0 100 Z
        // Full height on left, starts 20% down on right side
        const rows = Math.floor((b.h * 0.85) / GAP_Y);
        
        for (let r = 0; r < rows; r++) {
          const relativeY = r / rows;
          const rightCutPercent = 0.2;
          
          if (relativeY < rightCutPercent) {
            // In the sloped section
            const slopeProgress = relativeY / rightCutPercent;
            const availableWidth = b.w * (0.5 + slopeProgress * 0.25);
            const cols = Math.floor(availableWidth / GAP_X);
            const startX = xOffset + 5;
            const y = buildingBottom + 15 + r * GAP_Y;
            
            for (let c = 0; c < cols; c++) {
              const x = startX + c * GAP_X;
              renderWindow(ctx, x, y, windowId, lights);
              windowId++;
            }
          } else {
            // Full width section
            const cols = Math.floor((b.w * 0.75) / GAP_X);
            const gridWidth = cols * GAP_X;
            const startX = xOffset + (b.w - gridWidth) / 2;
            const y = buildingBottom + 15 + r * GAP_Y;
            
            for (let c = 0; c < cols; c++) {
              const x = startX + c * GAP_X;
              renderWindow(ctx, x, y, windowId, lights);
              windowId++;
            }
          }
        }
      } else if (b.type === "notch") {
        // Notch: M0 0 L70 0 L70 12 L100 12 L100 100 L0 100 Z
        // First 70% width at top for 12% of height, then full width
        const rows = Math.floor((b.h * 0.88) / GAP_Y);
        
        for (let r = 0; r < rows; r++) {
          const relativeY = r / rows;
          let cols, startX;
          
          if (relativeY < 0.12) {
            // Top section - only left 70% (from 0 to 70 in viewBox)
            const topWidth = b.w * 0.7;
            cols = Math.floor((topWidth * 0.65) / GAP_X);
            startX = xOffset + 10;
          } else {
            // Full width body (after the notch step)
            cols = Math.floor((b.w * 0.70) / GAP_X);
            const gridWidth = cols * GAP_X;
            startX = xOffset + (b.w - gridWidth) / 2;
          }
          
          const y = buildingBottom + 15 + r * GAP_Y;
          
          for (let c = 0; c < cols; c++) {
            const x = startX + c * GAP_X;
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

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find hovered window
    for (const [id, bounds] of windowMapRef.current.entries()) {
      if (
        x >= bounds.x &&
        x <= bounds.x + bounds.w &&
        y >= bounds.y &&
        y <= bounds.y + bounds.h
      ) {
        const lightData = lights.find(l => l.windowId === id);
        if (lightData && (lightData.name || lightData.goal)) {
          setHoveredWindow({
            windowId: id,
            name: lightData.name,
            goal: lightData.goal,
            x: e.clientX,
            y: e.clientY
          });
          return;
        }
      }
    }
    setHoveredWindow(null);
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
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredWindow(null)}
          className="absolute bottom-0 left-0 cursor-pointer"
        />
      </div>

      {/* Tooltip */}
      {hoveredWindow && (
        <div
          className="fixed z-50 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-600 pointer-events-none max-w-xs"
          style={{
            left: hoveredWindow.x + 15,
            top: hoveredWindow.y - 60,
          }}
        >
          {hoveredWindow.name && (
            <div className="font-semibold text-amber-400">{hoveredWindow.name}</div>
          )}
          {hoveredWindow.goal && (
            <div className="text-sm text-slate-300 mt-1">{hoveredWindow.goal}</div>
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
    case "block":
      return "M0 0 L100 0 L100 100 L0 100 Z";
    default:
      return "M0 0 L100 0 L100 100 L0 100 Z";
  }
}
