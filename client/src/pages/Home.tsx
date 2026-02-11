import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Skyline from "@/components/Skyline";

type Light = {
  windowId: number;
  name: string;
  goal: string;
  color: string;
  timestamp: string;
};

export default function Home() {
  const { toast } = useToast();
  const [activeWindowId, setActiveWindowId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  const { data: lights = [] } = useQuery<Light[]>({ 
    queryKey: ["/api/lights"] 
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
      setGoal("");
      setActiveWindowId(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Could not save your light yet.", variant: "destructive" });
    }
  });

  const handleLightClick = (id: number) => {
    setActiveWindowId(id);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-neutral-950 to-black text-white font-sans selection:bg-yellow-500/30 flex flex-col overflow-x-hidden">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* UPDATED: Purple Pulse Dot */}
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <h1 className="text-sm font-medium tracking-widest uppercase text-neutral-400">
              Project Skyline
            </h1>
          </div>
          <div className="text-xs text-neutral-500 font-mono">
@@ -82,53 +82,53 @@ export default function Home() {

        <div className="w-full h-[600px] flex items-end justify-center relative z-10 overflow-hidden">
           <Skyline lights={lights || []} onLightClick={handleLightClick} />
        </div>

        {activeWindowId !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-purple-500/30 p-6 rounded-lg max-w-md w-full space-y-4 shadow-2xl shadow-purple-900/20 animate-in fade-in zoom-in duration-300">
              <h3 className="text-xl text-white font-light">Illuminate Window #{activeWindowId}</h3>
              
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
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setActiveWindowId(null)}
                  className="flex-1 py-2 rounded border border-white/10 text-neutral-400 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => mutation.mutate({ windowId: activeWindowId, name, goal, color: "yellow" })}
                  disabled={mutation.isPending || !name || goal.length < 10}
                  className="flex-1 py-2 rounded bg-yellow-600 text-white font-medium hover:bg-yellow-500 disabled:opacity-50 transition-colors"
                >
                  {mutation.isPending ? "Saving..." : "Illuminate"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main> 
    </div>
  );
}
