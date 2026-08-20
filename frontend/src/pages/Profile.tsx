import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  User as UserIcon, Hotel, Utensils, Heart, Printer, AlertTriangle, CheckCircle2, RotateCcw, Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { initialSeedData } from '../data/seedData';
import { RoomCard } from '../components/RoomCard';
import { FoodCard } from '../components/FoodCard';
import { InvoiceModal } from '../components/InvoiceModal';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';

export const Profile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, logout, isAdmin } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'rooms');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const [roomBookings, setRoomBookings] = useState<any[]>([]);
  const [foodOrders, setFoodOrders] = useState<any[]>([]);
  const [farmBookings, setFarmBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        apiService.getUserRoomBookings(),
        apiService.getUserFoodOrders(),
        apiService.getUserFarmBookings()
      ]).then(([roomRes, foodRes, farmRes]) => {
        if (roomRes.status === 200) setRoomBookings(roomRes.data || []);
        if (foodRes.status === 200) setFoodOrders(foodRes.data || []);
        if (farmRes.status === 200) setFarmBookings(farmRes.data || []);
      }).catch(err => {
        console.warn('Error fetching profile user history:', err);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

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

  const wishlistedRooms = initialSeedData.rooms.filter(r => user.wishlist?.rooms?.includes(r.id));
  const wishlistedFood = initialSeedData.menuItems.filter(f => user.wishlist?.food?.includes(f.id));

  const statusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'VERIFIED' || s === 'CONFIRMED' || s === 'PAID') {
      return <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold border border-green-300">CONFIRMED ✓</span>;
    }
    if (s === 'PAYMENT_SUBMITTED') {
      return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">PENDING VERIFICATION ⏳</span>;
    }
    if (s === 'REJECTED' || s === 'PAYMENT_REJECTED') {
      return <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold border border-red-300">PAYMENT REJECTED ✗</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-bold">{s}</span>;
  };

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian pt-28 pb-24">
      <SEO noindex title="My Guest Profile | Gona Hotel" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* User Header */}
        <div className="glass-panel p-8 rounded-3xl border border-luxury-gold/30 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-luxury-gold shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#0D3B29] text-luxury-gold font-serif text-3xl font-bold flex items-center justify-center border-2 border-luxury-gold shadow-lg shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-3xl font-bold text-[#0D3B29]">{user.name}</h1>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full bg-luxury-gold text-[#0D3B29] text-[10px] font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">{user.email} • {user.phone || 'Phone not provided'}</p>
              <p className="text-[11px] text-luxury-gold font-bold mt-1">Royal Privilege Member since 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-6 py-2.5 rounded-full bg-[#0D3B29] text-white font-bold text-xs shadow-md"
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
            onClick={() => setActiveTab('farm')}
            className={`px-5 py-3 font-bold rounded-t-2xl flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'farm' ? 'border-luxury-gold text-[#0D3B29] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Home className="w-4 h-4 text-luxury-gold" /> Farm Bookings ({farmBookings.length})
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
            {roomBookings.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
                <Hotel className="w-12 h-12 text-gray-400 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#0D3B29]">No Room Bookings Found</h4>
                <Link to="/rooms" className="inline-block px-5 py-2.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-xs">
                  Explore Luxury Suites & Rooms
                </Link>
              </div>
            ) : (
              roomBookings.map((b) => (
                <div key={b._id || b.bookingId || b.id} className="p-6 rounded-3xl bg-white border border-luxury-gold/20 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {b.roomImage && (
                      <img src={b.roomImage} alt={b.roomName} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {statusBadge(b.paymentStatus || b.bookingStatus)}
                        <span className="text-xs text-gray-500">Invoice: {b.invoiceId}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#0D3B29]">{b.roomName}</h3>
                      <p className="text-xs text-gray-600">
                        Check-in: <strong>{b.checkIn}</strong> to <strong>{b.checkOut}</strong> ({b.nights || b.totalNights} night(s)) • {b.guests?.adults || 2} Adult(s)
                      </p>
                      {b.utrNumber && <p className="text-xs text-gray-500 font-mono">Submitted UTR Ref: {b.utrNumber}</p>}
                    </div>
                  </div>

                  <div className="text-right space-y-3 shrink-0">
                    <span className="font-serif text-2xl font-bold block text-luxury-gold">
                      ₹{b.totalAmount?.toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => setSelectedInvoice({
                        invoiceId: b.invoiceId,
                        title: `${b.roomName} Stay Reservation`,
                        type: 'room',
                        date: b.createdAt || b.checkIn,
                        customerName: b.userName,
                        customerEmail: b.userEmail,
                        customerPhone: b.userPhone,
                        utrNumber: b.utrNumber,
                        paymentStatus: b.paymentStatus,
                        items: [{ description: `${b.roomName} (${b.nights || b.totalNights} nights)`, quantity: b.nights || b.totalNights, amount: b.totalAmount }],
                        subtotal: b.subtotal || b.totalAmount,
                        tax: b.tax || 0,
                        totalAmount: b.totalAmount
                      })}
                      className="px-4 py-2 rounded-full bg-[#0D3B29] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5" /> View / Download Bill
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* FOOD ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {foodOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
                <Utensils className="w-12 h-12 text-gray-400 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#0D3B29]">No Food Orders Found</h4>
                <Link to="/restaurant" className="inline-block px-5 py-2.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-xs">
                  Order Delicious Food
                </Link>
              </div>
            ) : (
              foodOrders.map((o) => (
                <div key={o._id || o.orderId || o.id} className="p-6 rounded-3xl bg-white border border-luxury-gold/20 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-[#0D3B29] uppercase">Order #{o.orderId || o.id}</span>
                      <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()} • {(o.orderType || 'delivery').toUpperCase()}</p>
                    </div>
                    {statusBadge(o.paymentStatus || o.orderStatus)}
                  </div>

                  <div className="space-y-2">
                    {o.items?.map((i: any, idx: number) => (
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
                        title: `Food Order (${(o.orderType || 'delivery').toUpperCase()})`,
                        type: 'food',
                        date: o.createdAt,
                        customerName: o.userName,
                        customerEmail: user.email,
                        customerPhone: o.userPhone,
                        utrNumber: o.utrNumber,
                        paymentStatus: o.paymentStatus,
                        items: o.items?.map((it: any) => ({ description: `${it.name} (${it.quantity}x)`, quantity: it.quantity, amount: it.price * it.quantity })),
                        subtotal: o.subtotal,
                        tax: o.tax,
                        discount: o.discount,
                        totalAmount: o.totalAmount
                      })}
                      className="px-4 py-2 rounded-full bg-[#0D3B29] text-white font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> View / Download Bill
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* FARM BOOKINGS TAB */}
        {activeTab === 'farm' && (
          <div className="space-y-4">
            {farmBookings.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
                <Home className="w-12 h-12 text-gray-400 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#0D3B29]">No Farm Reservations Found</h4>
                <Link to="/farm" className="inline-block px-5 py-2.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-xs">
                  Reserve Gona Private Farm House
                </Link>
              </div>
            ) : (
              farmBookings.map((f) => (
                <div key={f._id || f.bookingId || f.id} className="p-6 rounded-3xl bg-white border border-luxury-gold/20 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-[#0D3B29]">{f.packageType}</h4>
                      <p className="text-xs text-gray-500">Visit Date: <strong>{f.visitDate}</strong> • Guests: {f.visitorCount}</p>
                    </div>
                    {statusBadge(f.paymentStatus || f.status)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-xl font-bold text-luxury-gold">₹{f.totalAmount?.toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => setSelectedInvoice({
                        invoiceId: f.invoiceId,
                        title: `Farm House Reservation: ${f.packageType}`,
                        type: 'farm',
                        date: f.createdAt,
                        customerName: f.userName,
                        customerEmail: f.userEmail,
                        customerPhone: f.userPhone,
                        utrNumber: f.utrNumber,
                        paymentStatus: f.paymentStatus,
                        items: [{ description: `${f.packageType} on ${f.visitDate}`, quantity: 1, amount: f.subtotal || f.totalAmount }],
                        subtotal: f.subtotal || f.totalAmount,
                        tax: f.tax || 0,
                        totalAmount: f.totalAmount
                      })}
                      className="px-4 py-2 rounded-full bg-[#0D3B29] text-white font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> View / Download Bill
                    </button>
                  </div>
                </div>
              ))
            )}
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
    </div>
  );
};
