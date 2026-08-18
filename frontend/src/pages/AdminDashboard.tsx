import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Hotel, Utensils, Tag, Users, ShieldCheck,
  Edit3, CheckCircle2, TrendingUp, Lock, Plus, Trash2, XCircle,
  ShoppingBag, Star, Calendar, Phone, Mail, Printer, Clock, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { apiService } from '../services/api';

type AdminTab = 'analytics' | 'payments' | 'rooms' | 'bookings' | 'menu' | 'food-orders' | 'farm-bookings' | 'coupons' | 'customers';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [analytics, setAnalytics] = useState<any>(null);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomBookings, setRoomBookings] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [foodOrders, setFoodOrders] = useState<any[]>([]);
  const [farmBookings, setFarmBookings] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        analyticsRes,
        pendingRes,
        roomsRes,
        roomBookingsRes,
        menuRes,
        foodOrdersRes,
        farmRes,
        couponsRes,
        customersRes
      ] = await Promise.all([
        apiService.getAdminAnalytics(),
        apiService.getPendingPaymentsAdmin(),
        apiService.getRooms(),
        apiService.getAllRoomBookingsAdmin(),
        apiService.getMenu(),
        apiService.getAllFoodOrdersAdmin(),
        apiService.getAllFarmBookingsAdmin(),
        apiService.getCouponsAdmin(),
        apiService.getCustomersAdmin()
      ]);

      if (analyticsRes.status === 200) setAnalytics(analyticsRes.data);
      if (pendingRes.status === 200) setPendingPayments(pendingRes.data || []);
      if (roomsRes.status === 200) setRooms(roomsRes.data || []);
      if (roomBookingsRes.status === 200) setRoomBookings(roomBookingsRes.data || []);
      if (menuRes.status === 200) setMenuItems(menuRes.data || []);
      if (foodOrdersRes.status === 200) setFoodOrders(foodOrdersRes.data || []);
      if (farmRes.status === 200) setFarmBookings(farmRes.data || []);
      if (couponsRes.status === 200) setCoupons(couponsRes.data || []);
      if (customersRes.status === 200) setCustomers(customersRes.data || []);
    } catch (err) {
      console.warn('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F7F4EB] pt-32 flex flex-col items-center justify-center gap-4 text-center px-6">
        <Lock className="w-16 h-16 text-red-500" />
        <h2 className="font-serif text-3xl font-bold text-[#0D3B29]">Admin Portal Restricted</h2>
        <p className="text-gray-600">Please sign in with your <strong>Administrator Account</strong> to access the admin dashboard.</p>
      </div>
    );
  }

  // Handle Verify Payment Action
  const handleVerifyPayment = async (txnId: string, bType?: string) => {
    try {
      const res = await apiService.verifyOrRejectPaymentAdmin(txnId, { action: 'verify', bookingType: bType });
      if (res.status === 200) {
        showToast(res.data.message || 'Payment verified and booking confirmed!', 'success');
        loadData();
      } else {
        showToast(res.data.message || 'Failed to verify payment', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error verifying payment', 'error');
    }
  };

  // Handle Reject Payment Action
  const handleRejectPayment = async (txnId: string, bType?: string) => {
    const reason = rejectionReason[txnId] || 'Invalid UTR or payment not received in bank account';
    try {
      const res = await apiService.verifyOrRejectPaymentAdmin(txnId, { action: 'reject', rejectionReason: reason, bookingType: bType });
      if (res.status === 200) {
        showToast(res.data.message || 'Payment rejected.', 'info');
        loadData();
      } else {
        showToast(res.data.message || 'Failed to reject payment', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error rejecting payment', 'error');
    }
  };

  const updateFoodStatus = async (id: string, status: string) => {
    try {
      await apiService.updateFoodOrderStatusAdmin(id, { orderStatus: status });
      setFoodOrders(prev => prev.map(o => o.orderId === id || o.id === id ? { ...o, orderStatus: status } : o));
      showToast(`Order status updated to ${status}`, 'success');
    } catch (err) {
      showToast('Failed to update food order status', 'error');
    }
  };

  const updateRoomBookingStatus = async (id: string, bookingStatus: string) => {
    try {
      await apiService.updateRoomBookingStatusAdmin(id, { bookingStatus });
      setRoomBookings(prev => prev.map(b => b.bookingId === id || b.id === id ? { ...b, bookingStatus } : b));
      showToast(`Booking status updated to ${bookingStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update booking status', 'error');
    }
  };

  const handleUpdateRoom = async (roomId: string, updatedFields: Partial<any>) => {
    try {
      const res = await apiService.updateRoomAdmin(roomId, updatedFields);
      if ((res.status === 200 || res.ok) && res.data) {
        showToast('Room details updated & saved to database!', 'success');
        const updatedRoom = res.data;
        setRooms(prev => prev.map(r => 
          (r._id === roomId || r.id === roomId || r.slug === roomId || r.title === updatedRoom.title) 
            ? { ...r, ...updatedRoom, ...updatedFields } 
            : r
        ));
      } else {
        showToast(res.data?.message || 'Failed to update room', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating room', 'error');
    }
  };

  const handleDeleteCustomer = async (userId: string, userName: string, userEmail: string) => {
    const confirmText = `Are you sure you want to permanently delete user "${userName}" (${userEmail})?\n\n⚠️ WARNING: This will permanently wipe all of their room bookings, food orders, farm bookings, and transactions from the database!`;
    if (!window.confirm(confirmText)) return;

    try {
      const res = await apiService.deleteCustomerAdmin(userId);
      if (res.status === 200 || res.data?.success) {
        showToast(res.data?.message || `User "${userName}" and all data deleted permanently!`, 'success');
        
        // Remove customer from local state
        setCustomers(prev => prev.filter(u => u.id !== userId && u._id !== userId && u.email !== userEmail));

        // Cascade cleanup in local state
        setRoomBookings(prev => prev.filter(b => b.userId !== userId && b.userEmail !== userEmail));
        setFoodOrders(prev => prev.filter(o => o.userId !== userId && o.userEmail !== userEmail));
        setFarmBookings(prev => prev.filter(f => f.userId !== userId && f.userEmail !== userEmail));
        setPendingPayments(prev => prev.filter(p => p.userId !== userId && p.userEmail !== userEmail));
      } else {
        showToast(res.data?.message || 'Failed to delete user', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting user', 'error');
    }
  };

  // Food Menu Handlers
  const handleToggleFoodAvailability = async (itemKey: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const res = await apiService.updateMenuItemAdmin(itemKey, { isAvailable: newStatus });
      if (res.status === 200 || res.ok) {
        showToast(`Item set to ${newStatus ? 'Available' : 'Sold Out / Unavailable'}`, 'success');
        setMenuItems(prev => prev.map(m => (m._id === itemKey || m.id === itemKey || m.name === itemKey) ? { ...m, isAvailable: newStatus } : m));
      } else {
        showToast(res.data?.message || 'Failed to update item availability', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating item availability', 'error');
    }
  };

  const handleUpdateFoodPrice = async (itemKey: string, price: number) => {
    try {
      const res = await apiService.updateMenuItemAdmin(itemKey, { price });
      if (res.status === 200 || res.ok) {
        showToast('Dish price updated & saved to database!', 'success');
        setMenuItems(prev => prev.map(m => (m._id === itemKey || m.id === itemKey || m.name === itemKey) ? { ...m, price } : m));
      } else {
        showToast(res.data?.message || 'Failed to update dish price', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating dish price', 'error');
    }
  };

  const handleDeleteMenuItem = async (itemKey: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete dish "${name}" from the menu?`)) return;

    try {
      const res = await apiService.deleteMenuItemAdmin(itemKey);
      if (res.status === 200 || res.ok) {
        showToast(`Dish "${name}" deleted from menu!`, 'success');
        setMenuItems(prev => prev.filter(m => m._id !== itemKey && m.id !== itemKey && m.name !== name));
      } else {
        showToast(res.data?.message || 'Failed to delete dish', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting dish', 'error');
    }
  };

  // Coupon Handlers
  const handleToggleCouponStatus = async (couponKey: string, currentStatus: boolean) => {
    try {
      const res = await apiService.toggleCouponActiveAdmin(couponKey);
      if (res.status === 200 || res.ok) {
        const updated = res.data;
        showToast(`Coupon status set to ${updated?.isActive ? 'Active' : 'Deactivated'}`, 'success');
        setCoupons(prev => prev.map(c => (c._id === couponKey || c.code === couponKey || c.id === couponKey) ? { ...c, isActive: updated?.isActive ?? !currentStatus } : c));
      } else {
        showToast(res.data?.message || 'Failed to toggle coupon status', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error toggling coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (couponKey: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete promo coupon "${code}"?`)) return;

    try {
      const res = await apiService.deleteCouponAdmin(couponKey);
      if (res.status === 200 || res.ok) {
        showToast(`Coupon "${code}" deleted successfully!`, 'success');
        setCoupons(prev => prev.filter(c => c._id !== couponKey && c.code !== couponKey && c.id !== couponKey));
      } else {
        showToast(res.data?.message || 'Failed to delete coupon', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting coupon', 'error');
    }
  };






  const pendingSubmissions = pendingPayments.filter(p => p.status === 'PAYMENT_SUBMITTED');

  const tabs: { id: AdminTab; label: string; icon: React.FC<any>; count?: number }[] = [
    { id: 'analytics',     label: 'Overview',            icon: TrendingUp },
    { id: 'payments',      label: 'Payment Verification', icon: ShieldCheck, count: pendingSubmissions.length },
    { id: 'rooms',         label: 'Rooms',               icon: Hotel },
    { id: 'bookings',      label: 'Room Bookings',       icon: Calendar, count: roomBookings.length },
    { id: 'menu',          label: 'Restaurant Menu',     icon: Utensils },
    { id: 'food-orders',   label: 'Food Orders',         icon: ShoppingBag, count: foodOrders.length },
    { id: 'farm-bookings', label: 'Farm House Bookings', icon: Hotel, count: farmBookings.length },
    { id: 'coupons',       label: 'Coupons',             icon: Tag },
    { id: 'customers',     label: 'Customers',           icon: Users, count: customers.length },
  ];

  const metrics = analytics?.metrics || {
    totalRevenue: roomBookings.filter(b => b.paymentStatus === 'VERIFIED' || b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0) +
                  foodOrders.filter(o => o.paymentStatus === 'VERIFIED' || o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0),
    roomRevenue: roomBookings.filter(b => b.paymentStatus === 'VERIFIED' || b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0),
    foodRevenue: foodOrders.filter(o => o.paymentStatus === 'VERIFIED' || o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0),
    farmRevenue: farmBookings.filter(f => f.paymentStatus === 'VERIFIED' || f.paymentStatus === 'paid').reduce((s, f) => s + f.totalAmount, 0)
  };

  const statusColor = (s: string) => {
    const m: Record<string, string> = {
      placed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-amber-100 text-amber-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      confirmed: 'bg-green-100 text-green-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      VERIFIED: 'bg-green-100 text-green-800 border border-green-300',
      PAYMENT_SUBMITTED: 'bg-amber-100 text-amber-800 border border-amber-300',
      PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800 border border-red-300',
      PAYMENT_REJECTED: 'bg-red-100 text-red-800 border border-red-300'
    };
    return m[s] ?? 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-[#F7F4EB] pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="bg-white rounded-3xl border border-luxury-gold/30 shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0D3B29] text-luxury-gold flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#0D3B29]">Gona Admin Portal</h1>
              <p className="text-xs text-gray-500">Live Management & Banking UTR Verification Desk</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
            </button>

            <span className="px-3.5 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center gap-1.5 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Production Backend Connected
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map(({ id, label, icon: Icon, count }) => (
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
              {count !== undefined && count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  id === 'payments' ? 'bg-amber-400 text-amber-950 animate-pulse' : 'bg-luxury-gold/20 text-luxury-gold'
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ──────────── ANALYTICS ──────────── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Verified Paid Revenue', value: `₹${(metrics.totalRevenue || 0).toLocaleString('en-IN')}`, sub: 'Only verified payments count as revenue', color: 'text-[#0D3B29]' },
                { label: 'Room Revenue', value: `₹${(metrics.roomRevenue || 0).toLocaleString('en-IN')}`, sub: `${roomBookings.length} total bookings`, color: 'text-luxury-gold' },
                { label: 'Food Revenue', value: `₹${(metrics.foodRevenue || 0).toLocaleString('en-IN')}`, sub: `${foodOrders.length} food orders`, color: 'text-[#0D3B29]' },
              ].map(s => (
                <div key={s.label} className="p-6 rounded-3xl bg-white border border-luxury-gold/20 shadow-md">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
                  <h3 className={`font-serif text-3xl font-bold mt-1 ${s.color}`}>{s.value}</h3>
                  <p className="text-[11px] text-green-600 font-bold mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { label: 'Pending Payment Verification', value: pendingSubmissions.length, icon: Clock, color: 'bg-amber-50 text-amber-800 border-amber-200' },
                { label: 'Total Rooms', value: rooms.length, icon: Hotel, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: 'Menu Items', value: menuItems.length, icon: Utensils, color: 'bg-green-50 text-green-700 border-green-200' },
                { label: 'Registered Customers', value: customers.length, icon: Users, color: 'bg-purple-50 text-purple-700 border-purple-200' },
              ].map(s => (
                <div key={s.label} className={`p-5 rounded-3xl ${s.color} border shadow-sm flex items-center gap-4`}>
                  <s.icon className="w-8 h-8 opacity-70 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold opacity-80 uppercase">{s.label}</p>
                    <h3 className="font-serif text-3xl font-bold">{s.value}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────── PAYMENT VERIFICATION SECTION ──────────── */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Client UPI Payment Verification Desk</h3>
                <p className="text-xs text-gray-500">Match customer UTR numbers against your Punjab National Bank / UPI app statement</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                {pendingPayments.length} Total Submission(s)
              </span>
            </div>

            {pendingPayments.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
                <ShieldCheck className="w-12 h-12 text-green-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#0D3B29]">No Pending Payment Submissions</h4>
                <p className="text-xs text-gray-500">All submitted UTR numbers have been verified or resolved.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map((txn: any) => {
                  const isPending = txn.status === 'PAYMENT_SUBMITTED';
                  const isVerified = txn.status === 'VERIFIED';
                  const isRejected = txn.status === 'REJECTED';

                  return (
                    <div key={txn.transactionId || txn._id} className="p-6 rounded-3xl bg-white border border-luxury-gold/30 shadow-md space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#0D3B29]">
                              Transaction Ref: {txn.transactionId || txn.utrNumber}
                            </span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${statusColor(txn.status)}`}>
                              {txn.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Type: <strong className="uppercase">{txn.bookingType}</strong> • Related ID: <strong>{txn.bookingId || txn.orderId}</strong>
                          </p>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(txn.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-serif text-2xl font-bold text-luxury-gold block">
                            ₹{txn.amount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-500">Expected Bank Credit</span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-amber-50/60 p-4 rounded-2xl border border-luxury-gold/20">
                        <div>
                          <span className="text-gray-500 font-bold block uppercase text-[10px]">Customer Details</span>
                          <p className="font-bold text-gray-900">{txn.userName}</p>
                          <p className="text-gray-600">{txn.userEmail}</p>
                          {txn.userPhone && <p className="text-gray-600">Ph: {txn.userPhone}</p>}
                        </div>

                        <div>
                          <span className="text-gray-500 font-bold block uppercase text-[10px]">Payment Proof Details</span>
                          <p className="font-mono font-bold text-[#0D3B29] text-sm">UTR: {txn.utrNumber}</p>
                          <p className="text-gray-600">Payer: {txn.payerName || 'Not specified'}</p>
                          <p className="text-gray-600">Method: {txn.method || 'UPI_QR'}</p>
                        </div>

                        <div>
                          <span className="text-gray-500 font-bold block uppercase text-[10px]">Verification Action</span>
                          {isVerified && (
                            <p className="text-green-700 font-bold flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-4 h-4" /> Verified by {txn.verifiedBy || 'Admin'}
                            </p>
                          )}
                          {isRejected && (
                            <p className="text-red-700 font-bold flex items-center gap-1 mt-1">
                              <XCircle className="w-4 h-4" /> Rejected ({txn.rejectionReason})
                            </p>
                          )}
                          {isPending && (
                            <p className="text-amber-800 font-bold flex items-center gap-1 mt-1">
                              <Clock className="w-4 h-4" /> Awaiting Bank Match Confirmation
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Admin Decision Actions */}
                      {isPending && (
                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                          <button
                            onClick={() => handleVerifyPayment(txn.transactionId || txn.utrNumber, txn.bookingType)}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition"
                          >
                            <CheckCircle2 className="w-4 h-4" /> VERIFY PAYMENT (Confirm Stay/Order)
                          </button>

                          <div className="flex-1 flex gap-2 w-full">
                            <input
                              type="text"
                              placeholder="Rejection reason (e.g. UTR not found in PNB statement)"
                              value={rejectionReason[txn.transactionId || txn.utrNumber] || ''}
                              onChange={e => setRejectionReason({ ...rejectionReason, [txn.transactionId || txn.utrNumber]: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-red-500"
                            />
                            <button
                              onClick={() => handleRejectPayment(txn.transactionId || txn.utrNumber, txn.bookingType)}
                              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition shrink-0"
                            >
                              <XCircle className="w-4 h-4" /> REJECT PAYMENT
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ──────────── ROOMS ──────────── */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Hotel Rooms, Inventory & Rates</h3>
                <p className="text-xs text-gray-500">Update nightly prices, guest capacities, and room availability status</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-luxury-gold/20 text-[#0D3B29] text-xs font-bold shrink-0">
                {rooms.length} Room Categories Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room: any) => {
                const roomKey = room._id || room.id || room.slug;
                const isEditingThis = editingRoomId === roomKey;

                return (
                  <div key={roomKey} className="p-6 rounded-3xl bg-white border border-luxury-gold/30 shadow-md space-y-4">
                    <div className="flex items-start gap-4">
                      <img src={room.images?.[0]} alt={room.title} className="w-24 h-24 rounded-2xl object-cover shadow shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-serif text-lg font-bold text-[#0D3B29] truncate">{room.title}</h4>
                          <button
                            onClick={() => {
                              if (isEditingThis) {
                                setEditingRoomId(null);
                              } else {
                                setEditingRoomId(roomKey);
                                setNewPrice(room.pricePerNight || 0);
                              }
                            }}
                            className="p-1.5 rounded-full hover:bg-gray-100 text-luxury-gold transition shrink-0"
                            title="Edit Room Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">{room.category} • {room.bedType}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-serif text-2xl font-bold text-luxury-gold">
                            ₹{room.pricePerNight?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-400">/ night</span>
                        </div>
                      </div>
                    </div>

                    {/* Room Quick Controls & Inventory Inputs */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-luxury-cream/50 rounded-2xl border border-luxury-gold/20 text-xs">
                      <div>
                        <span className="text-gray-500 font-bold block text-[10px] uppercase">Price / Night (₹)</span>
                        <input
                          type="number"
                          value={isEditingThis ? newPrice : room.pricePerNight}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setNewPrice(val);
                            if (!isEditingThis) setEditingRoomId(roomKey);
                          }}
                          className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-gray-300 font-bold text-[#0D3B29] bg-white focus:outline-none focus:border-luxury-gold text-xs"
                        />
                      </div>

                      <div>
                        <span className="text-gray-500 font-bold block text-[10px] uppercase">Available Rooms</span>
                        <input
                          type="number"
                          value={room.availableCount ?? 5}
                          onChange={(e) => handleUpdateRoom(roomKey, { availableCount: Number(e.target.value) })}
                          className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-gray-300 font-bold text-[#0D3B29] bg-white focus:outline-none focus:border-luxury-gold text-xs"
                        />
                      </div>

                      <div>
                        <span className="text-gray-500 font-bold block text-[10px] uppercase">Max Guests</span>
                        <input
                          type="number"
                          value={room.maxGuests}
                          onChange={(e) => handleUpdateRoom(roomKey, { maxGuests: Number(e.target.value) })}
                          className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-gray-300 font-bold text-[#0D3B29] bg-white focus:outline-none focus:border-luxury-gold text-xs"
                        />
                      </div>
                    </div>

                    {/* Save Price & Availability Toggle */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        onClick={() => handleUpdateRoom(roomKey, { isAvailable: !room.isAvailable })}
                        className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                          room.isAvailable ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {room.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {room.isAvailable ? 'Status: Available' : 'Status: Booked / Offline'}
                      </button>

                      {isEditingThis && (
                        <button
                          onClick={() => {
                            handleUpdateRoom(roomKey, { pricePerNight: newPrice });
                            setEditingRoomId(null);
                          }}
                          className="px-5 py-2 rounded-full bg-[#0D3B29] hover:bg-luxury-emerald text-white font-bold text-xs shadow-md transition cursor-pointer"
                        >
                          Save Price Update
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* ──────────── ROOM BOOKINGS ──────────── */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Room Stay Bookings ({roomBookings.length})</h3>
            {roomBookings.map((b: any) => (
              <div key={b._id || b.bookingId || b.id} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={b.roomImage} alt={b.roomName} className="w-20 h-16 rounded-xl object-cover shadow" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#0D3B29] text-sm">{b.roomName}</p>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusColor(b.bookingStatus)}`}>
                          {b.bookingStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-semibold">{b.userName} • <span className="text-gray-500">{b.userEmail}</span></p>
                      <p className="text-xs text-gray-500 mt-0.5">📅 {b.checkIn} → {b.checkOut} • {b.nights || b.totalNights} night(s) • UTR: {b.utrNumber || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="text-right space-y-1.5 flex-shrink-0">
                    <p className="font-serif text-xl font-bold text-[#0D3B29]">₹{b.totalAmount?.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-gray-400">{b.invoiceId}</p>
                    <div className="flex gap-2 justify-end flex-wrap items-center">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusColor(b.paymentStatus)}`}>
                        {b.paymentStatus}
                      </span>
                      <button
                        onClick={() => setSelectedInvoice({
                          invoiceId: b.invoiceId || `INV-ROOM-${b.bookingId || b.id}`,
                          title: `Room Stay: ${b.roomName}`,
                          type: 'room',
                          date: b.createdAt || b.checkIn,
                          customerName: b.userName,
                          customerEmail: b.userEmail,
                          customerPhone: b.userPhone,
                          utrNumber: b.utrNumber,
                          paymentStatus: b.paymentStatus,
                          items: [{ description: `Room Stay: ${b.roomName} (${b.nights || b.totalNights} Nights)`, quantity: b.nights || b.totalNights, amount: b.totalAmount }],
                          subtotal: b.subtotal || b.totalAmount,
                          tax: b.tax || 0,
                          totalAmount: b.totalAmount
                        })}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-luxury-gold text-[#0D3B29] font-bold text-xs hover:bg-[#F3E5AB] transition shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" /> GST Bill
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ──────────── RESTAURANT MENU ──────────── */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Restaurant Food Menu ({menuItems.length} items)</h3>
                <p className="text-xs text-gray-500">Toggle dish availability, update prices, or add/delete items on live restaurant menu</p>
              </div>

              <button
                onClick={async () => {
                  const name = prompt('Enter new dish name (e.g. Special Butter Paneer):');
                  if (!name) return;
                  const priceStr = prompt('Enter dish price (₹):', '150');
                  if (!priceStr) return;
                  const category = prompt('Enter category (e.g. Indian Main Course, Breakfast, Chinese, Beverages):', 'Indian Main Course') || 'Indian Main Course';

                  try {
                    const res = await apiService.createMenuItemAdmin({
                      name,
                      price: Number(priceStr) || 150,
                      category,
                      description: `${name} prepared fresh by Gona Hotel chefs.`,
                      isVeg: true,
                      isAvailable: true
                    });
                    if (res.status === 201 && res.data) {
                      showToast(`Dish "${name}" added to menu!`, 'success');
                      setMenuItems(prev => [...prev, res.data]);
                    }
                  } catch (err: any) {
                    showToast('Failed to add dish', 'error');
                  }
                }}
                className="px-4 py-2.5 rounded-2xl bg-[#0D3B29] text-white hover:bg-luxury-emerald font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-luxury-gold" /> Add New Dish
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item: any) => {
                const itemKey = item._id || item.id || item.name;
                const isAvailable = item.isAvailable !== false;

                return (
                  <div key={itemKey} className="p-5 bg-white rounded-3xl border border-gray-200 shadow-md space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.isVeg ? 'bg-green-50 border-green-600 text-green-700' : 'bg-red-50 border-red-600 text-red-700'}`}>
                          {item.isVeg ? 'PURE VEG' : 'NON VEG'}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-500">{item.category}</span>
                      </div>

                      <h4 className="font-serif font-bold text-[#0D3B29] text-base leading-snug">{item.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-gray-500">₹</span>
                          <input
                            type="number"
                            defaultValue={item.price}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              if (val > 0 && val !== item.price) {
                                handleUpdateFoodPrice(itemKey, val);
                              }
                            }}
                            className="w-20 px-2 py-1 rounded-lg border border-gray-300 font-bold text-[#0D3B29] bg-white focus:outline-none focus:border-luxury-gold text-xs"
                          />
                        </div>

                        {/* Availability Toggle */}
                        <button
                          onClick={() => handleToggleFoodAvailability(itemKey, isAvailable)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                            isAvailable ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {isAvailable ? 'Available' : 'Sold Out'}
                        </button>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleDeleteMenuItem(itemKey, item.name)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 p-1 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Dish
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* ──────────── FOOD ORDERS ──────────── */}
        {activeTab === 'food-orders' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Live Food Orders ({foodOrders.length})</h3>
            {foodOrders.map((o: any) => (
              <div key={o._id || o.orderId || o.id} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#0D3B29] text-sm">Order #{o.orderId || o.id} — {o.userName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">📍 {o.deliveryAddress || o.tableNumber} • {(o.orderType || 'delivery').toUpperCase()}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {o.items?.map((i: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                          <span className="text-[11px] font-semibold text-gray-700">{i.name} ×{i.quantity} (₹{i.price * i.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right space-y-2 flex-shrink-0">
                    <p className="font-serif text-xl font-bold text-[#0D3B29]">₹{o.totalAmount}</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusColor(o.paymentStatus)}`}>
                      {o.paymentStatus}
                    </span>
                    <div className="mt-2 flex items-center justify-end gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedInvoice({
                          invoiceId: o.invoiceId || `INV-FOOD-${o.orderId || o.id}`,
                          title: `Gona Restaurant Food Order (${(o.orderType || 'delivery').toUpperCase()})`,
                          type: 'food',
                          date: o.createdAt,
                          customerName: o.userName,
                          customerEmail: o.userEmail,
                          customerPhone: o.userPhone,
                          utrNumber: o.utrNumber,
                          paymentStatus: o.paymentStatus,
                          items: o.items?.map((i: any) => ({ description: i.name, quantity: i.quantity, amount: i.price * i.quantity })),
                          subtotal: o.subtotal,
                          tax: o.tax,
                          discount: o.discount,
                          totalAmount: o.totalAmount
                        })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-luxury-gold text-[#0D3B29] font-bold text-xs hover:bg-[#F3E5AB] transition shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" /> GST Bill
                      </button>
                      <select
                        value={o.orderStatus}
                        onChange={e => updateFoodStatus(o.orderId || o.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-[#0D3B29] text-white font-bold text-xs"
                      >
                        <option value="PENDING_PAYMENT">Pending Payment</option>
                        <option value="PAYMENT_SUBMITTED">Payment Submitted</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="READY">Ready</option>
                        <option value="COMPLETED">Completed ✓</option>
                        <option value="CANCELLED">Cancelled ✗</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ──────────── FARM BOOKINGS ──────────── */}
        {activeTab === 'farm-bookings' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Farm House Reservations ({farmBookings.length})</h3>
            {farmBookings.map((f: any) => (
              <div key={f._id || f.bookingId || f.id} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#0D3B29] text-sm">{f.packageType}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor(f.status)}`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold">{f.userName} • {f.userEmail} • {f.userPhone}</p>
                  <p className="text-xs text-gray-500 mt-0.5">📅 Date: {f.visitDate} • {f.visitorCount} Guests • UTR: {f.utrNumber || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl font-bold text-luxury-gold">₹{f.totalAmount?.toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor(f.paymentStatus)}`}>
                    {f.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ──────────── COUPONS ──────────── */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Discount Promo Coupons ({coupons.length})</h3>
                <p className="text-xs text-gray-500">Create new promo codes, activate/deactivate discounts, or delete expired coupons</p>
              </div>

              <button
                onClick={async () => {
                  const code = prompt('Enter Coupon Code (e.g. FESTIVE25):');
                  if (!code) return;
                  const pct = prompt('Enter Discount Percentage (%):', '20');
                  if (!pct) return;
                  const maxDisc = prompt('Enter Max Discount Amount (₹):', '500');
                  const minSp = prompt('Enter Minimum Spend Amount (₹):', '1000');

                  try {
                    const res = await apiService.addCouponAdmin({
                      code: code.toUpperCase(),
                      discountPercentage: Number(pct) || 10,
                      maxDiscount: Number(maxDisc) || 500,
                      minSpend: Number(minSp) || 0,
                      validUntil: '2026-12-31',
                      isActive: true
                    });
                    if ((res.status === 201 || res.status === 200) && res.data) {
                      showToast(`Coupon "${code.toUpperCase()}" created successfully!`, 'success');
                      setCoupons(prev => [...prev, res.data]);
                    }
                  } catch (err: any) {
                    showToast('Failed to create coupon', 'error');
                  }
                }}
                className="px-4 py-2.5 rounded-2xl bg-[#0D3B29] text-white hover:bg-luxury-emerald font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-luxury-gold" /> Create New Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((c: any) => {
                const couponKey = c._id || c.code || c.id;

                return (
                  <div key={couponKey} className="p-6 rounded-3xl bg-white border border-luxury-gold/30 shadow-md space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif text-2xl font-bold text-luxury-gold tracking-wider">{c.code}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                          {c.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-[#0D3B29]">{c.discountPercentage}% OFF Discount</p>
                      <p className="text-xs text-gray-500">Max Savings: ₹{c.maxDiscount} • Min Spend: ₹{c.minSpend || 0}</p>
                      <p className="text-xs text-gray-400">Valid Until: {c.validUntil || '2026-12-31'}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleToggleCouponStatus(couponKey, c.isActive)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                          c.isActive ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-green-100 text-green-800 border border-green-300'
                        }`}
                      >
                        {c.isActive ? 'Deactivate' : 'Activate Coupon'}
                      </button>

                      <button
                        onClick={() => handleDeleteCoupon(couponKey, c.code)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer text-xs font-bold flex items-center gap-1"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* ──────────── CUSTOMERS ──────────── */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Registered User Database ({customers.length})</h3>
                <p className="text-xs text-gray-500">Manage registered users, review profiles, or delete accounts with full cascade cleanup</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customers.map((u: any) => {
                const customerId = u.id || u._id;
                const isUserAdmin = u.role === 'admin';

                return (
                  <div key={customerId} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-14 h-14 rounded-full bg-[#0D3B29] text-luxury-gold font-serif text-xl font-bold flex items-center justify-center border-2 border-luxury-gold shrink-0">
                        {u.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-serif font-bold text-[#0D3B29] truncate">{u.name}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isUserAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {u.role?.toUpperCase() || 'USER'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate"><Mail className="w-3 h-3 text-gray-400 shrink-0" /> {u.email}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-gray-400 shrink-0" /> {u.phone || 'N/A'}</p>
                      </div>
                    </div>

                    {!isUserAdmin && (
                      <button
                        onClick={() => handleDeleteCustomer(customerId, u.name, u.email)}
                        className="p-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
                        title="Delete User & Clean Database Records"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete User</span>
                      </button>
                    )}
                  </div>
                );
              })}
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
