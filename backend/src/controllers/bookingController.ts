import { Request, Response } from 'express';
import RoomBooking from '../models/RoomBooking';
import Room from '../models/Room';
import { initialSeedData } from '../seed/seedData';

export const createRoomBooking = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { 
      roomId, checkIn, checkOut, guests, numberOfRooms, 
      userName, userEmail, userPhone, specialRequests 
    } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Room ID, check-in, and check-out dates are required' });
    }

    // 1. Fetch Room from MongoDB (or seed data fallback)
    let room = await Room.findOne({ 
      $or: [
        { id: roomId }, 
        { slug: roomId }, 
        { _id: roomId.match(/^[0-9a-fA-F]{24}$/) ? roomId : null }
      ] 
    });

    if (!room) {
      const fallback = initialSeedData.rooms.find(r => r.id === roomId || r.slug === roomId);
      if (fallback) room = fallback as any;
    }

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // 2. Prevent Double Booking - Check Date Overlap in MongoDB
    const existingBookings = await RoomBooking.find({
      roomId: room.id || roomId,
      bookingStatus: { $nin: ['CANCELLED', 'PAYMENT_REJECTED'] }
    });

    const newStart = new Date(checkIn).getTime();
    const newEnd = new Date(checkOut).getTime();

    if (isNaN(newStart) || isNaN(newEnd) || newStart >= newEnd) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date range' });
    }

    const isOverlap = existingBookings.some(b => {
      const bStart = new Date(b.checkIn).getTime();
      const bEnd = new Date(b.checkOut).getTime();
      return (newStart < bEnd) && (newEnd > bStart);
    });

    if (isOverlap) {
      return res.status(400).json({ message: 'Room is no longer available for the selected dates.' });
    }

    // 3. Independent Backend Price & Night Calculation
    const totalNights = Math.max(1, Math.ceil((newEnd - newStart) / (1000 * 60 * 60 * 24)));
    const roomsCount = numberOfRooms && numberOfRooms > 0 ? numberOfRooms : 1;
    const roomPrice = room.pricePerNight;
    const subtotal = roomPrice * totalNights * roomsCount;
    const tax = 0; // Configured hotel tax (0%)
    const discount = 0;
    const totalAmount = Math.max(0, subtotal + tax - discount);
    const invoiceId = 'INV-ROOM-' + Date.now().toString().slice(-6);
    const bookingId = 'bk_' + Date.now();

    // 4. Save Persistent Booking to MongoDB
    const booking = await RoomBooking.create({
      bookingId,
      userId,
      userName: userName || req.user.name || 'Valued Guest',
      userEmail: userEmail || req.user.email || 'guest@gonahotel.com',
      userPhone: userPhone || req.user.phone || '',
      roomId: room.id || roomId,
      roomName: room.title,
      roomImage: room.images && room.images[0] ? room.images[0] : '',
      checkIn,
      checkOut,
      guests: guests || { adults: 2, children: 0 },
      numberOfRooms: roomsCount,
      roomPrice,
      nights: totalNights,
      subtotal,
      tax,
      discount,
      totalAmount,
      paymentMethod: 'UPI_QR',
      paymentStatus: 'PENDING_PAYMENT',
      bookingStatus: 'PENDING_PAYMENT',
      invoiceId,
      specialRequests: specialRequests || ''
    });

    return res.status(201).json({
      message: 'Pending room booking created successfully',
      booking
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getUserBookings = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const userBookings = await RoomBooking.find({ userId }).sort({ createdAt: -1 });
    return res.json(userBookings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getAllBookingsAdmin = async (req: Request, res: Response) => {
  try {
    const bookings = await RoomBooking.find({}).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateBookingStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body;

    const booking = await RoomBooking.findOne({ $or: [{ bookingId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    return res.json({ message: 'Booking status updated successfully', booking });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
