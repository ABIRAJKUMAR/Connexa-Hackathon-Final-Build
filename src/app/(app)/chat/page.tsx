"use client";

import { useAuth } from "@/components/AuthProvider";
import { Send, User as UserIcon, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Hey! Saw we matched. I can teach you React.", isMe: false },
    { id: 2, sender: user?.name, text: "Awesome! Could you help me with hooks?", isMe: true },
    { id: 3, sender: "Alice", text: "Sure thing! Are you free this weekend?", isMe: false },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const formatText = (text: string) => {
    // Hackathon clean-up: remove Markdown stars but keep structure
    return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: user?.name || "Me", text: input, isMe: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const history = messages.map(msg => ({
        role: msg.isMe ? 'user' : 'model',
        content: msg.text
      }));

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, history })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "Gemini", text: formatText(data.response), isMe: false }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "System", text: `Error: ${data.error}`, isMe: false }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "System", text: "Connection error. Check API key.", isMe: false }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col fixed inset-0 top-20 max-w-4xl mx-auto glass-card overflow-hidden shadow-2xl border border-white/10">
      <header className="p-4 border-b border-white/5 bg-bg-surface flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 border border-brand-500/30">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Alice</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-xs text-brand-400 font-medium">Online Assistant</p>
            </div>
          </div>
        </div>
        <div className="bg-brand-500/20 text-brand-400 border border-brand-500/50 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-brand-500/10">
          <Zap className="w-4 h-4 text-brand-400 fill-brand-400" /> Credits: 40
        </div>
      </header>

      {/* Messages Container with Auto-Scroll */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] md:max-w-md p-4 rounded-2xl shadow-sm overflow-hidden ${msg.isMe
              ? "bg-brand-600 text-white rounded-tr-none"
              : "bg-white/10 border border-white/10 text-white rounded-tl-none"
              }`}>
              {/* whitespace-pre-wrap helps maintain line breaks from AI response */}
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {msg.text.replace(/\*\*/g, '').replace(/\*/g, '').trim()}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-bg-surface/50 border-t border-white/5 backdrop-blur-xl shrink-0">
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-brand-500 hover:bg-brand-400 disabled:opacity-50 p-3 aspect-square flex items-center justify-center rounded-xl transition-all shadow-lg shadow-brand-500/20"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}