import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const REPLACEMENT_KEY = "AIzaSyBOO2BetZFFKqOuVr0V0y9VWygvd3I_9jw";

export async function POST(req: Request) {
  try {
    let isDbWorking = false;
    try {
      // 3-SECOND DB TIMEOUT WATCHER
      const connectPromise = dbConnect();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("DB_TIMEOUT")), 3000));
      await Promise.race([connectPromise, timeoutPromise]);
      isDbWorking = true;
    } catch (e) {
      console.log("⚠️ DB Bypass in /gemini - Skipping Credit Deductions");
    }

    const apiKey = process.env.GEMINI_API_KEY || REPLACEMENT_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const { prompt, history, userEmail } = await req.json();

    // 1. Credit Check & Deduction Logic (Only if DB works)
    if (isDbWorking && userEmail) {
      const user = await User.findOne({ email: userEmail });
      if (user && user.credits < 5) {
        return NextResponse.json({ text: "Insufficient credits! Please teach someone to earn more." }, { status: 403 });
      }
      await User.findOneAndUpdate({ email: userEmail }, { $inc: { credits: -5 } });
    }

    // 2. Switch to 2026-compatible gemini-2.5-flash mapping 
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let formattedHistory = history?.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) || [];

    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.unshift({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    const chat = model.startChat({ history: formattedHistory });

    const systemCues = "You are Connexa AI. Answer in short points. Use bold for key terms. Maximum 3 points.";
    const result = await chat.sendMessage(`${systemCues} \n User query: ${prompt}`);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}