export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  wishlist: {
    rooms: string[];
    food: string[];
  };
}

export interface Room {
  id: string;
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
}

export type PaymentStatus = 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'VERIFIED' | 'REJECTED' | 'pending' | 'paid' | 'failed' | 'refunded';

export type RoomBookingStatus = 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'CONFIRMED' | 'checked_in' | 'completed' | 'cancelled' | 'PAYMENT_REJECTED' | 'confirmed';

export type FoodOrderStatus = 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_REJECTED' | 'placed' | 'preparing' | 'out_for_delivery' | 'completed' | 'cancelled';

export type FarmBookingStatus = 'PENDING_PAYMENT' | 'PAYMENT_SUBMITTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_REJECTED' | 'confirmed' | 'completed' | 'cancelled';

export interface RoomBooking {
  id: string;
  bookingId?: string;
  userId: string;
  userName: string;
  userEmail: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  guests: { adults: number; children: number };
  totalNights: number;
  pricePerNight: number;
  subtotal?: number;
  tax?: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: RoomBookingStatus;
  paymentId?: string;
  utrNumber?: string;
  invoiceId: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Desserts' | 'Beverages';
  price: number;
  description: string;
  isVeg: boolean;
  image: string;
  isAvailable: boolean;
  prepTimeMinutes: number;
  rating: number;
  popular: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface FoodOrder {
  id: string;
  orderId?: string;
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
  paymentStatus: PaymentStatus;
  orderStatus: FoodOrderStatus;
  paymentId?: string;
  utrNumber?: string;
  invoiceId: string;
  createdAt: string;
}

export interface FarmBooking {
  id: string;
  bookingId?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  visitDate: string;
  visitorCount: number;
  packageType: string;
  specialRequests?: string;
  pricePerVisitor?: number;
  subtotal?: number;
  tax?: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  status: FarmBookingStatus;
  paymentId?: string;
  utrNumber?: string;
  invoiceId: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'rooms' | 'restaurant' | 'food' | 'farm' | 'events' | 'videos';
  imageUrl: string;
  videoUrl?: string;
  caption?: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  entityType: 'hotel' | 'restaurant' | 'farm';
  isApproved: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minSpend: number;
  validUntil: string;
  isActive: boolean;
}
