import Skyline from "../Skyline";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function SkylineExample() {
  return (
    <TooltipProvider>
      <div className="h-[450px]" style={{ background: "linear-gradient(to bottom, #070b14, #0a0f1a)" }}>
        <Skyline litCount={120} totalCount={5000} />
      </div>
    </TooltipProvider>
  );
}
