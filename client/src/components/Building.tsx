export interface BuildingData {
  id: string;
  width: number;
  height: number;
  path: string;
  windowCols: number;
  windowRows: number;
}

interface BuildingProps {
  building: BuildingData;
  lights: { windowId: number }[];
  onWindowClick: (id: number) => void;
}

export default function Building({ building, lights, onWindowClick }: BuildingProps) {
  const WINDOW_SIZE = 6;
  const GAP_X = 10;
  const GAP_Y = 10;
  const PADDING = 12;

  let windowIdBase = hashId(building.id) * 10_000;

  return (
    <svg
      width={building.width}
      height={building.height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="drop-shadow-lg"
    >
      <defs>
        <linearGradient id={`g-${building.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      {/* Building body */}
      <path d={building.path} fill={`url(#g-${building.id})`} />

      {/* Windows */}
      {Array.from({ length: building.windowCols }).map((_, c) =>
        Array.from({ length: building.windowRows }).map((_, r) => {
          const x = PADDING + c * GAP_X;
          const y = 100 - PADDING - r * GAP_Y;

          const id = windowIdBase + c * 100 + r;
          const lit = lights.some((l) => l.windowId === id);

          return (
            <rect
              key={`${c}-${r}`}
              x={x}
              y={y}
              width={WINDOW_SIZE}
              height={WINDOW_SIZE}
              rx={1}
              fill={lit ? "#fbbf24" : "rgba(148,163,184,0.25)"}
              style={{ cursor: "pointer" }}
              onClick={() => onWindowClick(id)}
            />
          );
        })
      )}
    </svg>
  );
}

/* Simple deterministic hash */
function hashId(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}
