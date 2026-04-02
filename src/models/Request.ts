import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  skill: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);
