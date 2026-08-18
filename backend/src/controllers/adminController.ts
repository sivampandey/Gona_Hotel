import { Request, Response } from 'express';
import RoomBooking from '../models/RoomBooking';
import FoodOrder from '../models/FoodOrder';
import FarmBooking from '../models/FarmBooking';
import User from '../models/User';
import Coupon from '../models/Coupon';
import Review from '../models/Review';
import Gallery from '../models/Gallery';
import PaymentTransaction from '../models/PaymentTransaction';
import { initialSeedData } from '../seed/seedData';


export const getAdminAnalytics = async (req: Request, res: Response) => {
  try {
    const roomBookings = await RoomBooking.find({});
    const foodOrders = await FoodOrder.find({});
    const farmBookings = await FarmBooking.find({});
    const users = await User.find({});

    // CRITICAL: Revenue counts ONLY verified/confirmed payments (VERIFIED or paid)
    const isPaid = (status: string) => status === 'VERIFIED' || status === 'paid';

    const roomRevenue = roomBookings.reduce((sum, b) => sum + (isPaid(b.paymentStatus) ? b.totalAmount : 0), 0);
    const foodRevenue = foodOrders.reduce((sum, o) => sum + (isPaid(o.paymentStatus) ? o.totalAmount : 0), 0);
    const farmRevenue = farmBookings.reduce((sum, f) => sum + (isPaid(f.paymentStatus) ? f.totalAmount : 0), 0);
    const totalRevenue = roomRevenue + foodRevenue + farmRevenue;

    const totalHotelBookings = roomBookings.length;
    const totalFoodOrders = foodOrders.length;
    const totalFarmVisitors = farmBookings.reduce((sum, f) => sum + (f.visitorCount || 1), 0);
    const totalCustomers = users.length;

    const pendingPaymentCount = 
      roomBookings.filter(b => b.paymentStatus === 'PAYMENT_SUBMITTED').length +
      foodOrders.filter(o => o.paymentStatus === 'PAYMENT_SUBMITTED').length +
      farmBookings.filter(f => f.paymentStatus === 'PAYMENT_SUBMITTED').length;

    const activeFoodOrdersCount = foodOrders.filter(o => 
      ['placed', 'preparing', 'out_for_delivery', 'CONFIRMED', 'PAYMENT_SUBMITTED'].includes(o.orderStatus)
    ).length;

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
        pendingPaymentCount,
        activeFoodOrdersCount,
        occupancyRate: '85%'
      },
      recentRoomBookings: roomBookings.slice(0, 5),
      recentFoodOrders: foodOrders.slice(0, 5),
      recentFarmBookings: farmBookings.slice(0, 5)
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getGalleryAdmin = async (req: Request, res: Response) => {
  try {
    let items = await Gallery.find({});
    if (!items || items.length === 0) items = initialSeedData.gallery as any[];
    return res.json(items);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const addGalleryItemAdmin = async (req: Request, res: Response) => {
  try {
    const newItem = await Gallery.create({
      id: 'gal_' + Date.now(),
      ...req.body
    });
    return res.status(201).json(newItem);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const deleteGalleryItemAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Gallery.findOneAndDelete({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
    return res.json({ message: 'Gallery item deleted' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getReviewsAdmin = async (req: Request, res: Response) => {
  try {
    let reviews = await Review.find({});
    if (!reviews || reviews.length === 0) reviews = initialSeedData.reviews as any[];
    return res.json(reviews);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const newRev = await Review.create({
      id: 'rev_' + Date.now(),
      isApproved: true,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ...req.body
    });
    return res.status(201).json(newRev);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const toggleReviewApprovalAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rev = await Review.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
    if (!rev) return res.status(404).json({ message: 'Review not found' });
    rev.isApproved = !rev.isApproved;
    await rev.save();
    return res.json(rev);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getCouponsAdmin = async (req: Request, res: Response) => {
  try {
    let coupons = await Coupon.find({});
    if (!coupons || coupons.length === 0) coupons = initialSeedData.coupons as any[];
    return res.json(coupons);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const addCouponAdmin = async (req: Request, res: Response) => {
  try {
    const newCoupon = await Coupon.create({
      id: 'c_' + Date.now(),
      code: req.body.code ? req.body.code.toUpperCase() : 'GONA' + Math.floor(Math.random() * 100),
      discountPercentage: req.body.discountPercentage || 10,
      maxDiscount: req.body.maxDiscount || 500,
      minSpend: req.body.minSpend || 0,
      validUntil: req.body.validUntil || '2026-12-31',
      isActive: true
    });
    return res.status(201).json(newCoupon);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const toggleCouponActiveAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findOne({ $or: [{ code: id }, { id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    return res.json(coupon);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const deleteCouponAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Coupon.findOneAndDelete({
      $or: [
        { code: id },
        { code: String(id).toUpperCase() },
        { id },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
      ]
    });
    return res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};


export const validateCouponPublic = async (req: Request, res: Response) => {
  try {
    const { code, amount } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    let coupon = await Coupon.findOne({ code: String(code).toUpperCase(), isActive: true });
    if (!coupon) {
      const fallback = initialSeedData.coupons.find(c => c.code.toUpperCase() === String(code).toUpperCase() && c.isActive);
      if (fallback) coupon = fallback as any;
    }

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or expired coupon code' });
    }

    if (amount && coupon.minSpend && amount < coupon.minSpend) {
      return res.status(400).json({ message: `Minimum spend of ₹${coupon.minSpend} required for coupon ${coupon.code}` });
    }

    const rawDiscount = ((amount || 0) * coupon.discountPercentage) / 100;
    const discountAmount = Math.min(rawDiscount, coupon.maxDiscount || rawDiscount);

    return res.json({
      valid: true,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      discountAmount: Math.round(discountAmount)
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getCustomersAdmin = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password');
    const customers = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      avatar: u.avatar,
      wishlist: u.wishlist
    }));
    return res.json(customers);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const deleteCustomerAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userToDelete = await User.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { email: id },
        { id }
      ]
    });

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    const currentAdminEmail = (req as any).user?.email;
    if (userToDelete.email.toLowerCase() === currentAdminEmail?.toLowerCase()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account!' });
    }

    const targetUserId = userToDelete._id.toString();
    const targetEmail = userToDelete.email;

    await Promise.all([
      User.deleteOne({ _id: userToDelete._id }),
      RoomBooking.deleteMany({
        $or: [{ userId: targetUserId }, { userEmail: targetEmail }]
      }),
      FoodOrder.deleteMany({
        $or: [{ userId: targetUserId }, { userEmail: targetEmail }]
      }),
      FarmBooking.deleteMany({
        $or: [{ userId: targetUserId }, { userEmail: targetEmail }]
      }),
      PaymentTransaction.deleteMany({
        $or: [{ userId: targetUserId }, { userEmail: targetEmail }]
      }),
      Review.deleteMany({
        $or: [{ userId: targetUserId }, { userEmail: targetEmail }]
      })
    ]);

    return res.json({
      success: true,
      message: `User "${userToDelete.name}" (${userToDelete.email}) and all associated database records deleted successfully.`
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error deleting user' });
  }
};

