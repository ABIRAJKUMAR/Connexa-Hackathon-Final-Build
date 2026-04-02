import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    await dbConnect();
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        name: 'Alice Expert',
        email: 'alice@example.com',
        password: hashedPassword,
        skillsOffered: ['React', 'Next.js', 'Typescript'],
        skillsWanted: ['MongoDB', 'Python'],
        credits: 50,
        rating: 4.8,
        bio: 'Frontend expert looking to learn backend.'
      },
      {
        name: 'Bob Backend',
        email: 'bob@example.com',
        password: hashedPassword,
        skillsOffered: ['MongoDB', 'Node.js', 'Python'],
        skillsWanted: ['React', 'CSS'],
        credits: 30,
        rating: 4.5,
        bio: 'Backend developer trying to understand the frontend magic.'
      },
      {
        name: 'Charlie Designer',
        email: 'charlie@example.com',
        password: hashedPassword,
        skillsOffered: ['UI/UX', 'Figma', 'CSS'],
        skillsWanted: ['Next.js', 'React'],
        credits: 20,
        rating: 4.9,
        bio: 'Designer learning to code.'
      }
    ];

    await User.insertMany(users);

    return NextResponse.json({ success: true, message: 'Database seeded with dummy users' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
