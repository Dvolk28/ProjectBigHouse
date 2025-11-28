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

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: buildings = [], isLoading: buildingsLoading } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

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
