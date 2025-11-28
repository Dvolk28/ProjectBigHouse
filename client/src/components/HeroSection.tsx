import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  onAddLightClick: () => void;
  litCount: number;
  totalCount: number;
}

export default function HeroSection({ onAddLightClick, litCount, totalCount }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(169, 112, 255, 0.1) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #a970ff 50%, #bb88ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          data-testid="hero-title"
        >
          Project Skyline – Cleveland
        </h1>
        <p
          className="text-lg sm:text-xl md:text-2xl text-white/80 mb-4 font-light"
          data-testid="hero-subtitle"
        >
          Light your mark on the skyline.
        </p>
        <p className="text-sm md:text-base text-white/50 mb-8 max-w-2xl mx-auto">
          Every light represents a personal goal. Join the movement and illuminate your ambition
          on Cleveland's digital skyline.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            size="lg"
            onClick={onAddLightClick}
            className="text-lg px-8 py-6 relative overflow-visible"
            style={{
              background: "linear-gradient(135deg, #7c4dff 0%, #a970ff 100%)",
              boxShadow: "0 0 30px rgba(169, 112, 255, 0.4), 0 0 60px rgba(169, 112, 255, 0.2)",
            }}
            data-testid="button-add-light"
          >
            Add Your Light
            <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>
        </div>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
          style={{
            background: "rgba(169, 112, 255, 0.1)",
            border: "1px solid rgba(169, 112, 255, 0.2)",
          }}
          data-testid="stats-counter"
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#a970ff" }}
          />
          <span className="text-white/70">
            <span className="text-primary font-semibold">{litCount}</span> of{" "}
            <span className="text-white/90">{totalCount}</span> lights illuminated
          </span>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white/30" />
      </div>
    </section>
  );
}
