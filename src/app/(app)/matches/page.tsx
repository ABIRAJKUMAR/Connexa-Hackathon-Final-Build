"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, Sparkles, Send } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function MatchesPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  // AI Chatbot State
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Matchmaking State
  const [matchQuery, setMatchQuery] = useState("");
  const [matchResult, setMatchResult] = useState<any>(null);
  const [isMatching, setIsMatching] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newHistory = [...chatHistory, { role: "user", content: chatInput }];
    setChatHistory(newHistory);
    setChatInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: chatInput,
          userEmail: user?.email,
        }),
      });
      const data = await res.json();
      setChatHistory([...newHistory, { role: "ai", content: data.text }]);
    } catch (err) {
      setChatHistory([...newHistory, { role: "ai", content: "Error connecting to AI. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFindMatch = async () => {
    if (!matchQuery) return;
    setIsMatching(true);

    try {
      // Simulate matchmaking response for Demo mock
      setTimeout(() => {
        setMatchResult({
          name: "Sarah Jenkins",
          skill: "Advanced React Patterns",
          matchPercentage: "98%",
          bio: "Senior UI developer looking to trade React mentorship for UX design basics.",
        });
        setIsMatching(false);
      }, 1500);
    } catch {
      setIsMatching(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Peer Network & Matches
        </h1>
        <p className="text-white/60 text-lg">
          Find your perfect learning partner via AI matchmaking or chat with the Connexa Assistant.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Matchmaking Section */}
        <div className="lg:col-span-2 glass-card border border-white/10 p-8 rounded-2xl bg-[#0d0d0d] shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-brand-500" />
            <h2 className="text-2xl font-bold">AI-Powered Matches</h2>
          </div>
          
          <div className="flex gap-4 mb-8">
            <input 
              type="text" 
              className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500"
              placeholder="What do you want to learn today? (e.g. Next.js Routing)"
              value={matchQuery}
              onChange={(e) => setMatchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFindMatch()}
            />
            <button 
              onClick={handleFindMatch}
              disabled={isMatching}
              className="bg-brand-600 hover:bg-brand-500 px-6 rounded-xl font-bold transition-all disabled:opacity-50 text-white min-w-[160px]"
            >
              {isMatching ? "Searching AI..." : "Find My Match"}
            </button>
          </div>

          {matchResult ? (
            <div className="bg-brand-900/10 border border-brand-500/30 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{matchResult.name}</h3>
                  <p className="text-brand-400 font-medium">Offers: {matchResult.skill}</p>
                </div>
                <span className="bg-brand-500/20 text-brand-300 font-bold px-3 py-1 rounded-full text-sm">
                  {matchResult.matchPercentage} Match
                </span>
              </div>
              <p className="text-white/70 mb-6">{matchResult.bio}</p>
              <button
                onClick={() => {
                  if (user && user.credits >= 10) {
                     setUser({ ...user, credits: user.credits - 10 });
                     router.push("/sessions");
                  } else {
                     alert("You do not have enough credits to start a live session! Consider completing the 'Become a Mentor' verification flow to earn more.");
                  }
                }}
                className="block text-center w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg font-bold transition-colors"
              >
                Initialize Live Session (-10 Credits)
              </button>
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-white/30 p-12 text-center h-full min-h-[200px]">
              Type a skill you want to learn above to <br/>let Connexa AI find your perfect peer.
            </div>
          )}
        </div>

        {/* AI Chatbot Section */}
        <div className="lg:col-span-1 glass-card border border-white/10 flex flex-col rounded-2xl bg-[#0d0d0d] shadow-xl overflow-hidden h-[500px]">
          <div className="p-4 border-b border-white/10 bg-black/40 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-500" />
            <h2 className="font-bold">Connexa Assistant</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {chatHistory.length === 0 && (
              <p className="text-white/40 text-sm text-center mt-12 px-4 leading-relaxed">
                Need help preparing for your peer session? Ask me any coding or platform questions!
              </p>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white/10 text-white/90 rounded-bl-none'}`}>
                  {msg?.content?.replace(/\*/g, '') || ''}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 rounded-2xl px-4 py-3 rounded-bl-none">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="p-3 border-t border-white/10 bg-black/40 relative">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Message AI..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-brand-500/50 text-sm placeholder:text-white/30"
            />
            <button type="submit" disabled={isTyping} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 bg-brand-500 hover:bg-brand-400 rounded-lg text-white transition-colors disabled:opacity-50 shadow-md shadow-brand-500/20">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
