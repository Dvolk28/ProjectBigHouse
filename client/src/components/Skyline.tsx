import Building from "./Building";
import { BuildingData } from "./Building";

interface SkylineProps {
  buildings: BuildingData[];
  lights: { windowId: number }[];
  onWindowClick: (id: number) => void;
}

export default function Skyline({ buildings, lights, onWindowClick }: SkylineProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(169,112,255,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Skyline */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 px-4">
        {buildings.map((building) => (
          <Building
            key={building.id}
            building={building}
            lights={lights}
            onWindowClick={onWindowClick}
          />
        ))}
      </div>

      {/* Ground fade */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
    </div>
  );
}
