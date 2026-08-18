import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentTransaction extends Document {
  transactionId: string;
  orderId?: string;
  bookingId?: string;
  bookingType: 'room' | 'food' | 'farm';
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  amount: number;
  currency: string;
  method: string;
  utrNumber: string;
  payerName?: string;
  status: 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentTransactionSchema: Schema = new Schema({
  transactionId: { type: String, required: true, unique: true },
  orderId: { type: String, default: '' },
  bookingId: { type: String, default: '' },
  bookingType: { type: String, enum: ['room', 'food', 'farm'], required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, default: '' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  method: { type: String, default: 'UPI_QR' },
  utrNumber: { type: String, required: true },
  payerName: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['PENDING_PAYMENT', 'PAYMENT_SUBMITTED', 'VERIFIED', 'REJECTED'], 
    default: 'PAYMENT_SUBMITTED' 
  },
  verifiedBy: { type: String, default: '' },
  verifiedAt: { type: Date },
  rejectionReason: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);
