import dbConnect from '@/app/lib/mongodb';
import StudentImage from "@/app/models/StudentImage";
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { student_id, image } = body;

    if (!student_id || !image) {
      return NextResponse.json({ error: 'Missing student_id or image' }, { status: 400 });
    }

    const newImage = await StudentImage.create({ student_id, image });
    return NextResponse.json(newImage, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}