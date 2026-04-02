"use client";

import { GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MentorSuccessPage() {
  const router = useRouter();
  
  return (
    <div className="text-center py-20 space-y-6 animate-in zoom-in duration-500 h-[80vh] flex flex-col items-center justify-center">
       <div className="w-32 h-32 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/30">
         <GraduationCap className="w-16 h-16" />
       </div>
       <div>
         <h2 className="text-4xl font-bold text-white mb-2">Verification Passed!</h2>
         <p className="text-green-400 font-bold text-lg flex items-center justify-center gap-2">
           <span>✔️</span> Verified Mentor Badge Unlocked
         </p>
       </div>
       <p className="text-white/60 max-w-sm mx-auto leading-relaxed">Congratulations! You earned the Verified Mentor badge. You can now host live classes and earn robust credits on the platform!</p>
       <button onClick={() => router.push("/sessions")} className="bg-brand-600 hover:bg-brand-500 py-4 px-10 rounded-xl font-bold text-white transition-all shadow-lg text-lg mt-8">
         Start Teaching Session
       </button>
    </div>
  );
}
