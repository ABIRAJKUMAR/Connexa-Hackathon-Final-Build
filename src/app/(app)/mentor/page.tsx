"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileUp, GraduationCap } from "lucide-react";

const MOCK_QUESTIONS = [
  { q: "What is the primary purpose of a framework?", options: ["Design Patterns", "State Management", "Routing logic structure", "All of the above"], a: 3 },
  { q: "Which of these perfectly models side-effects in React?", options: ["useState", "useEffect", "useMemo", "useContext"], a: 1 },
  { q: "What ensures type safety at compile time?", options: ["JavaScript", "Python", "TypeScript", "HTML"], a: 2 },
  { q: "What does DOM stand for?", options: ["Data Object Mode", "Document Object Model", "Discrete Object Matrix", "Digital Orientation Mechanism"], a: 1 },
  { q: "Which tool bundles modern modular web applications efficiently?", options: ["NPM", "Webpack/Turbopack", "Git", "Prettier"], a: 1 },
];

export default function MentorApplicationPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [skill, setSkill] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isVerifyingDoc, setIsVerifyingDoc] = useState(false);
  
  // Quiz State
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<"pass" | "fail" | null>(null);

  if (user?.isVerifiedMentor) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="glass-card max-w-md w-full p-8 text-center rounded-2xl border border-brand-500/30 bg-brand-500/5 shadow-2xl">
          <div className="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4">You are a Verified Mentor!</h2>
          <p className="text-white/60 mb-6">You already completed the verification flow and actively hold the Verified Mentor badge. You are authorized to create live learning sessions.</p>
          <button onClick={() => router.push("/sessions")} className="w-full py-3 bg-brand-600 hover:bg-brand-500 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20">Go to Sessions</button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 1 && skill && file) {
      setIsVerifyingDoc(true);
      // Simulate robust AI document scan
      setTimeout(() => {
         setIsVerifyingDoc(false);
         if (file.name.toLowerCase().includes("fake")) {
            alert("AI Error: Invalid certificate structure detected.");
         } else {
            setStep(2);
         }
      }, 3500);
    }
  };

  const handleQuizSubmit = async () => {
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans === MOCK_QUESTIONS[idx].a) score++;
    });

    if (score === 5) {
      if (user) {
        setUser({ ...user, isVerifiedMentor: true, certificates: [...(user.certificates || []), skill] });
        
        try {
          await fetch("/api/mentor/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email })
          });
        } catch {}
      }
      router.push("/mentor/success");
    } else {
      setQuizResult("fail");
      setStep(3);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-brand-500" />
          Become a Verified Mentor
        </h1>
        <p className="text-white/60 mt-2 text-lg">Teach what you know. Earn robust credits. Gain a Verified Mentor Badge.</p>
      </header>

      <div className="glass-card border border-white/10 p-8 rounded-2xl bg-[#0d0d0d] shadow-xl relative overflow-hidden">
        
        {/* STEP 1.5: AI VERIFICATION SCANNER */}
        {isVerifyingDoc && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center animate-in zoom-in duration-500">
             <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-brand-500 animate-spin shadow-[0_0_15px_#3b82f6]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileUp className="w-10 h-10 text-brand-400 animate-pulse" />
                </div>
             </div>
             <div>
               <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-300 to-brand-600 bg-clip-text text-transparent">Connexa AI Scanning Certificate...</h3>
               <p className="text-white/50 mt-2 font-medium tracking-wide">Authenticating structural layout and analyzing explicit skill associations...</p>
             </div>
          </div>
        )}

        {/* STEP 1: UPLOAD */}
        {step === 1 && !isVerifyingDoc && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Select Primary Subject/Skill</label>
              <select value={skill} onChange={(e) => setSkill(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 font-medium">
                <option value="" disabled>Select a skill you excel in...</option>
                <option value="React">React Framework</option>
                <option value="Java">Java Architecture</option>
                <option value="Python">Python Processing</option>
              </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-white/70 mb-2">Upload Valid Certificate (PDF/Image)</label>
               <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors relative">
                 <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                 <FileUp className="w-8 h-8 text-brand-500 mb-3" />
                 <span className="font-medium text-white/80">{file ? file.name : "Drag & drop or browse for a file"}</span>
                 <span className="text-xs text-white/40 mt-1">Supports PDF, PNG, JPG (Max 5MB)</span>
               </div>
            </div>

            <button disabled={!skill || !file} onClick={handleNext} className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 font-bold transition-all text-white shadow-lg shadow-brand-500/20">
              Continue to Mock Test Selection
            </button>
          </div>
        )}

        {/* STEP 2: QUIZ */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 flex items-start gap-4">
               <div className="bg-brand-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">!</div>
               <div>
                 <h3 className="font-bold text-brand-100">Automated Technical Review</h3>
                 <p className="text-sm text-brand-100/70 mt-1">To verify your status as a mentor, you must pass this automated baseline technical review. A perfect score ({'>95%'}) is required. No stress!</p>
               </div>
            </div>

            <div className="space-y-6">
              {MOCK_QUESTIONS.map((q, qIndex) => (
                <div key={qIndex} className="p-6 bg-black/40 border border-white/5 rounded-xl">
                  <h4 className="font-bold mb-4">{qIndex + 1}. {q.q}</h4>
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <label key={optIndex} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${answers[qIndex] === optIndex ? 'bg-brand-500/10 border-brand-500/50' : 'border-white/10 hover:bg-white/5'}`}>
                        <input 
                          type="radio" 
                          name={`q-${qIndex}`} 
                          className="accent-brand-500"
                          checked={answers[qIndex] === optIndex} 
                          onChange={() => {
                            const newAnswers = [...answers];
                            newAnswers[qIndex] = optIndex;
                            setAnswers(newAnswers);
                          }} 
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button disabled={answers.filter(a => a !== undefined).length < 5} onClick={handleQuizSubmit} className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 font-bold transition-all text-white shadow-lg shadow-brand-500/20 sticky bottom-0">
              Submit Answers & Finalize
            </button>
          </div>
        )}

        {step === 3 && quizResult === "pass" && (
          <div className="text-center py-10 space-y-6 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/30">
               <GraduationCap className="w-12 h-12" />
             </div>
             <div>
               <h2 className="text-3xl font-bold text-white mb-2">Verification Passed!</h2>
               <p className="text-green-400 font-medium">100% Correct / Confirmed Match</p>
             </div>
             <p className="text-white/60 max-w-sm mx-auto">Congratulations! You earned the Verified Mentor badge. You can now host live classes and earn unlimited credits!</p>
             <button onClick={() => router.push("/sessions")} className="bg-brand-600 hover:bg-brand-500 py-3 px-8 rounded-xl font-bold text-white transition-all shadow-lg">Start Teaching</button>
          </div>
        )}

        {step === 3 && quizResult === "fail" && (
           <div className="text-center py-10 space-y-6 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
               <span className="text-4xl font-black">X</span>
             </div>
             <div>
               <h2 className="text-3xl font-bold text-white mb-2">Test Failed</h2>
               <p className="text-red-400 font-medium">Baseline Review Failed. Please try again after 24 hours.</p>
             </div>
             <p className="text-white/60 max-w-sm mx-auto">Take some time to brush up on your {skill || 'technical'} skills. Don't give up!</p>
             <button onClick={() => { setStep(1); setAnswers([]); setQuizResult(null); }} className="bg-white/10 hover:bg-white/20 py-3 px-8 rounded-xl font-bold text-white transition-all">Retake Mock Flow</button>
          </div>
        )}

      </div>
    </div>
  );
}
