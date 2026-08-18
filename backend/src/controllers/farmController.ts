import { Request, Response } from 'express';
import FarmBooking from '../models/FarmBooking';

export const createFarmBooking = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { 
      visitDate, visitorCount, packageType, 
      userName, userEmail, userPhone, specialRequests 
    } = req.body;

    const packagePrices: Record<string, number> = {
      'Full Farm House Overnight Stay': 18000,
      'Day Pool & Lawn Picnic Package': 6500,
      'Night Bonfire & BBQ Party': 8500,
      'Private Celebration & Birthday Lawn': 12500,
      'standard': 800,
      'guided_tour': 1200,
      'picnic_lunch': 1500,
      'vip_experience': 2500
    };

    const count = Number(visitorCount) || 1;
    const pkg = packageType || 'Full Farm House Overnight Stay';
    const subtotal = packagePrices[pkg] || 18000;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const totalAmount = subtotal + tax;
    const invoiceId = 'INV-FARM-' + Date.now().toString().slice(-6);
    const bookingId = 'fh_' + Date.now();

    const booking = await FarmBooking.create({
      bookingId,
      userId,
      userName: userName || req.user.name || 'Valued Visitor',
      userEmail: userEmail || req.user.email || 'guest@gonahotel.com',
      userPhone: userPhone || req.user.phone || '+91 96966 31621',
      visitDate,
      visitorCount: count,
      packageType: pkg,
      specialRequests: specialRequests || '',
      pricePerVisitor: subtotal,
      subtotal,
      tax,
      discount: 0,
      totalAmount,
      paymentMethod: 'UPI_QR',
      paymentStatus: 'PENDING_PAYMENT',
      status: 'PENDING_PAYMENT',
      invoiceId
    });

    return res.status(201).json({
      message: 'Pending farm booking created successfully',
      booking
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getUserFarmBookings = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const userBookings = await FarmBooking.find({ userId }).sort({ createdAt: -1 });
    return res.json(userBookings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getAllFarmBookingsAdmin = async (req: Request, res: Response) => {
  try {
    const bookings = await FarmBooking.find({}).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateFarmBookingStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await FarmBooking.findOne({ $or: [{ bookingId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
    if (!booking) return res.status(404).json({ message: 'Farm booking not found' });

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    return res.json({ message: 'Farm booking status updated successfully', booking });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
