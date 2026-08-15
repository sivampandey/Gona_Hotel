import React, { useState } from 'react';
import {
  LayoutDashboard, Hotel, Utensils, Tag, Users,
  Edit3, CheckCircle2, TrendingUp, Lock, Plus, Trash2,
  ShoppingBag, Star, IndianRupee, Calendar, Phone, Mail, Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { initialSeedData } from '../data/seedData';
import { memoryRoomBookings, memoryFoodOrders } from '../data/mockBookings';
import { useNotification } from '../context/NotificationContext';
import { InvoiceModal } from '../components/InvoiceModal';

type AdminTab = 'analytics' | 'rooms' | 'bookings' | 'menu' | 'food-orders' | 'coupons' | 'customers';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const [rooms, setRooms] = useState([...initialSeedData.rooms]);
  const [menuItems, setMenuItems] = useState([...initialSeedData.menuItems]);
  const [roomBookings] = useState([...memoryRoomBookings]);
  const [foodOrders, setFoodOrders] = useState([...memoryFoodOrders]);
  const [coupons, setCoupons] = useState([...initialSeedData.coupons]);

  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F7F4EB] pt-32 flex flex-col items-center justify-center gap-4 text-center px-6">
        <Lock className="w-16 h-16 text-red-500" />
        <h2 className="font-serif text-3xl font-bold text-[#0D3B29]">Admin Portal Restricted</h2>
        <p className="text-gray-600">Please sign in as <strong>admin@gonahotel.com</strong> to access the admin dashboard.</p>
      </div>
    );
  }

  // ─── Stats ───
  const roomRev = roomBookings.reduce((s, b) => s + b.totalAmount, 0);
  const foodRev = foodOrders.reduce((s, o) => s + o.totalAmount, 0);
  const totalRev = roomRev + foodRev;

  const tabs: { id: AdminTab; label: string; icon: React.FC<any> }[] = [
    { id: 'analytics',   label: 'Overview',       icon: TrendingUp },
    { id: 'rooms',       label: 'Rooms',          icon: Hotel },
    { id: 'bookings',    label: 'Room Bookings',  icon: Calendar },
    { id: 'menu',        label: 'Restaurant Menu',icon: Utensils },
    { id: 'food-orders', label: 'Food Orders',    icon: ShoppingBag },
    { id: 'coupons',     label: 'Coupons',        icon: Tag },
    { id: 'customers',   label: 'Customers',      icon: Users },
  ];

  // ─── Handlers ───
  const updateRoomPrice = (roomId: string) => {
    setRooms(p => p.map(r => r.id === roomId ? { ...r, pricePerNight: newPrice } : r));
    setEditingRoomId(null);
    showToast('Room price updated!', 'success');
  };

  const toggleMenuAvailability = (id: string) => {
    setMenuItems(p => p.map(m => m.id === id ? { ...m, isAvailable: !m.isAvailable } : m));
    showToast('Menu item status updated!', 'success');
  };

  const updateFoodStatus = (id: string, status: string) => {
    setFoodOrders((p: any[]) => p.map((o: any) => o.id === id ? { ...o, orderStatus: status } : o));
    showToast(`Order status → ${status}`, 'success');
  };

  const toggleCoupon = (code: string) => {
    setCoupons(p => p.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c));
    showToast('Coupon status toggled', 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons(p => p.filter(c => c.code !== code));
    showToast('Coupon deleted', 'success');
  };

  const addCoupon = () => {
    if (!newCouponCode.trim()) return;
    setCoupons(p => [...p, {
      id: `c_${Date.now()}`, code: newCouponCode.toUpperCase(),
      discountPercentage: newCouponDiscount, maxDiscount: 1000, minSpend: 500,
      validUntil: '2026-12-31', isActive: true
    }]);
    setNewCouponCode('');
    setShowAddCoupon(false);
    showToast('New coupon created!', 'success');
  };

  // ─── Status badge helper ───
  const statusColor = (s: string) => {
    const m: Record<string, string> = {
      placed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-amber-100 text-amber-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
    };
    return m[s] ?? 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-[#F7F4EB] pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="bg-white rounded-3xl border border-luxury-gold/30 shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0D3B29] text-luxury-gold flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#0D3B29]">Gona Admin Portal</h1>
              <p className="text-xs text-gray-500">Full control over Gona Hotel & Restaurant</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> System Online
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap flex items-center gap-2 transition-all border ${
                activeTab === id
                  ? 'bg-[#0D3B29] text-luxury-gold border-[#0D3B29] shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#0D3B29]/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* ──────────── ANALYTICS ──────────── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Total Revenue', value: `₹${totalRev.toLocaleString('en-IN')}`, sub: '+18.4% this month', color: 'text-[#0D3B29]' },
                { label: 'Room Revenue', value: `₹${roomRev.toLocaleString('en-IN')}`, sub: `${roomBookings.length} bookings`, color: 'text-luxury-gold' },
                { label: 'Food Revenue', value: `₹${foodRev.toLocaleString('en-IN')}`, sub: `${foodOrders.length} orders`, color: 'text-[#0D3B29]' },
              ].map(s => (
                <div key={s.label} className="p-6 rounded-3xl bg-white border border-luxury-gold/20 shadow-md">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
                  <h3 className={`font-serif text-3xl font-bold mt-1 ${s.color}`}>{s.value}</h3>
                  <p className="text-[11px] text-green-600 font-bold mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Total Rooms', value: rooms.length, icon: Hotel, color: 'bg-blue-50 text-blue-700' },
                { label: 'Menu Items', value: menuItems.length, icon: Utensils, color: 'bg-green-50 text-green-700' },
                { label: 'Active Coupons', value: coupons.filter(c => c.isActive).length, icon: Tag, color: 'bg-amber-50 text-amber-700' },
              ].map(s => (
                <div key={s.label} className={`p-6 rounded-3xl ${s.color} border border-current/10 shadow-md flex items-center gap-4`}>
                  <s.icon className="w-10 h-10 opacity-60" />
                  <div>
                    <p className="text-xs font-semibold opacity-70 uppercase">{s.label}</p>
                    <h3 className="font-serif text-4xl font-bold">{s.value}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────── ROOMS ──────────── */}
        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Hotel Rooms & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map(room => (
                <div key={room.id} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md">
                  <div className="flex items-center gap-4">
                    <img src={room.images[0]} alt={room.title} className="w-24 h-20 rounded-2xl object-cover shadow" />
                    <div className="flex-1">
                      <h4 className="font-serif text-lg font-bold text-[#0D3B29]">{room.title}</h4>
                      <p className="text-xs text-gray-500">{room.category} • Max {room.maxGuests} Guests • {room.sizeSqFt} sq ft</p>
                      <p className="text-xs text-gray-500 mt-0.5">{room.bedType}</p>

                      {editingRoomId === room.id ? (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-600">₹</span>
                          <input
                            type="number"
                            value={newPrice}
                            onChange={e => setNewPrice(Number(e.target.value))}
                            className="w-28 px-3 py-1.5 text-sm border border-luxury-gold rounded-lg focus:outline-none"
                          />
                          <button onClick={() => updateRoomPrice(room.id)}
                            className="px-3 py-1.5 bg-[#0D3B29] text-luxury-gold font-bold text-xs rounded-lg">
                            Save
                          </button>
                          <button onClick={() => setEditingRoomId(null)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="font-serif text-xl font-bold text-luxury-gold">₹{room.pricePerNight.toLocaleString('en-IN')}<span className="text-xs text-gray-400 font-normal"> /night</span></span>
                          <button onClick={() => { setEditingRoomId(room.id); setNewPrice(room.pricePerNight); }}
                            className="p-1.5 rounded-lg hover:bg-luxury-gold/10 text-gray-500 hover:text-luxury-gold transition">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" />
                    <span className="text-xs font-bold text-gray-700">{room.rating}</span>
                    <span className="text-xs text-gray-400">({room.reviewCount} reviews)</span>
                    <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {room.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────── ROOM BOOKINGS ──────────── */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Room Stay Bookings ({roomBookings.length})</h3>
            {roomBookings.map((b: any) => {
              const isCancelled = b.bookingStatus === 'cancelled';

              return (
                <div key={b.id} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={b.roomImage} alt={b.roomName} className="w-20 h-16 rounded-xl object-cover shadow" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#0D3B29] text-sm">{b.roomName}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCancelled ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800'
                          }`}>
                            {isCancelled ? 'CANCELLED' : b.bookingStatus.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-semibold">{b.userName} • <span className="text-gray-500">{b.userEmail}</span></p>
                        <p className="text-xs text-gray-500 mt-0.5">📅 {b.checkIn} → {b.checkOut} • {b.totalNights} nights • {b.guests.adults} adults</p>
                        {isCancelled && (
                          <p className="text-xs font-bold text-red-600 mt-1">
                            Refund Amount: ₹{b.refundAmount?.toLocaleString('en-IN')} • Fee Charged: ₹{b.cancellationFee?.toLocaleString('en-IN')} (Reason: {b.cancellationReason || 'User Cancellation'})
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1.5 flex-shrink-0">
                      <p className={`font-serif text-xl font-bold ${isCancelled ? 'text-gray-400 line-through' : 'text-[#0D3B29]'}`}>
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-gray-400">{b.invoiceId}</p>
                      <div className="flex gap-2 justify-end flex-wrap items-center">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusColor(b.paymentStatus)}`}>
                          {isCancelled ? 'REFUNDED' : b.paymentStatus.toUpperCase()}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedInvoice({
                              invoiceId: b.invoiceId || `INV-ROOM-${b.id}`,
                              title: `Room Stay: ${b.roomName}`,
                              type: 'room',
                              date: b.checkIn || new Date().toISOString(),
                              customerName: b.userName,
                              customerEmail: b.userEmail || 'guest@gonahotel.com',
                              customerPhone: b.userPhone || '+91 96966 31621',
                              paymentId: b.paymentId || 'PAY-ONLINE-UPI',
                              items: [
                                {
                                  description: `Room Stay: ${b.roomName} (${b.totalNights} Nights)`,
                                  quantity: b.totalNights,
                                  amount: b.totalAmount
                                }
                              ],
                              subtotal: Math.round(b.totalAmount / 1.05),
                              tax: Math.round(b.totalAmount - (b.totalAmount / 1.05)),
                              totalAmount: b.totalAmount
                            });
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-luxury-gold text-[#0D3B29] font-bold text-xs hover:bg-[#F3E5AB] transition shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" /> Print / Download GST Bill
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ──────────── MENU MANAGEMENT ──────────── */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Restaurant Menu ({menuItems.length} items)</h3>
            {(['Breakfast', 'Indian Main Course', 'Rice & Biryani', 'Chinese', 'South Indian', 'Snacks & Thali', 'Salad & Crispy', 'Beverages'] as const).map(cat => {
              const catItems = menuItems.filter(m => m.category === cat);
              if (!catItems.length) return null;
              return (
                <div key={cat}>
                  <h4 className="font-bold text-[#0D3B29] text-sm mb-2 px-1">{cat}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {catItems.map(item => (
                      <div key={item.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-16 h-14 rounded-xl object-cover shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0D3B29] text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                          <p className="font-serif font-bold text-luxury-gold">₹{item.price}</p>
                        </div>
                        <button
                          onClick={() => toggleMenuAvailability(item.id)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0 ${
                            item.isAvailable ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {item.isAvailable ? '✓ Available' : '✗ Hidden'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ──────────── FOOD ORDERS ──────────── */}
        {activeTab === 'food-orders' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Live Food Orders ({foodOrders.length})</h3>
            {foodOrders.map(o => (
              <div key={o.id} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#0D3B29] text-sm">Order #{o.id} — {o.userName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">📍 {o.deliveryAddress} • {o.orderType.replace('_', ' ').toUpperCase()}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {o.items.map(i => (
                        <div key={i.itemId} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                          <img src={i.image} alt={i.name} className="w-6 h-6 rounded object-cover" />
                          <span className="text-[11px] font-semibold text-gray-700">{i.name} ×{i.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right space-y-2 flex-shrink-0">
                    <p className="font-serif text-xl font-bold text-[#0D3B29]">₹{o.totalAmount}</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusColor(o.paymentStatus)}`}>
                      {o.paymentStatus.toUpperCase()}
                    </span>
                    <div className="mt-2 flex items-center justify-end gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedInvoice({
                            invoiceId: o.invoiceId || `INV-FOOD-${o.id}`,
                            title: `Gona Restaurant Food Order (${(o.orderType || 'delivery').toUpperCase()})`,
                            type: 'food',
                            date: o.createdAt || new Date().toISOString(),
                            customerName: o.userName,
                            customerEmail: o.userEmail || 'guest@gonahotel.com',
                            customerPhone: o.userPhone || '+91 96966 31621',
                            paymentId: o.paymentId || 'PAY-ONLINE-UPI',
                            items: o.items.map((i: any) => ({
                              description: i.name,
                              quantity: i.quantity,
                              amount: i.price * i.quantity
                            })),
                            subtotal: o.subtotal || Math.round(o.totalAmount / 1.05),
                            tax: o.tax || Math.round(o.totalAmount - (o.totalAmount / 1.05)),
                            totalAmount: o.totalAmount
                          });
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-luxury-gold text-[#0D3B29] font-bold text-xs hover:bg-[#F3E5AB] transition shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print / Download GST Bill
                      </button>
                      <select
                        value={o.orderStatus}
                        onChange={e => updateFoodStatus(o.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-[#0D3B29] text-white font-bold text-xs"
                      >
                        <option value="placed">Placed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="completed">Completed ✓</option>
                        <option value="cancelled">Cancelled ✗</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ──────────── COUPONS ──────────── */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Promo Coupons</h3>
              <button onClick={() => setShowAddCoupon(!showAddCoupon)}
                className="px-4 py-2 rounded-xl bg-[#0D3B29] text-luxury-gold font-bold text-xs flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Coupon
              </button>
            </div>

            {showAddCoupon && (
              <div className="p-5 rounded-2xl bg-white border border-luxury-gold/40 shadow-md flex flex-col md:flex-row gap-3 items-end">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Coupon Code</label>
                  <input value={newCouponCode} onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DIWALI30"
                    className="px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono uppercase focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Discount %</label>
                  <input type="number" min={1} max={90} value={newCouponDiscount} onChange={e => setNewCouponDiscount(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-xl text-sm w-20 focus:outline-none focus:border-luxury-gold" />
                </div>
                <button onClick={addCoupon} className="px-5 py-2 bg-luxury-gold text-[#0D3B29] font-bold text-xs rounded-xl">
                  Create
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map(c => (
                <div key={c.code} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md flex items-center justify-between gap-4">
                  <div>
                    <span className="font-serif text-2xl font-bold text-luxury-gold">{c.code}</span>
                    <p className="text-xs text-gray-600 mt-0.5">{c.discountPercentage}% OFF — up to ₹{c.maxDiscount}</p>
                    <p className="text-[11px] text-gray-400">Min. spend ₹{c.minSpend} • Expires {c.validUntil}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleCoupon(c.code)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Active' : 'Off'}
                    </button>
                    <button onClick={() => deleteCoupon(c.code)} className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────── CUSTOMERS ──────────── */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Registered Customers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialSeedData.users.map(u => (
                <div key={u.id} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md flex items-center gap-4">
                  <img src={u.avatar} alt={u.name} className="w-16 h-16 rounded-full object-cover border-2 border-luxury-gold/30 shadow" />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-[#0D3B29]">{u.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {u.email}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {u.phone}</p>
                    <span className={`mt-1.5 inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right text-xs text-gray-500 flex-shrink-0">
                    <p className="font-bold">{u.wishlist.rooms.length} <span className="font-normal">saved rooms</span></p>
                    <p className="font-bold mt-0.5">{u.wishlist.food.length} <span className="font-normal">saved dishes</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Invoice Modal for Admin Print / Download */}
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
