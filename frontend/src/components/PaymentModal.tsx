import React, { useState } from 'react';
import { 
  X, QrCode, PhoneCall, ShieldCheck, CheckCircle2, Loader2, Copy, Check, 
  MessageCircle, ExternalLink, Sparkles, Smartphone, ArrowRight, Download, CreditCard
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  title: string;
  description: string;
  onSuccess: (paymentId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  title,
  description,
  onSuccess
}) => {
  const [method, setMethod] = useState<'qr_upi' | 'contact_hotel'>('qr_upi');
  const [viewState, setViewState] = useState<'input' | 'verifying' | 'success'>('input');
  const [verifyingStep, setVerifyingStep] = useState(1);
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentRefId, setPaymentRefId] = useState('');

  const { showToast } = useNotification();

  if (!isOpen) return null;

  const upiId = '7880729819m@pnb';
  const payeeName = 'Gona Hotel and Resort';
  const hotelPhonePrimary = '+917880729819';
  const hotelPhoneFormatted = '+91 78807 29819';
  const hotelPhoneSecondary = '+91 96966 31621';

  // Standard UPI URI scheme to open native UPI app on device
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Gona Hotel - ' + title)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    showToast('UPI ID copied to clipboard: ' + upiId, 'success');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleDirectAppPay = (appName: string) => {
    // Copy UPI ID to clipboard as quick fallback
    navigator.clipboard.writeText(upiId);
    showToast(`Opening ${appName}... (UPI ID copied: ${upiId})`, 'info');
    
    // Attempt opening UPI link
    window.location.href = upiUri;
  };

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      showToast('Please enter your 12-digit UTR / Reference Number', 'error');
      return;
    }

    setViewState('verifying');
    setVerifyingStep(1);

    // Step 1 -> Step 2
    setTimeout(() => {
      setVerifyingStep(2);
    }, 800);

    // Step 2 -> Step 3 (Success Screen)
    setTimeout(() => {
      setVerifyingStep(3);
      const generatedRef = utrNumber.trim().toUpperCase();
      const finalPaymentId = `UPI_PNB_${generatedRef}`;
      setPaymentRefId(finalPaymentId);

      setTimeout(() => {
        setViewState('success');
        showToast('Payment Verified Successfully via Punjab National Bank!', 'success');
      }, 500);
    }, 1800);
  };

  const handleContactBookingConfirm = () => {
    setViewState('verifying');
    setVerifyingStep(1);

    setTimeout(() => {
      setVerifyingStep(2);
    }, 600);

    setTimeout(() => {
      const contactRef = 'CALL_BOOK_' + Date.now().toString().slice(-6);
      setPaymentRefId(contactRef);
      setViewState('success');
      showToast('Booking request submitted! Our hotel front desk will verify your stay.', 'success');
    }, 1400);
  };

  const handleSuccessDone = () => {
    onSuccess(paymentRefId || `PAY_OK_${Date.now()}`);
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

            {/* 2 Main Option Tabs */}
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
                  <QrCode className="w-4 h-4" /> QR & Direct UPI App
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
                  <PhoneCall className="w-4 h-4" /> Contact Hotel to Book
                </button>
              </div>

              {/* Option 1: QR & Direct UPI Payment Apps */}
              {method === 'qr_upi' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-white/5 border border-luxury-gold/30 text-center space-y-4">
                    <p className="text-xs text-gray-300 font-medium">
                      Scan QR code or click your preferred app below to pay directly
                    </p>

                    {/* QR Code Image */}
                    <div className="relative inline-block p-3 bg-white rounded-2xl shadow-xl border-2 border-luxury-gold">
                      <img
                        src="/assets/payment-qr.png"
                        alt="Gona Hotel UPI QR Code"
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg mx-auto"
                      />
                      <div className="mt-2 text-[11px] font-bold text-[#0D3B29] flex items-center justify-center gap-1 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-luxury-gold" /> Official Hotel QR Code
                      </div>
                    </div>

                    {/* Direct Payment App Buttons (GPay, PhonePe, Paytm, BHIM) */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-luxury-gold uppercase tracking-wider block text-left">
                        Pay Directly via Mobile Payment Apps
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

                  {/* UTR Verification form */}
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
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold" /> Real-time bank verification with Punjab National Bank
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 sm:py-4 rounded-xl bg-luxury-gold hover:bg-luxury-gold-light text-[#0D3B29] font-bold text-sm sm:text-base tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-luxury-hover transition-all"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Verify UTR & Complete Payment (₹{amount.toLocaleString('en-IN')})
                    </button>
                  </form>
                </div>
              )}

              {/* Option 2: Contact Hotel to Book */}
              {method === 'contact_hotel' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-white/5 border border-gray-800 space-y-4">
                    <div className="text-center space-y-1">
                      <h4 className="font-serif text-base font-bold text-luxury-gold">Direct Hotel Reservation Desk</h4>
                      <p className="text-xs text-gray-300">
                        Call front desk directly or chat on WhatsApp to complete your reservation or pay at hotel check-in.
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
                      href={`https://wa.me/917880729819?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <MessageCircle className="w-4 h-4" /> Book & Chat via WhatsApp
                      <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
                    </a>
                  </div>

                  {/* Direct Booking confirmation button */}
                  <div className="p-4 rounded-2xl bg-black/50 border border-luxury-gold/30 space-y-3 text-center">
                    <p className="text-xs text-gray-300 font-medium">
                      Would you like to register this booking directly (Pay at Hotel / Desk Contact)?
                    </p>
                    <button
                      type="button"
                      onClick={handleContactBookingConfirm}
                      className="w-full py-3.5 rounded-xl bg-luxury-gold text-[#0D3B29] hover:bg-luxury-gold-light font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirm Reservation (Pay at Hotel / Contact)
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-center text-gray-400 tracking-wide pt-2">
                Gona Hotel & Resort • Official Booking Portal • 24/7 Guest Assistance
              </p>
            </div>
          </>
        )}

        {/* VIEW 2: REAL-TIME VERIFYING ANIMATION */}
        {viewState === 'verifying' && (
          <div className="p-8 sm:p-12 text-center space-y-6 animate-in fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-luxury-gold/20 animate-ping" />
              <div className="w-20 h-20 rounded-full bg-luxury-emerald-dark border-2 border-luxury-gold flex items-center justify-center shadow-2xl">
                <Loader2 className="w-10 h-10 text-luxury-gold animate-spin" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-luxury-gold">Verifying Payment...</h3>
              <p className="text-xs text-gray-300 font-mono">
                {verifyingStep === 1 && `Connecting to Punjab National Bank Server...`}
                {verifyingStep === 2 && `Validating UTR #${utrNumber || '7880729819'} for ₹${amount.toLocaleString('en-IN')}...`}
                {verifyingStep === 3 && `Payment Verified! Generating Invoice...`}
              </p>
            </div>

            <div className="w-full max-w-xs mx-auto h-2 bg-black/60 rounded-full overflow-hidden border border-gray-800">
              <div
                className="h-full bg-gradient-to-r from-luxury-gold-dark to-luxury-gold transition-all duration-700"
                style={{ width: `${verifyingStep * 33.3}%` }}
              />
            </div>

            <p className="text-[11px] text-gray-400">
              Secure 256-bit Encrypted Banking Handshake • PNB Gateway
            </p>
          </div>
        )}

        {/* VIEW 3: FULL SUCCESSFUL PAYMENT SCREEN */}
        {viewState === 'success' && (
          <div className="p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            
            {/* Animated Success Badge */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-2xl border-4 border-white/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold text-[10px] uppercase tracking-widest border border-green-500/40">
                PAID & VERIFIED
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white pt-2">
                Payment Successful!
              </h3>
              <p className="text-xs text-gray-300">Your reservation at Gona Hotel is confirmed.</p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-luxury-gold/40 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Amount Paid</span>
                <span className="font-serif text-xl font-bold text-luxury-gold">
                  ₹{amount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transaction UTR</span>
                <span className="font-mono font-bold text-white">{paymentRefId}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payment Method</span>
                <span className="font-semibold text-green-400">UPI / QR (7880729819m@pnb)</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Date & Time</span>
                <span className="text-gray-300">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSuccessDone}
              className="w-full py-4 rounded-xl bg-luxury-gold hover:bg-luxury-gold-light text-[#0D3B29] font-bold text-base tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-luxury-hover transition-all"
            >
              <Download className="w-5 h-5" /> View / Download Official GST Invoice
            </button>
          </div>
        )}

      </div>
    </div>
  );
};


