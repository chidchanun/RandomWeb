import dbConnect from '@/app/lib/mongodb';
import Student from '@/app/models/Student';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const studentNumber = searchParams.get('student_number');
    const classroom = searchParams.get('classroom');

    // Build query filter based on params
    const filter = {};
    if (studentNumber) filter.number = studentNumber;
    if (classroom) filter.classroom = classroom;

    const students = await Student.find(filter);

    return NextResponse.json(students);
  } catch (error) {
    console.error('GET /api/students error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
