import { useRef, useEffect, useState } from "react";

const HEIGHT = 600;
const CANVAS_WIDTH = 1200;

const WINDOW_SIZE = 7;
const GAP_X = 11;
const GAP_Y = 11;
const WINDOW_PADDING = 8;

type BuildingShape =
  | "terminal-tower"
  | "key-tower"
  | "public-square"
  | "erieview"
  | "huntington"
  | "fed-classic"
  | "angled-left"
  | "angled-right";

type BuildingDefinition = {
  name: string;
  shape: BuildingShape;
  w: number;
  h: number;
  x: number;
  depth: "back" | "mid" | "front";
};

type LightData = { windowId: number; name?: string; message?: string; goal?: string };
type WindowBounds = { x: number; y: number; w: number; h: number };

const BUILDINGS: BuildingDefinition[] = [
  { name: "Flats West", shape: "angled-right", w: 110, h: 155, x: 0, depth: "back" },
  { name: "55 Public Square", shape: "fed-classic", w: 112, h: 215, x: 100, depth: "mid" },
  { name: "Huntington", shape: "huntington", w: 102, h: 320, x: 206, depth: "front" },
  { name: "Federal Reserve", shape: "public-square", w: 144, h: 270, x: 296, depth: "mid" },
  { name: "Key Tower", shape: "key-tower", w: 170, h: 500, x: 430, depth: "front" },
  { name: "Terminal Tower", shape: "terminal-tower", w: 145, h: 430, x: 615, depth: "front" },
  { name: "Erieview", shape: "erieview", w: 124, h: 345, x: 778, depth: "mid" },
  { name: "North Coast", shape: "angled-left", w: 148, h: 240, x: 892, depth: "back" },
  { name: "Public Square East", shape: "public-square", w: 156, h: 305, x: 1034, depth: "mid" },
];

const depthOpacity: Record<BuildingDefinition["depth"], number> = {
  back: 0.58,
  mid: 0.76,
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
          if (!isWindowWithinPath(ctx, buildingPath, x, y)) {
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
        WINDOW_SIZE * 2.4,
      );
      glow.addColorStop(0, "rgba(251, 191, 36, 0.92)");
      glow.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(x - WINDOW_SIZE, y - WINDOW_SIZE, WINDOW_SIZE * 3, WINDOW_SIZE * 3);
    }

    ctx.fillStyle = lit ? "#fbbf24" : "rgba(148, 163, 184, 0.32)";
    ctx.fillRect(x, y, WINDOW_SIZE, WINDOW_SIZE);

    if (hovered) {
      ctx.strokeStyle = "rgba(250, 204, 21, 0.95)";
      ctx.lineWidth = 1.1;
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
      if (hitWindowId) return;

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

@@ -179,144 +176,159 @@ export default function Skyline({

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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(167,139,250,0.22),transparent_36%),radial-gradient(circle_at_78%_18%,rgba(59,130,246,0.2),transparent_34%),linear-gradient(to_bottom,rgba(10,10,15,0)_0%,rgba(28,25,74,0.55)_34%,rgba(2,6,23,0.96)_100%)]" />
        <div className="absolute inset-0 opacity-55 bg-[radial-gradient(circle,rgba(226,232,240,0.72)_1px,transparent_1.4px)] [background-size:150px_150px]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,rgba(196,181,253,0.85)_1px,transparent_1.2px)] [background-size:235px_235px] [background-position:40px_24px]" />
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: CANVAS_WIDTH, height: HEIGHT }}>
        {BUILDINGS.map((building, i) => (
          <svg
            key={`${building.name}-${i}`}
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
                <stop offset="42%" stopColor="#1e1b4b" />
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

function isWindowWithinPath(ctx: CanvasRenderingContext2D, buildingPath: Path2D, x: number, y: number) {
  const corners: [number, number][] = [
    [x + 0.5, y + 0.5],
    [x + WINDOW_SIZE - 0.5, y + 0.5],
    [x + 0.5, y + WINDOW_SIZE - 0.5],
    [x + WINDOW_SIZE - 0.5, y + WINDOW_SIZE - 0.5],
  ];

  return corners.every(([cx, cy]) => ctx.isPointInPath(buildingPath, cx, cy));
}

function getSvgPath(shape: BuildingShape) {
  switch (shape) {
    case "terminal-tower":
      return "M28 100 L28 20 L40 20 L40 12 L46 12 L46 6 L50 0 L54 6 L54 12 L60 12 L60 20 L72 20 L72 100 Z";
    case "key-tower":
      return "M12 100 L12 16 L30 16 L36 0 L64 0 L70 16 L88 16 L88 100 Z";
    case "public-square":
      return "M10 100 L10 12 L30 12 L30 6 L70 6 L70 12 L90 12 L90 100 Z";
    case "erieview":
      return "M16 100 L16 14 L40 14 L40 6 L60 6 L60 14 L84 14 L84 100 Z";
    case "huntington":
      return "M30 100 L30 16 L40 16 L40 8 L47 8 L47 4 L50 0 L53 4 L53 8 L60 8 L60 16 L70 16 L70 100 Z";
    case "fed-classic":
      return "M8 100 L8 18 L24 18 L24 10 L42 10 L42 4 L58 4 L58 10 L76 10 L76 18 L92 18 L92 100 Z";
    case "angled-left":
      return "M10 100 L10 22 L90 6 L90 100 Z";
    case "angled-right":
      return "M10 100 L10 8 L90 24 L90 100 Z";
    default:
      return "M0 0 L100 0 L100 100 L0 100 Z";
  }
}

function getShapePoints(shape: BuildingShape): [number, number][] {
  switch (shape) {
    case "terminal-tower":
      return [[28, 100], [28, 20], [40, 20], [40, 12], [46, 12], [46, 6], [50, 0], [54, 6], [54, 12], [60, 12], [60, 20], [72, 20], [72, 100]];
    case "key-tower":
      return [[12, 100], [12, 16], [30, 16], [36, 0], [64, 0], [70, 16], [88, 16], [88, 100]];
    case "public-square":
      return [[10, 100], [10, 12], [30, 12], [30, 6], [70, 6], [70, 12], [90, 12], [90, 100]];
    case "erieview":
      return [[16, 100], [16, 14], [40, 14], [40, 6], [60, 6], [60, 14], [84, 14], [84, 100]];
    case "huntington":
      return [[30, 100], [30, 16], [40, 16], [40, 8], [47, 8], [47, 4], [50, 0], [53, 4], [53, 8], [60, 8], [60, 16], [70, 16], [70, 100]];
    case "fed-classic":
      return [[8, 100], [8, 18], [24, 18], [24, 10], [42, 10], [42, 4], [58, 4], [58, 10], [76, 10], [76, 18], [92, 18], [92, 100]];
    case "angled-left":
      return [[10, 100], [10, 22], [90, 6], [90, 100]];
    case "angled-right":
      return [[10, 100], [10, 8], [90, 24], [90, 100]];
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
