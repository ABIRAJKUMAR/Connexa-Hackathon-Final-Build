import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Mock temporary storage for OTP flow natively in memory
declare global {
  var otpStore: any;
}
global.otpStore = global.otpStore || {};

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store temporarily
    global.otpStore[email] = { name, email, password, otp };

    // Real Email Implementation setup using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Connexa" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Connexa Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #0a0a0a; color: #fff; text-align: center;">
          <h2 style="color: #3b82f6;">Welcome to Connexa, ${name}!</h2>
          <p>Your one-time verification code is:</p>
          <h1 style="letter-spacing: 4px; padding: 15px; border: 1px solid #3b82f6; border-radius: 8px; display: inline-block;">${otp}</h1>
          <p style="color: #888; font-size: 12px; mt-4">Thank you for joining the Knowledge Economy!</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
