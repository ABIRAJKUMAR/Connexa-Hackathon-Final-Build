import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    let isDbWorking = false;
    try {
      const connectPromise = dbConnect();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("DB_TIMEOUT")), 3000));
      await Promise.race([connectPromise, timeoutPromise]);
      isDbWorking = true;
    } catch {
      console.log("DB Timeout - Mocking verification response internally");
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (isDbWorking) {
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: { isVerifiedMentor: true } },
        { new: true }
      );
      return NextResponse.json({ success: true, user: updatedUser });
    } else {
      // Demo mock
      return NextResponse.json({ success: true, isMock: true });
    }
  } catch (error: any) {
    console.error('Mentor Verify Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
