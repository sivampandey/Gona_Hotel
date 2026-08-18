import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  title: string;
  slug: string;
  category: string;
  pricePerNight: number;
  maxGuests: number;
  sizeSqFt: number;
  bedType: string;
  description: string;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  blockedDates: string[];
  rating: number;
  reviewCount: number;
  totalRooms: number;
  availableCount: number;
}

const RoomSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'Luxury Suite' },
  pricePerNight: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  sizeSqFt: { type: Number, required: true },
  bedType: { type: String, required: true },
  description: { type: String, required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  blockedDates: [{ type: String }],
  rating: { type: Number, default: 4.9 },
  reviewCount: { type: Number, default: 24 },
  totalRooms: { type: Number, default: 5 },
  availableCount: { type: Number, default: 5 }
}, { timestamps: true });

export default mongoose.model<IRoom>('Room', RoomSchema);
