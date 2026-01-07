import { useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import Skyline from "@/components/Skyline";
import LightForm from "@/components/LightForm";
import { BuildingData } from "@/components/Building";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { playIlluminateSound } from "@/lib/sounds";
import { Building } from "@shared/schema";

import { RefreshCcw } from "lucide-react";
const INITIAL_BUILDINGS = [
  { id: 1, name: "Key Tower", style: "keyTower", height: 300, width: 60, isLit: true, x: 10 },
  { id: 2, name: "Terminal Tower", style: "terminalTower", height: 250, width: 50, isLit: true, x: 30 },
  { id: 3, name: "200 Public Square", style: "publicSquare", height: 220, width: 70, isLit: true, x: 50 },
  { id: 4, name: "Tower City", style: "default", height: 180, width: 55, isLit: false, x: 70 },
  { id: 5, name: "Fifth Third", style: "default", height: 160, width: 45, isLit: false, x: 90 },
];
export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

// IGNORE THE BACKEND FOR NOW, USE MANUAL LIST
  const buildingsLoading = false; 
  const buildings = INITIAL_BUILDINGS;

  const { data: stats } = useQuery<{ litCount: number; totalCount: number; availableCount: number }>({
    queryKey: ["/api/stats"],
  });

  const illuminateMutation = useMutation({
    mutationFn: async (data: { name: string; goal: string }) => {
      const response = await apiRequest("POST", "/api/illuminate", data);
      return response.json();
    },
    onSuccess: (illuminatedBuilding: Building) => {
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      playIlluminateSound();
      
      toast({
        title: "Your light shines bright!",
        description: `You've illuminated ${illuminatedBuilding.name} on the Cleveland skyline.`,
      });

      setTimeout(() => {
        scrollToSkyline();
      }, 300);
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to illuminate",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = useCallback(
    async (data: { name: string; goal: string }): Promise<boolean> => {
      return new Promise((resolve) => {
        illuminateMutation.mutate(data, {
          onSuccess: () => resolve(true),
          onError: () => resolve(false),
        });
      });
    },
    [illuminateMutation]
  );

  const resetMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/reset");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Skyline Reset",
        description: "All lights have been extinguished.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Reset Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const litCount = stats?.litCount ?? 0;
  const totalCount = stats?.totalCount ?? buildings.length;
  const availableBuildings = stats?.availableCount ?? buildings.filter((b) => !b.isLit).length;

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const scrollToSkyline = useCallback(() => {
    skylineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const buildingDataForSkyline: BuildingData[] = buildings.map((b) => ({
    id: b.id,
    name: b.name,
    height: b.height,
    width: b.width,
    isLit: b.isLit,
    ownerName: b.ownerName ?? undefined,
    goal: b.goal ?? undefined,
    style: b.style as BuildingData["style"],
    zIndex: b.zIndex,
  }));

  if (buildingsLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, #070b14 0%, #0a0f1a 50%, #070b14 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 animate-pulse"
            style={{ background: "rgba(169, 112, 255, 0.3)" }}
          />
          <p className="text-white/60">Loading skyline...</p>
        </div>
      </div>
    );
  }

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
          onClick={() => {
            if (confirm("Are you sure you want to reset all lights?")) {
              resetMutation.mutate();
            }
          }}
          disabled={resetMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10 transition-all text-xs mb-4"
          data-testid="button-reset-lights"
        >
          <RefreshCcw className={`h-3 w-3 ${resetMutation.isPending ? "animate-spin" : ""}`} />
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
