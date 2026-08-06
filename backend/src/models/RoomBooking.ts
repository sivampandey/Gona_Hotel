import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomBooking extends Document {
  userId: string;
  userName: string;
  userEmail: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  totalNights: number;
  pricePerNight: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  bookingStatus: 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  paymentId?: string;
  invoiceId: string;
  specialRequests?: string;
  createdAt: Date;
}

const RoomBookingSchema: Schema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  roomId: { type: String, required: true },
  roomName: { type: String, required: true },
  roomImage: { type: String, default: '' },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  guests: {
    adults: { type: Number, default: 2 },
    children: { type: Number, default: 0 }
  },
  totalNights: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'paid' },
  bookingStatus: { type: String, enum: ['confirmed', 'checked_in', 'completed', 'cancelled'], default: 'confirmed' },
  paymentId: { type: String, default: 'pay_mock_' + Date.now() },
  invoiceId: { type: String, required: true },
  specialRequests: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IRoomBooking>('RoomBooking', RoomBookingSchema);
