"use client";

import { useAuth } from "@/components/AuthProvider";
import { BookOpen, CreditCard, Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ requests: 0, pending: 0 });
  const [forceMock, setForceMock] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Demo 2-sec Fallback
    const timer = setTimeout(() => {
      setForceMock(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <div className="animate-pulse flex h-full items-center justify-center">Loading...</div>;
  if (!user && !forceMock) return <div className="animate-pulse flex h-full items-center justify-center">Loading...</div>;

  const displayUser = user || {
    name: typeof window !== 'undefined' ? localStorage.getItem('connexa_name') || "Demo User" : "Demo User",
    credits: 50,
    skillsOffered: ["Mock Skill"],
    skillsWanted: ["Another Skill"],
    isVerifiedMentor: false
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Welcome back, <span className="text-brand-400">{displayUser.name.split(' ')[0]}</span> 👋
          {displayUser.isVerifiedMentor && (
            <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2 py-1 rounded-md uppercase tracking-wider font-bold">Verified Mentor</span>
          )}
        </h1>
        <p className="text-white/60 text-lg">
          You have <strong className="text-brand-400">{displayUser.credits} credits</strong> available to spend.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CreditCard} label="Credits Balance" value={displayUser.credits} />
        <StatCard icon={Sparkles} label="Skills Offered" value={displayUser.skillsOffered?.length || 0} />
        <StatCard icon={BookOpen} label="Skills Wanted" value={displayUser.skillsWanted?.length || 0} />
        <StatCard icon={UserPlus} label="Pending Requests" value={stats.pending} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 flex flex-col items-start gap-4 h-full border border-white/5 bg-[#0d0d0d] rounded-2xl shadow-xl">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-400 border border-white/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Find a Match</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Discover people who want to learn what you teach and can teach what you want to learn. Our AI algorithm finds the perfect peer for you.
            </p>
          </div>
          <Link href="/matches" className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl transition-all font-bold text-sm mt-auto">
            View Potential Matches
          </Link>
        </div>

        <div className="glass-card p-6 flex flex-col items-start gap-4 h-full border border-white/5 bg-[#0d0d0d] rounded-2xl shadow-xl">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-500 border border-white/10">
            <UserPlus className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Update Profile</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Add new skills to your profile to improve your matching potential. The more skills you list, the likelier you are to get highly relevant peers.
            </p>
          </div>
          <Link href="/profile" className="bg-brand-600 hover:bg-brand-500 px-6 py-2 rounded-xl transition-all font-bold text-sm mt-auto shadow-lg shadow-brand-500/20">
            Edit Skills & Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: number }) {
  return (
    <div className="glass-card p-5 border border-white/5 bg-[#0d0d0d] flex items-center gap-4 rounded-xl shadow-lg">
      <div className="bg-black/50 p-3 rounded-xl shadow-inner border border-white/5">
        <Icon className="w-6 h-6 text-brand-400" />
      </div>
      <div>
        <p className="text-white/60 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}
