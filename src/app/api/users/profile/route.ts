import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skillsOffered, skillsWanted, bio } = await req.json();

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      session.userId,
      { $set: { skillsOffered, skillsWanted, bio } },
      { new: true }
    ).select('-password');

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
