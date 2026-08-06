import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Desserts' | 'Beverages' | 'Indian Main Course' | 'Rice & Biryani' | 'Chinese' | 'South Indian' | 'Snacks & Thali' | 'Salad & Crispy';
  price: number;
  description: string;
  isVeg: boolean;
  image: string;
  isAvailable: boolean;
  prepTimeMinutes: number;
  rating: number;
  popular: boolean;
}

const MenuItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Beverages', 'Indian Main Course', 'Rice & Biryani', 'Chinese', 'South Indian', 'Snacks & Thali', 'Salad & Crispy'], 
    required: true 
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  isVeg: { type: Boolean, required: true },
  image: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  prepTimeMinutes: { type: Number, default: 20 },
  rating: { type: Number, default: 4.8 },
  popular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
