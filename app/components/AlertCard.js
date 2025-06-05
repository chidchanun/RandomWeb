import React from "react";

export default function AlertCard({ student, onConfirm, onCancel }) {
  if (!student) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50">
      {/* Background overlay with opacity */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-40 cursor-not-allowed"></div>

      {/* Alert card with full opacity */}
      <div className="bg-gray-200 p-6 rounded-xl shadow-lg max-w-xl w-full text-center z-50">
        <h3 className="text-2xl font-semibold mb-4">โปรดตรวจสอบข้อมูลก่อนยืนยัน</h3>
        <h2 className="text-xl font-semibold mb-4">ยืนยันการสุ่มสายรหัส</h2>
        <p className="mb-2">เลขที่ <strong>{student.student_number}</strong></p>
        <p className="mb-2">รหัส <strong>{student.student_id}</strong> {student.full_name}</p>
        <p className="mb-4">ห้อง <strong>{student.studentRoom}</strong></p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
            onClick={onConfirm}
          >
            ✅ Confirm
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
            onClick={onCancel}
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
