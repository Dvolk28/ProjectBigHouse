import Building from "./Building";
import { BuildingData } from "./Building";

interface SkylineProps {
  buildings: BuildingData[];
  lights: { windowId: number }[];
  onWindowClick: (id: number) => void;
}

export default function Skyline({ buildings, lights, onWindowClick }: SkylineProps) {
 return (
  <div className="relative w-full h-[520px] overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900 to-slate-950" />
    <div className="absolute inset-0 bg-purple-900/20" />

    {/* SKYLINE WRAPPER */}
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      style={{ width: 2400, height: CANVAS_HEIGHT }}
    >
      {/* Windows Canvas */}
      <canvas
        ref={canvasRef}
        width={2400}
        height={CANVAS_HEIGHT}
        className="absolute bottom-0 left-0"
      />

      {/* Buildings */}
      <div className="absolute bottom-0 left-0 flex items-end">
        {BUILDINGS.map((b, i) => (
          <svg
            key={i}
            width={b.w}
            height={b.h}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="mr-7"
          >
            <defs>
              <linearGradient id={`g-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <path d={getSvgPath(b.type)} fill={`url(#g-${i})`} />
          </svg>
        ))}
      </div>
    </div>
  </div>
);
