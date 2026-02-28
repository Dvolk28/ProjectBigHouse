import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type LightRecord = {
  windowId: string;
  name: string;
  goal: string;
};

interface SkylineProps {
  lights: LightRecord[];
  onLightClick: (windowId: string) => void;
}

type Building = {
  id: string;
  name: string;
  x: number;
  width: number;
  height: number;
  color?: string;
  crown?: "pyramid" | "antenna" | "step" | "terminal-spire";
};

const WINDOW_SIZE = 5;
const WINDOW_GAP_X = 9;
const WINDOW_GAP_Y = 10;
const BASE_HEIGHT = 455;

const BUILDINGS: Building[] = [
  { id: "shoreway", name: "North Coast", x: 96, width: 90, height: 132, color: "#151a33", crown: "step" },
  { id: "weston", name: "Weston", x: 204, width: 58, height: 150, color: "#161b34" },
  { id: "key-tower", name: "Key Tower", x: 286, width: 108, height: 296, crown: "pyramid", color: "#1a1f3a" },
  { id: "terminal-tower", name: "Terminal Tower", x: 410, width: 118, height: 284, crown: "terminal-spire", color: "#1e2341" },
  { id: "200-public", name: "200 Public Square", x: 548, width: 94, height: 276, crown: "step", color: "#1b203b" },
  { id: "bp-tower", name: "BP Tower", x: 662, width: 66, height: 248, crown: "antenna", color: "#1a1f39" },
  { id: "justice-center", name: "Justice Center", x: 748, width: 138, height: 206, color: "#171c35" },
  { id: "one-cleveland", name: "One Cleveland", x: 914, width: 72, height: 228, color: "#181d36" },
  { id: "harbor", name: "Harbor", x: 1006, width: 114, height: 138, color: "#141a31" },
];

function renderCrown(building: Building) {
  if (building.crown === "pyramid") {
    return (
      <polygon
        points={`${building.width / 2},${BASE_HEIGHT - building.height - 34} 8,${BASE_HEIGHT - building.height} ${building.width - 8},${BASE_HEIGHT - building.height}`}
        fill="#252b48"
      />
    );
  }

  if (building.crown === "antenna") {
    return (
      <g>
        <rect
          x={building.width / 2 - 9}
          y={BASE_HEIGHT - building.height - 12}
          width={18}
          height={12}
          fill="#242a46"
        />
      </g>
    );
  }

  if (building.crown === "step") {
    return (
      <g>
        <rect
          x={building.width * 0.2}
          y={BASE_HEIGHT - building.height - 12}
          width={building.width * 0.6}
          height={12}
          fill="#212743"
        />
        <rect
          x={building.width * 0.34}
          y={BASE_HEIGHT - building.height - 24}
          width={building.width * 0.32}
          height={12}
          fill="#272d4a"
        />
      </g>
    );
  }

  if (building.crown === "terminal-spire") {
    const top = BASE_HEIGHT - building.height;
    const center = building.width / 2;

    return (
      <g>
        <rect
          x={building.width * 0.16}
          y={top - 16}
          width={building.width * 0.68}
          height={16}
          fill="#272d4c"
        />
        <rect
          x={building.width * 0.28}
          y={top - 34}
          width={building.width * 0.44}
          height={18}
          fill="#2b3252"
        />
        <rect
          x={building.width * 0.39}
          y={top - 52}
          width={building.width * 0.22}
          height={18}
          fill="#31395e"
        />
        <circle
          cx={center}
          cy={top - 43}
          r={6}
          fill="none"
          stroke="#6c73a4"
          strokeWidth={1.4}
          opacity={0.95}
        />
        <rect
          x={center - 1.2}
          y={top - 88}
          width={2.4}
          height={36}
          fill="#7a81b0"
        />
      </g>
    );
  }

  return null;
}

export default function Skyline({ lights, onLightClick }: SkylineProps) {
  const lightByWindowId = useMemo(
    () => new Map(lights.map((light) => [light.windowId, light])),
    [lights]
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
      }}
    >
      <TooltipProvider delayDuration={120}>
        <svg
          viewBox="0 0 1200 520"
          className="w-full h-full min-h-[520px]"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="cleSkyGlow" cx="50%" cy="18%" r="70%">
              <stop offset="0%" stopColor="#a970ff" stopOpacity="0.24" />
              <stop offset="48%" stopColor="#3e2569" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#080a18" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cityMist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9d6bff" stopOpacity="0" />
              <stop offset="45%" stopColor="#332152" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#090b1a" stopOpacity="0.16" />
            </linearGradient>
          </defs>

          <ellipse cx="610" cy="150" rx="560" ry="220" fill="url(#cleSkyGlow)" opacity="0.4" />
          <rect x="0" y="0" width="1200" height="520" fill="url(#cityMist)" />

          {/* Foreground skyline */}
          <g>
            {BUILDINGS.map((building) => {
              const cols = Math.max(1, Math.floor((building.width - 18) / WINDOW_GAP_X));
              const rows = Math.max(1, Math.floor((building.height - 24) / WINDOW_GAP_Y));
              const bodyTop = BASE_HEIGHT - building.height;

              const windows = Array.from({ length: rows }, (_, row) =>
                Array.from({ length: cols }, (_, col) => {
                  const windowId = `${building.id}-${row}-${col}`;
                  return {
                    id: windowId,
                    x: 10 + col * WINDOW_GAP_X,
                    y: bodyTop + 14 + row * WINDOW_GAP_Y,
                  };
                })
              ).flat();

              return (
                <g key={building.id} transform={`translate(${building.x}, 0)`}>
                  {renderCrown(building)}
                  <rect
                    x={0}
                    y={bodyTop}
                    width={building.width}
                    height={building.height}
                    fill={building.color || "#111"}
                  />
                  {windows.map((win) => (
                    <Tooltip key={win.id} content={lightByWindowId.get(win.id)?.goal || ""}>
                      <rect
                        x={win.x}
                        y={win.y}
                        width={WINDOW_SIZE}
                        height={WINDOW_SIZE}
                        fill={lightByWindowId.get(win.id)?.color || "#222"}
                        onClick={() => onLightClick(win.id)}
                        className="cursor-pointer transition-colors"
                      />
                    </Tooltip>
                  ))}
                </g>
              );
            })}
          </g>
        </svg>
      </TooltipProvider>
    </div>
  );
}
