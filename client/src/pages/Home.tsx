import { useState, useRef, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import Skyline from "@/components/Skyline";
import LightForm from "@/components/LightForm";
import { BuildingData } from "@/components/Building";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality - initial building data
const createInitialBuildings = (): BuildingData[] => [
  { id: "b1", name: "Building 1", height: 100, width: 28, isLit: false, style: "modern", zIndex: 1 },
  { id: "b2", name: "Building 2", height: 140, width: 32, isLit: false, style: "classic", zIndex: 2 },
  { id: "b3", name: "Building 3", height: 180, width: 38, isLit: false, style: "modern", zIndex: 3 },
  { id: "b4", name: "200 Public Square", height: 220, width: 50, isLit: false, style: "tower", zIndex: 4 },
  { id: "b5", name: "Building 5", height: 260, width: 42, isLit: false, style: "modern", zIndex: 5 },
  { id: "b6", name: "Key Tower", height: 320, width: 58, isLit: false, style: "spire", zIndex: 10 },
  { id: "b7", name: "Terminal Tower", height: 280, width: 52, isLit: false, style: "tower", zIndex: 8 },
  { id: "b8", name: "Building 8", height: 240, width: 44, isLit: false, style: "classic", zIndex: 6 },
  { id: "b9", name: "Building 9", height: 200, width: 40, isLit: false, style: "modern", zIndex: 4 },
  { id: "b10", name: "Building 10", height: 160, width: 36, isLit: false, style: "tower", zIndex: 3 },
  { id: "b11", name: "Building 11", height: 130, width: 34, isLit: false, style: "modern", zIndex: 2 },
  { id: "b12", name: "Building 12", height: 110, width: 30, isLit: false, style: "classic", zIndex: 1 },
  { id: "b13", name: "Building 13", height: 90, width: 26, isLit: false, style: "modern", zIndex: 1 },
  { id: "b14", name: "Building 14", height: 150, width: 35, isLit: false, style: "tower", zIndex: 2 },
  { id: "b15", name: "Building 15", height: 190, width: 42, isLit: false, style: "classic", zIndex: 3 },
];

export default function Home() {
  const [buildings, setBuildings] = useState<BuildingData[]>(createInitialBuildings());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const litCount = buildings.filter((b) => b.isLit).length;
  const availableBuildings = buildings.filter((b) => !b.isLit).length;

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const scrollToSkyline = useCallback(() => {
    skylineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleFormSubmit = useCallback(
    async (data: { name: string; goal: string }) => {
      setIsSubmitting(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const unlitBuildings = buildings.filter((b) => !b.isLit);
      if (unlitBuildings.length === 0) {
        toast({
          title: "All buildings are lit!",
          description: "Thank you for your interest. All buildings are currently illuminated.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Pick a random unlit building
      const randomIndex = Math.floor(Math.random() * unlitBuildings.length);
      const selectedBuilding = unlitBuildings[randomIndex];

      setBuildings((prev) =>
        prev.map((b) =>
          b.id === selectedBuilding.id
            ? { ...b, isLit: true, ownerName: data.name, goal: data.goal }
            : b
        )
      );

      setIsSubmitting(false);

      toast({
        title: "Your light shines bright!",
        description: `You've illuminated ${selectedBuilding.name} on the Cleveland skyline.`,
      });

      // Scroll to skyline to see the illuminated building
      setTimeout(() => {
        scrollToSkyline();
      }, 300);
    },
    [buildings, toast, scrollToSkyline]
  );

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
        totalCount={buildings.length}
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
          <Skyline buildings={buildings} />
        </div>
      </section>

      <div ref={formRef}>
        <LightForm
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          availableBuildings={availableBuildings}
        />
      </div>

      <footer className="py-12 text-center">
        <p className="text-white/30 text-sm">
          Project Skyline – Cleveland
        </p>
        <p className="text-white/20 text-xs mt-2">
          Every light tells a story of ambition and unity
        </p>
      </footer>
    </div>
  );
}
