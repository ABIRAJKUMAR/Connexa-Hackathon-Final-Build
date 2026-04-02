"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Video, Zap, BookOpen, GraduationCap } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide sidebar on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Network/Matches", href: "/matches", icon: Users },
    { name: "Classes/Sessions", href: "/sessions", icon: Video },
    { name: "Credits", href: "/credits", icon: Zap },
  ];

  if (!user?.isVerifiedMentor) {
    links.push({ name: "Become a Mentor", href: "/mentor", icon: GraduationCap });
  }

  return (
    <aside className="w-64 h-screen bg-[#0d1117] border-r border-white/10 flex flex-col shrink-0 z-50 transition-all duration-300">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-brand-500" />
        <span className="text-xl font-bold tracking-tighter text-brand-400">CONNEXA</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          // Highlight logic
          const isActive = pathname === link.href || (pathname === "/" && link.href === "/dashboard");
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" /> {link.name}
            </Link>
          );
        })}
      </nav>

      {user?.isVerifiedMentor && (
        <div className="p-4 border-t border-white/10 mt-auto">
          <Link href="/sessions" className="flex items-center justify-center gap-2 w-full py-3 bg-brand-600 hover:bg-brand-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-brand-500/20">
            <Video className="w-5 h-5" />
            Create a Session
          </Link>
        </div>
      )}
    </aside>
  );
}
