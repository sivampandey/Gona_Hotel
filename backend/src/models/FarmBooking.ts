import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmBooking extends Document {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  visitDate: string;
  visitorCount: number;
  packageType: 'standard' | 'guided_tour' | 'picnic_lunch' | 'vip_experience';
  specialRequests?: string;
  pricePerVisitor: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid';
  status: 'confirmed' | 'completed' | 'cancelled';
  paymentId?: string;
  invoiceId: string;
  createdAt: Date;
}

const FarmBookingSchema: Schema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  visitDate: { type: String, required: true },
  visitorCount: { type: Number, required: true },
  packageType: { 
    type: String, 
    enum: ['standard', 'guided_tour', 'picnic_lunch', 'vip_experience'], 
    default: 'guided_tour' 
  },
  specialRequests: { type: String, default: '' },
  pricePerVisitor: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'paid' },
  status: { type: String, enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed' },
  paymentId: { type: String, default: '' },
  invoiceId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IFarmBooking>('FarmBooking', FarmBookingSchema);
