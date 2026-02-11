import { useMemo } from "react";

interface SkylineProps {
  litCount: number;
  totalCount: number;
}

const WINDOW_SIZE = 6;
const WINDOW_GAP = 10;
const BASE_HEIGHT = 420;

const BUILDINGS = [
  { name: "Key Tower", width: 90, height: 340 },
  { name: "200 Public", width: 70, height: 300 },
  { name: "Terminal Tower", width: 110, height: 380 },
  { name: "BP Tower", width: 80, height: 260 },
  { name: "Justice Center", width: 140, height: 180 },
  { name: "Huntington", width: 85, height: 250 },
];

export default function Skyline({ litCount, totalCount }: SkylineProps) {
  const totalWindows = useMemo(() => {
    return BUILDINGS.reduce((acc, b) => {
      const cols = Math.floor((b.width - 20) / WINDOW_GAP);
      const rows = Math.floor((b.height - 30) / WINDOW_GAP);
      return acc + cols * rows;
    }, 0);
  }, []);

  const litWindows = Math.min(litCount, totalWindows);

  let currentIndex = 0;

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#0f1020] to-[#0a0b16]">
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
            const xOffset =
              BUILDINGS.slice(0, i).reduce((sum, b) => sum + b.width + 25, 0);

            const cols = Math.floor((building.width - 20) / WINDOW_GAP);
            const rows = Math.floor((building.height - 30) / WINDOW_GAP);

            return (
              <g key={building.name} transform={`translate(${xOffset}, 0)`}>
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
                {Array.from({ length: rows }).map((_, row) =>
                  Array.from({ length: cols }).map((_, col) => {
                    const isLit = currentIndex < litWindows;
                    const x = 10 + col * WINDOW_GAP;
                    const y =
                      BASE_HEIGHT -
                      building.height +
                      15 +
                      row * WINDOW_GAP;

                    currentIndex++;

                    return (
                      <rect
                        key={`${row}-${col}`}
                        x={x}
                        y={y}
                        width={WINDOW_SIZE}
                        height={WINDOW_SIZE}
                        fill={isLit ? "#c084fc" : "#2a2d44"}
                        rx={1}
                      />
                    );
                  })
                )}
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
    </div>
  );
}
