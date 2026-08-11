import { Request, Response } from 'express';

export interface MemoryFoodOrder {
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

export let memoryFoodOrders: MemoryFoodOrder[] = [];

export const createFoodOrder = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id || 'usr_guest';
    const { items, orderType, tableNumber, deliveryAddress, userName, userPhone, discount, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty' });
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
    const totalAmount = Math.max(0, subtotal + tax - (discount || 0));
    const invoiceId = 'INV-FOOD-' + Date.now().toString().slice(-6);

    const order: MemoryFoodOrder = {
      id: 'ord_' + Date.now(),
      userId,
      userName: userName || 'Valued Guest',
      userPhone: userPhone || '+91 98765 00000',
      items,
      orderType,
      tableNumber: tableNumber || '',
      deliveryAddress: deliveryAddress || '',
      subtotal,
      tax,
      discount: discount || 0,
      totalAmount,
      paymentStatus: 'paid',
      orderStatus: 'placed',
      paymentId: paymentId || 'pay_rzp_mock_' + Date.now(),
      invoiceId,
      createdAt: new Date().toISOString()
    };

    memoryFoodOrders.unshift(order);

    return res.status(201).json({
      message: 'Food order placed successfully!',
      order
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getUserFoodOrders = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const userOrders = memoryFoodOrders.filter(o => o.userId === userId);
    return res.json(userOrders);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getFoodOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = memoryFoodOrders.find(o => o.id === id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getAllFoodOrdersAdmin = async (req: Request, res: Response) => {
  try {
    return res.json(memoryFoodOrders);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateFoodOrderStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    const order = memoryFoodOrders.find(o => o.id === id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    return res.json({ message: 'Order status updated', order });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
