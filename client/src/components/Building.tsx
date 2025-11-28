import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface BuildingData {
  id: string;
  name: string;
  height: number;
  width: number;
  isLit: boolean;
  ownerName?: string;
  goal?: string;
  style?: "modern" | "classic" | "tower" | "spire";
  zIndex?: number;
}

interface BuildingProps {
  building: BuildingData;
  onLight?: () => void;
}

export default function Building({ building, onLight }: BuildingProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGlow, setShowGlow] = useState(building.isLit);

  useEffect(() => {
    if (building.isLit && !showGlow) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShowGlow(true);
        setIsAnimating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [building.isLit, showGlow]);

  const getTopStyle = () => {
    switch (building.style) {
      case "spire":
        return (
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: showGlow ? "32px solid #a970ff" : "32px solid #1a1f2e",
              filter: showGlow ? "drop-shadow(0 0 10px rgba(169, 112, 255, 0.6))" : "none",
              transition: "all 0.8s ease-in-out",
            }}
          />
        );
      case "tower":
        return (
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-t-full"
            style={{
              width: building.width * 0.6,
              height: 24,
              background: showGlow
                ? "linear-gradient(to top, #a970ff, #bb88ff)"
                : "linear-gradient(to top, #1a1f2e, #252b3d)",
              boxShadow: showGlow ? "0 0 20px rgba(169, 112, 255, 0.5)" : "none",
              transition: "all 0.8s ease-in-out",
            }}
          />
        );
      case "classic":
        return (
          <div className="absolute -top-4 left-0 right-0 flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-t"
                style={{
                  width: building.width * 0.15,
                  height: 16,
                  background: showGlow ? "#a970ff" : "#1a1f2e",
                  boxShadow: showGlow ? "0 0 15px rgba(169, 112, 255, 0.5)" : "none",
                  transition: "all 0.8s ease-in-out",
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const buildingContent = (
    <div
      className="relative cursor-pointer"
      style={{
        width: building.width,
        height: building.height,
        zIndex: building.zIndex || 1,
      }}
      onClick={onLight}
      data-testid={`building-${building.id}`}
    >
      {getTopStyle()}
      <div
        className="w-full h-full rounded-t-sm relative overflow-hidden"
        style={{
          background: showGlow
            ? "linear-gradient(to top, #7c4dff, #a970ff, #bb88ff)"
            : "linear-gradient(to top, #0d1117, #1a1f2e, #252b3d)",
          boxShadow: showGlow
            ? `
              0 0 20px rgba(169, 112, 255, 0.6),
              0 0 40px rgba(169, 112, 255, 0.4),
              0 0 60px rgba(169, 112, 255, 0.2),
              inset 0 0 30px rgba(169, 112, 255, 0.3)
            `
            : "none",
          transition: "all 0.8s ease-in-out",
          transform: isAnimating ? "scale(1.02)" : "scale(1)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: showGlow
              ? "repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255,255,255,0.1) 15px, rgba(255,255,255,0.1) 16px)"
              : "repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255,255,255,0.03) 15px, rgba(255,255,255,0.03) 16px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: showGlow
              ? "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 9px)"
              : "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.02) 8px, rgba(255,255,255,0.02) 9px)",
          }}
        />
        {showGlow && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: "radial-gradient(ellipse at center, rgba(169, 112, 255, 0.3) 0%, transparent 70%)",
              animationDuration: "2s",
            }}
          />
        )}
      </div>
    </div>
  );

  if (building.isLit && building.ownerName) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{buildingContent}</TooltipTrigger>
        <TooltipContent
          className="max-w-[200px] p-3 border-primary/30"
          style={{
            background: "linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)",
            boxShadow: "0 0 20px rgba(169, 112, 255, 0.2)",
          }}
        >
          <p className="font-semibold text-sm text-white" data-testid={`tooltip-name-${building.id}`}>
            {building.ownerName}
          </p>
          <p className="text-xs text-white/70 mt-1" data-testid={`tooltip-goal-${building.id}`}>
            {building.goal}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return buildingContent;
}
