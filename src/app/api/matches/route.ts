import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findById(session.userId);
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const offers = currentUser.skillsOffered || [];
    const wants = currentUser.skillsWanted || [];

    if (offers.length === 0 || wants.length === 0) {
      return NextResponse.json({ matches: [] }); // No matches possible if current user hasn't set up skills
    }

    // Match logic:
    // Other user must offer at least one skill the current user wants ($in: wants)
    // Other user must want at least one skill the current user offers ($in: offers)
    const matches = await User.find({
      _id: { $ne: currentUser._id },
      skillsOffered: { $in: wants },
      skillsWanted: { $in: offers },
    }).select('-password');

    return NextResponse.json({ matches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
