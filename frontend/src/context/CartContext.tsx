import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  orderType: 'delivery' | 'pickup' | 'table';
  tableNumber: string;
  deliveryAddress: string;
  couponCode: string;
  discountAmount: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: 'delivery' | 'pickup' | 'table') => void;
  setTableNumber: (num: string) => void;
  setDeliveryAddress: (addr: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gona_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'table'>('delivery');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('gona_cart', JSON.stringify(cart));
  }, [cart]);

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    // Don't auto-open cart — let user decide when to open it
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const applyCoupon = (code: string, discount: number) => {
    setCouponCode(code);
    setDiscountAmount(discount);
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST/Tax
  const totalAmount = Math.max(0, subtotal + tax - discountAmount);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        orderType,
        tableNumber,
        deliveryAddress,
        couponCode,
        discountAmount,
        subtotal,
        tax,
        totalAmount,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setOrderType,
        setTableNumber,
        setDeliveryAddress,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
