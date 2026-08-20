import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Lock, ArrowLeft, Ticket, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { PaymentModal } from '../components/PaymentModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';

export const FarmBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [visitDate, setVisitDate] = useState('2026-08-15');
  const [guestCount, setGuestCount] = useState(4);
  const [packageType, setPackageType] = useState(searchParams.get('package') || 'Full Farm House Overnight Stay');
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<any>(null);

  const packageRates: Record<string, number> = {
    'Full Farm House Overnight Stay': 18000,
    'Day Pool & Lawn Picnic Package': 6500,
    'Night Bonfire & BBQ Party': 8500,
    'Private Celebration & Birthday Lawn': 12500
  };

  const subtotal = packageRates[packageType] || 18000;
  const tax = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + tax;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to reserve the farm house', 'info');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.createFarmBooking({
        visitDate,
        visitorCount: guestCount,
        packageType,
        userName: userName || user?.name,
        userEmail: userEmail || user?.email,
        userPhone: userPhone || user?.phone,
        specialRequests
      });

      if (res.status === 201 && res.data?.booking) {
        setPendingBooking(res.data.booking);
        setIsPaymentOpen(true);
      } else {
        showToast(res.data?.message || 'Failed to reserve farm house', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error creating farm booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentRefId: string, utrNumber?: string) => {
    setIsPaymentOpen(false);

    const invoiceData = {
      invoiceId: pendingBooking?.invoiceId || ('INV-FH-' + Date.now().toString().slice(-6)),
      title: `Gona Private Farm House Reservation (${packageType})`,
      type: 'farm' as const,
      date: new Date().toISOString(),
      customerName: userName || user?.name || '',
      customerEmail: userEmail || user?.email || '',
      customerPhone: userPhone || user?.phone || '',
      paymentId: paymentRefId,
      utrNumber: utrNumber || paymentRefId,
      paymentStatus: 'PAYMENT_SUBMITTED',
      items: [
        {
          description: `${packageType} for ${guestCount} Guest(s) on ${visitDate}`,
          quantity: 1,
          amount: pendingBooking?.subtotal || subtotal
        }
      ],
      subtotal: pendingBooking?.subtotal || subtotal,
      tax: pendingBooking?.tax || tax,
      totalAmount: pendingBooking?.totalAmount || totalAmount
    };

    setConfirmedTicket({
      id: pendingBooking?.bookingId || ('fh_' + Date.now()),
      paymentId: paymentRefId,
      invoiceData
    });

    showToast('Farm House reservation submitted for verification! Invoice ready.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian pt-28 pb-24">
      <SEO noindex title="Farm House Booking | Gona Hotel" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link to="/farm" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D3B29] hover:text-luxury-gold">
          <ArrowLeft className="w-4 h-4" /> Back to Farm House Options
        </Link>

        {confirmedTicket ? (
          <div className="glass-panel p-8 rounded-3xl border border-luxury-gold/40 shadow-2xl space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <Ticket className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#0D3B29]">Farm House Reservation Submitted</h2>
            <p className="text-xs text-gray-600">Booking Ref: <strong>{confirmedTicket.id}</strong> • Reserved Date: <strong>{visitDate}</strong></p>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setIsInvoiceOpen(true)}
                className="px-6 py-3 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-xs"
              >
                View / Download GST Invoice
              </button>
              <Link
                to="/profile?tab=farm"
                className="px-6 py-3 rounded-full border border-[#0D3B29] text-[#0D3B29] font-bold text-xs"
              >
                Go to My Reservations
              </Link>
            </div>

            {confirmedTicket.invoiceData && (
              <InvoiceModal
                isOpen={isInvoiceOpen}
                onClose={() => setIsInvoiceOpen(false)}
                invoiceData={confirmedTicket.invoiceData}
              />
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-luxury-gold/30 shadow-2xl space-y-6">
            <div className="space-y-2 border-b border-gray-200 pb-4">
              <span className="text-xs font-bold text-[#0D3B29] uppercase tracking-widest flex items-center gap-1.5">
                <HomeIcon className="w-4 h-4 text-luxury-gold" /> Gona Private Farm House Reservation
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#0D3B29]">Reserve Gona Private Farm House</h1>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Reservation Date</label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Expected Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Booking Package</label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="Full Farm House Overnight Stay">Full Overnight Stay (₹18,000)</option>
                    <option value="Day Pool & Lawn Picnic Package">Day Pool Picnic (₹6,500)</option>
                    <option value="Night Bonfire & BBQ Party">Night Bonfire & BBQ Party (₹8,500)</option>
                    <option value="Private Celebration & Birthday Lawn">Private Event & Lawn (₹12,500)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Special Notes / Requests</label>
                <textarea
                  rows={3}
                  placeholder="Pool heating, special food catering, bonfire timing, music setup..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#0D3B29] text-white space-y-2">
                <div className="flex justify-between">
                  <span>{packageType}</span>
                  <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-white">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-serif text-base font-bold text-luxury-gold pt-2 border-t border-gray-800">
                  <span>Total Amount Payable</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-luxury-gold hover:bg-luxury-gold-light text-[#0D3B29] font-bold text-base tracking-wider flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Reserving Farm House...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Pay ₹{totalAmount.toLocaleString('en-IN')} & Confirm Reservation
                  </>
                )}
              </button>

            </form>
          </div>
        )}

      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={pendingBooking?.totalAmount || totalAmount}
        title="Gona Private Farm House Reservation"
        description={`${packageType} on ${visitDate}`}
        bookingId={pendingBooking?.bookingId || pendingBooking?._id}
        bookingType="farm"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
