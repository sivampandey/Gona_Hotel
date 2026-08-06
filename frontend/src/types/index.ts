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

export interface RoomBooking {
  id: string;
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
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  bookingStatus: 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  paymentId: string;
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
  paymentId: string;
  invoiceId: string;
  createdAt: string;
}

export interface FarmBooking {
  id: string;
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
  paymentId: string;
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
