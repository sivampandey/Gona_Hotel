import { Request, Response } from 'express';
import PaymentTransaction from '../models/PaymentTransaction';
import RoomBooking from '../models/RoomBooking';
import FoodOrder from '../models/FoodOrder';
import FarmBooking from '../models/FarmBooking';

export const submitUtrProof = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const { bookingId, orderId, bookingType, utrNumber, payerName } = req.body;

    if (!utrNumber || !utrNumber.trim()) {
      return res.status(400).json({ message: '12-digit UTR / Reference number is required' });
    }

    if (!bookingType || !['room', 'food', 'farm'].includes(bookingType)) {
      return res.status(400).json({ message: 'Valid bookingType (room, food, farm) is required' });
    }

    const cleanUtr = utrNumber.trim().toUpperCase();
    const cleanPayer = payerName ? payerName.trim() : req.user.name || 'Guest';

    let amount = 0;
    let targetRecord: any = null;

    if (bookingType === 'room') {
      targetRecord = await RoomBooking.findOne({
        $or: [
          { bookingId: bookingId || orderId },
          { _id: (bookingId || orderId).match(/^[0-9a-fA-F]{24}$/) ? (bookingId || orderId) : null }
        ]
      });
      if (!targetRecord) return res.status(404).json({ message: 'Room booking not found' });

      // Ownership enforcement check
      if (targetRecord.userId && targetRecord.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Forbidden: You do not own this booking' });
      }

      targetRecord.paymentStatus = 'PAYMENT_SUBMITTED';
      targetRecord.bookingStatus = 'PAYMENT_SUBMITTED';
      targetRecord.utrNumber = cleanUtr;
      targetRecord.payerName = cleanPayer;
      targetRecord.paymentId = `UPI_${cleanUtr}`;
      await targetRecord.save();

      amount = targetRecord.totalAmount;
    } else if (bookingType === 'food') {
      targetRecord = await FoodOrder.findOne({
        $or: [
          { orderId: orderId || bookingId },
          { _id: (orderId || bookingId).match(/^[0-9a-fA-F]{24}$/) ? (orderId || bookingId) : null }
        ]
      });
      if (!targetRecord) return res.status(404).json({ message: 'Food order not found' });

      // Ownership enforcement check
      if (targetRecord.userId && targetRecord.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Forbidden: You do not own this food order' });
      }

      targetRecord.paymentStatus = 'PAYMENT_SUBMITTED';
      targetRecord.orderStatus = 'PAYMENT_SUBMITTED';
      targetRecord.utrNumber = cleanUtr;
      targetRecord.payerName = cleanPayer;
      targetRecord.paymentId = `UPI_${cleanUtr}`;
      await targetRecord.save();

      amount = targetRecord.totalAmount;
    } else if (bookingType === 'farm') {
      targetRecord = await FarmBooking.findOne({
        $or: [
          { bookingId: bookingId || orderId },
          { _id: (bookingId || orderId).match(/^[0-9a-fA-F]{24}$/) ? (bookingId || orderId) : null }
        ]
      });
      if (!targetRecord) return res.status(404).json({ message: 'Farm booking not found' });

      // Ownership enforcement check
      if (targetRecord.userId && targetRecord.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Forbidden: You do not own this farm booking' });
      }

      targetRecord.paymentStatus = 'PAYMENT_SUBMITTED';
      targetRecord.status = 'PAYMENT_SUBMITTED';
      targetRecord.utrNumber = cleanUtr;
      targetRecord.payerName = cleanPayer;
      targetRecord.paymentId = `UPI_${cleanUtr}`;
      await targetRecord.save();

      amount = targetRecord.totalAmount;
    }

    const transactionId = `txn_${Date.now()}`;
    const transaction = await PaymentTransaction.create({
      transactionId,
      orderId: targetRecord.orderId || '',
      bookingId: targetRecord.bookingId || '',
      bookingType,
      userId,
      userName: targetRecord.userName || req.user.name,
      userEmail: targetRecord.userEmail || req.user.email,
      userPhone: targetRecord.userPhone || req.user.phone || '',
      amount,
      currency: 'INR',
      method: 'UPI_QR',
      utrNumber: cleanUtr,
      payerName: cleanPayer,
      status: 'PAYMENT_SUBMITTED'
    });

    return res.status(200).json({
      success: true,
      message: 'Payment details submitted successfully. Verification is pending.',
      transaction,
      booking: targetRecord
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getPendingTransactionsAdmin = async (req: Request, res: Response) => {
  try {
    const transactions = await PaymentTransaction.find({}).sort({ createdAt: -1 });
    return res.json(transactions);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const verifyOrRejectPaymentAdmin = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;

    const transaction = await PaymentTransaction.findOne({
      $or: [
        { transactionId: id },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { utrNumber: id }
      ]
    });

    const adminEmail = req.user?.email || 'admin';

    if (action === 'verify') {
      if (transaction) {
        transaction.status = 'VERIFIED';
        transaction.verifiedBy = adminEmail;
        transaction.verifiedAt = new Date();
        await transaction.save();
      }

      const bType = transaction ? transaction.bookingType : req.body.bookingType;
      const targetId = transaction ? (transaction.bookingId || transaction.orderId) : id;

      if (bType === 'room' || !bType) {
        const rBooking = await RoomBooking.findOne({ $or: [{ bookingId: targetId }, { _id: targetId.match(/^[0-9a-fA-F]{24}$/) ? targetId : null }] });
        if (rBooking) {
          rBooking.paymentStatus = 'VERIFIED';
          rBooking.bookingStatus = 'CONFIRMED';
          rBooking.verifiedBy = adminEmail;
          rBooking.verifiedAt = new Date();
          await rBooking.save();
        }
      }

      if (bType === 'food' || !bType) {
        const fOrder = await FoodOrder.findOne({ $or: [{ orderId: targetId }, { _id: targetId.match(/^[0-9a-fA-F]{24}$/) ? targetId : null }] });
        if (fOrder) {
          fOrder.paymentStatus = 'VERIFIED';
          fOrder.orderStatus = 'CONFIRMED';
          fOrder.verifiedBy = adminEmail;
          fOrder.verifiedAt = new Date();
          await fOrder.save();
        }
      }

      if (bType === 'farm' || !bType) {
        const fmBooking = await FarmBooking.findOne({ $or: [{ bookingId: targetId }, { _id: targetId.match(/^[0-9a-fA-F]{24}$/) ? targetId : null }] });
        if (fmBooking) {
          fmBooking.paymentStatus = 'VERIFIED';
          fmBooking.status = 'CONFIRMED';
          fmBooking.verifiedBy = adminEmail;
          fmBooking.verifiedAt = new Date();
          await fmBooking.save();
        }
      }

      return res.json({ message: 'Payment successfully verified and booking/order confirmed!' });

    } else if (action === 'reject') {
      const reason = rejectionReason || 'Invalid UTR or payment not received in bank account';
      
      if (transaction) {
        transaction.status = 'REJECTED';
        transaction.rejectionReason = reason;
        transaction.verifiedBy = adminEmail;
        transaction.verifiedAt = new Date();
        await transaction.save();
      }

      const bType = transaction ? transaction.bookingType : req.body.bookingType;
      const targetId = transaction ? (transaction.bookingId || transaction.orderId) : id;

      if (bType === 'room' || !bType) {
        const rBooking = await RoomBooking.findOne({ $or: [{ bookingId: targetId }, { _id: targetId.match(/^[0-9a-fA-F]{24}$/) ? targetId : null }] });
        if (rBooking) {
          rBooking.paymentStatus = 'REJECTED';
          rBooking.bookingStatus = 'PAYMENT_REJECTED';
          rBooking.rejectionReason = reason;
          await rBooking.save();
        }
      }

      if (bType === 'food' || !bType) {
        const fOrder = await FoodOrder.findOne({ $or: [{ orderId: targetId }, { _id: targetId.match(/^[0-9a-fA-F]{24}$/) ? targetId : null }] });
        if (fOrder) {
          fOrder.paymentStatus = 'REJECTED';
          fOrder.orderStatus = 'PAYMENT_REJECTED';
          fOrder.rejectionReason = reason;
          await fOrder.save();
        }
      }

      if (bType === 'farm' || !bType) {
        const fmBooking = await FarmBooking.findOne({ $or: [{ bookingId: targetId }, { _id: targetId.match(/^[0-9a-fA-F]{24}$/) ? targetId : null }] });
        if (fmBooking) {
          fmBooking.paymentStatus = 'REJECTED';
          fmBooking.status = 'PAYMENT_REJECTED';
          fmBooking.rejectionReason = reason;
          await fmBooking.save();
        }
      }

      return res.json({ message: 'Payment rejected. Status updated.' });
    }

    return res.status(400).json({ message: 'Invalid action. Must be "verify" or "reject".' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
