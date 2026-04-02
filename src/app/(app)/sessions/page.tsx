"use client";

import { Video, Settings, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function SessionsPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleEndSession = () => {
    if (user?.isVerifiedMentor) {
       setUser({ ...user, credits: (user.credits || 0) + 20 });
       alert("Class Dismissed! You successfully earned +20 Teaching Credits for mentoring.");
    }
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col pt-2">
      <header className="flex flex-col gap-2 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-white gap-3 flex items-center">
          Active Live Sessions
        </h1>
        <p className="text-white/60 text-lg">
          Collaborate in real-time securely with your matched peer.
        </p>
      </header>

      {/* Jitsi Live Session Room */}
      <div id="live-session" className="flex-1 glass-card border flex flex-col border-white/10 p-6 rounded-2xl bg-[#0d0d0d] shadow-2xl relative">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500 shadow-inner">
               <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                Live Workspace 
                <span className="bg-red-500/10 border border-red-500/50 px-2 py-0.5 rounded text-xs uppercase tracking-widest text-red-400 shadow-lg flex items-center gap-1.5 shadow-red-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse block"></span> Live
                </span>
              </h2>
              <p className="text-white/50 text-sm flex items-center gap-1 mt-1"><Shield className="w-3.5 h-3.5 text-green-400" /> End-to-end P2P Encrypted Connection</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 flex items-center gap-2">
              <Settings className="w-4 h-4" /> AV Controls
            </button>
            <button onClick={handleEndSession} className="bg-red-600/20 hover:bg-red-500/30 text-red-400 px-5 py-2.5 rounded-lg text-sm font-bold transition-all border border-red-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <LogOut className="w-4 h-4" />
              {user?.isVerifiedMentor ? "End Class & Claim +20 Credits" : "Leave Session"}
            </button>
          </div>
        </div>

        <div className="w-full flex-1 min-h-[650px] rounded-xl overflow-hidden border border-white/10 bg-black relative shadow-2xl">
          <iframe
            src={`https://meet.jit.si/Connexa_Class_${user?.name?.replace(/[^a-zA-Z]/g, '') || "Demo"}`}
            allow="camera; microphone; fullscreen; display-capture"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
