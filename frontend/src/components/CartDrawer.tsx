import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, Utensils, Bike, Store, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    deliveryAddress,
    setDeliveryAddress,
    subtotal,
    tax,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    totalAmount,
    totalItemsCount
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [applying, setApplying] = useState(false);
  const { showToast } = useNotification();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    setApplying(true);
    try {
      const codeUpper = inputCoupon.trim().toUpperCase();
      if (codeUpper === 'LUXURY20') {
        const disc = Math.min(Math.round(subtotal * 0.2), 2000);
        applyCoupon('LUXURY20', disc);
        showToast('Coupon LUXURY20 applied! 20% discount added.', 'success');
      } else if (codeUpper === 'GONA1000') {
        applyCoupon('GONA1000', 500);
        showToast('Coupon GONA1000 applied! ₹500 discount added.', 'success');
      } else {
        showToast('Invalid coupon code. Try LUXURY20 or GONA1000.', 'error');
      }
    } finally {
      setApplying(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    navigate('/checkout/food');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel-dark text-white shadow-2xl border-l border-luxury-gold/30 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-luxury-gold text-luxury-emerald-dark flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg text-gold-gradient font-bold">Your Gourmet Cart</h2>
                <p className="text-xs text-gray-400">{totalItemsCount} item(s) selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Body - Scrollable Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <Utensils className="w-16 h-16 text-gray-600 mx-auto" />
                <p className="text-lg font-serif text-gray-300">Your food cart is empty</p>
                <p className="text-xs text-gray-500">Explore our Michelin-inspired culinary menu and add delicious items.</p>
              </div>
            ) : (
              <>
                {/* Service Selection Toggle */}
                <div className="bg-luxury-emerald/60 p-3 rounded-2xl border border-luxury-gold/20 space-y-3">
                  <span className="text-xs font-semibold text-luxury-champagne uppercase tracking-wider">
                    Service Option
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setOrderType('delivery')}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-medium transition-all ${
                        orderType === 'delivery'
                          ? 'bg-luxury-gold text-luxury-emerald-dark font-bold shadow-md'
                          : 'bg-black/40 text-gray-300 hover:bg-black/60'
                      }`}
                    >
                      <Bike className="w-4 h-4 mb-1" />
                      Room Delivery
                    </button>
                    <button
                      onClick={() => setOrderType('table')}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-medium transition-all ${
                        orderType === 'table'
                          ? 'bg-luxury-gold text-luxury-emerald-dark font-bold shadow-md'
                          : 'bg-black/40 text-gray-300 hover:bg-black/60'
                      }`}
                    >
                      <Utensils className="w-4 h-4 mb-1" />
                      Table Service
                    </button>
                    <button
                      onClick={() => setOrderType('pickup')}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-medium transition-all ${
                        orderType === 'pickup'
                          ? 'bg-luxury-gold text-luxury-emerald-dark font-bold shadow-md'
                          : 'bg-black/40 text-gray-300 hover:bg-black/60'
                      }`}
                    >
                      <Store className="w-4 h-4 mb-1" />
                      Takeaway
                    </button>
                  </div>

                  {orderType === 'delivery' && (
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter Suite / Room Number or Address"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold"
                    />
                  )}

                  {orderType === 'table' && (
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Enter Restaurant Table Number (e.g. T-14)"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold"
                    />
                  )}
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-gray-800 hover:border-luxury-gold/30 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center text-[8px] font-bold ${
                              item.isVeg ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'
                            }`}
                          >
                            ●
                          </span>
                          <h4 className="text-sm font-semibold text-white truncate">{item.name.replace(/\s*\([\u0900-\u097F\s\w]+\)/g, '')}</h4>
                        </div>
                        <p className="text-xs text-luxury-gold font-bold">₹{item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-gray-800">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-2">
                  {couponCode ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-luxury-gold/10 border border-luxury-gold/40 text-xs">
                      <div className="flex items-center gap-2 text-luxury-gold font-medium">
                        <Tag className="w-4 h-4" />
                        <span>Code <strong>{couponCode}</strong> Applied (-₹{discountAmount})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-gray-400 hover:text-red-400 text-xs underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder="Promo Code (LUXURY20)"
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold"
                      />
                      <button
                        type="submit"
                        disabled={applying}
                        className="px-4 py-2 rounded-xl bg-luxury-gold/20 hover:bg-luxury-gold text-luxury-gold hover:text-luxury-emerald-dark font-bold text-xs transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer - Totals & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-800 space-y-4 bg-luxury-emerald-dark">
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-luxury-gold">
                    <span>Special Offer Discount</span>
                    <span className="font-bold">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif text-gold-gradient font-bold pt-2 border-t border-gray-800">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-light text-luxury-emerald-dark font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
