import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skyline } from "@/components/Skyline";

// This defines what a "Light" looks like in your database
type Light = {
  id: number;
  windowId: number;
  name: string;
  message: string;
  color: string;
};

export default function Home() {
  const { toast } = useToast();
  const [activeWindowId, setActiveWindowId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // 1. Calculate 5,000 windows for the grid
  const totalWindows = 5000;
  const windows = Array.from({ length: totalWindows }, (_, i) => i);

  // 2. Fetch the existing lights from your new Neon database
  const { data: lights = [] } = useQuery<Light[]>({ 
    queryKey: ["/api/lights"] 
  });

  // 3. Setup the "Save" function
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
      toast({ title: "Error", description: "Could not save your light yet.", variant: "destructive" });
    }
  });

  // Helper to check if a window is already lit
  const handleLightClick = (id: number) => {
    setActiveWindowId(id);
  };
  const getLightForWindow = (wid: number) => lights.find((l) => l.windowId === wid);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-yellow-500/30">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <h1 className="text-sm font-medium tracking-widest uppercase text-neutral-400">
              Project Skyline
            </h1>
          </div>
          <div className="text-xs text-neutral-600 font-mono">
            CLE • 41.4993° N, 81.6944° W
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white">
              Light Your Mark
            </h2>
            <p className="text-neutral-400 max-w-lg mx-auto text-lg font-light">
              Claim a window on the Cleveland skyline. 
              <span className="block text-yellow-500 mt-2">
                {lights.length} / {totalWindows.toLocaleString()} windows illuminated.
              </span>
            </p>
          </div>

          {/* THE FORM (Only shows when you click a window) */}
          {activeWindowId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-neutral-900 border border-white/10 p-6 rounded-lg max-w-md w-full space-y-4 shadow-2xl">
                <h3 className="text-xl text-white font-light">Illuminate Window #{activeWindowId + 1}</h3>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase text-neutral-500">Your Name</label>
                  <input 
                    className="w-full bg-neutral-800 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase text-neutral-500">Your Ambition</label>
                  <textarea 
                    className="w-full bg-neutral-800 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500 h-24"
                    placeholder="What is your dream?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setActiveWindowId(null)}
                    className="flex-1 py-2 rounded border border-white/10 text-neutral-400 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => mutation.mutate({ windowId: activeWindowId, name, message, color: "yellow" })}
                    disabled={mutation.isPending || !name}
                    className="flex-1 py-2 rounded bg-yellow-600 text-white font-medium hover:bg-yellow-500 disabled:opacity-50"
                  >
                    {mutation.isPending ? "Saving..." : "Illuminate"}
                  </button>
                </div>
              </div>
            </div>
          )}
{/* MAIN CONTENT */}
<div className="relative z-10 w-full">
    <Skyline lights={lights || []} onLightClick={handleLightClick} />
</div>
      </main>
    </div>
  );
}
