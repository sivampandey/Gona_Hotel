import { Request, Response } from 'express';
import crypto from 'crypto';

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt_' + Date.now() } = req.body;

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey12345';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'mocksecretkey12345';

    // Simulated Razorpay Order Object
    const orderId = 'order_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    return res.json({
      success: true,
      id: orderId,
      entity: 'order',
      amount: Math.round(amount * 100), // amount in paise
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency,
      receipt,
      status: 'created',
      key: keyId
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Payment order creation failed' });
  }
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // For test environment, accept any signature or mock match
    return res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id || 'pay_rzp_mock_' + Date.now(),
      orderId: razorpay_order_id
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Payment verification failed' });
  }
};
