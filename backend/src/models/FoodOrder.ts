import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodOrder extends Document {
  orderId: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
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
  paymentMethod: string;
  paymentStatus: 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'VERIFIED' | 'REJECTED';
  orderStatus: 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_REJECTED';
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

const FoodOrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, default: '' },
  userEmail: { type: String, default: '' },
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
  paymentMethod: { type: String, default: 'UPI_QR' },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING_PAYMENT', 'PAYMENT_SUBMITTED', 'VERIFIED', 'REJECTED'], 
    default: 'PENDING_PAYMENT' 
  },
  orderStatus: { 
    type: String, 
    enum: ['PENDING_PAYMENT', 'PAYMENT_SUBMITTED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED', 'PAYMENT_REJECTED'], 
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

export default mongoose.model<IFoodOrder>('FoodOrder', FoodOrderSchema);
