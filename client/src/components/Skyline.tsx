import Building, { BuildingData } from "./Building";

interface SkylineProps {
  buildings: BuildingData[];
  onBuildingClick?: (id: string) => void;
}

export default function Skyline({ buildings, onBuildingClick }: SkylineProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden" data-testid="skyline-container">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(169, 112, 255, 0.08) 0%, transparent 60%)",
        }}
      />
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
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
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 md:gap-2 px-4">
        {buildings.map((building) => (
          <Building
            key={building.id}
            building={building}
            onLight={() => onBuildingClick?.(building.id)}
          />
        ))}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{
          background: "linear-gradient(to top, #0a0f1a, transparent)",
        }}
      />
    </div>
  );
}
