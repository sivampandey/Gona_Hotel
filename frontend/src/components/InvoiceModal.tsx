import React from 'react';
import { X, Printer, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

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
    tax?: number;
    discount?: number;
    totalAmount: number;
  };
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoiceData }) => {
  if (!isOpen || !invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  const discountVal = invoiceData.discount || 0;
  const taxableAmount = Math.max(0, invoiceData.subtotal - discountVal);
  // 5% GST total
  const calculatedTax = invoiceData.tax !== undefined && invoiceData.tax > 0 
    ? invoiceData.tax 
    : Math.round(taxableAmount * 0.05);

  const grandTotal = taxableAmount + calculatedTax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Print CSS Override */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
            border: none !important;
            box-shadow: none !important;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-2xl bg-white text-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 relative border-2 border-luxury-gold max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Top Header Controls (Hidden on Print) */}
        <div className="p-3 sm:p-4 bg-[#0D3B29] text-white flex items-center justify-between shrink-0 print-hide">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            <span className="text-[10px] sm:text-xs font-bold text-luxury-gold uppercase tracking-widest">
              Gona Hotel & Restaurant Tax Bill
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-luxury-gold text-[#0D3B29] font-bold text-xs hover:bg-[#F3E5AB] transition-colors shadow"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Print / Download PDF Bill
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Container */}
        <div className="p-4 sm:p-8 space-y-6 overflow-y-auto flex-1 bg-white" id="printable-invoice">
          
          {/* Top Hotel Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-[#0D3B29]/30 pb-5 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#0D3B29] text-luxury-gold font-bold flex items-center justify-center text-sm shadow">
                  G
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0D3B29] tracking-wider uppercase">
                  GONA HOTEL & RESTAURANT
                </h1>
              </div>
              <p className="text-xs font-bold text-luxury-gold uppercase tracking-widest pl-10">
                Trade Name: GONA FARM AND HOLIDAY HOME • Legal Name: MITHILESH KUMAR SINGH (HUF)
              </p>
              <p className="text-[11px] text-gray-600 font-medium pl-10">
                📍 Hotel Address: Village - Semari, Post - Sarso, Chunar Road, Mirzapur, Uttar Pradesh - 231201
              </p>
              <p className="text-[11px] text-gray-600 font-medium pl-10">
                🏢 Reg. Address: Akhara Mohal Babhanauli, Robertsganj, Sonbhadra, Uttar Pradesh - 231216
              </p>
              <p className="text-[11px] text-gray-600 font-medium pl-10">
                📞 Mobile: +91 96966 31621 / +91 79050 79819 | ✉️ info@gonahotel.com
              </p>
              <div className="pt-1.5 pl-10 flex flex-wrap gap-2 text-[10px] font-mono font-bold text-[#0D3B29]">
                <span className="bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">GSTIN: 09AAKHM1332D1ZH</span>
                <span className="bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">SAC Code: 9963</span>
                <span className="bg-blue-100 px-2.5 py-0.5 rounded border border-blue-300">Form GST REG-06</span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 border-l sm:border-l-0 border-gray-200 pl-3 sm:pl-0">
              <span className="inline-block px-3.5 py-1 bg-green-700 text-white font-bold text-[11px] rounded-full mb-1.5 uppercase tracking-wider shadow-sm">
                OFFICIAL TAX INVOICE
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 font-mono">{invoiceData.invoiceId}</h3>
              <p className="text-[11px] text-gray-500">Date: {new Date(invoiceData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p className="text-[11px] text-gray-500 font-mono">Payment Ref: {invoiceData.paymentId}</p>
            </div>
          </div>

          {/* Customer & Billing Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/60 p-4 rounded-xl border border-luxury-gold/30 text-xs">
            <div>
              <span className="font-bold text-[#0D3B29] uppercase tracking-wider block mb-1">Billed To (Guest Details)</span>
              <p className="font-bold text-sm text-gray-900">{invoiceData.customerName}</p>
              <p className="text-gray-600">{invoiceData.customerEmail}</p>
              {invoiceData.customerPhone && <p className="text-gray-600">Ph: {invoiceData.customerPhone}</p>}
            </div>
            <div className="sm:text-right">
              <span className="font-bold text-[#0D3B29] uppercase tracking-wider block mb-1">Hotel Service / Booking</span>
              <p className="font-bold text-sm text-[#0D3B29] capitalize">{invoiceData.title}</p>
              <p className="text-gray-600">Type: {invoiceData.type.toUpperCase()}</p>
              <p className="text-gray-600 font-semibold text-emerald-700">Payment Status: PAID ✓</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0D3B29] text-white uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3 rounded-l-lg">S.No & Item Description</th>
                  <th className="py-2.5 px-2 text-center">HSN/SAC</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoiceData.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-900">
                      <span className="font-bold text-gray-400 mr-2">{idx + 1}.</span>
                      {item.description}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-gray-500">9963</td>
                    <td className="py-3 px-2 text-center font-bold text-gray-700">{item.quantity || 1}</td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Totals */}
          <div className="border-t-2 border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            
            {/* Left: GST Declaration */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1 max-w-xs">
              <p className="font-bold text-[#0D3B29] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Tax Declaration
              </p>
              <p>Total GST Applied: <strong>5%</strong></p>
              <p>GST Amount Included: ₹{calculatedTax.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-200">Official Computer Generated Bill from Gona Hotel & Restaurant.</p>
            </div>

            {/* Right: Calculation Table */}
            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">₹{invoiceData.subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {discountVal > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Discount</span>
                  <span>-₹{discountVal.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-100">
                <span>Net Taxable Amount</span>
                <span className="font-semibold text-gray-900">₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-gray-700 font-semibold pt-1 border-t border-gray-200">
                <span>GST (5%)</span>
                <span className="text-[#0D3B29]">₹{calculatedTax.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-serif font-bold text-[#0D3B29] pt-2 border-t-2 border-[#0D3B29]">
                <span>Grand Total Paid</span>
                <span className="text-emerald-700">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signature Stamp */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <div className="text-center sm:text-left space-y-0.5">
              <p className="font-bold text-[#0D3B29]">Thank you for visiting Gona Hotel & Restaurant!</p>
              <p>For any queries, please present this computer generated tax invoice.</p>
              <p className="text-[10px] text-gray-400">E. & O.E. • Subject to Mirzapur Jurisdiction</p>
            </div>

            <div className="text-center border-t sm:border-t-0 sm:border-l border-gray-200 pl-0 sm:pl-4 pt-2 sm:pt-0">
              <div className="w-28 h-10 border border-luxury-gold/40 rounded flex items-center justify-center bg-amber-50/50 mx-auto">
                <span className="text-[10px] font-bold text-[#0D3B29] uppercase tracking-tighter">Gona Hotel Seal</span>
              </div>
              <p className="text-[10px] font-bold text-[#0D3B29] mt-1">Authorized Signatory</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

