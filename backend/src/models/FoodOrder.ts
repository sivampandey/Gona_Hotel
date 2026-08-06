import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodOrder extends Document {
  userId: string;
  userName: string;
  userPhone: string;
  items: Array<{
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    isVeg: boolean;
    image: string;
  }>;
  orderType: 'delivery' | 'pickup' | 'table';
  tableNumber?: string;
  deliveryAddress?: string;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid';
  orderStatus: 'placed' | 'preparing' | 'out_for_delivery' | 'completed' | 'cancelled';
  paymentId?: string;
  invoiceId: string;
  createdAt: Date;
}

const FoodOrderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, default: '' },
  items: [{
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    isVeg: { type: Boolean, default: true },
    image: { type: String, default: '' }
  }],
  orderType: { type: String, enum: ['delivery', 'pickup', 'table'], required: true },
  tableNumber: { type: String, default: '' },
  deliveryAddress: { type: String, default: '' },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'paid' },
  orderStatus: { 
    type: String, 
    enum: ['placed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'], 
    default: 'placed' 
  },
  paymentId: { type: String, default: '' },
  invoiceId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IFoodOrder>('FoodOrder', FoodOrderSchema);
