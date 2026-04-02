"use client";

import { useAuth } from "@/components/AuthProvider";
import { ArrowDownLeft, ArrowUpRight, CreditCard, Sparkles } from "lucide-react";

export default function CreditsPage() {
  const { user } = useAuth();
  
  // Dummy data for transactions since we want to keep MVP simple
  const transactions = [
    { id: 1, type: "earn", amount: 10, target: "Taught React to Alice", date: "2 Hrs ago" },
    { id: 2, type: "spend", amount: 10, target: "Learned MongoDB from Bob", date: "1 Day ago" },
    { id: 3, type: "earn", amount: 10, target: "Sign up bonus", date: "3 Days ago" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto pb-16">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Credits</h1>
          <p className="text-text-muted text-lg">Manage your balance and history.</p>
        </div>
      </header>

      <div className="glass-card p-10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-500 to-accent-500"></div>
        <div className="w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">
          <CreditCard className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <p className="text-text-muted font-medium uppercase tracking-widest text-sm">Available Balance</p>
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-brand-100 flex items-center justify-center gap-2">
            {user?.credits || 0} <Sparkles className="w-8 h-8 text-brand-400" />
          </h2>
        </div>
        <p className="text-sm text-text-muted max-w-sm">
          Credits are the currency of Connexa. Earn them by teaching others, and spend them when you learn.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
        
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="glass-card p-5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${
                  tx.type === "earn" 
                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  {tx.type === "earn" ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-brand-300 transition-colors">{tx.target}</p>
                  <p className="text-xs text-text-muted mt-0.5">{tx.date}</p>
                </div>
              </div>
              <div className={`text-xl font-bold ${
                tx.type === "earn" ? "text-green-400" : "text-white"
              }`}>
                {tx.type === "earn" ? "+" : "-"}{tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
