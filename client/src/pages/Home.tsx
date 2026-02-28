import { useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Skyline from "@/components/Skyline";
import HeroSection from "@/components/HeroSection";

type Light = {
  id: number;
  windowId: string;
  name: string;
  goal: string;
  color: string;
};

export default function Home() {
  const { toast } = useToast();
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const skylineSectionRef = useRef<HTMLDivElement>(null);

  const { data: lights = [] } = useQuery<Light[]>({
    queryKey: ["/api/lights"],
  });

  const totalWindows = 5000;

  const mutation = useMutation({
    mutationFn: async (newLight: any) => {
      const res = await apiRequest("POST", "/api/lights", newLight);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lights"] });
      toast({ title: "Success!", description: "You have lit up a window!" });
         setName("");
      setMessage("");
      setActiveWindowId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not save your light yet.",
        variant: "destructive",
      });
    },
  });

  const handleLightClick = (id: string) => {
    setActiveWindowId(id);
  };

  const handleAddLightClick = () => {
    skylineSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative min-h-screen text-white font-sans flex flex-col overflow-x-hidden bg-[#05060f]">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse at 50% -12%, rgba(164, 111, 255, 0.34) 0%, rgba(94, 58, 166, 0.20) 30%, rgba(8, 10, 24, 0) 62%)",
            "linear-gradient(180deg, #0d1022 0%, #070916 42%, #060713 100%)",
          ].join(", "),
        }}
      />
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <h1 className="text-sm font-medium tracking-widest uppercase text-neutral-400">
              Project Skyline
            </h1>
          </div>
          <div className="text-xs text-neutral-500 font-mono">
            CLE • 41.4993° N, 81.6944° W
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow pt-16 flex flex-col items-center relative z-10">
        <HeroSection
          onAddLightClick={handleAddLightClick}
          litCount={lights.length}
          totalCount={totalWindows}
        />

        <div
          ref={skylineSectionRef}
          className="w-full h-[620px] -mt-36 flex items-end justify-center relative z-10"
        >
          <Skyline lights={lights} onLightClick={handleLightClick} />
        </div>

        {/* MODAL */}
        {activeWindowId !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-purple-500/30 p-6 rounded-lg max-w-md w-full space-y-4 shadow-2xl shadow-purple-900/20 animate-in fade-in zoom-in duration-300">
              <h3 className="text-xl text-white font-light">
                Illuminate Window
              </h3>


              <div className="space-y-2">
                <label className="text-xs uppercase text-neutral-500">
                  Your Name
                </label>
                <input
                  className="w-full bg-neutral-800 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
