import { Request, Response } from 'express';
import { memoryRooms } from './roomController';

export interface MemoryRoomBooking {
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

export let memoryRoomBookings: MemoryRoomBooking[] = [
  {
    id: 'bk_1001',
    userId: 'usr_guest',
    userName: 'Alexander Wright',
    userEmail: 'guest@gonahotel.com',
    roomId: 'room_presidential',
    roomName: 'Royal Presidential Sanctuary',
    roomImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    checkIn: '2026-08-10',
    checkOut: '2026-08-13',
    guests: { adults: 2, children: 1 },
    totalNights: 3,
    pricePerNight: 45000,
    totalAmount: 135000,
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    paymentId: 'pay_rzp_9812739182',
    invoiceId: 'INV-ROOM-2026-001',
    createdAt: new Date().toISOString()
  }
];

export const createRoomBooking = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id || 'usr_guest';
    const { roomId, checkIn, checkOut, guests, userName, userEmail, specialRequests, paymentId } = req.body;

    const room = memoryRooms.find(r => r.id === roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Calculate total nights
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const totalAmount = room.pricePerNight * totalNights;
    const invoiceId = 'INV-ROOM-' + Date.now().toString().slice(-6);

    const booking: MemoryRoomBooking = {
      id: 'bk_' + Date.now(),
      userId,
      userName: userName || 'Valued Guest',
      userEmail: userEmail || 'guest@gonahotel.com',
      roomId: room.id,
      roomName: room.title,
      roomImage: room.images[0] || '',
      checkIn,
      checkOut,
      guests: guests || { adults: 2, children: 0 },
      totalNights,
      pricePerNight: room.pricePerNight,
      totalAmount,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      paymentId: paymentId || 'pay_rzp_mock_' + Date.now(),
      invoiceId,
      createdAt: new Date().toISOString()
    };

    memoryRoomBookings.unshift(booking);

    return res.status(201).json({
      message: 'Room booking confirmed successfully!',
      booking
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getUserBookings = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const userBookings = memoryRoomBookings.filter(b => b.userId === userId);
    return res.json(userBookings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getAllBookingsAdmin = async (req: Request, res: Response) => {
  try {
    return res.json(memoryRoomBookings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateBookingStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body;
    const booking = memoryRoomBookings.find(b => b.id === id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    return res.json({ message: 'Booking updated', booking });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
