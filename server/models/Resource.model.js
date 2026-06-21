import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    subject: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: 'pdf' },
    fileSize: { type: Number, default: 0 },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloadsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Resource', resourceSchema);
