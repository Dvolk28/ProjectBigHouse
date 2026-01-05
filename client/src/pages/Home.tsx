import { useRef, useCallback, useState } from "react";
import HeroSection from "@/components/HeroSection";
import Skyline from "@/components/Skyline";
import LightForm from "@/components/LightForm";
import { BuildingData } from "@/components/Building";
import { useToast } from "@/hooks/use-toast";
import { playIlluminateSound } from "@/lib/sounds";
import { RefreshCcw } from "lucide-react";

// 1. HARDCODED BUILDING DATA (This replaces the database)
const INITIAL_BUILDINGS = [
  { id: 1, name: "Society Tower", height: 90, width: 28, style: "modern", zIndex: 1, isLit: false, ownerName: null, goal: null },
  { id: 2, name: "Celebrezze Building", height: 130, width: 35, style: "fedReserve", zIndex: 2, isLit: false, ownerName: null, goal: null },
  { id: 3, name: "One Cleveland Center", height: 170, width: 40, style: "huntington", zIndex: 3, isLit: false, ownerName: null, goal: null },
  { id: 4, name: "Federal Reserve Bank", height: 120, width: 45, style: "fedReserve", zIndex: 2, isLit: false, ownerName: null, goal: null },
  { id: 5, name: "Huntington Building", height: 200, width: 42, style: "huntington", zIndex: 5, isLit: false, ownerName: null, goal: null },
  { id: 6, name: "PNC Center", height: 240, width: 48, style: "pnc", zIndex: 6, isLit: false, ownerName: null, goal: null },
  { id: 7, name: "Key Tower", height: 320, width: 60, style: "keyTower", zIndex: 10, isLit: false, ownerName: null, goal: null },
  { id: 8, name: "Terminal Tower", height: 280, width: 55, style: "terminalTower", zIndex: 9, isLit: false, ownerName: null, goal: null },
  { id: 9, name: "200 Public Square", height: 260, width: 52, style: "publicSquare", zIndex: 8, isLit: false, ownerName: null, goal: null },
  { id: 10, name: "Tower at Erieview", height: 220, width: 38, style: "erieview", zIndex: 7, isLit: false, ownerName: null, goal: null },
  { id: 11, name: "55 Public Square", height: 180, width: 44, style: "modern", zIndex: 4, isLit: false, ownerName: null, goal: null },
  { id: 12, name: "EY Tower", height: 150, width: 36, style: "modern", zIndex: 3, isLit: false, ownerName: null, goal: null },
  { id: 13, name: "Justice Center", height: 140, width: 50, style: "classic", zIndex: 2, isLit: false, ownerName: null, goal: null },
  { id: 14, name: "Ritz-Carlton", height: 110, width: 32, style: "classic", zIndex: 1, isLit: false, ownerName: null, goal: null },
  { id: 15, name: "Sherwin-Williams HQ", height: 100, width: 30, style: "modern", zIndex: 1, isLit: false, ownerName: null, goal: null },
  { id: 16, name: "AECOM Building", height: 160, width: 38, style: "modern", zIndex: 4, isLit: false, ownerName: null, goal: null },
  { id: 17, name: "Diamond Building", height: 140, width: 35, style: "classic", zIndex: 3, isLit: false, ownerName: null, goal: null },
  { id: 18, name: "North Point Tower", height: 180, width: 42, style: "modern", zIndex: 5, isLit: false, ownerName: null, goal: null },
  { id: 19, name: "Standard Building", height: 210, width: 40, style: "tower", zIndex: 6, isLit: false, ownerName: null, goal: null },
  { id: 20, name: "Rhodes Tower", height: 190, width: 38, style: "modern", zIndex: 5, isLit: false, ownerName: null, goal: null },
  { id: 21, name: "US Bank Centre", height: 150, width: 34, style: "modern", zIndex: 3, isLit: false, ownerName: null, goal: null },
  { id: 22, name: "Penton Media Design Center", height: 130, width: 40, style: "classic", zIndex: 2, isLit: false, ownerName: null, goal: null },
  { id: 23, name: "Ohio Bell Building", height: 170, width: 44, style: "tower", zIndex: 4, isLit: false, ownerName: null, goal: null },
  { id: 24, name: "Hanna Building", height: 110, width: 36, style: "classic", zIndex: 2, isLit: false, ownerName: null, goal: null },
  { id: 25, name: "Euclid Tower", height: 140, width: 32, style: "modern", zIndex: 1, isLit: false, ownerName: null, goal: null }
];

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // 2. USE LOCAL STATE INSTEAD OF DATABASE
  const [buildings, setBuildings] = useState(INITIAL_BUILDINGS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. CALCULATE STATS LOCALLY
  const litCount = buildings.filter(b => b.isLit).length;
  const totalCount = buildings.length;
  const availableBuildings = totalCount - litCount;

  // 4. HANDLE FORM SUBMIT (No API calls)
  const handleFormSubmit = async (data: { name: string; goal: string }): Promise<boolean> => {
    setIsSubmitting(true);
    
    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find the first unlit building
    const buildingIndex = buildings.findIndex(b => !b.isLit);

    if (buildingIndex === -1) {
      toast({
        title: "All buildings lit!",
        description: "The skyline is fully illuminated.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return false;
    }

    // Create new buildings array with the updated building
    const newBuildings = [...buildings];
    newBuildings[buildingIndex] = {
      ...newBuildings[buildingIndex],
      isLit: true,
      ownerName: data.name,
      goal: data.goal
    };

    setBuildings(newBuildings);
    playIlluminateSound();
    
    toast({
      title: "Your light shines bright!",
      description: `You've illuminated ${newBuildings[buildingIndex].name} on the Cleveland skyline.`,
    });

    setTimeout(() => scrollToSkyline(), 300);
    setIsSubmitting(false);
    return true;
  };

  // 5. HANDLE RESET (Local only)
  const handleReset = () => {
    if (confirm("Are you sure you want to reset all lights?")) {
      setBuildings(INITIAL_BUILDINGS);
      toast({
        title: "Skyline Reset",
        description: "All lights have been extinguished.",
      });
    }
  };

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const scrollToSkyline = useCallback(() => {
    skylineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // Map to the format Skyline component expects
  const buildingDataForSkyline: BuildingData[] = buildings.map((b) => ({
    id: String(b.id),
    name: b.name,
    height: b.height,
    width: b.width,
    isLit: b.isLit,
    ownerName: b.ownerName ?? undefined,
    goal: b.goal ?? undefined,
    style: b.style as BuildingData["style"],
    zIndex: b.zIndex,
  }));

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #070b14 0%, #0a0f1a 50%, #070b14 100%)",
      }}
    >
      <HeroSection
        onAddLightClick={scrollToForm}
        litCount={litCount}
        totalCount={totalCount}
      />

      <section
        ref={skylineRef}
        className="relative py-8 md:py-16"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(169, 112, 255, 0.03), transparent)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-white/90 mb-2">
            Cleveland Skyline
          </h2>
          <p className="text-center text-white/50 text-sm mb-8">
            Hover over illuminated buildings to see the dreams they represent
          </p>
        </div>
        <div className="h-[350px] md:h-[450px]">
          <Skyline buildings={buildingDataForSkyline} />
        </div>
      </section>

      <div ref={formRef}>
        <LightForm
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          availableBuildings={availableBuildings}
        />
      </div>

      <footer className="py-12 text-center flex flex-col items-center gap-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10 transition-all text-xs mb-4"
          data-testid="button-reset-lights"
        >
          <RefreshCcw className="h-3 w-3" />
          Reset Skyline
        </button>
        <div>
          <p className="text-white/30 text-sm">
            Project Skyline – Cleveland
          </p>
          <p className="text-white/20 text-xs mt-2">
            Every light tells a story of ambition and unity
          </p>
        </div>
      </footer>
    </div>
  );
}
