import { Request, Response } from 'express';
import { memoryRoomBookings } from './bookingController';
import { memoryFoodOrders } from './foodOrderController';
import { memoryFarmBookings } from './farmController';
import { memoryUsers } from './authController';
import { memoryRooms } from './roomController';
import { initialSeedData } from '../seed/seedData';

export let memoryGallery: any[] = [...initialSeedData.gallery];
export let memoryReviews: any[] = [...initialSeedData.reviews];
export let memoryCoupons: any[] = [...initialSeedData.coupons];

export const getAdminAnalytics = async (req: Request, res: Response) => {
  try {
    const roomRevenue = memoryRoomBookings.reduce((sum, b) => sum + (b.paymentStatus === 'paid' ? b.totalAmount : 0), 0);
    const foodRevenue = memoryFoodOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
    const farmRevenue = memoryFarmBookings.reduce((sum, f) => sum + (f.paymentStatus === 'paid' ? f.totalAmount : 0), 0);
    const totalRevenue = roomRevenue + foodRevenue + farmRevenue;

    const totalHotelBookings = memoryRoomBookings.length;
    const totalFoodOrders = memoryFoodOrders.length;
    const totalFarmVisitors = memoryFarmBookings.reduce((sum, f) => sum + f.visitorCount, 0);
    const totalCustomers = memoryUsers.length;

    const activeFoodOrdersCount = memoryFoodOrders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'preparing' || o.orderStatus === 'out_for_delivery').length;

    return res.json({
      metrics: {
        totalRevenue,
        roomRevenue,
        foodRevenue,
        farmRevenue,
        totalHotelBookings,
        totalFoodOrders,
        totalFarmVisitors,
        totalCustomers,
        activeFoodOrdersCount,
        occupancyRate: '85%'
      },
      recentRoomBookings: memoryRoomBookings.slice(0, 5),
      recentFoodOrders: memoryFoodOrders.slice(0, 5),
      recentFarmBookings: memoryFarmBookings.slice(0, 5)
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getGalleryAdmin = async (req: Request, res: Response) => {
  return res.json(memoryGallery);
};

export const addGalleryItemAdmin = async (req: Request, res: Response) => {
  const newItem = { id: 'gal_' + Date.now(), ...req.body };
  memoryGallery.unshift(newItem);
  return res.status(201).json(newItem);
};

export const deleteGalleryItemAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  memoryGallery = memoryGallery.filter(g => g.id !== id);
  return res.json({ message: 'Gallery item deleted' });
};

export const getReviewsAdmin = async (req: Request, res: Response) => {
  return res.json(memoryReviews);
};

export const createReview = async (req: Request, res: Response) => {
  const newRev = {
    id: 'rev_' + Date.now(),
    isApproved: true,
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    ...req.body
  };
  memoryReviews.unshift(newRev);
  return res.status(201).json(newRev);
};

export const toggleReviewApprovalAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const rev = memoryReviews.find(r => r.id === id);
  if (!rev) return res.status(404).json({ message: 'Review not found' });
  rev.isApproved = !rev.isApproved;
  return res.json(rev);
};

export const getCouponsAdmin = async (req: Request, res: Response) => {
  return res.json(memoryCoupons);
};

export const addCouponAdmin = async (req: Request, res: Response) => {
  const newCoupon = { id: 'c_' + Date.now(), isActive: true, ...req.body };
  memoryCoupons.push(newCoupon);
  return res.status(201).json(newCoupon);
};

export const toggleCouponActiveAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const coupon = memoryCoupons.find(c => c.id === id);
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  coupon.isActive = !coupon.isActive;
  return res.json(coupon);
};

export const validateCouponPublic = async (req: Request, res: Response) => {
  const { code, amount } = req.body;
  const coupon = memoryCoupons.find(c => c.code.toUpperCase() === String(code).toUpperCase() && c.isActive);
  if (!coupon) {
    return res.status(400).json({ message: 'Invalid or expired coupon code' });
  }

  if (amount && coupon.minSpend && amount < coupon.minSpend) {
    return res.status(400).json({ message: `Minimum spend of ₹${coupon.minSpend} required for this coupon` });
  }

  const rawDiscount = (amount * coupon.discountPercentage) / 100;
  const discount = Math.min(rawDiscount, coupon.maxDiscount || rawDiscount);

  return res.json({
    valid: true,
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
    discountAmount: Math.round(discount)
  });
};

export const getCustomersAdmin = async (req: Request, res: Response) => {
  const customers = memoryUsers.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    avatar: u.avatar
  }));
  return res.json(customers);
};
