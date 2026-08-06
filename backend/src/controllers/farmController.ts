import { Request, Response } from 'express';

export interface MemoryFarmBooking {
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

export let memoryFarmBookings: MemoryFarmBooking[] = [
  {
    id: 'farm_5001',
    userId: 'usr_guest',
    userName: 'Alexander Wright',
    userEmail: 'guest@gonahotel.com',
    userPhone: '+91 98765 12345',
    visitDate: '2026-08-12',
    visitorCount: 3,
    packageType: 'picnic_lunch',
    specialRequests: 'Organic fruit picking basket for children',
    pricePerVisitor: 1500,
    totalAmount: 4500,
    paymentStatus: 'paid',
    status: 'confirmed',
    paymentId: 'pay_rzp_farm_8812',
    invoiceId: 'INV-FARM-2026-011',
    createdAt: new Date().toISOString()
  }
];

export const createFarmBooking = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id || 'usr_guest';
    const { visitDate, visitorCount, packageType, userName, userEmail, userPhone, specialRequests, paymentId } = req.body;

    const packagePrices: Record<string, number> = {
      standard: 800,
      guided_tour: 1200,
      picnic_lunch: 1500,
      vip_experience: 2500
    };

    const count = Number(visitorCount) || 1;
    const pricePerVisitor = packagePrices[packageType] || 1200;
    const totalAmount = count * pricePerVisitor;
    const invoiceId = 'INV-FARM-' + Date.now().toString().slice(-6);

    const booking: MemoryFarmBooking = {
      id: 'farm_' + Date.now(),
      userId,
      userName: userName || 'Valued Visitor',
      userEmail: userEmail || 'guest@gonahotel.com',
      userPhone: userPhone || '+91 98765 00000',
      visitDate,
      visitorCount: count,
      packageType: packageType || 'guided_tour',
      specialRequests: specialRequests || '',
      pricePerVisitor,
      totalAmount,
      paymentStatus: 'paid',
      status: 'confirmed',
      paymentId: paymentId || 'pay_rzp_mock_' + Date.now(),
      invoiceId,
      createdAt: new Date().toISOString()
    };

    memoryFarmBookings.unshift(booking);

    return res.status(201).json({
      message: 'Farm visit booked successfully!',
      booking
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getUserFarmBookings = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const userBookings = memoryFarmBookings.filter(b => b.userId === userId);
    return res.json(userBookings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getAllFarmBookingsAdmin = async (req: Request, res: Response) => {
  try {
    return res.json(memoryFarmBookings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateFarmBookingStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const booking = memoryFarmBookings.find(b => b.id === id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    return res.json({ message: 'Farm booking status updated', booking });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
