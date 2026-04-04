import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['internship', 'full-time', 'part-time'],
      default: 'full-time',
    },
    location: { type: String, required: true },
    packageStipend: { type: String, required: true },
    eligibility: { type: String, required: true },
    deadline: { type: Date, required: true },
    applyUrl: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Placement', placementSchema);
