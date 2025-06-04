import dbConnect from '@/app/lib/mongodb';
import Student from '@/app/models/Student';
import StudentImage from '@/app/models/StudentImage';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const classroom = searchParams.get("classroom");
  const student_number = searchParams.get("student_number");

  const filter = {};
  if (classroom) filter.classroom = classroom;
  if (student_number) filter.student_number = Number(student_number);

  try {
    const students = await Student.find(filter).lean();

    // Fetch images for each student
    const studentIds = students.map((s) => s._id);
    const images = await StudentImage.find({ student_id: { $in: studentIds } }).lean();

    const merged = students.map((student) => {
      const imageDoc = images.find((img) => img.student_id.toString() === student._id.toString());
      return {
        ...student,
        image: imageDoc?.image || null,
      };
    });

    return NextResponse.json(merged);
  } catch (err) {
    return NextResponse.json({ error: "Fetch failed", details: err.message }, { status: 500 });
  }
}