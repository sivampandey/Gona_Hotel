import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Bike, Utensils, Store, ArrowLeft, Lock, Tag, 
  CheckCircle2, Clock, MapPin, Phone, ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { PaymentModal } from '../components/PaymentModal';
import { InvoiceModal } from '../components/InvoiceModal';

export const FoodCheckout: React.FC = () => {
  const {
    cart,
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
    totalAmount,
    clearCart
  } = useCart();

  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [userName, setUserName] = useState(user?.name || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="min-h-screen bg-luxury-cream pt-32 pb-24 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto" />
        <h2 className="font-serif text-3xl font-bold text-luxury-emerald-dark">Your cart is empty</h2>
        <Link
          to="/restaurant"
          className="inline-block px-6 py-3 rounded-full bg-luxury-gold text-luxury-emerald-dark font-bold text-xs"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setIsPaymentOpen(false);

    const invoiceData = {
      invoiceId: 'INV-FOOD-' + Date.now().toString().slice(-6),
      title: `Gona Restaurant Food Order (${orderType.toUpperCase()})`,
      type: 'food' as const,
      date: new Date().toISOString(),
      customerName: userName,
      customerEmail: user?.email || 'guest@gonahotel.com',
      customerPhone: userPhone,
      paymentId,
      items: cart.map(i => ({ description: `${i.name} (${i.quantity}x)`, quantity: i.quantity, amount: i.price * i.quantity })),
      subtotal,
      tax,
      discount: discountAmount,
      totalAmount
    };

    setConfirmedOrder({
      id: 'ord_' + Date.now(),
      orderStatus: 'preparing',
      paymentId,
      invoiceData
    });

    clearCart();
    showToast('Food order placed successfully! Kitchen is preparing your meal.', 'success');
  };

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-obsidian pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link to="/restaurant" className="inline-flex items-center gap-2 text-sm font-semibold text-luxury-emerald hover:text-luxury-gold">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>

        {confirmedOrder ? (
          /* Live Order Tracking View */
          <div className="glass-panel p-8 rounded-3xl border border-luxury-gold/40 shadow-2xl space-y-8 animate-in fade-in">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-luxury-emerald-dark">Order Confirmed & Preparing</h2>
              <p className="text-xs text-gray-600">Order Ref: <strong>{confirmedOrder.id}</strong> • Paid via Razorpay</p>
            </div>

            {/* Live Status Step Progress */}
            <div className="p-6 rounded-2xl bg-luxury-emerald-dark text-white space-y-4">
              <h3 className="font-serif text-base font-bold text-gold-gradient">Live Kitchen Status Tracker</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-luxury-gold text-luxury-emerald-dark font-bold flex items-center justify-center mx-auto">✓</div>
                  <span className="text-luxury-gold font-bold">Placed</span>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-luxury-gold text-luxury-emerald-dark font-bold flex items-center justify-center mx-auto animate-ping">●</div>
                  <span className="text-luxury-gold font-bold">Preparing</span>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 font-bold flex items-center justify-center mx-auto">3</div>
                  <span className="text-gray-400">On The Way</span>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 font-bold flex items-center justify-center mx-auto">4</div>
                  <span className="text-gray-400">Delivered</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsInvoiceOpen(true)}
                className="px-6 py-3 rounded-full bg-luxury-gold text-luxury-emerald-dark font-bold text-xs"
              >
                View / Print Official Bill
              </button>
              <Link
                to="/profile?tab=orders"
                className="px-6 py-3 rounded-full border border-luxury-emerald text-luxury-emerald font-bold text-xs"
              >
                Go to Food History
              </Link>
            </div>

            {confirmedOrder.invoiceData && (
              <InvoiceModal
                isOpen={isInvoiceOpen}
                onClose={() => setIsInvoiceOpen(false)}
                invoiceData={confirmedOrder.invoiceData}
              />
            )}
          </div>
        ) : (
          /* Checkout Form */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form */}
            <div className="lg:col-span-2 glass-panel p-4 sm:p-8 rounded-3xl border border-luxury-gold/30 shadow-md space-y-6">
              <h2 className="font-serif text-2xl font-bold text-luxury-emerald-dark">Gourmet Checkout Details</h2>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>

                {/* Service Type Option */}
                <div className="space-y-3">
                  <span className="font-bold text-gray-700 text-xs block uppercase">Fulfillment Method</span>
                  <div className="grid grid-cols-3 gap-3 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                        orderType === 'delivery'
                          ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-emerald-dark font-bold'
                          : 'border-gray-200 bg-white text-gray-600'
                      }`}
                    >
                      <Bike className="w-5 h-5 text-luxury-gold" /> Room Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('table')}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                        orderType === 'table'
                          ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-emerald-dark font-bold'
                          : 'border-gray-200 bg-white text-gray-600'
                      }`}
                    >
                      <Utensils className="w-5 h-5 text-luxury-gold" /> Table Service
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                        orderType === 'pickup'
                          ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-emerald-dark font-bold'
                          : 'border-gray-200 bg-white text-gray-600'
                      }`}
                    >
                      <Store className="w-5 h-5 text-luxury-gold" /> Takeaway
                    </button>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="text-xs space-y-1 pt-2">
                      <label className="font-bold text-gray-700 block">Suite / Room Number</label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="e.g. Suite 402, Royal Presidential Wing"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                      />
                    </div>
                  )}

                  {orderType === 'table' && (
                    <div className="text-xs space-y-1 pt-2">
                      <label className="font-bold text-gray-700 block">Restaurant Table Number</label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="e.g. T-14 Garden Terrace"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-luxury-gold hover:bg-luxury-gold-light text-luxury-emerald-dark font-bold text-base tracking-wider flex items-center justify-center gap-2 shadow-xl"
                >
                  <Lock className="w-4 h-4" /> Pay ₹{totalAmount} via Razorpay
                </button>

              </form>
            </div>

            {/* Order Items Summary */}
            <div className="lg:col-span-1 glass-panel-dark p-6 rounded-3xl border border-luxury-gold/40 text-white space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-gradient">Order Items</h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-white">{item.name.replace(/\s*\([\u0900-\u097F\s\w]+\)/g, '')}</p>
                      <span className="text-gray-400">Qty: {item.quantity} × ₹{item.price}</span>
                    </div>
                    <span className="font-bold text-luxury-gold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-2 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-luxury-gold font-bold">
                    <span>Discount ({couponCode})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif font-bold text-luxury-gold pt-2 border-t border-gray-800">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={totalAmount}
        title="Gona Restaurant Food Order"
        description={`${cart.length} item(s) • ${orderType.toUpperCase()}`}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
