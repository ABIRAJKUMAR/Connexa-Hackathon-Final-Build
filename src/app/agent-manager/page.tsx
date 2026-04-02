"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Video, MessageSquare, Users } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AgentManagerPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your AI Agent assistant. How can I help you today during your session?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // AI Matchmaking state
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState('');
  const [myProfile, setMyProfile] = useState('');
  
  // Jitsi Room
  const roomName = 'HackathonConnect2026';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dummyProfiles = [
    { name: "Arun", skills: ["React", "Python", "Node.js"], goal: "Looking to learn Next.js and build a full-stack SaaS." },
    { name: "Priya", skills: ["UI/UX", "Figma", "Design"], goal: "Wants to pair with a frontend dev to bring designs to life." },
    { name: "Ravi", skills: ["Machine Learning", "Data Science", "SQL"], goal: "Teaching python basics in exchange for React tutoring." },
    { name: "Karthik", skills: ["Go", "Backend", "Docker"], goal: "Wants to build microservices with someone who knows frontend." },
    { name: "Sneha", skills: ["Marketing", "SEO", "Content"], goal: "Looking for a technical cofounder for a Web3 app." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          history: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content
          }))
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Failed to get response'}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error while reaching the AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFindMatch = async () => {
    if (!myProfile.trim() || matchLoading) return;
    setMatchLoading(true);
    setMatchResult('');

    const prompt = `I am a user with the following profile/skills/goals: "${myProfile}". 
    Here are 5 mock profiles:
    ${JSON.stringify(dummyProfiles, null, 2)}
    
    Which profile is the best match for me to collaborate with and WHY? 
    Please respond by starting with the best match's name in bold, followed by a short explanation.`;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, history: [] })
      });

      const data = await response.json();
      if (response.ok) {
        setMatchResult(data.response);
      } else {
        setMatchResult(`Error: ${data.error || 'Failed to get response'}`);
      }
    } catch (error) {
       setMatchResult('Connection error while reaching the AI.');
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] p-4 gap-4 flex-col lg:flex-row max-w-7xl mx-auto w-full">
      {/* LEFT PANE: MATCHMAKING & JITSI */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* RECOMMENDED FOR YOU BLOCK */}
        <div className="flex flex-col bg-background-light border border-border rounded-xl p-6 glass-card shadow-xl">
           <h2 className="font-semibold text-xl text-white flex items-center gap-2 mb-6">
               <Users className="w-5 h-5 text-brand-500" />
               Recommended For You
           </h2>
           
           <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                 <textarea 
                   value={myProfile} 
                   onChange={(e) => setMyProfile(e.target.value)} 
                   placeholder="Enter your user profile (e.g. My skills are React and Node.js. My goal is to find a UI designer.)"
                   className="w-full h-28 bg-background-dark border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 text-white shadow-inner resize-none"
                 />
                 <button 
                   onClick={handleFindMatch}
                   disabled={matchLoading || !myProfile.trim()}
                   className="btn-primary w-full py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg shadow-brand-500/30 transition-all font-semibold"
                 >
                   {matchLoading ? 'Analyzing Matches...' : 'Find My Match'}
                 </button>
              </div>
              
              <div className="flex-[1.5] min-h-[140px] flex flex-col">
                 {matchResult ? (
                   <div className="flex-1 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 border border-brand-500/30 p-5 flex flex-col justify-between animate-in fade-in zoom-in duration-300 shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-2 opacity-10">
                       <Users className="w-24 h-24" />
                     </div>
                     <div>
                       <h3 className="text-brand-400 font-bold mb-3 uppercase text-xs tracking-wider border-b border-brand-500/20 pb-2 inline-block">Top Match Card</h3>
                       <div className="text-sm text-white/95 leading-relaxed font-medium prose prose-invert prose-p:my-1 max-w-none">
                         {/* Render basic bold formatting for the name that Gemini returns */}
                         <p dangerouslySetInnerHTML={{ __html: matchResult.replace(/\*\*(.*?)\*\*/g, '<span class="text-brand-400 font-extrabold text-lg">$1</span>') }}></p>
                       </div>
                     </div>
                     <button className="mt-4 bg-brand-500 hover:bg-brand-600 text-white py-2 px-6 rounded-lg font-medium shadow-lg shadow-brand-500/20 transition-colors self-start z-10">
                       Connect
                     </button>
                   </div>
                 ) : (
                   <div className="flex-1 rounded-xl bg-background-dark/50 border border-border/50 p-5 flex flex-col justify-center items-center text-text-muted text-sm text-center">
                     <Users className="w-8 h-8 text-white/10 mb-2" />
                     Enter your profile and click find to let the AI match you with the perfect user profile.
                   </div>
                 )}
              </div>
           </div>
           
           <div className="mt-6 pt-5 border-t border-border/50">
             <p className="text-xs text-text-muted mb-3 uppercase tracking-wide font-medium">Available Network Profiles</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
               {dummyProfiles.map(p => (
                 <div key={p.name} className="p-3 bg-background-dark/80 border border-border rounded-lg flex flex-col gap-1 hover:border-brand-500/30 transition-colors">
                   <div className="flex justify-between items-center">
                     <strong className="text-white text-sm">{p.name}</strong>
                   </div>
                   <p className="text-[11px] text-brand-400 truncate">{p.skills.join(', ')}</p>
                   <p className="text-[11px] text-white/60 line-clamp-2 mt-1">{p.goal}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* LIVE SESSION PANE */}
        <div className="flex-1 flex flex-col bg-background-light border border-border rounded-xl overflow-hidden glass-card shadow-xl min-h-[400px]">
          <div className="p-4 border-b border-border flex items-center gap-2 bg-background/50">
            <Video className="w-5 h-5 text-brand-500" />
            <h2 className="font-semibold text-lg text-white">Live Session ({roomName})</h2>
          </div>
          <div className="flex-1 w-full bg-black">
            <iframe
              src={`https://meet.jit.si/${roomName}`}
              allow="camera; microphone; fullscreen; display-capture"
              className="w-full h-full border-0 min-h-[400px]"
              title="Jitsi Video Conference"
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANE: GEMINI CHATBOT */}
      <div className="w-full lg:w-[400px] flex flex-col bg-background-light border border-border rounded-xl overflow-hidden glass-card shadow-xl h-[600px] lg:h-auto">
        <div className="p-4 border-b border-border flex items-center gap-2 bg-background/50 shrink-0">
          <MessageSquare className="w-5 h-5 text-brand-500" />
          <h2 className="font-semibold text-lg text-white">AI Assistant</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-brand-500 text-white rounded-br-none shadow-md shadow-brand-500/20'
                    : 'bg-background-dark border border-border rounded-bl-none text-white/90 shadow-sm'
                }`}
              >
                <span className="whitespace-pre-wrap">{msg.content}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl p-4 bg-background-dark border border-border rounded-bl-none flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-background/50 shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-background-dark border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 text-white shadow-inner"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-brand-500 text-white p-3 rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-12 h-12 shadow-lg shadow-brand-500/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
