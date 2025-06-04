import mongoose from "mongoose";

const StudentImageSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  image: String
}, {
  collection: 'StudentImage_Table'
});

const StudentImage = mongoose.models.StudentImage || mongoose.model('StudentImage', StudentImageSchema);

export default StudentImage;
