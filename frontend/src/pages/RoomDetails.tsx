import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, Users, Maximize, Bed, CheckCircle2, ArrowLeft, Heart, Lock, 
  Wifi, Tv, Wind, Coffee, ShieldCheck, Loader2
} from 'lucide-react';
import { initialSeedData } from '../data/seedData';
import { PaymentModal } from '../components/PaymentModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { apiService } from '../services/api';

export const RoomDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, toggleWishlist, isWishlisted } = useAuth();
  const { showToast } = useNotification();

  const room = initialSeedData.rooms.find(r => r.slug === slug || r.id === slug) || initialSeedData.rooms[0];

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [activeImage, setActiveImage] = useState(room.images[0]);
  const [checkIn, setCheckIn] = useState(getTodayStr());
  const [checkOut, setCheckOut] = useState(getTomorrowStr());
  const [guests, setGuests] = useState(room.maxGuests <= 2 ? room.maxGuests : 2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [confirmedInvoice, setConfirmedInvoice] = useState<any>(null);

  const wishlisted = isWishlisted(room.id, 'rooms');

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const diffDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalNights = diffDays > 0 ? diffDays : 1;
  const subtotal = room.pricePerNight * totalNights;
  const totalAmount = subtotal;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to complete your stay booking', 'info');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.createRoomBooking({
        roomId: room.id,
        checkIn,
        checkOut,
        guests: { adults: guests, children: 0 },
        userName: user?.name,
        userEmail: user?.email,
        userPhone: user?.phone,
        specialRequests
      });

      if (res.status === 201 && res.data?.booking) {
        setPendingBooking(res.data.booking);
        setIsPaymentOpen(true);
      } else {
        showToast(res.data?.message || 'Failed to create room booking', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error creating booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentRefId: string, utrNumber?: string) => {
    setIsPaymentOpen(false);

    const invoiceData = {
      invoiceId: pendingBooking?.invoiceId || ('INV-ROOM-' + Date.now().toString().slice(-6)),
      title: `${room.title} Stay Reservation`,
      type: 'room' as const,
      date: new Date().toISOString(),
      customerName: user?.name || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      paymentId: paymentRefId,
      utrNumber: utrNumber || paymentRefId,
      paymentStatus: 'PAYMENT_SUBMITTED',
      items: [
        {
          description: `${room.title} (${totalNights} Night Stay from ${checkIn} to ${checkOut})`,
          quantity: totalNights,
          amount: pendingBooking?.subtotal || subtotal
        }
      ],
      subtotal: pendingBooking?.subtotal || subtotal,
      tax: pendingBooking?.tax || 0,
      totalAmount: pendingBooking?.totalAmount || totalAmount
    };

    setConfirmedInvoice(invoiceData);
    setIsInvoiceOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-luxury-emerald">Home</Link>
            <span>›</span>
            <Link to="/rooms" className="hover:text-luxury-emerald">Rooms</Link>
            <span>›</span>
            <span className="font-bold text-[#0D3B29]">{room.title}</span>
          </div>

          <Link to="/rooms" className="inline-flex items-center gap-1.5 font-bold text-[#0D3B29]">
            <ArrowLeft className="w-4 h-4" /> Back to Rooms
          </Link>
        </div>

        {/* Room View & Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Large Image & Thumbnails */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl bg-black border border-gray-200">
              <img
                src={activeImage}
                alt={room.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  toggleWishlist(room.id, 'rooms');
                  showToast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', 'success');
                }}
                className="absolute top-4 right-4 p-3 rounded-full glass-panel text-white hover:text-red-500 transition-colors shadow-lg"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-4">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-[#0D3B29] scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xl space-y-6 sticky top-28">
              
              <div className="space-y-1 border-b border-gray-200 pb-4">
                <h1 className="font-serif text-3xl font-bold text-[#0D3B29]">{room.title}</h1>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-serif text-2xl font-bold text-luxury-gold">
                    ₹{room.pricePerNight.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-500">/ night</span>
                </div>
                <p className="text-xs text-gray-600 pt-2 leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* Amenity Grid */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-700 font-semibold py-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-luxury-gold" /> {room.maxGuests} Guests</div>
                <div className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-luxury-gold" /> {room.bedType}</div>
                <div className="flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5 text-luxury-gold" /> {room.sizeSqFt} sq.ft</div>
                <div className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-luxury-gold" /> AC</div>
                <div className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-luxury-gold" /> WiFi</div>
                <div className="flex items-center gap-1.5"><Tv className="w-3.5 h-3.5 text-luxury-gold" /> TV</div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Check In</label>
                  <input
                    type="date"
                    min={getTodayStr()}
                    value={checkIn}
                    onChange={(e) => {
                      const newIn = e.target.value;
                      setCheckIn(newIn);
                      if (newIn >= checkOut) {
                        const nextDay = new Date(new Date(newIn).getTime() + 86400000).toISOString().split('T')[0];
                        setCheckOut(nextDay);
                      }
                    }}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 font-semibold text-gray-900 focus:outline-none focus:border-luxury-emerald"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Check Out</label>
                  <input
                    type="date"
                    min={checkIn || getTodayStr()}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 font-semibold text-gray-900 focus:outline-none focus:border-luxury-emerald"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 font-semibold text-gray-900 focus:outline-none focus:border-luxury-emerald"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-1 text-gray-700">
                  <div className="flex justify-between">
                    <span>₹{room.pricePerNight.toLocaleString('en-IN')} × {totalNights} night(s)</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#0D3B29] text-sm pt-1 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#0D3B29] hover:bg-[#134A35] text-white font-bold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying Availability...
                    </>
                  ) : (
                    'Check Availability & Book'
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={pendingBooking?.totalAmount || totalAmount}
        title={`Book ${room.title}`}
        description={`${totalNights} Night Stay (${checkIn} to ${checkOut})`}
        bookingId={pendingBooking?.bookingId || pendingBooking?._id}
        bookingType="room"
        onSuccess={handlePaymentSuccess}
      />

      {confirmedInvoice && (
        <InvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          invoiceData={confirmedInvoice}
        />
      )}
    </div>
  );
};
