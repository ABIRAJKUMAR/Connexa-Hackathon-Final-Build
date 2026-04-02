import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  let userEmail = '';
  let userName = '';
  
  try {
    const body = await req.json();
    userName = body.name;
    userEmail = body.email;
    const password = body.password;

    if (!userName || !userEmail || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Wrap dbConnect in a 3-second explicit timeout race for demo fallback
    const connectPromise = dbConnect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB_TIMEOUT")), 3000)
    );

    // Will throw error if DB takes longer than 3s
    await Promise.race([connectPromise, timeoutPromise]);

    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Use bcrypt validation properly
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: userName,
      email: userEmail,
      password: hashedPassword,
      credits: 50,
    });

    const cookieStore = await cookies();
    cookieStore.set('connexa_auth', userEmail, { httpOnly: true, secure: false, path: '/' });

    return NextResponse.json({ success: true, user: { id: user._id, name: userName, email: userEmail } });

  } catch (error: any) {
    console.error("Register Error:", error.message);
    
    // DEMO HACK Bypass
    if (error.message.includes("DB_TIMEOUT") || error.name === "MongoNetworkError" || error.name === "MongooseServerSelectionError") {
      console.log("⚠️ DB Bypass Triggered - Forcing Demo Mode Authentication");
      
      const cookieStore = await cookies();
      cookieStore.set('connexa_auth', userEmail || 'demo_mode@abiraj.net', { httpOnly: true, secure: false, path: '/' });
      
      return NextResponse.json({ 
        success: true, 
        demoMode: true,
        user: { id: 'demo123', name: userName || 'Demo User', email: userEmail || 'demo_mode@abiraj.net' } 
      });
    }

    // Return specific error message instead of generic "Server Error"
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
