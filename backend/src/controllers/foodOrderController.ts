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

export let memoryFoodOrders: MemoryFoodOrder[] = [
  {
    id: 'ord_3001',
    userId: 'usr_guest',
    userName: 'Alexander Wright',
    userPhone: '+91 98765 12345',
    items: [
      {
        itemId: 'item_truffle',
        name: 'Wild Farm Mushroom & Black Truffle Risotto',
        price: 1450,
        quantity: 2,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=400&q=80'
      },
      {
        itemId: 'item_tiramisu',
        name: 'Signature Gona Espresso Tiramisu',
        price: 650,
        quantity: 1,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80'
      }
    ],
    orderType: 'delivery',
    deliveryAddress: 'Suite 402, Royal Presidential Wing',
    subtotal: 3550,
    tax: 177.5,
    discount: 355,
    totalAmount: 3372.5,
    paymentStatus: 'paid',
    orderStatus: 'preparing',
    paymentId: 'pay_rzp_food_99182',
    invoiceId: 'INV-FOOD-2026-042',
    createdAt: new Date().toISOString()
  }
];

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
