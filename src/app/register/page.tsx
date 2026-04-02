"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // DEMO HACK: Store locally for quick greeting fallback
    if (typeof window !== 'undefined') {
      localStorage.setItem("connexa_name", formData.name);
      localStorage.setItem("connexa_email", formData.email);
    }

    try {
      // Direct call to database API, skipping OTP flow completely
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      // Even if network ok, server might return error (e.g. Email exists)
      if (res.ok) {
        await refreshUser();
        router.push("/dashboard");
      } else {
        // We log the specific error
        setError(data.error);
        
        // DEMO HACK Bypass: Even if it completely fails, force redirect to dashboard so demo continues
        setTimeout(() => router.push("/dashboard"), 1000);
      }
    } catch (err) {
      setError("Critical network issue. Bypassing for Demo.");
      
      // DEMO HACK Bypass
      setTimeout(() => router.push("/dashboard"), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <BookOpen className="w-8 h-8 text-brand-500" />
        <span className="text-3xl font-bold tracking-tighter text-brand-400">CONNEXA</span>
      </div>

      <div className="w-full max-w-md glass-card border border-white/5 p-8 rounded-2xl bg-[#111] shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 rounded-xl font-bold transition-all disabled:opacity-50 mt-4 shadow-lg shadow-brand-500/20"
          >
            {loading ? "Signing Up..." : "Sign Up & Access Dashboard"}
          </button>
          <p className="text-center text-sm text-white/50 mt-4">
            Already have an account? <Link href="/login" className="text-brand-400 hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
