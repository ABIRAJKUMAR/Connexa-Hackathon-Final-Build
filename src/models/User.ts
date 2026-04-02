import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  skills: { type: [String], default: [] },
  skillsOffered: { type: [String], default: [] },
  skillsWanted: { type: [String], default: [] },
  credits: { type: Number, default: 50 },
  rating: { type: Number, default: 0 },
  isVerifiedMentor: { type: Boolean, default: false },
  certificates: { type: [String], default: [] },
  otp: { type: String },
  otpExpiry: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
