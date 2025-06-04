// /app/api/classrooms/route.ts
import dbConnect from '@/app/lib/mongodb';
import Student from '@/app/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const classrooms = await Student.distinct("classroom", { year: 1 });
    return NextResponse.json(classrooms);
  } catch (error) {
    console.error("GET /api/classrooms error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
