"use client";

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  credits: number;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  isVerifiedMentor?: boolean;
  certificates?: string[];
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// MOCK USER FOR BYPASSING AUTH COMPLETELY
const MOCK_USER: User = {
  _id: "demo123",
  name: "Abiraj",
  email: "abiraj@example.com",
  credits: 50,
  skillsOffered: ["React", "TypeScript"],
  skillsWanted: ["Python", "UX"],
  rating: 5,
  isVerifiedMentor: false,
};

const AuthContext = createContext<AuthContextType>({
  user: MOCK_USER,
  loading: false,
  refreshUser: async () => {},
  logout: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always logged in natively with the Mock User
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const router = useRouter();

  // Bypassed completely for Demo flow (no redirects, no fetching)
  const refreshUser = async () => {};
  const logout = async () => { router.push('/login'); };

  return (
    <AuthContext.Provider value={{ user, loading: false, refreshUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
