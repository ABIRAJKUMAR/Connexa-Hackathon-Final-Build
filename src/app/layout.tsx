import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Connexa - Peer-to-Peer Learning",
  description: "Knowledge exchange platform with a credit-based system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
        <AuthProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative bg-[#050505]">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
