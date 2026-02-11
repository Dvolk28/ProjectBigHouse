import { useRef, useEffect, useState } from "react";

const HEIGHT = 600;
const CANVAS_WIDTH = 1200;

const WINDOW_SIZE = 8;
const GAP_X = 12;
const GAP_Y = 12;
const WINDOW_PADDING = 10;

type BuildingShape =
  | "crown"
  | "needle"
  | "terrace"
  | "angled-left"
  | "angled-right"
  | "setback"
  | "spire";

type BuildingDefinition = {
  shape: BuildingShape;
  w: number;
  h: number;
  x: number;
  depth: "back" | "mid" | "front";
};

type LightData = { windowId: number; name?: string; message?: string; goal?: string };
type WindowBounds = { x: number; y: number; w: number; h: number };

const BUILDINGS: BuildingDefinition[] = [
  { shape: "angled-right", w: 100, h: 180, x: 18, depth: "back" },
  { shape: "setback", w: 116, h: 250, x: 106, depth: "back" },
  { shape: "needle", w: 72, h: 350, x: 224, depth: "mid" },
  { shape: "terrace", w: 132, h: 280, x: 308, depth: "mid" },
  { shape: "crown", w: 152, h: 470, x: 454, depth: "front" },
  { shape: "spire", w: 126, h: 390, x: 628, depth: "front" },
  { shape: "angled-left", w: 124, h: 250, x: 766, depth: "mid" },
  { shape: "setback", w: 138, h: 330, x: 900, depth: "front" },
  { shape: "terrace", w: 118, h: 220, x: 1048, depth: "back" },
];

const depthOpacity: Record<BuildingDefinition["depth"], number> = {
  back: 0.62,
  mid: 0.8,
  front: 1,
};

export default function Skyline({
  lights = [],
  onLightClick,
}: {
  lights: LightData[];
  onLightClick?: (id: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowMapRef = useRef<Map<number, WindowBounds>>(new Map());
  const [hoveredWindow, setHoveredWindow] = useState<{ windowId: number; name?: string; text?: string; x: number; y: number } | null>(null);
  const [hoveredWindowId, setHoveredWindowId] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, HEIGHT);
    windowMapRef.current.clear();

    const litWindowIds = new Set(lights.map((light) => light.windowId));

    let windowId = 1;
    for (const building of BUILDINGS) {
      const buildingPath = createBuildingPath(building);
      const top = HEIGHT - building.h;
      const left = building.x;
      const bottom = HEIGHT;
      const right = building.x + building.w;

      for (let y = top + WINDOW_PADDING; y <= bottom - WINDOW_SIZE - WINDOW_PADDING; y += GAP_Y) {
        for (let x = left + WINDOW_PADDING; x <= right - WINDOW_SIZE - WINDOW_PADDING; x += GAP_X) {
          const centerX = x + WINDOW_SIZE / 2;
          const centerY = y + WINDOW_SIZE / 2;

          if (!ctx.isPointInPath(buildingPath, centerX, centerY)) {
            continue;
          }

          const isHovered = hoveredWindowId === windowId;
          renderWindow(ctx, x, y, litWindowIds.has(windowId), isHovered);
          windowMapRef.current.set(windowId, { x, y, w: WINDOW_SIZE, h: WINDOW_SIZE });
          windowId++;
        }
      }
    }
  }, [lights, hoveredWindowId]);

  function renderWindow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    lit: boolean,
    hovered: boolean,
  ) {
    if (lit) {
      const glow = ctx.createRadialGradient(
        x + WINDOW_SIZE / 2,
        y + WINDOW_SIZE / 2,
        1,
        x + WINDOW_SIZE / 2,
        y + WINDOW_SIZE / 2,
        WINDOW_SIZE * 2.2,
      );
      glow.addColorStop(0, "rgba(251, 191, 36, 0.9)");
      glow.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(x - WINDOW_SIZE, y - WINDOW_SIZE, WINDOW_SIZE * 3, WINDOW_SIZE * 3);
    }

    ctx.fillStyle = lit ? "#fbbf24" : "rgba(148, 163, 184, 0.3)";
    ctx.fillRect(x, y, WINDOW_SIZE, WINDOW_SIZE);

    if (hovered) {
      ctx.strokeStyle = "rgba(250, 204, 21, 0.95)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x - 1, y - 1, WINDOW_SIZE + 2, WINDOW_SIZE + 2);
    }
  }

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const getWindowAtPosition = (x: number, y: number) => {
    let hitWindowId: number | null = null;

    windowMapRef.current.forEach((bounds, id) => {
      if (hitWindowId) {
        return;
      }

      if (x >= bounds.x && x <= bounds.x + bounds.w && y >= bounds.y && y <= bounds.y + bounds.h) {
        hitWindowId = id;
      }
    });

    return hitWindowId;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onLightClick) return;

    const point = getCanvasCoordinates(e);
    if (!point) return;

    const hitWindowId = getWindowAtPosition(point.x, point.y);
    if (hitWindowId) {
      onLightClick(hitWindowId);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasCoordinates(e);
    if (!point) return;

    const hitWindowId = getWindowAtPosition(point.x, point.y);
    setHoveredWindowId(hitWindowId);

    if (!hitWindowId) {
      setHoveredWindow(null);
      return;
    }

    const lightData = lights.find((light) => light.windowId === hitWindowId);
    const text = lightData?.goal ?? lightData?.message;

    if (lightData && (lightData.name || text)) {
      setHoveredWindow({
        windowId: hitWindowId,
        name: lightData.name,
        text,
        x: e.clientX,
        y: e.clientY,
      });
    } else {
      setHoveredWindow(null);
    }
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: HEIGHT }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(167,139,250,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(79,70,229,0.22),transparent_40%),linear-gradient(to_bottom,rgba(49,46,129,0.45),rgba(2,6,23,0.95))]" />
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle,rgba(255,255,255,0.65)_1px,transparent_1.4px)] [background-size:140px_140px]" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle,rgba(196,181,253,0.8)_1px,transparent_1.3px)] [background-size:220px_220px] [background-position:60px_30px]" />
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: CANVAS_WIDTH, height: HEIGHT }}>
        {BUILDINGS.map((building, i) => (
          <svg
            key={`${building.shape}-${i}`}
            width={building.w}
            height={building.h}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute bottom-0"
            style={{ left: building.x, opacity: depthOpacity[building.depth] }}
          >
            <defs>
              <linearGradient id={`g-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="40%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <path d={getSvgPath(building.shape)} fill={`url(#g-${i})`} />
          </svg>
        ))}

        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={HEIGHT}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => {
            setHoveredWindow(null);
            setHoveredWindowId(null);
          }}
          className="absolute bottom-0 left-0 cursor-pointer"
        />
      </div>

      {hoveredWindow && (
        <div
          className="fixed z-50 px-7 py-5 rounded-2xl pointer-events-none max-w-xs min-w-[220px] border border-yellow-300/65 bg-slate-950/95 shadow-[0_0_30px_rgba(250,204,21,0.28)] text-center"
          style={{
            left: hoveredWindow.x + 14,
            top: hoveredWindow.y - 96,
          }}
        >
          {hoveredWindow.name && <div className="text-3xl font-semibold text-white leading-none">{hoveredWindow.name}</div>}
          {hoveredWindow.text && <div className="text-3xl italic text-yellow-300 mt-3 leading-tight">“{hoveredWindow.text}”</div>}
          <div className="mx-auto mt-4 h-3 w-3 rounded-sm bg-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.95)]" />
        </div>
      )}
    </div>
  );
}

function getSvgPath(shape: BuildingShape) {
  switch (shape) {
    case "crown":
      return "M0 12 L20 12 L30 2 L50 0 L70 2 L80 12 L100 12 L100 100 L0 100 Z";
    case "needle":
      return "M45 0 L55 0 L58 8 L64 16 L64 24 L78 24 L78 100 L22 100 L22 24 L36 24 L36 16 L42 8 Z";
    case "terrace":
      return "M0 18 L26 18 L26 10 L48 10 L48 4 L72 4 L72 10 L100 10 L100 100 L0 100 Z";
    case "angled-left":
      return "M0 24 L100 6 L100 100 L0 100 Z";
    case "angled-right":
      return "M0 8 L100 24 L100 100 L0 100 Z";
    case "setback":
      return "M0 14 L18 14 L18 7 L42 7 L42 0 L72 0 L72 7 L100 7 L100 100 L0 100 Z";
    case "spire":
      return "M50 0 L54 6 L62 12 L62 20 L76 20 L76 100 L24 100 L24 20 L38 20 L38 12 L46 6 Z";
    default:
      return "M0 0 L100 0 L100 100 L0 100 Z";
  }
}

function getShapePoints(shape: BuildingShape): [number, number][] {
  switch (shape) {
    case "crown":
      return [[0, 12], [20, 12], [30, 2], [50, 0], [70, 2], [80, 12], [100, 12], [100, 100], [0, 100]];
    case "needle":
      return [[45, 0], [55, 0], [58, 8], [64, 16], [64, 24], [78, 24], [78, 100], [22, 100], [22, 24], [36, 24], [36, 16], [42, 8]];
    case "terrace":
      return [[0, 18], [26, 18], [26, 10], [48, 10], [48, 4], [72, 4], [72, 10], [100, 10], [100, 100], [0, 100]];
    case "angled-left":
      return [[0, 24], [100, 6], [100, 100], [0, 100]];
    case "angled-right":
      return [[0, 8], [100, 24], [100, 100], [0, 100]];
    case "setback":
      return [[0, 14], [18, 14], [18, 7], [42, 7], [42, 0], [72, 0], [72, 7], [100, 7], [100, 100], [0, 100]];
    case "spire":
      return [[50, 0], [54, 6], [62, 12], [62, 20], [76, 20], [76, 100], [24, 100], [24, 20], [38, 20], [38, 12], [46, 6]];
    default:
      return [[0, 0], [100, 0], [100, 100], [0, 100]];
  }
}

function createBuildingPath(building: BuildingDefinition) {
  const points = getShapePoints(building.shape);
  const path = new Path2D();

  points.forEach(([px, py], index) => {
    const x = building.x + (px / 100) * building.w;
    const y = HEIGHT - building.h + (py / 100) * building.h;

    if (index === 0) {
      path.moveTo(x, y);
      return;
    }

    path.lineTo(x, y);
  });

  path.closePath();
  return path;
}
