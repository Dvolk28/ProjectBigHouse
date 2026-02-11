import { useRef, useEffect, useState } from "react";

const HEIGHT = 600;
const CANVAS_WIDTH = 1200;

const WINDOW_SIZE = 8;
const GAP_X = 12;
const GAP_Y = 12;

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
  lights: { windowId: number; name?: string; message?: string; goal?: string }[];
  onLightClick?: (id: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowMapRef = useRef<Map<number, { x: number; y: number; w: number; h: number }>>(new Map());
  const [hoveredWindow, setHoveredWindow] = useState<{ windowId: number; name?: string; text?: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, HEIGHT);
    windowMapRef.current.clear();

    let windowId = 1;

    BUILDINGS.forEach((building) => {
      const rows = Math.floor((building.h * 0.88) / GAP_Y);

      for (let r = 0; r < rows; r++) {
        const rowRatio = rows > 1 ? r / (rows - 1) : 0;
        const rowConfig = getRowWindowConfig(building, rowRatio);
        const cols = Math.max(0, Math.floor((building.w * rowConfig.widthPercent) / GAP_X));

        if (!cols) {
          continue;
        }

        const gridWidth = cols * GAP_X;
        const startX = building.x + ((building.w - gridWidth) / 2) + (building.w * rowConfig.shiftPercent);
        const y = HEIGHT - building.h + 10 + r * GAP_Y;

        for (let c = 0; c < cols; c++) {
          const x = startX + c * GAP_X;
          renderWindow(ctx, x, y, windowId, lights);
          windowId++;
        }
      }
    });
  }, [lights]);

  function renderWindow(ctx: CanvasRenderingContext2D, x: number, y: number, id: number, lightsData: { windowId: number }[]) {
    const lit = lightsData.some((l) => l.windowId === id);
    ctx.fillStyle = lit ? "#fbbf24" : "rgba(148, 163, 184, 0.3)";
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

    windowMapRef.current.forEach((bounds, id) => {
      if (x >= bounds.x && x <= bounds.x + bounds.w && y >= bounds.y && y <= bounds.y + bounds.h) {
        onLightClick(id);
      }
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    let hovered: { windowId: number; name?: string; text?: string; x: number; y: number } | null = null;

    windowMapRef.current.forEach((bounds, id) => {
      if (hovered || x < bounds.x || x > bounds.x + bounds.w || y < bounds.y || y > bounds.y + bounds.h) {
        return;
      }

      const lightData = lights.find((l) => l.windowId === id);
      const text = lightData?.message ?? lightData?.goal;
      if (lightData && (lightData.name || text)) {
        hovered = {
          windowId: id,
          name: lightData.name,
          text,
          x: e.clientX,
          y: e.clientY,
        };
      }
    });

    setHoveredWindow(hovered);
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
          onMouseLeave={() => setHoveredWindow(null)}
          className="absolute bottom-0 left-0 cursor-pointer"
        />
      </div>

      {hoveredWindow && (
        <div
          className="fixed z-50 bg-slate-900/95 text-white px-3 py-2 rounded-lg shadow-xl border border-indigo-400/40 pointer-events-none max-w-xs"
          style={{
            left: hoveredWindow.x + 15,
            top: hoveredWindow.y - 60,
          }}
        >
          {hoveredWindow.name && <div className="font-semibold text-amber-300">{hoveredWindow.name}</div>}
          {hoveredWindow.text && <div className="text-sm text-slate-200 mt-1">{hoveredWindow.text}</div>}
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

function getRowWindowConfig(building: BuildingDefinition, rowRatio: number) {
  switch (building.shape) {
    case "crown": {
      if (rowRatio < 0.08) return { widthPercent: 0.32, shiftPercent: 0 };
      if (rowRatio < 0.16) return { widthPercent: 0.46, shiftPercent: 0 };
      return { widthPercent: 0.74, shiftPercent: 0 };
    }
    case "needle": {
      if (rowRatio < 0.1) return { widthPercent: 0.2, shiftPercent: 0 };
      if (rowRatio < 0.18) return { widthPercent: 0.36, shiftPercent: 0 };
      return { widthPercent: 0.5, shiftPercent: 0 };
    }
    case "terrace": {
      if (rowRatio < 0.06) return { widthPercent: 0.42, shiftPercent: -0.08 };
      if (rowRatio < 0.12) return { widthPercent: 0.58, shiftPercent: -0.04 };
      return { widthPercent: 0.72, shiftPercent: 0 };
    }
    case "angled-left": {
      if (rowRatio < 0.22) {
        const t = rowRatio / 0.22;
        return { widthPercent: 0.42 + t * 0.24, shiftPercent: 0.18 - t * 0.14 };
      }
      return { widthPercent: 0.72, shiftPercent: 0 };
    }
    case "angled-right": {
      if (rowRatio < 0.22) {
        const t = rowRatio / 0.22;
        return { widthPercent: 0.42 + t * 0.24, shiftPercent: -0.18 + t * 0.14 };
      }
      return { widthPercent: 0.72, shiftPercent: 0 };
    }
    case "setback": {
      if (rowRatio < 0.07) return { widthPercent: 0.4, shiftPercent: -0.05 };
      if (rowRatio < 0.14) return { widthPercent: 0.55, shiftPercent: -0.02 };
      return { widthPercent: 0.72, shiftPercent: 0 };
    }
    case "spire": {
      if (rowRatio < 0.08) return { widthPercent: 0.2, shiftPercent: 0 };
      if (rowRatio < 0.15) return { widthPercent: 0.34, shiftPercent: 0 };
      return { widthPercent: 0.54, shiftPercent: 0 };
    }
    default:
      return { widthPercent: 0.7, shiftPercent: 0 };
  }
}
