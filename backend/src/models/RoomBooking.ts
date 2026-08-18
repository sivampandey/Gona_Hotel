import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomBooking extends Document {
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  numberOfRooms: number;
  roomPrice: number;
  nights: number;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'VERIFIED' | 'REJECTED';
  bookingStatus: 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'PAYMENT_REJECTED';
  utrNumber?: string;
  payerName?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  paymentId?: string;
  invoiceId: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomBookingSchema: Schema = new Schema({
  bookingId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, default: '' },
  roomId: { type: String, required: true },
  roomName: { type: String, required: true },
  roomImage: { type: String, default: '' },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  guests: {
    adults: { type: Number, default: 2 },
    children: { type: Number, default: 0 }
  },
  numberOfRooms: { type: Number, default: 1 },
  roomPrice: { type: Number, required: true },
  nights: { type: Number, required: true },
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
  bookingStatus: { 
    type: String, 
    enum: ['PENDING_PAYMENT', 'PAYMENT_SUBMITTED', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'PAYMENT_REJECTED'], 
    default: 'PENDING_PAYMENT' 
  },
  utrNumber: { type: String, default: '' },
  payerName: { type: String, default: '' },
  verifiedBy: { type: String, default: '' },
  verifiedAt: { type: Date },
  rejectionReason: { type: String, default: '' },
  paymentId: { type: String, default: '' },
  invoiceId: { type: String, required: true },
  specialRequests: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IRoomBooking>('RoomBooking', RoomBookingSchema);
