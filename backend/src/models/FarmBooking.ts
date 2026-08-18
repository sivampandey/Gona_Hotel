import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmBooking extends Document {
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  visitDate: string;
  visitorCount: number;
  packageType: string;
  specialRequests?: string;
  pricePerVisitor: number;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'VERIFIED' | 'REJECTED';
  status: 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_REJECTED';
  utrNumber?: string;
  payerName?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  paymentId?: string;
  invoiceId: string;
  createdAt: Date;
  updatedAt: Date;
}

const FarmBookingSchema: Schema = new Schema({
  bookingId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  visitDate: { type: String, required: true },
  visitorCount: { type: Number, required: true },
  packageType: { type: String, required: true },
  specialRequests: { type: String, default: '' },
  pricePerVisitor: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI_QR' },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING_PAYMENT', 'PAYMENT_SUBMITTED', 'VERIFIED', 'REJECTED'], 
    default: 'PENDING_PAYMENT' 
  },
  status: { 
    type: String, 
    enum: ['PENDING_PAYMENT', 'PAYMENT_SUBMITTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'PAYMENT_REJECTED'], 
    default: 'PENDING_PAYMENT' 
  },
  utrNumber: { type: String, default: '' },
  payerName: { type: String, default: '' },
  verifiedBy: { type: String, default: '' },
  verifiedAt: { type: Date },
  rejectionReason: { type: String, default: '' },
  paymentId: { type: String, default: '' },
  invoiceId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IFarmBooking>('FarmBooking', FarmBookingSchema);
