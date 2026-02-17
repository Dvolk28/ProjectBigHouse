import { useMemo } from "react";

interface SkylineProps {
  litCount: number;
  totalCount: number;
}

interface WindowZone {
  x: number;
  y: number;
  width: number;
  height: number;
  gapX?: number;
  gapY?: number;
}

interface LandmarkPreset {
  name: string;
  x: number;
  height: number;
  layer: "foreground" | "background";
  silhouettePath: string;
  crownPath?: string;
  crownStrokePath?: string;
  windowZones: WindowZone[];
}

const WINDOW_SIZE = 6;
const WINDOW_GAP = 10;
const BASE_HEIGHT = 430;

const LANDMARKS: LandmarkPreset[] = [
  {
    name: "Erieview Tower",
    x: 20,
    height: 250,
    layer: "background",
    silhouettePath: "M0 250 L0 32 L16 16 L70 16 L86 32 L86 250 Z",
    crownStrokePath: "M8 44 H78",
    windowZones: [{ x: 10, y: 48, width: 66, height: 182 }],
  },
  {
    name: "BP Tower",
    x: 120,
    height: 300,
    layer: "background",
    silhouettePath: "M0 300 L0 42 L46 0 L92 42 L92 300 Z",
    crownStrokePath: "M18 56 H74",
    windowZones: [{ x: 13, y: 64, width: 66, height: 210 }],
  },
  {
    name: "Huntington Bank Plaza",
    x: 226,
    height: 278,
    layer: "background",
    silhouettePath: "M0 278 L0 24 L16 24 L16 0 L72 0 L72 24 L88 24 L88 278 Z",
    crownStrokePath: "M18 30 H70",
    windowZones: [{ x: 12, y: 44, width: 64, height: 214 }],
  },
  {
    name: "200 Public Square",
    x: 342,
    height: 330,
    layer: "foreground",
    silhouettePath:
      "M0 330 L0 40 L20 40 L20 20 L42 20 L42 0 L76 0 L76 20 L98 20 L98 40 L118 40 L118 330 Z",
    crownPath: "M36 20 H82 V34 H36 Z",
    windowZones: [
      { x: 14, y: 56, width: 40, height: 252 },
      { x: 64, y: 56, width: 40, height: 252 },
    ],
  },
  {
    name: "Terminal Tower",
    x: 492,
    height: 400,
    layer: "foreground",
    silhouettePath:
      "M22 400 L22 130 L36 130 L36 94 L52 94 L52 66 L64 66 L64 26 L70 0 L76 26 L76 66 L88 66 L88 94 L104 94 L104 130 L118 130 L118 400 Z",
    crownPath:
      "M52 130 H88 V178 H52 Z M36 178 H104 V238 H36 Z M22 238 H118 V400 H22 Z",
    crownStrokePath: "M62 36 H78 M56 82 H84",
    windowZones: [
      { x: 28, y: 248, width: 84, height: 146 },
      { x: 40, y: 188, width: 60, height: 48 },
      { x: 50, y: 138, width: 40, height: 38 },
    ],
  },
  {
    name: "Key Tower",
    x: 656,
    height: 360,
    layer: "foreground",
    silhouettePath:
      "M0 360 L0 72 L28 72 L28 32 L54 0 L78 32 L78 72 L106 72 L106 360 Z",
    crownPath: "M28 72 H78 V124 H28 Z",
    crownStrokePath: "M44 42 H62",
    windowZones: [
      { x: 12, y: 132, width: 82, height: 214 },
      { x: 32, y: 82, width: 42, height: 36 },
    ],
  },
  {
    name: "Justice Center",
    x: 784,
    height: 220,
    layer: "foreground",
    silhouettePath:
      "M0 220 L0 40 L26 40 L26 0 L58 0 L58 40 L112 40 L112 0 L144 0 L144 40 L170 40 L170 220 Z",
    crownStrokePath: "M16 58 H154",
    windowZones: [
      { x: 10, y: 66, width: 54, height: 132 },
      { x: 72, y: 66, width: 26, height: 132 },
      { x: 106, y: 66, width: 54, height: 132 },
    ],
  },
  {
    name: "Federal Reserve Bank",
    x: 972,
    height: 268,
    layer: "background",
    silhouettePath: "M0 268 L0 36 L12 24 L82 24 L94 36 L94 268 Z",
    crownStrokePath: "M12 46 H82",
    windowZones: [{ x: 12, y: 54, width: 70, height: 194 }],
  },
  {
    name: "55 Public Square",
    x: 1082,
    height: 248,
    layer: "background",
    silhouettePath: "M0 248 L0 48 L16 48 L16 16 L68 16 L68 48 L84 48 L84 248 Z",
    crownStrokePath: "M14 56 H70",
    windowZones: [{ x: 10, y: 68, width: 64, height: 166 }],
  },
];

const getZoneWindowCount = (zone: WindowZone) => {
  const gapX = zone.gapX ?? WINDOW_GAP;
  const gapY = zone.gapY ?? WINDOW_GAP;
  const cols = Math.max(0, Math.floor((zone.width - WINDOW_SIZE) / gapX) + 1);
  const rows = Math.max(0, Math.floor((zone.height - WINDOW_SIZE) / gapY) + 1);

  return { cols, rows, gapX, gapY };
};

export default function Skyline({ litCount, totalCount }: SkylineProps) {
  const totalWindows = useMemo(
    () =>
      LANDMARKS.reduce((sum, building) => {
        const buildingWindows = building.windowZones.reduce((zoneSum, zone) => {
          const { cols, rows } = getZoneWindowCount(zone);
          return zoneSum + cols * rows;
        }, 0);

        return sum + buildingWindows;
      }, 0),
    []
  );

  const litWindows = Math.min(litCount, totalCount, totalWindows);

  let currentIndex = 0;

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#0f1020] via-[#111329] to-[#090a15]">
      <svg
        viewBox="0 0 1200 520"
        className="h-[360px] w-full sm:h-[420px] lg:h-[500px]"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <radialGradient id="skyGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#a970ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="foregroundBuilding" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2f54" />
            <stop offset="100%" stopColor="#161a34" />
          </linearGradient>
          <linearGradient id="backgroundBuilding" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#232746" />
            <stop offset="100%" stopColor="#13172f" />
          </linearGradient>
          <linearGradient id="rimLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1200" height="520" fill="url(#skyGlow)" />

        <g>
          {LANDMARKS.filter((b) => b.layer === "background").map((building) => {
            const yOffset = BASE_HEIGHT - building.height;
            return (
              <g key={building.name} transform={`translate(${building.x}, ${yOffset})`}>
                <path d={building.silhouettePath} fill="url(#backgroundBuilding)" opacity={0.8} />
                <path d={building.silhouettePath} fill="url(#rimLight)" opacity={0.45} />
                {building.crownPath ? (
                  <path d={building.crownPath} fill="#2d335c" opacity={0.8} />
                ) : null}
                {building.crownStrokePath ? (
                  <path
                    d={building.crownStrokePath}
                    stroke="#7e83af"
                    strokeOpacity={0.45}
                    strokeWidth={2}
                    fill="none"
                  />
                ) : null}
              </g>
            );
          })}
        </g>

        <g>
          {LANDMARKS.filter((b) => b.layer === "foreground").map((building) => {
            const yOffset = BASE_HEIGHT - building.height;
            return (
              <g key={building.name} transform={`translate(${building.x}, ${yOffset})`}>
                <path d={building.silhouettePath} fill="url(#foregroundBuilding)" />
                <path d={building.silhouettePath} fill="url(#rimLight)" opacity={0.7} />
                {building.crownPath ? <path d={building.crownPath} fill="#303762" opacity={0.9} /> : null}
                {building.crownStrokePath ? (
                  <path
                    d={building.crownStrokePath}
                    stroke="#a9b0e0"
                    strokeOpacity={0.5}
                    strokeWidth={2}
                    fill="none"
                  />
                ) : null}
              </g>
            );
          })}
        </g>

        <g>
          {LANDMARKS.map((building) => {
            const yOffset = BASE_HEIGHT - building.height;
            const unlitColor = building.layer === "foreground" ? "#2b2f4b" : "#232741";

            return (
              <g key={`${building.name}-windows`} transform={`translate(${building.x}, ${yOffset})`}>
                {building.windowZones.map((zone, zoneIndex) => {
                  const { cols, rows, gapX, gapY } = getZoneWindowCount(zone);

                  return Array.from({ length: rows }).map((_, row) =>
                    Array.from({ length: cols }).map((__, col) => {
                      const isLit = currentIndex < litWindows;
                      const x = zone.x + col * gapX;
                      const y = zone.y + row * gapY;

                      currentIndex++;

                      return (
                        <rect
                          key={`${zoneIndex}-${row}-${col}`}
                          x={x}
                          y={y}
                          width={WINDOW_SIZE}
                          height={WINDOW_SIZE}
                          fill={isLit ? "#d19cff" : unlitColor}
                          rx={1}
                        />
                      );
                    })
                  );
                })}
              </g>
            );
          })}
        </g>

        <rect x="0" y={BASE_HEIGHT} width="1200" height="12" fill="#11152c" />
        <rect x="0" y={BASE_HEIGHT + 12} width="1200" height="88" fill="#0a0d1d" />
      </svg>
    </div>
  );
}
