import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  student_id: String,
  student_number: Number,
  full_name: String,
  classroom: String,
  year: Number,
}, {
  collection: 'Student_Table' // ✅ match your actual collection name
});

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

export default Student;
