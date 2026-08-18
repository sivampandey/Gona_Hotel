import { Request, Response } from 'express';
import FoodOrder from '../models/FoodOrder';
import MenuItem from '../models/MenuItem';
import Coupon from '../models/Coupon';
import { initialSeedData } from '../seed/seedData';

export const createFoodOrder = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { 
      items, orderType, tableNumber, deliveryAddress, 
      userName, userPhone, userEmail, couponCode 
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty' });
    }

    if (!orderType || !['delivery', 'pickup', 'table'].includes(orderType)) {
      return res.status(400).json({ message: 'Valid order type (delivery, pickup, table) is required' });
    }

    // 1. Validate items against MongoDB & recalculate actual prices
    let validatedItems: Array<{
      itemId: string;
      name: string;
      price: number;
      quantity: number;
      isVeg: boolean;
      image: string;
    }> = [];

    let subtotal = 0;

    for (const item of items) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      let dbItem = await MenuItem.findOne({ 
        $or: [
          { id: item.itemId }, 
          { _id: item.itemId.match(/^[0-9a-fA-F]{24}$/) ? item.itemId : null }
        ] 
      });

      if (!dbItem) {
        const fallback = initialSeedData.menuItems.find(m => m.id === item.itemId);
        if (fallback) dbItem = fallback as any;
      }

      if (!dbItem) {
        return res.status(400).json({ message: `Food item "${item.name || item.itemId}" is no longer available` });
      }

      if (dbItem.isAvailable === false) {
        return res.status(400).json({ message: `Food item "${dbItem.name}" is currently sold out` });
      }

      const itemTotal = dbItem.price * quantity;
      subtotal += itemTotal;

      validatedItems.push({
        itemId: dbItem.id || (dbItem._id as any).toString(),
        name: dbItem.name,
        price: dbItem.price,
        quantity,
        isVeg: dbItem.isVeg,
        image: dbItem.image
      });
    }

    // 2. Validate Coupon on Backend
    let discount = 0;
    if (couponCode && typeof couponCode === 'string') {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (subtotal >= coupon.minSpend) {
          const calculatedDiscount = Math.round((subtotal * coupon.discountPercentage) / 100);
          discount = Math.min(calculatedDiscount, coupon.maxDiscount);
        }
      }
    }

    // 3. Tax & Total calculation
    const tax = Math.round((subtotal - discount) * 0.05 * 100) / 100; // 5% GST
    const totalAmount = Math.max(0, subtotal + tax - discount);
    const invoiceId = 'INV-FOOD-' + Date.now().toString().slice(-6);
    const orderId = 'ord_' + Date.now();

    // 4. Save persistent food order in MongoDB
    const order = await FoodOrder.create({
      orderId,
      userId,
      userName: userName || req.user.name || 'Valued Guest',
      userPhone: userPhone || req.user.phone || '',
      userEmail: userEmail || req.user.email || 'guest@gonahotel.com',
      items: validatedItems,
      orderType,
      tableNumber: tableNumber || '',
      deliveryAddress: deliveryAddress || '',
      subtotal,
      tax,
      discount,
      totalAmount,
      paymentMethod: 'UPI_QR',
      paymentStatus: 'PENDING_PAYMENT',
      orderStatus: 'PENDING_PAYMENT',
      invoiceId
    });

    return res.status(201).json({
      message: 'Pending food order created successfully',
      order
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getUserFoodOrders = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const userOrders = await FoodOrder.find({ userId }).sort({ createdAt: -1 });
    return res.json(userOrders);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getFoodOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await FoodOrder.findOne({ $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getAllFoodOrdersAdmin = async (req: Request, res: Response) => {
  try {
    const orders = await FoodOrder.find({}).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateFoodOrderStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await FoodOrder.findOne({ $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    return res.json({ message: 'Order status updated successfully', order });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
