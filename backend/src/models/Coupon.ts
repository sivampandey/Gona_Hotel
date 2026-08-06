import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minSpend: number;
  validUntil: string;
  isActive: boolean;
}

const CouponSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  maxDiscount: { type: Number, default: 500 },
  minSpend: { type: Number, default: 0 },
  validUntil: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ICoupon>('Coupon', CouponSchema);
