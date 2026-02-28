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

const WINDOW_SIZE = 6;
const WINDOW_GAP = 10;
const BASE_HEIGHT = 420;

const BUILDINGS = [
  { id: "key-tower", name: "Key Tower", width: 90, height: 340 },
  { id: "200-public", name: "200 Public", width: 70, height: 300 },
  { id: "terminal-tower", name: "Terminal Tower", width: 110, height: 380 },
  { id: "bp-tower", name: "BP Tower", width: 80, height: 260 },
  { id: "justice-center", name: "Justice Center", width: 140, height: 180 },
  { id: "huntington", name: "Huntington", width: 85, height: 250 },
];

export default function Skyline({ lights, onLightClick }: SkylineProps) {
  const lightByWindowId = useMemo(
    () => new Map(lights.map((light) => [light.windowId, light])),
    [lights],
  );

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#0f1020] to-[#0a0b16]">
      <TooltipProvider delayDuration={120}>
        <svg
          viewBox="0 0 1200 500"
          className="w-full h-[500px]"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Purple skyline glow */}
          <defs>
            <radialGradient id="skyGlow" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#a970ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <rect width="1200" height="500" fill="url(#skyGlow)" />

          {/* Buildings */}
          <g transform="translate(100, 80)">
            {BUILDINGS.map((building, i) => {
              const xOffset = BUILDINGS.slice(0, i).reduce(
                (sum, b) => sum + b.width + 25,
                0,
              );

              const cols = Math.floor((building.width - 20) / WINDOW_GAP);
              const rows = Math.floor((building.height - 30) / WINDOW_GAP);

              const windows = Array.from({ length: rows }, (_, row) =>
                Array.from({ length: cols }, (_, col) => {
                  const windowId = `${building.id}-${row}-${col}`;

                  return {
                    id: windowId,
                    row,
                    col,
                    x: 10 + col * WINDOW_GAP,
                    y: BASE_HEIGHT - building.height + 15 + row * WINDOW_GAP,
                  };
                }),
              ).flat();

              return (
                <g key={building.id} transform={`translate(${xOffset}, 0)`}>
                  {/* Building Body */}
                  <rect
                    x={0}
                    y={BASE_HEIGHT - building.height}
                    width={building.width}
                    height={building.height}
                    fill="#1a1c2e"
                    rx={2}
                  />

                  {/* Windows */}
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
                        fill={isLit ? "#c084fc" : "#2a2d44"}
                        stroke={isLit ? "#f0abfc" : "#4c4f70"}
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

          {/* Ground line */}
          <rect
            x="0"
            y={BASE_HEIGHT + 80}
            width="1200"
            height="4"
            fill="#14162a"
          />
        </svg>
      </TooltipProvider>
    </div>
  );
}
