import React, { useState } from 'react';
import { 
  X, QrCode, PhoneCall, ShieldCheck, CheckCircle2, Loader2, Copy, Check, 
  MessageCircle, ExternalLink, Sparkles, Smartphone, Clock, AlertCircle
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { apiService } from '../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  title: string;
  description: string;
  bookingId?: string;
  orderId?: string;
  bookingType?: 'room' | 'food' | 'farm';
  onSuccess: (paymentId: string, utrNumber?: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  title,
  description,
  bookingId,
  orderId,
  bookingType = 'room',
  onSuccess
}) => {
  const [method, setMethod] = useState<'qr_upi' | 'contact_hotel'>('qr_upi');
  const [viewState, setViewState] = useState<'input' | 'submitting' | 'submitted'>('input');
  const [utrNumber, setUtrNumber] = useState('');
  const [payerName, setPayerName] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submittedUtr, setSubmittedUtr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useNotification();

  if (!isOpen) return null;

  const upiId = '7880729819m@pnb';
  const payeeName = 'Gona Hotel and Resort';
  const hotelPhonePrimary = '+919696631621';
  const hotelPhoneFormatted = '+91 96966 31621';
  const hotelPhoneSecondary = '+91 79050 79819';

  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Gona Hotel - ' + title)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    showToast('UPI ID copied to clipboard: ' + upiId, 'success');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleDirectAppPay = (appName: string) => {
    navigator.clipboard.writeText(upiId);
    showToast(`Opening ${appName}... (UPI ID copied: ${upiId})`, 'info');
    window.location.href = upiUri;
  };

  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      showToast('Please enter your 12-digit UTR / Reference Number', 'error');
      return;
    }

    const cleanUtr = utrNumber.trim().toUpperCase();
    const targetId = bookingId || orderId;

    if (!targetId) {
      showToast('Order or Booking ID missing for payment submission', 'error');
      return;
    }

    setIsSubmitting(true);
    setViewState('submitting');

    try {
      const res = await apiService.submitUtrProof({
        bookingId: targetId,
        orderId: targetId,
        bookingType,
        utrNumber: cleanUtr,
        payerName
      });

      if (res.status === 200 && res.data?.success) {
        setSubmittedUtr(cleanUtr);
        setViewState('submitted');
        showToast('Payment details submitted! Status: Pending Verification by Hotel Admin.', 'success');
      } else {
        const errorMsg = res.data?.message || 'Failed to submit payment proof. Please try again.';
        showToast(errorMsg, 'error');
        setViewState('input');
      }
    } catch (err: any) {
      showToast(err.message || 'Unable to connect to payment server. Please try again.', 'error');
      setViewState('input');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactBookingConfirm = async () => {
    const targetId = bookingId || orderId;

    if (!targetId) {
      showToast('Order or Booking ID missing', 'error');
      return;
    }

    setIsSubmitting(true);
    setViewState('submitting');

    try {
      const res = await apiService.submitUtrProof({
        bookingId: targetId,
        orderId: targetId,
        bookingType,
        utrNumber: 'DESK_PAY_UPON_ARRIVAL',
        payerName
      });

      if (res.status === 200 && res.data?.success) {
        setSubmittedUtr('DESK_PAYMENT');
        setViewState('submitted');
        showToast('Reservation registered! Hotel desk will verify upon check-in.', 'success');
      } else {
        showToast(res.data?.message || 'Failed to register reservation', 'error');
        setViewState('input');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit reservation', 'error');
      setViewState('input');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmittedDone = () => {
    onSuccess(submittedUtr || `PAY_PENDING_${Date.now()}`, submittedUtr);
    setViewState('input');
    onClose();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Gona Hotel & Resort,\n\nI want to confirm my booking:\n• Item/Stay: ${title}\n• Details: ${description}\n• Total Amount: ₹${amount.toLocaleString('en-IN')}\n\nPlease confirm availability and assist me with booking.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto glass-panel-dark text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-luxury-gold/40 relative my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0D3B29] to-[#144d36] border-b border-luxury-gold/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-luxury-gold text-[#0D3B29] flex items-center justify-center font-bold shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-luxury-gold">{title}</h3>
              <p className="text-xs text-luxury-champagne/80">{description}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setViewState('input');
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIEW 1: SELECTION & UTR INPUT */}
        {viewState === 'input' && (
          <>
            {/* Amount Display */}
            <div className="px-6 py-4 bg-black/50 border-b border-gray-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Total Payable Amount
              </span>
              <span className="font-serif text-2xl text-luxury-gold font-bold">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Option Tabs */}
            <div className="p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-black/60 rounded-2xl border border-gray-800">
                <button
                  type="button"
                  onClick={() => setMethod('qr_upi')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    method === 'qr_upi'
                      ? 'bg-luxury-gold text-[#0D3B29] shadow-lg scale-[1.02]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" /> Client UPI QR Code
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('contact_hotel')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    method === 'contact_hotel'
                      ? 'bg-luxury-gold text-[#0D3B29] shadow-lg scale-[1.02]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <PhoneCall className="w-4 h-4" /> Pay at Hotel Desk
                </button>
              </div>

              {/* Option 1: Client QR Code & Direct UPI Apps */}
              {method === 'qr_upi' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-white/5 border border-luxury-gold/30 text-center space-y-4">
                    <p className="text-xs text-gray-300 font-medium">
                      Scan the Gona Hotel official UPI QR code below using GPay, PhonePe, Paytm or BHIM
                    </p>

                    {/* Official Client QR Code Image */}
                    <div className="relative inline-block p-3 bg-white rounded-2xl shadow-xl border-2 border-luxury-gold">
                      <img
                        src="/assets/payment-qr.png"
                        alt="Gona Hotel Official UPI QR Code"
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiUri)}`;
                        }}
                      />
                      <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-[11px] font-bold text-amber-900 flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Payee: {payeeName} (₹{amount.toLocaleString('en-IN')})</span>
                      </div>
                    </div>

                    {/* Direct App Pay Buttons */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-luxury-gold uppercase tracking-wider block text-left">
                        Pay Directly via App Link
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDirectAppPay('Google Pay')}
                          className="py-2.5 px-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all"
                        >
                          <Smartphone className="w-4 h-4 text-blue-400" />
                          <span>Google Pay</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDirectAppPay('PhonePe')}
                          className="py-2.5 px-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all"
                        >
                          <Smartphone className="w-4 h-4 text-purple-400" />
                          <span>PhonePe</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDirectAppPay('Paytm')}
                          className="py-2.5 px-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all"
                        >
                          <Smartphone className="w-4 h-4 text-cyan-400" />
                          <span>Paytm</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDirectAppPay('BHIM / UPI')}
                          className="py-2.5 px-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all"
                        >
                          <Smartphone className="w-4 h-4 text-amber-400" />
                          <span>BHIM / Any UPI</span>
                        </button>
                      </div>
                    </div>

                    {/* UPI ID display with Copy button */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/70 border border-luxury-gold/40 text-xs">
                      <div className="text-left">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">UPI VPA</span>
                        <span className="font-mono font-bold text-luxury-gold text-sm">{upiId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-3 py-1.5 rounded-lg bg-luxury-gold/20 hover:bg-luxury-gold/30 text-luxury-gold font-bold text-xs flex items-center gap-1.5 border border-luxury-gold/40 transition-all"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy UPI ID
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* UTR Proof Form */}
                  <form onSubmit={handleUpiSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-300 block">
                        Enter 12-Digit UTR / Transaction Reference Number
                      </label>
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 423198765432 (12 digits from GPay/PhonePe)"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-luxury-gold/40 text-white text-sm font-mono focus:outline-none focus:border-luxury-gold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-300 block">
                        Payer Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        placeholder="Name on bank account"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-luxury-gold/40 text-white text-sm focus:outline-none focus:border-luxury-gold"
                      />
                    </div>

                    <p className="text-[11px] text-gray-400 flex items-center gap-1.5 bg-black/40 p-2.5 rounded-xl border border-gray-800">
                      <Clock className="w-4 h-4 text-luxury-gold shrink-0" />
                      Your payment will be submitted to the hotel concierge for verification.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 sm:py-4 rounded-xl bg-luxury-gold hover:bg-luxury-gold-light text-[#0D3B29] font-bold text-sm sm:text-base tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-luxury-hover transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Submitting Payment Details...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" /> Submit UTR Proof (₹{amount.toLocaleString('en-IN')})
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Option 2: Contact Hotel Desk */}
              {method === 'contact_hotel' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-white/5 border border-gray-800 space-y-4">
                    <div className="text-center space-y-1">
                      <h4 className="font-serif text-base font-bold text-luxury-gold">Direct Hotel Reservation Desk</h4>
                      <p className="text-xs text-gray-300">
                        Call front desk directly or chat on WhatsApp to complete your reservation or pay at check-in.
                      </p>
                    </div>

                    {/* Call buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={`tel:${hotelPhonePrimary}`}
                        className="p-3.5 rounded-xl bg-[#0D3B29] hover:bg-[#134A35] border border-luxury-gold/40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all text-center"
                      >
                        <PhoneCall className="w-4 h-4 text-luxury-gold" />
                        <div>
                          <span className="block text-[10px] text-luxury-champagne">Primary Concierge</span>
                          <span>{hotelPhoneFormatted}</span>
                        </div>
                      </a>

                      <a
                        href={`tel:${hotelPhoneSecondary}`}
                        className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-gray-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all text-center"
                      >
                        <PhoneCall className="w-4 h-4 text-luxury-gold" />
                        <div>
                          <span className="block text-[10px] text-gray-400">Alternate Line</span>
                          <span>{hotelPhoneSecondary}</span>
                        </div>
                      </a>
                    </div>

                    {/* WhatsApp button */}
                    <a
                      href={`https://wa.me/919696631621?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <MessageCircle className="w-4 h-4" /> Book & Chat via WhatsApp
                      <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/50 border border-luxury-gold/30 space-y-3 text-center">
                    <p className="text-xs text-gray-300 font-medium">
                      Register this reservation and pay upon arrival at check-in desk:
                    </p>
                    <button
                      type="button"
                      onClick={handleContactBookingConfirm}
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-luxury-gold text-[#0D3B29] hover:bg-luxury-gold-light font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirm Reservation (Pay at Hotel Desk)
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-center text-gray-400 tracking-wide pt-2">
                Gona Hotel & Resort • Official Payment Gateway • 24/7 Guest Assistance
              </p>
            </div>
          </>
        )}

        {/* VIEW 2: SUBMITTING ANIMATION */}
        {viewState === 'submitting' && (
          <div className="p-8 sm:p-12 text-center space-y-6 animate-in fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-luxury-gold/20 animate-ping" />
              <div className="w-20 h-20 rounded-full bg-luxury-emerald-dark border-2 border-luxury-gold flex items-center justify-center shadow-2xl">
                <Loader2 className="w-10 h-10 text-luxury-gold animate-spin" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-luxury-gold">Submitting Payment Details...</h3>
              <p className="text-xs text-gray-300 font-mono">
                Saving UTR proof #{utrNumber} for ₹{amount.toLocaleString('en-IN')}...
              </p>
            </div>
          </div>
        )}

        {/* VIEW 3: SUBMITTED & PENDING VERIFICATION SCREEN */}
        {viewState === 'submitted' && (
          <div className="p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 text-white flex items-center justify-center mx-auto shadow-2xl border-4 border-white/20">
                <Clock className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase tracking-widest border border-amber-500/40">
                PAYMENT DETAILS SUBMITTED
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white pt-2">
                Pending Verification
              </h3>
              <p className="text-xs text-gray-300 max-w-sm mx-auto">
                Your payment details have been sent to Gona Hotel concierge. The hotel admin will verify your transaction against bank records.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-luxury-gold/40 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Amount Payable</span>
                <span className="font-serif text-xl font-bold text-luxury-gold">
                  ₹{amount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">UTR / Reference</span>
                <span className="font-mono font-bold text-white">{submittedUtr}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payment Status</span>
                <span className="font-semibold text-amber-400 uppercase">PENDING_VERIFICATION</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">UPI Account</span>
                <span className="font-mono text-gray-300">7880729819m@pnb</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmittedDone}
              className="w-full py-4 rounded-xl bg-luxury-gold hover:bg-luxury-gold-light text-[#0D3B29] font-bold text-base tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-luxury-hover transition-all"
            >
              <CheckCircle2 className="w-5 h-5" /> Done & View Status in Profile
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
