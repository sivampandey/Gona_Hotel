import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  entityType: 'hotel' | 'restaurant' | 'farm';
  isApproved: boolean;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  userName: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  entityType: { type: String, enum: ['hotel', 'restaurant', 'farm'], required: true },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IReview>('Review', ReviewSchema);
