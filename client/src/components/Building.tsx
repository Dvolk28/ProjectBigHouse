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
  style?: "keyTower" | "terminalTower" | "publicSquare" | "erieview" | "huntington" | "pnc" | "fedReserve" | "tower" | "modern" | "classic";
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

  const baseColor = showGlow ? "#a970ff" : "#1a1f2e";
  const darkColor = showGlow ? "#7c4dff" : "#0d1117";
  const lightColor = showGlow ? "#bb88ff" : "#252b3d";
  const windowColor = showGlow ? "rgba(169, 112, 255, 0.4)" : "rgba(255, 255, 255, 0.03)";
  const glowShadow = showGlow
    ? "0 0 20px rgba(169, 112, 255, 0.6), 0 0 40px rgba(169, 112, 255, 0.4), 0 0 60px rgba(169, 112, 255, 0.2)"
    : "none";

  const renderKeyTower = () => (
    <div className="relative" style={{ width: building.width, height: building.height }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: building.width,
          height: building.height * 0.75,
          background: `linear-gradient(to top, ${darkColor}, ${baseColor}, ${lightColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      >
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 8px, ${windowColor} 8px, ${windowColor} 9px)` }} />
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(90deg, transparent, transparent 6px, ${windowColor} 6px, ${windowColor} 7px)` }} />
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.75,
          width: building.width * 0.8,
          height: building.height * 0.12,
          background: `linear-gradient(to top, ${baseColor}, ${lightColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.87,
          width: building.width * 0.6,
          height: building.height * 0.08,
          background: `linear-gradient(to top, ${baseColor}, ${lightColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.95,
          width: building.width * 0.35,
          height: building.height * 0.08,
          background: `linear-gradient(to top, ${baseColor}, ${lightColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: -15,
          width: 4,
          height: 20,
          background: showGlow ? "#bb88ff" : "#3a4050",
          boxShadow: showGlow ? "0 0 10px rgba(169, 112, 255, 0.8)" : "none",
          transition: "all 0.8s ease-in-out",
        }}
      />
    </div>
  );

  const renderTerminalTower = () => (
    <div className="relative" style={{ width: building.width, height: building.height }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-sm"
        style={{
          width: building.width,
          height: building.height * 0.6,
          background: `linear-gradient(to top, ${darkColor}, ${baseColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      >
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 10px, ${windowColor} 10px, ${windowColor} 11px)` }} />
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.6,
          width: building.width * 0.85,
          height: building.height * 0.08,
          background: baseColor,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.68,
          width: building.width * 0.7,
          height: building.height * 0.08,
          background: baseColor,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.76,
          width: building.width * 0.55,
          height: building.height * 0.08,
          background: baseColor,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.84,
          width: building.width * 0.4,
          height: building.height * 0.06,
          background: lightColor,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.9,
          width: building.width * 0.25,
          height: building.height * 0.06,
          background: lightColor,
          borderRadius: "2px 2px 0 0",
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: -20,
          width: 3,
          height: 25,
          background: showGlow ? "#bb88ff" : "#3a4050",
          boxShadow: showGlow ? "0 0 8px rgba(169, 112, 255, 0.8)" : "none",
          transition: "all 0.8s ease-in-out",
        }}
      />
    </div>
  );

  const renderPublicSquare = () => (
    <div className="relative" style={{ width: building.width, height: building.height }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: building.width,
          height: building.height * 0.92,
          background: `linear-gradient(to right, ${darkColor}, ${baseColor}, ${darkColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      >
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 6px, ${windowColor} 6px, ${windowColor} 7px)` }} />
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.3) 11px)` }} />
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-t-sm"
        style={{
          bottom: building.height * 0.92,
          width: building.width * 0.95,
          height: building.height * 0.08,
          background: lightColor,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
    </div>
  );

  const renderErieview = () => (
    <div className="relative" style={{ width: building.width, height: building.height }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: building.width * 0.7,
          height: building.height * 0.85,
          background: `linear-gradient(to top, ${darkColor}, ${baseColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      >
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 5px, ${windowColor} 5px, ${windowColor} 6px)` }} />
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.85,
          width: building.width,
          height: building.height * 0.08,
          background: lightColor,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.93,
          width: building.width * 0.5,
          height: building.height * 0.07,
          background: baseColor,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
    </div>
  );

  const renderHuntington = () => (
    <div className="relative" style={{ width: building.width, height: building.height }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-sm"
        style={{
          width: building.width,
          height: building.height,
          background: `linear-gradient(to top, ${darkColor}, ${baseColor}, ${lightColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      >
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 7px, ${windowColor} 7px, ${windowColor} 8px)` }} />
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(90deg, transparent, transparent 8px, ${windowColor} 8px, ${windowColor} 9px)` }} />
      </div>
    </div>
  );

  const renderPNC = () => (
    <div className="relative" style={{ width: building.width, height: building.height }}>
      <div
        className="absolute bottom-0 left-0"
        style={{
          width: building.width * 0.65,
          height: building.height * 0.85,
          background: `linear-gradient(to top, ${darkColor}, ${baseColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      >
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 6px, ${windowColor} 6px, ${windowColor} 7px)` }} />
      </div>
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: building.width * 0.45,
          height: building.height,
          background: `linear-gradient(to top, ${darkColor}, ${lightColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      >
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 6px, ${windowColor} 6px, ${windowColor} 7px)` }} />
      </div>
    </div>
  );

  const renderFedReserve = () => (
    <div className="relative" style={{ width: building.width, height: building.height }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: building.width,
          height: building.height * 0.9,
          background: `linear-gradient(to top, ${darkColor}, ${baseColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      >
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 12px, ${windowColor} 12px, ${windowColor} 14px)` }} />
        <div className="absolute top-0 left-0 right-0 h-4" style={{ background: lightColor }} />
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.9,
          width: building.width * 0.7,
          height: building.height * 0.1,
          background: lightColor,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
    </div>
  );

  const renderModern = () => (
    <div className="relative" style={{ width: building.width, height: building.height }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-sm"
        style={{
          width: building.width,
          height: building.height,
          background: `linear-gradient(to top, ${darkColor}, ${baseColor}, ${lightColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      >
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 8px, ${windowColor} 8px, ${windowColor} 9px)` }} />
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(90deg, transparent, transparent 6px, ${windowColor} 6px, ${windowColor} 7px)` }} />
      </div>
    </div>
  );

  const renderClassic = () => (
    <div className="relative" style={{ width: building.width, height: building.height }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: building.width,
          height: building.height * 0.85,
          background: `linear-gradient(to top, ${darkColor}, ${baseColor})`,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      >
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 10px, ${windowColor} 10px, ${windowColor} 11px)` }} />
      </div>
      <div className="absolute left-0 right-0 flex justify-center gap-1" style={{ bottom: building.height * 0.85 }}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-t"
            style={{
              width: building.width * 0.2,
              height: building.height * 0.08,
              background: lightColor,
              boxShadow: glowShadow,
              transition: "all 0.8s ease-in-out",
            }}
          />
        ))}
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: building.height * 0.93,
          width: building.width * 0.3,
          height: building.height * 0.07,
          background: lightColor,
          boxShadow: glowShadow,
          transition: "all 0.8s ease-in-out",
        }}
      />
    </div>
  );

  const renderBuilding = () => {
    switch (building.style) {
      case "keyTower":
        return renderKeyTower();
      case "terminalTower":
        return renderTerminalTower();
      case "publicSquare":
        return renderPublicSquare();
      case "erieview":
        return renderErieview();
      case "huntington":
        return renderHuntington();
      case "pnc":
        return renderPNC();
      case "fedReserve":
        return renderFedReserve();
      case "classic":
        return renderClassic();
      default:
        return renderModern();
    }
  };

  const buildingContent = (
    <div
      className="relative cursor-pointer"
      style={{
        width: building.width,
        height: building.height,
        zIndex: building.zIndex || 1,
        transform: isAnimating ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.3s ease-in-out",
      }}
      onClick={onLight}
      data-testid={`building-${building.id}`}
    >
      {renderBuilding()}
      {showGlow && (
        <div
          className="absolute inset-0 animate-pulse pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(169, 112, 255, 0.2) 0%, transparent 70%)",
            animationDuration: "2s",
          }}
        />
      )}
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
