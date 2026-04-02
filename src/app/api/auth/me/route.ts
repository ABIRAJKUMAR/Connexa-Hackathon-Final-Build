import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('connexa_auth');

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user;

    try {
      // 3-SECOND DB TIMEOUT WATCHER
      const connectPromise = dbConnect();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB_TIMEOUT")), 3000)
      );

      await Promise.race([connectPromise, timeoutPromise]);
      user = await User.findOne({ email: token.value });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

    } catch (dbError: any) {
      console.log("⚠️ DB Bypass in /me Triggered - Serving Local Auth Context");
      
      // DEMO HACK: Serve localized mock representation
      user = {
        name: typeof window !== 'undefined' ? localStorage.getItem('connexa_name') : 'Demo User',
        email: token.value,
        credits: 50,
        skillsOffered: ["Mock Skill"],
        skillsWanted: ["Help Needed"]
      };
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
