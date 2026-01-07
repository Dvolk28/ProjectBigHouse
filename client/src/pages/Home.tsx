import { useRef, useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import Skyline from "@/components/Skyline";
import LightForm from "@/components/LightForm";
import { BuildingData } from "@/components/Building";
import { useToast } from "@/hooks/use-toast";
import { playIlluminateSound } from "@/lib/sounds";
import { RefreshCcw } from "lucide-react";

// 1. SETUP: The default list of buildings (All lights set to FALSE)
const INITIAL_BUILDINGS = [
  { id: 1, name: "Key Tower", style: "keyTower", height: 300, width: 60, isLit: false, x: 10 },
  { id: 2, name: "Terminal Tower", style: "terminalTower", height: 250, width: 50, isLit: false, x: 30 },
  { id: 3, name: "200 Public Square", style: "publicSquare", height: 220, width: 70, isLit: false, x: 50 },
  { id: 4, name: "Tower City", style: "default", height: 180, width: 55, isLit: false, x: 70 },
  { id: 5, name: "Fifth Third", style: "default", height: 160, width: 45, isLit: false, x: 90 },
];

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 2. STATE: This allows the buildings to change when you click the button
  const [buildings, setBuildings] = useState(INITIAL_BUILDINGS);

  // Calculate stats based on our local list
  const litCount = buildings.filter(b => b.isLit).length;
  const totalCount = buildings.length;
  const availableBuildings = totalCount - litCount;

  // 3. ACTION: This runs when you submit the form
  const illuminateMutation = useMutation({
    mutationFn: async (data: { name: string; goal: string }) => {
      // Simulate a short network delay so it feels real
      await new Promise(resolve => setTimeout(resolve, 800));
      return data;
    },
    onSuccess: (data) => {
      // Find the first unlit building and light it up!
      let litUpName = "";
      
      setBuildings(prevBuildings => {
        const newBuildings = [...prevBuildings];
        const unlitIndex = newBuildings.findIndex(b => !b.isLit);
        
        if (unlitIndex !== -1) {
          // Update the specific building with the user's data
          newBuildings[unlitIndex] = { 
            ...newBuildings[unlitIndex], 
            isLit: true, 
            ownerName: data.name, // These might show as errors if types are strict, but it will work
            goal: data.goal 
          };
          litUpName = newBuildings[unlitIndex].name;
        }
        return newBuildings;
      });

      playIlluminateSound();
      
      toast({
        title: "Your light shines bright!",
        description: `You've illuminated ${litUpName || "a building"} on the Cleveland skyline.`,
      });

      setTimeout(() => {
        scrollToSkyline();
      }, 300);
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to illuminate",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = useCallback(async (data: { name: string; goal: string }): Promise<boolean> => {
    return new Promise((resolve) => {
      illuminateMutation.mutate(data, {
        onSuccess: () => resolve(true),
        onError: () => resolve(false),
      });
    });
  }, [illuminateMutation]);

 // Reset the skyline to dark
  const handleReset = () => {
    if (confirm("Are you sure you want to reset all lights?")) {
      // FORCE a fresh update: Map over the buildings and turn them all off explicitly
      setBuildings(currentBuildings => 
        currentBuildings.map(b => ({ 
          ...b, 
          isLit: false,       // Turn off the light
          ownerName: undefined, // Clear the name
          goal: undefined       // Clear the goal
        }))
      );

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

  // Prepare data for the Skyline component
  const buildingDataForSkyline: BuildingData[] = buildings.map((b) => ({
    id: b.id,
    name: b.name,
    height: b.height,
    width: b.width,
    isLit: b.isLit,
    ownerName: (b as any).ownerName,
    goal: (b as any).goal,
    style: b.style as BuildingData["style"],
    zIndex: (b as any).zIndex,
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
          isSubmitting={illuminateMutation.isPending}
          availableBuildings={availableBuildings}
        />
      </div>

      <footer className="py-12 text-center flex flex-col items-center gap-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10 transition-all text-xs mb-4"
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
