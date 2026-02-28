import Building, { BuildingData } from "../Building";

export default function BuildingExample() {
  const buildings: BuildingData[] = [
    { id: "1", width: 40, height: 180, path: "M10 10 H90 V95 H10 Z", windowCols: 6, windowRows: 8 },
    { id: "2", width: 60, height: 320, path: "M10 5 H90 V95 H10 Z", windowCols: 7, windowRows: 10 },
    { id: "3", width: 55, height: 280, path: "M10 8 H90 V95 H10 Z", windowCols: 7, windowRows: 9 },
    { id: "4", width: 52, height: 220, path: "M10 12 H90 V95 H10 Z", windowCols: 6, windowRows: 8 },
  ];

  return (
    <div className="p-8" style={{ background: "linear-gradient(to bottom, #070b14, #0a0f1a)" }}>
      <div className="flex items-end justify-center gap-4">
        {buildings.map((building) => (
          <Building
            key={building.id}
            building={building}
            lights={[]}
            onWindowClick={(id) => console.log(`Window ${id} clicked`)}
          />
        ))}
      </div>
      <p className="text-center text-white/50 text-sm mt-4">Building component example</p>
    </div>
  );
}
