import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  User as UserIcon, Hotel, Utensils, Heart, Printer, AlertTriangle, CheckCircle2, RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { initialSeedData } from '../data/seedData';
import { RoomCard } from '../components/RoomCard';
import { FoodCard } from '../components/FoodCard';
import { InvoiceModal } from '../components/InvoiceModal';
import { CancellationModal } from '../components/CancellationModal';
import { memoryRoomBookings, memoryFoodOrders } from '../data/mockBookings';

export const Profile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, logout, isAdmin } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'rooms');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [cancellationTarget, setCancellationTarget] = useState<any>(null);

  const [roomBookings, setRoomBookings] = useState<any[]>([...memoryRoomBookings]);
  const foodOrders = memoryFoodOrders;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7F4EB] pt-32 pb-24 text-center space-y-6">
        <UserIcon className="w-16 h-16 text-gray-400 mx-auto" />
        <h2 className="font-serif text-3xl font-bold text-[#0D3B29]">Please Sign In</h2>
        <Link to="/login" className="inline-block px-6 py-3 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-xs">
          Sign In / Register
        </Link>
      </div>
    );
  }

  const wishlistedRooms = initialSeedData.rooms.filter(r => user.wishlist.rooms.includes(r.id));
  const wishlistedFood = initialSeedData.menuItems.filter(f => user.wishlist.food.includes(f.id));

  const handleConfirmCancel = (bookingId: string, refundPolicy: any, reason: string) => {
    setRoomBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const updated = {
          ...b,
          bookingStatus: 'cancelled',
          paymentStatus: 'refund_processed',
          refundAmount: refundPolicy.refundAmount,
          cancellationFee: refundPolicy.cancellationFee,
          cancellationReason: reason,
          cancelledAt: new Date().toISOString()
        };
        // Also update shared memory array for Admin panel view
        const idx = memoryRoomBookings.findIndex((item: any) => item.id === bookingId);
        if (idx !== -1) {
          (memoryRoomBookings as any)[idx] = updated;
        }
        return updated;
      }
      return b;
    }));

    showToast(
      `Booking ${bookingId} cancelled. Refund of ₹${refundPolicy.refundAmount.toLocaleString('en-IN')} (${refundPolicy.refundPercent}%) will be credited back to your account.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* User Header */}
        <div className="glass-panel p-8 rounded-3xl border border-luxury-gold/30 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-luxury-gold shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-3xl font-bold text-[#0D3B29]">{user.name}</h1>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full bg-luxury-gold text-[#0D3B29] text-[10px] font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">{user.email} • {user.phone}</p>
              <p className="text-[11px] text-luxury-gold font-bold mt-1">Royal Privilege Member since 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-6 py-2.5 rounded-full bg-[#0D3B29] text-white font-bold text-xs"
              >
                Go to Admin Dashboard
              </Link>
            )}
            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-full border border-red-500/40 text-red-600 font-bold text-xs hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-5 py-3 font-bold rounded-t-2xl flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'rooms' ? 'border-luxury-gold text-[#0D3B29] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Hotel className="w-4 h-4 text-luxury-gold" /> Room Bookings ({roomBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 font-bold rounded-t-2xl flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders' ? 'border-luxury-gold text-[#0D3B29] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Utensils className="w-4 h-4 text-luxury-gold" /> Food Orders ({foodOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-5 py-3 font-bold rounded-t-2xl flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'wishlist' ? 'border-luxury-gold text-[#0D3B29] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Heart className="w-4 h-4 text-luxury-gold" /> Wishlist ({wishlistedRooms.length + wishlistedFood.length})
          </button>
        </div>

        {/* ROOM BOOKINGS TAB */}
        {activeTab === 'rooms' && (
          <div className="space-y-4">
            {roomBookings.map((b) => {
              const isCancelled = b.bookingStatus === 'cancelled';

              return (
                <div key={b.id} className="p-6 rounded-3xl bg-white border border-luxury-gold/20 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img src={b.roomImage} alt={b.roomName} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          isCancelled ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700'
                        }`}>
                          {isCancelled ? 'Cancelled' : b.bookingStatus}
                        </span>
                        {isCancelled && (
                          <span className="text-[10px] text-gray-500">Reason: {b.cancellationReason || 'User Request'}</span>
                        )}
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#0D3B29]">{b.roomName}</h3>
                      <p className="text-xs text-gray-600">
                        Check-in: <strong>{b.checkIn}</strong> to <strong>{b.checkOut}</strong> ({b.totalNights} night(s)) • {b.guests.adults} Adult(s)
                      </p>
                      <p className="text-xs text-gray-500">Invoice: {b.invoiceId} • Ref: {b.paymentId}</p>

                      {isCancelled && (
                        <div className="p-3 rounded-xl bg-red-50/80 border border-red-100 mt-2 text-xs text-red-800 space-y-1">
                          <p className="font-bold flex items-center gap-1">
                            <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                            Refund Processed: ₹{b.refundAmount?.toLocaleString('en-IN')} (Fee: ₹{b.cancellationFee?.toLocaleString('en-IN')})
                          </p>
                          <p className="text-[10px] text-red-600">Refund credited back to original payment mode.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-3 shrink-0">
                    <div>
                      <span className={`font-serif text-2xl font-bold block ${isCancelled ? 'text-gray-400 line-through' : 'text-luxury-gold'}`}>
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </span>
                      {isCancelled && (
                        <span className="text-xs font-bold text-green-700 block">
                          Refund: ₹{b.refundAmount?.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                      <button
                        onClick={() => setSelectedInvoice({
                          invoiceId: b.invoiceId,
                          title: `${b.roomName} Stay Reservation`,
                          type: 'room',
                          date: b.createdAt,
                          customerName: b.userName,
                          customerEmail: b.userEmail,
                          paymentId: b.paymentId,
                          items: [{ description: `${b.roomName} (${b.totalNights} nights)`, quantity: b.totalNights, amount: b.totalAmount }],
                          subtotal: Math.round(b.totalAmount / 1.05),
                          tax: Math.round(b.totalAmount - (b.totalAmount / 1.05)),
                          totalAmount: b.totalAmount
                        })}
                        className="px-4 py-2 rounded-full bg-[#0D3B29] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" /> GST Invoice
                      </button>

                      {!isCancelled && (
                        <button
                          onClick={() => setCancellationTarget(b)}
                          className="px-4 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Cancel Room
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FOOD ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {foodOrders.map((o) => (
              <div key={o.id} className="p-6 rounded-3xl bg-white border border-luxury-gold/20 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#0D3B29] uppercase">Order #{o.id}</span>
                    <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()} • {o.orderType.toUpperCase()}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase">
                    Status: {o.orderStatus}
                  </span>
                </div>

                <div className="space-y-2">
                  {o.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-medium text-gray-700">
                      <span>{i.name} (Qty: {i.quantity})</span>
                      <span>₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-serif text-lg font-bold text-luxury-gold">Total: ₹{o.totalAmount}</span>
                  <button
                    onClick={() => setSelectedInvoice({
                      invoiceId: o.invoiceId,
                      title: `Food Order (${o.orderType.toUpperCase()})`,
                      type: 'food',
                      date: o.createdAt,
                      customerName: o.userName,
                      customerEmail: user.email,
                      paymentId: o.paymentId,
                      items: o.items.map(it => ({ description: `${it.name} (${it.quantity}x)`, quantity: it.quantity, amount: it.price * it.quantity })),
                      subtotal: o.subtotal,
                      tax: o.tax,
                      discount: o.discount,
                      totalAmount: o.totalAmount
                    })}
                    className="px-4 py-2 rounded-full bg-[#0D3B29] text-white font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> GST Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Saved Rooms ({wishlistedRooms.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedRooms.map(r => (
                  <RoomCard key={r.id} room={r} />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Saved Dishes ({wishlistedFood.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistedFood.map(f => (
                  <FoodCard key={f.id} item={f} />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoiceData={selectedInvoice}
        />
      )}

      {/* Cancellation Modal */}
      {cancellationTarget && (
        <CancellationModal
          isOpen={!!cancellationTarget}
          onClose={() => setCancellationTarget(null)}
          booking={cancellationTarget}
          onConfirmCancel={handleConfirmCancel}
        />
      )}
    </div>
  );
};
