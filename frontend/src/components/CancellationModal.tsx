import React, { useState } from 'react';
import { AlertTriangle, Clock, X, CheckCircle2, ShieldAlert } from 'lucide-react';

export function calculateCancellationRefund(checkInDateStr: string, totalAmount: number) {
  const checkInDate = new Date(checkInDateStr);
  checkInDate.setHours(12, 0, 0, 0); // Check-in standard time 12:00 PM
  const now = new Date();
  
  const diffHours = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  let refundPercent = 0;
  let feePercent = 100;
  let ruleTitle = 'Less than 12 Hours before Check-In';

  if (diffHours >= 48) {
    refundPercent = 100;
    feePercent = 0;
    ruleTitle = 'More than 48 Hours before Check-In (Full Refund)';
  } else if (diffHours >= 24) {
    refundPercent = 75;
    feePercent = 25;
    ruleTitle = '24 to 48 Hours before Check-In (75% Refund)';
  } else if (diffHours >= 12) {
    refundPercent = 50;
    feePercent = 50;
    ruleTitle = '12 to 24 Hours before Check-In (50% Refund)';
  } else {
    refundPercent = 0;
    feePercent = 100;
    ruleTitle = 'Less than 12 Hours / Post Check-In (No Refund)';
  }

  const refundAmount = Math.round((totalAmount * refundPercent) / 100);
  const cancellationFee = totalAmount - refundAmount;

  return {
    diffHours: Math.max(0, Math.round(diffHours)),
    refundPercent,
    feePercent,
    refundAmount,
    cancellationFee,
    ruleTitle,
    isEligible: diffHours > 0
  };
}

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onConfirmCancel: (bookingId: string, refundDetails: any, reason: string) => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmCancel
}) => {
  const [reason, setReason] = useState('Change of plans');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const policy = calculateCancellationRefund(booking.checkIn, booking.totalAmount);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCancel(booking.id, policy, reason);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-luxury-gold/30 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0D3B29]">Cancel Room Reservation</h3>
              <p className="text-xs text-gray-500">Ref ID: {booking.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Info */}
        <div className="p-4 rounded-2xl bg-[#F7F4EB] flex items-center gap-4">
          <img src={booking.roomImage} alt={booking.roomName} className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <h4 className="font-serif text-base font-bold text-[#0D3B29]">{booking.roomName}</h4>
            <p className="text-xs text-gray-600">📅 Check-In: <strong>{booking.checkIn}</strong></p>
            <p className="text-xs text-gray-500">Total Paid: <strong>₹{booking.totalAmount.toLocaleString('en-IN')}</strong></p>
          </div>
        </div>

        {/* Cancellation Policy Rules Box */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span>Cancellation Policy Applied:</span>
            <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Clock className="w-3.5 h-3.5" /> {policy.diffHours} hrs to Check-In
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
            <p className="font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              {policy.ruleTitle}
            </p>

            {/* Policy Tiers Chart */}
            <div className="grid grid-cols-4 gap-1 text-[10px] text-center pt-2">
              <div className={`p-1.5 rounded-lg border ${policy.refundPercent === 100 ? 'bg-green-600 text-white font-bold border-green-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                &gt;48 hrs<br/><strong>100% Refund</strong>
              </div>
              <div className={`p-1.5 rounded-lg border ${policy.refundPercent === 75 ? 'bg-amber-600 text-white font-bold border-amber-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                24-48 hrs<br/><strong>75% Refund</strong>
              </div>
              <div className={`p-1.5 rounded-lg border ${policy.refundPercent === 50 ? 'bg-amber-600 text-white font-bold border-amber-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                12-24 hrs<br/><strong>50% Refund</strong>
              </div>
              <div className={`p-1.5 rounded-lg border ${policy.refundPercent === 0 ? 'bg-red-600 text-white font-bold border-red-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                &lt;12 hrs<br/><strong>No Refund</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Calculation Breakdown */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Total Booking Amount</span>
            <span className="font-semibold text-gray-900">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Cancellation Charge ({policy.feePercent}%)</span>
            <span className="font-semibold">-₹{policy.cancellationFee.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-green-700 pt-2 border-t border-gray-100">
            <span>Estimated Refund Amount</span>
            <span className="font-serif text-lg font-bold">₹{policy.refundAmount.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Refund will be processed to original payment method within 3-5 business days.</p>
        </div>

        {/* Reason Select */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Reason for Cancellation</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#0D3B29]"
          >
            <option value="Change of plans">Change of travel plans</option>
            <option value="Emergency">Personal / Medical emergency</option>
            <option value="Booked another room">Booked another room / dates</option>
            <option value="Weather / Travel issue">Weather or transport delay</option>
            <option value="Other">Other reason</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition"
          >
            Keep Reservation
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
          >
            {isSubmitting ? 'Cancelling...' : `Confirm Cancel (Refund ₹${policy.refundAmount})`}
          </button>
        </div>

      </div>
    </div>
  );
};
