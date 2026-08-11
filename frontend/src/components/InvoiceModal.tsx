import React from 'react';
import { X, Printer, Download, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: {
    invoiceId: string;
    title: string;
    type: 'room' | 'food' | 'farm';
    date: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    paymentId: string;
    items: Array<{ description: string; quantity?: number; amount: number }>;
    subtotal: number;
    tax: number;
    discount?: number;
    totalAmount: number;
  };
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoiceData }) => {
  if (!isOpen || !invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white text-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 relative border border-luxury-gold max-h-[92vh] flex flex-col">
        
        {/* Top Actions */}
        <div className="p-3 sm:p-4 bg-luxury-emerald-dark text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            <span className="text-[10px] sm:text-xs font-bold text-luxury-champagne uppercase tracking-widest">
              Official Hotel Bill & Receipt
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-luxury-gold text-luxury-emerald-dark font-bold text-xs hover:bg-luxury-gold-light transition-colors"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Print / Save PDF Bill
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Area */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto flex-1" id="printable-invoice">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#0D3B29] tracking-wide">
                GONA HOTEL & RESTAURANT
              </h1>
              <p className="text-xs text-gray-500 font-semibold">Luxury Rooms • Multi-Cuisine Restaurant • Organic Farm</p>
              <p className="text-xs text-gray-500 mt-1">Village- Semari, Post- Sarso, Rajgarh, Mirzapur (U.P.) 231201</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full mb-2">
                PAID & CONFIRMED
              </span>
              <h3 className="font-serif text-lg font-bold text-gray-800">{invoiceData.invoiceId}</h3>
              <p className="text-xs text-gray-500">Date: {new Date(invoiceData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p className="text-xs text-gray-500">Payment Ref: {invoiceData.paymentId}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-6 bg-amber-50/50 p-4 rounded-2xl border border-gray-200 text-xs">
            <div>
              <span className="font-bold text-gray-500 uppercase tracking-wider block mb-1">Billed To</span>
              <p className="font-bold text-sm text-gray-900">{invoiceData.customerName}</p>
              <p className="text-gray-600">{invoiceData.customerEmail}</p>
              {invoiceData.customerPhone && <p className="text-gray-600">{invoiceData.customerPhone}</p>}
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-500 uppercase tracking-wider block mb-1">Reservation Type</span>
              <p className="font-bold text-sm text-[#0D3B29] capitalize">{invoiceData.title}</p>
              <p className="text-gray-600">Payment Method: Verified UPI QR / Hotel Desk</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-gray-300 text-gray-600 uppercase tracking-wider">
                  <th className="py-3">Description</th>
                  <th className="py-3 text-center">Qty</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoiceData.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 font-medium text-gray-900">{item.description}</td>
                    <td className="py-3.5 text-center text-gray-600">{item.quantity || 1}</td>
                    <td className="py-3.5 text-right font-bold text-gray-900">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary */}
          <div className="border-t border-gray-200 pt-4 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{invoiceData.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {invoiceData.discount && invoiceData.discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Special Discount</span>
                  <span>-₹{invoiceData.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-serif font-bold text-[#0D3B29] pt-2 border-t border-gray-300">
                <span>Total Amount Paid</span>
                <span>₹{invoiceData.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-gray-200 text-center text-[11px] text-gray-500 space-y-1">
            <p className="font-medium text-gray-700">Thank you for choosing Gona Hotel & Restaurant!</p>
            <p>For any concierge inquiries, call +91 96966 31621 / +91 79050 79819</p>
          </div>

        </div>
      </div>
    </div>
  );
};
