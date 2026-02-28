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
  crown?: "pyramid" | "antenna" | "step";
};

const WINDOW_SIZE = 5;
const WINDOW_GAP_X = 9;
const WINDOW_GAP_Y = 10;
const BASE_HEIGHT = 455;

// Structured to resemble Cleveland's skyline silhouette with a pronounced center mass.
const BUILDINGS: Building[] = [
  { id: "shoreway", name: "North Coast", x: 96, width: 90, height: 132, color: "#151a33", crown: "step" },
  { id: "weston", name: "Weston", x: 204, width: 58, height: 150, color: "#161b34" },
  { id: "key-tower", name: "Key Tower", x: 286, width: 118, height: 330, crown: "pyramid", color: "#1a1f3a" },
  { id: "terminal-tower", name: "Terminal Tower", x: 426, width: 88, height: 260, crown: "step", color: "#1d2140" },
  { id: "200-public", name: "200 Public Square", x: 536, width: 100, height: 292, crown: "step", color: "#1b203b" },
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
        <rect
          x={building.width / 2 - 1}
          y={BASE_HEIGHT - building.height - 48}
          width={2}
          height={36}
          fill="#5f6693"
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

  return null;
}

export default function Skyline({ lights, onLightClick }: SkylineProps) {
  const lightByWindowId = useMemo(
    () => new Map(lights.map((light) => [light.windowId, light])),
    [lights],
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 16%, black 100%)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 16%, black 100%)",
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
              <stop offset="0%" stopColor="#9d6bff" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#090b1a" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect width="1200" height="520" fill="url(#cleSkyGlow)" />
          <rect width="1200" height="520" fill="url(#cityMist)" />

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
                }),
              ).flat();

              return (
                <g key={building.id} transform={`translate(${building.x}, 0)`}>
                  {renderCrown(building)}

                  <rect
                    x={0}
                    y={bodyTop}
                    width={building.width}
                    height={building.height}
                    fill={building.color ?? "#1a1d34"}
                    rx={2}
                  />

                  {windows.map((windowObj) => {
                    const light = lightByWindowId.get(windowObj.id);
                    const isLit = Boolean(light);

                    const windowRect = (
                      <rect
                        key={windowObj.id}
                        x={windowObj.x}
                        y={windowObj.y}
                        width={WINDOW_SIZE}
                        height={WINDOW_SIZE}
                        fill={isLit ? "#c084fc" : "#2a2e4a"}
                        stroke={isLit ? "#f0abfc" : "#4e5580"}
                        strokeWidth={0.8}
                        className="cursor-pointer transition-all duration-150 hover:fill-[#8b5cf6] hover:stroke-[#d8b4fe]"
                        rx={1}
                        onClick={() => onLightClick(windowObj.id)}
                      />
                    );

                    if (!isLit || !light) {
                      return windowRect;
                    }

                    return (
                      <Tooltip key={windowObj.id}>
                        <TooltipTrigger asChild>{windowRect}</TooltipTrigger>
                        <TooltipContent className="max-w-64 border-purple-300/30 bg-neutral-900 text-white">
                          <p className="text-xs text-purple-300">{light.name}</p>
                          <p className="text-sm">{light.goal}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </g>
              );
            })}
          </g>

          {/* Horizon and water */}
          <rect x="0" y="455" width="1200" height="3" fill="#181c35" />
          <rect x="0" y="458" width="1200" height="62" fill="#090c1c" opacity="0.85" />
        </svg>
      </TooltipProvider>
    </div>
  );
}
