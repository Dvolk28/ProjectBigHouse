import Home from "@/pages/Home";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export default function HomeExample() {
  return (
    <TooltipProvider>
      <Home />
      <Toaster />
    </TooltipProvider>
  );
}
