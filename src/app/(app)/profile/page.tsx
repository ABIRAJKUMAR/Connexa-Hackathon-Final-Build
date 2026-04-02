"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Save, Plus, X } from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setSkillsOffered(user.skillsOffered || []);
      setSkillsWanted(user.skillsWanted || []);
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillsOffered, skillsWanted, bio }),
      });
      if (res.ok) {
        setSuccessMsg("Profile saved successfully.");
        await refreshUser();
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = (field: "offered" | "wanted", value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!value.trim()) return;
    if (field === "offered") {
      if (!skillsOffered.includes(value.trim())) setSkillsOffered([...skillsOffered, value.trim()]);
    } else {
      if (!skillsWanted.includes(value.trim())) setSkillsWanted([...skillsWanted, value.trim()]);
    }
    setter("");
  };

  const removeTag = (field: "offered" | "wanted", index: number) => {
    if (field === "offered") {
      setSkillsOffered((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSkillsWanted((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Your Profile</h1>
        <p className="text-text-muted text-lg">Manage your bio, skills, and preferences.</p>
      </header>

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Short Bio</label>
          <textarea
            className="input-field min-h-[100px] resize-y"
            placeholder="Tell us a little bit about yourself, what you do, and what you're passionate about learning/teaching..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Skills You Can Teach</h2>
          <p className="text-sm text-text-muted mb-4">List topics you feel comfortable teaching to peers.</p>
          <TagInput tags={skillsOffered} onAdd={(v, s) => handleAddField("offered", v, s)} onRemove={(i) => removeTag("offered", i)} placeholder="Add a skill you can teach..." />
        </div>

        <div className="h-px w-full bg-white/5" />

        <div>
          <h2 className="text-lg font-bold text-white mb-1">Skills You Want to Learn</h2>
          <p className="text-sm text-text-muted mb-4">List topics you're actively trying to understand or get help with.</p>
          <TagInput tags={skillsWanted} onAdd={(v, s) => handleAddField("wanted", v, s)} onRemove={(i) => removeTag("wanted", i)} placeholder="Add a skill you want to learn..." />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2 text-sm px-6">
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

function TagInput({ tags, onAdd, onRemove, placeholder }: { tags: string[]; onAdd: (v: string, s: any) => void; onRemove: (i: number) => void; placeholder: string }) {
  const [val, setVal] = useState("");
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium">
            {tag}
            <button onClick={() => onRemove(i)} className="hover:text-white transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {tags.length === 0 && <span className="text-sm text-text-muted italic px-2 py-1.5">No skills added yet.</span>}
      </div>
      <div className="flex gap-2 relative">
        <input
          type="text"
          className="input-field"
          placeholder={placeholder}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(val, setVal);
            }
          }}
        />
        <button
          onClick={() => onAdd(val, setVal)}
          className="absolute right-2 top-2 p-1.5 rounded-lg text-text-muted hover:bg-white/10 hover:text-white transition-all pointer-events-auto"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
