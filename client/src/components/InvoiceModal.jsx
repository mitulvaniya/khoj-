import React, { useRef } from 'react';
import { Modal, Button, Tag } from 'antd';
import {
  PrinterOutlined,
  SafetyCertificateFilled,
  CheckCircleFilled,
  QrcodeOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';

export default function InvoiceModal({ open, onClose, booking }) {
  const invoiceRef = useRef(null);

  if (!booking) return null;

  const invoiceNo = `KHJ/2026-27/INV-${Math.abs(
    (booking._id || '12345').split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  ).toString().padStart(5, '0')}`;

  const formattedDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN');

  const basePrice = parseInt((booking.servicePrice || '399').toString().replace(/\D/g, ''), 10) || 399;
  const safetyFee = 29;
  const subtotal = basePrice + safetyFee;
  const cgst = parseFloat((subtotal * 0.09).toFixed(2));
  const sgst = parseFloat((subtotal * 0.09).toFixed(2));
  const walletDiscount = 100;
  const totalAmount = (subtotal + cgst + sgst - walletDiscount).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width={720}
      className="!rounded-3xl overflow-hidden font-sans print:!w-full print:!m-0"
    >
      <div className="text-left -m-6 p-6 sm:p-8 bg-white" ref={invoiceRef}>
        {/* Printable Style Sheet */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * { visibility: hidden; }
              .print-invoice-area, .print-invoice-area * { visibility: visible; }
              .print-invoice-area { position: absolute; left: 0; top: 0; width: 100%; }
              .no-print { display: none !important; }
            }
          `
        }} />

        <div className="print-invoice-area">
          {/* Top Bar / Actions */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight" style={{ color: '#c75b3a' }}>
                KHOJ
              </span>
              <Tag color="green" className="!rounded-full font-bold text-[10px] uppercase">
                Tax Invoice &bull; Paid
              </Tag>
            </div>
            <div className="flex items-center gap-2">
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                className="!rounded-xl !font-bold !text-xs !bg-[#fbf9f6] !border-slate-300 hover:!border-[#c75b3a]"
              >
                Print / Save PDF
              </Button>
            </div>
          </div>

          {/* Invoice Header */}
          <div className="grid grid-cols-2 gap-6 pt-6 pb-6 border-b border-slate-200">
            <div>
              <div className="text-lg font-black tracking-tight text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                KHOJ SERVICES TECHNOLOGIES PVT. LTD.
              </div>
              <div className="text-xs text-slate-500 leading-relaxed mt-1">
                Station Road, Near Central Plaza<br />
                Ankleshwar, Gujarat - 393002<br />
                <strong>GSTIN:</strong> 24AAECK9823L1Z8 &bull; <strong>PAN:</strong> AAECK9823L<br />
                <strong>Support:</strong> care@khoj-services.in | +91 1800-202-6000
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-[#1c1917] tracking-tight">TAX INVOICE</div>
              <div className="text-xs text-slate-500 mt-1">
                <div><strong>Invoice No:</strong> {invoiceNo}</div>
                <div><strong>Invoice Date:</strong> {formattedDate}</div>
                <div><strong>Booking ID:</strong> #{booking._id}</div>
                <div><strong>Payment Mode:</strong> Online (Razorpay / UPI Verified)</div>
              </div>
            </div>
          </div>

          {/* Customer & Technician Details */}
          <div className="grid grid-cols-2 gap-6 py-5 border-b border-slate-200 bg-[#fbf9f6] -mx-6 px-6 sm:-mx-8 sm:px-8">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Customer (Billed To)
              </div>
              <div className="font-bold text-sm text-[#1c1917]">{booking.userName || 'Valued Customer'}</div>
              <div className="text-xs text-slate-600 mt-0.5">{booking.userPhone || '+91 98765 43210'}</div>
              <div className="text-xs text-slate-600">{booking.userEmail || 'customer@gmail.com'}</div>
              <div className="text-xs text-slate-500 mt-1 leading-snug">
                <strong>Address:</strong> {booking.address || 'Station Road, Ankleshwar, Gujarat'}
              </div>
            </div>

            <div className="text-right sm:text-left sm:pl-8">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Assigned Service Provider
              </div>
              <div className="font-bold text-sm text-[#1c1917] flex items-center gap-1.5 justify-end sm:justify-start">
                <span>{booking.serviceOwnerName || 'Rameshwar Sharma'}</span>
                <SafetyCertificateFilled className="text-emerald-600 text-xs" />
              </div>
              <div className="text-xs text-slate-600 mt-0.5">{booking.serviceName} ({booking.serviceCategory})</div>
              <div className="text-xs text-slate-500">
                <strong>Verified KYC ID:</strong> GJ-PRO-4819<br />
                <strong>Service Slot:</strong> {new Date(booking.bookingDate || new Date()).toLocaleDateString('en-IN')} ({booking.timeSlot || '10:00 AM - 12:00 PM'})
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 text-[10px] uppercase font-bold text-slate-500">
                  <th className="py-2.5">#</th>
                  <th className="py-2.5">Description of Service & Spares</th>
                  <th className="py-2.5 text-center">HSN/SAC</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 text-slate-400">1</td>
                  <td className="py-3 font-semibold text-slate-800">
                    {booking.serviceName}
                    <div className="text-[11px] font-normal text-slate-500">Professional doorstep diagnostics & labor</div>
                  </td>
                  <td className="py-3 text-center text-slate-500">998713</td>
                  <td className="py-3 text-center font-bold">1</td>
                  <td className="py-3 text-right font-bold text-slate-800">₹{basePrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-3 text-slate-400">2</td>
                  <td className="py-3 font-semibold text-slate-800">
                    Khoj Platform Trust & Safety Insurance
                    <div className="text-[11px] font-normal text-slate-500">Includes 30-Day rework warranty coverage</div>
                  </td>
                  <td className="py-3 text-center text-slate-500">998719</td>
                  <td className="py-3 text-center font-bold">1</td>
                  <td className="py-3 text-right font-bold text-slate-800">₹{safetyFee.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Calculation & Summary */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            {/* 30-Day Warranty Badge & QR Code */}
            <div className="flex items-center gap-4 bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-2xl">
              <div className="w-12 h-12 bg-white rounded-xl border border-emerald-200 flex items-center justify-center text-xl text-emerald-600 flex-shrink-0 shadow-xs">
                <FileProtectOutlined />
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-emerald-900 flex items-center gap-1">
                  <span>30-Day Service Guarantee</span>
                  <CheckCircleFilled className="text-emerald-600 text-[10px]" />
                </div>
                <div className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                  Warranty ID: <strong>WARR-30D-{booking._id.slice(-6).toUpperCase()}</strong>
                  <br />Free technician re-visit if the same issue reoccurs within 30 days.
                </div>
              </div>
            </div>

            {/* Calculations Ledger */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>CGST (9%):</span>
                <span>₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>SGST (9%):</span>
                <span>₹{sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Wallet Bonus Applied:</span>
                <span>-₹{walletDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#1c1917] pt-2 border-t border-slate-300">
                <span>Total Amount Paid:</span>
                <span className="text-[#c75b3a] text-base">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed flex items-center justify-between">
            <div>
              * This is a computer-generated tax invoice. No physical signature required.<br />
              Authorized signatory on behalf of Khoj Services Technologies Pvt. Ltd.
            </div>
            <div className="flex items-center gap-1 font-mono text-slate-500">
              <QrcodeOutlined className="text-base" />
              <span>SCAN-TO-VERIFY</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
