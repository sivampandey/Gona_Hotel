import React, { useState } from 'react';
import { X, Printer, Download, Sparkles, ShieldCheck, Loader2, CheckCircle2, Award } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    paymentId?: string;
    utrNumber?: string;
    paymentStatus?: string;
    items?: Array<{ description: string; quantity?: number; amount: number }>;
    subtotal?: number;
    tax?: number;
    discount?: number;
    totalAmount?: number;
  };
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoiceData }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen || !invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const invoiceElem = document.getElementById('printable-invoice');
    if (!invoiceElem) return;

    try {
      setIsGeneratingPdf(true);

      // Temporarily expand scroll constraints so html2canvas captures 100% of the bill content
      const parentModal = invoiceElem.parentElement;
      const originalElemStyle = invoiceElem.getAttribute('style') || '';
      const originalParentStyle = parentModal?.getAttribute('style') || '';

      invoiceElem.style.maxHeight = 'none';
      invoiceElem.style.height = 'auto';
      invoiceElem.style.overflow = 'visible';
      if (parentModal) {
        parentModal.style.maxHeight = 'none';
        parentModal.style.height = 'auto';
        parentModal.style.overflow = 'visible';
      }

      window.scrollTo(0, 0);

      const canvas = await html2canvas(invoiceElem, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800
      });

      // Restore original scroll/modal styles
      invoiceElem.setAttribute('style', originalElemStyle);
      if (parentModal) {
        parentModal.setAttribute('style', originalParentStyle);
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`Gona_Hotel_Tax_Invoice_${invoiceData.invoiceId || 'Bill'}.pdf`);
    } catch (err) {
      console.error('PDF download error:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Safe Amount & Item Calculations
  const grandTotal = invoiceData.totalAmount || invoiceData.subtotal || 0;
  const itemsList = (invoiceData.items && invoiceData.items.length > 0)
    ? invoiceData.items
    : [{ description: invoiceData.title || 'Gona Hotel Service', quantity: 1, amount: grandTotal }];

  const subtotalVal = invoiceData.subtotal || itemsList.reduce((sum, item) => sum + (item.amount || 0), 0) || grandTotal;
  const discountVal = invoiceData.discount || 0;
  const taxableAmount = Math.max(0, subtotalVal - discountVal);
  const calculatedTax = invoiceData.tax !== undefined ? invoiceData.tax : (grandTotal > taxableAmount ? Math.round(grandTotal - taxableAmount) : 0);
  const statusStr = (invoiceData.paymentStatus || 'VERIFIED').toUpperCase();

  return (
    <div className="invoice-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto print:p-0 print:bg-white print:static print:max-h-none print:overflow-visible">

      {/* Print CSS Override */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          /* Hide background website elements */
          body > * {
            visibility: hidden !important;
          }

          /* Reset Modal Overlay Container for Print */
          .invoice-modal-overlay,
          div:has(#printable-invoice) {
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Force all children inside invoice to be visible */
          .invoice-modal-overlay *,
          div:has(#printable-invoice) *,
          #printable-invoice,
          #printable-invoice * {
            visibility: visible !important;
          }

          .print-hide {
            display: none !important;
          }

          #printable-invoice {
            position: static !important;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 10px !important;
            background: white !important;
            color: black !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-2xl bg-white text-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 relative border-2 border-luxury-gold max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none print:overflow-visible">


        {/* Top Controls Header (Hidden on Print) */}
        <div className="p-3 sm:p-4 bg-[#0D3B29] text-white flex items-center justify-between shrink-0 print-hide">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            <span className="text-[10px] sm:text-xs font-bold text-luxury-gold uppercase tracking-widest">
              Gona Hotel & Resort Official Tax Invoice
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-luxury-gold text-[#0D3B29] font-bold text-xs hover:bg-[#F3E5AB] transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Download PDF Bill
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 📜 Printable Tax Invoice Container */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1 bg-white" id="printable-invoice">

          {/* Header & Luxury Hotel Crest */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-[#0D3B29]/30 pb-5 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-full bg-[#0D3B29] text-luxury-gold font-serif font-bold flex items-center justify-center text-base shadow-md border border-luxury-gold">
                  G
                </span>
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0D3B29] tracking-wider uppercase">
                    GONA HOTEL & RESTAURANT
                  </h1>
                  <span className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest block">
                    Luxury Resort & Organic Agro Farm
                  </span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-700 pl-11">
                Trade Name: GONA FARM AND HOLIDAY HOME • Legal Name: MITHILESH KUMAR SINGH
              </p>
              <p className="text-[11px] text-gray-600 font-medium pl-11">
                📍 Hotel Address: Village - Semari, Post - Sarso, Chunar Road, Mirzapur, Uttar Pradesh - 231201
              </p>
              <p className="text-[11px] text-gray-600 font-medium pl-11">
                🏢 Reg. Address: Akhara Mohal Babhanauli, Robertsganj, Sonbhadra, Uttar Pradesh - 231216
              </p>
              <p className="text-[11px] text-gray-600 font-medium pl-11">
                📞 Mobile: +91 96966 31621 / +91 79050 79819 | ✉️ info@gonahotel.com
              </p>
              <div className="pt-1.5 pl-11 flex flex-wrap gap-2 text-[10px] font-mono font-bold text-[#0D3B29]">
                <span className="bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">GSTIN: 09AAKHM1332D1ZH</span>
                <span className="bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">SAC Code: 9963</span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 border-l sm:border-l-0 border-gray-200 pl-3 sm:pl-0">
              <span className={`inline-block px-3.5 py-1 text-white font-bold text-[11px] rounded-full mb-1.5 uppercase tracking-wider shadow-sm ${statusStr === 'VERIFIED' || statusStr === 'PAID' || statusStr === 'CONFIRMED'
                  ? 'bg-green-700'
                  : statusStr === 'PAYMENT_SUBMITTED'
                    ? 'bg-amber-600'
                    : 'bg-red-600'
                }`}>
                {statusStr === 'VERIFIED' || statusStr === 'PAID' ? 'OFFICIAL TAX INVOICE (PAID)' : `STATUS: ${statusStr}`}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#0D3B29] font-mono">{invoiceData.invoiceId}</h3>
              <p className="text-[11px] text-gray-500">
                Date: {invoiceData.date ? new Date(invoiceData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN')}
              </p>
              {(invoiceData.utrNumber || invoiceData.paymentId) && (
                <p className="text-[11px] text-gray-600 font-mono font-semibold">UTR / Payment Ref: {invoiceData.utrNumber || invoiceData.paymentId}</p>
              )}
            </div>
          </div>

          {/* Billed To & Service Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-luxury-gold/40 text-xs shadow-sm">
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

              {/* Highlighted Paid Amount in Header Box */}
              <div className="mt-2 inline-block px-3 py-1 bg-[#0D3B29] text-luxury-gold rounded-lg font-bold text-xs shadow">
                Paid Amount: ₹{grandTotal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* 📋 Line Items Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0D3B29] text-luxury-gold uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">S.No & Item Description</th>
                  <th className="py-3 px-3 text-center">HSN/SAC</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Unit Price (₹)</th>
                  <th className="py-3 px-4 text-right">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {itemsList.map((item, idx) => {
                  const qty = item.quantity || 1;
                  const unitPrice = Math.round(item.amount / qty);

                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        <span className="font-bold text-gray-400 mr-2">{idx + 1}.</span>
                        {item.description}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-gray-500">9963</td>
                      <td className="py-3 px-3 text-center font-bold text-gray-700">{qty}</td>
                      <td className="py-3 px-3 text-right text-gray-600 font-mono">₹{unitPrice.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900 font-mono">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 💰 Calculations & Tax Breakdown Section */}
          <div className="border-t-2 border-[#0D3B29]/20 pt-4 flex flex-col sm:flex-row justify-between items-start gap-6">

            {/* Left: GST & Payment Details */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 text-xs text-gray-700 space-y-2 max-w-sm w-full">
              <p className="font-bold text-[#0D3B29] flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Payment & Tax Summary
              </p>
              <div className="space-y-1 text-[11px]">
                <p className="flex justify-between">
                  <span className="text-gray-500">Payment Status:</span>
                  <strong className="text-emerald-800">{statusStr}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">GST Rate Applied:</span>
                  <strong>5% (SGST 2.5% + CGST 2.5%)</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">GST Amount:</span>
                  <strong>₹{calculatedTax.toLocaleString('en-IN')}</strong>
                </p>
              </div>
              <p className="text-[10px] text-gray-500 pt-2 border-t border-emerald-200/60">
                Official computer-generated tax invoice issued by Gona Hotel & Restaurant.
              </p>
            </div>

            {/* Right: Bill Calculation Table */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900 font-mono">₹{subtotalVal.toLocaleString('en-IN')}</span>
              </div>

              {discountVal > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span className="font-mono">-₹{discountVal.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 pt-1.5 border-t border-gray-100">
                <span>Net Taxable Amount</span>
                <span className="font-semibold text-gray-900 font-mono">₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>

              {calculatedTax > 0 && (
                <div className="flex justify-between text-gray-700 font-semibold pt-1 border-t border-gray-200">
                  <span>GST (5%)</span>
                  <span className="text-[#0D3B29] font-mono">₹{calculatedTax.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* 🌟 GRAND TOTAL PAID CARD 🌟 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0D3B29] to-[#144d36] text-white flex justify-between items-center shadow-lg mt-3 border border-luxury-gold">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-luxury-gold block">
                    Total Amount Paid
                  </span>
                  <span className="text-xs text-gray-200">Inclusive of all taxes</span>
                </div>
                <span className="font-serif text-2xl font-bold text-luxury-gold">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* 🖋️ Official Hotel Stamp & Signature Seal */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <div className="text-center sm:text-left space-y-0.5">
              <p className="font-bold text-[#0D3B29] text-xs">Thank you for staying & dining with Gona Hotel & Restaurant!</p>
              <p>For any queries, please present this computer-generated tax invoice.</p>
              <p className="text-[10px] text-gray-400">E. & O.E. • Subject to Mirzapur Jurisdiction</p>
            </div>

            <div className="text-center border-t sm:border-t-0 sm:border-l border-gray-200 pl-0 sm:pl-6 pt-3 sm:pt-0 shrink-0">
              <div className="w-36 h-14 border-2 border-dashed border-luxury-gold rounded-xl flex flex-col items-center justify-center bg-amber-50/60 p-1 mx-auto shadow-inner">
                <Award className="w-4 h-4 text-[#0D3B29]" />
                <span className="text-[10px] font-extrabold text-[#0D3B29] uppercase tracking-tighter">
                  Gona Hotel Seal
                </span>
                <span className="text-[8px] text-emerald-800 font-bold">VERIFIED TAX INVOICE</span>
              </div>
              <p className="text-[10px] font-bold text-[#0D3B29] mt-1.5">Authorized Signatory</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
