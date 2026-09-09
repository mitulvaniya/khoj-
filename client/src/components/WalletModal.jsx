import React, { useState } from 'react';
import { Modal, Tag, notification } from 'antd';
import {
  GiftOutlined,
  CopyOutlined,
  CheckCircleFilled,
  ShareAltOutlined,
  ThunderboltFilled,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

export const AVAILABLE_COUPONS = [
  {
    code: 'KHOJFIRST',
    discountType: 'flat',
    discountValue: 150,
    minOrder: 299,
    description: 'Flat ₹150 OFF on your first booking above ₹299',
    badge: 'Popular for New Users',
    bg: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-400/40',
  },
  {
    code: 'SUPERPRO',
    discountType: 'percent',
    discountValue: 20,
    maxDiscount: 200,
    minOrder: 399,
    description: '20% OFF up to ₹200 on all repairs & maintenance',
    badge: 'Limited Time',
    bg: 'from-purple-500/10 to-indigo-500/10',
    border: 'border-purple-400/40',
  },
  {
    code: 'MONSOON50',
    discountType: 'flat',
    discountValue: 50,
    minOrder: 199,
    description: 'Flat ₹50 OFF on any quick home inspection or minor repair',
    badge: 'No Minimum Friction',
    bg: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-400/40',
  },
];

export default function WalletModal({ open, onClose, onApplyCoupon }) {
  const [copiedCode, setCopiedCode] = useState('');
  
  // Get wallet balance from localStorage or initialize with ₹250 welcome bonus
  const walletBalance = parseInt(localStorage.getItem('khoj_wallet_balance') || '250', 10);
  const referralCode = 'KHOJ-' + (localStorage.getItem('user_id')?.slice(-4) || 'MITUL').toUpperCase();

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    notification.success({
      message: `Coupon ${code} Copied!`,
      description: 'You can paste or apply it directly in your booking cart.',
      placement: 'topRight',
    });
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`Hey! Use my referral code ${referralCode} on Khoj to get ₹150 OFF your first home service: http://localhost:3000`);
    notification.success({
      message: 'Referral Link Copied!',
      description: 'Share it with friends to earn ₹150 Khoj Coins when they book!',
      placement: 'topRight',
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={540}
      centered
      className="!rounded-3xl overflow-hidden [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!rounded-3xl [&_.ant-modal-content]:!overflow-hidden"
    >
      {/* Header with Warm Terracotta Gradient */}
      <div 
        className="p-6 text-white text-left relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 60%, #c75b3a 140%)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-md">
              🪙
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-400 block">
                Khoj Rewards & Wallet
              </span>
              <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                My Wallet & Discounts
              </h2>
            </div>
          </div>
          <Tag className="!border-none !rounded-full !px-3 !py-1 !bg-emerald-500/20 !text-emerald-300 !text-xs !font-bold">
            Active Member
          </Tag>
        </div>

        {/* Big Balance Showcase Card */}
        <div className="mt-5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/70 block">Available Khoj Credits</span>
            <span className="text-3xl font-black text-white flex items-center gap-1.5 mt-0.5">
              ₹{walletBalance} <span className="text-xs font-normal text-amber-300 uppercase tracking-wider">Khoj Coins</span>
            </span>
            <span className="text-[11px] text-emerald-300 flex items-center gap-1 mt-1 font-medium">
              <CheckCircleFilled /> Usable directly on your bookings (1 Coin = ₹1)
            </span>
          </div>
          <div className="text-right">
            <button
              onClick={handleCopyReferral}
              className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#c75b3a] hover:bg-[#b04f30] border-none cursor-pointer transition-all flex items-center gap-1.5 shadow-md"
            >
              <ShareAltOutlined /> Refer & Earn ₹150
            </button>
          </div>
        </div>
      </div>

      {/* Body: Available Discount Coupons */}
      <div className="p-6 bg-[#faf8f5] text-left space-y-5 max-h-[65vh] overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#1c1917] flex items-center gap-1.5">
              <GiftOutlined className="text-[#c75b3a]" /> Exclusive Coupons & Promo Codes
            </span>
            <span className="text-[11px] text-slate-500">Tap to apply or copy</span>
          </div>

          {/* Coupons List */}
          <div className="space-y-3">
            {AVAILABLE_COUPONS.map((coupon) => (
              <div
                key={coupon.code}
                className={`p-4 rounded-2xl bg-gradient-to-r ${coupon.bg} border ${coupon.border} hover:shadow-md transition-all flex items-center justify-between gap-3`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-[#1c1917] tracking-wider shadow-xs">
                      {coupon.code}
                    </span>
                    <Tag className="!border-none !rounded-full !px-2 !py-0.2 !text-[10px] !font-bold !bg-amber-100 !text-amber-800">
                      {coupon.badge}
                    </Tag>
                  </div>
                  <p className="text-xs font-semibold text-[#1c1917] mt-1">{coupon.description}</p>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Min. order: ₹{coupon.minOrder}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onApplyCoupon) {
                        onApplyCoupon(coupon);
                        onClose();
                      } else {
                        handleCopyCode(coupon.code);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#c75b3a] bg-white border border-[#c75b3a]/30 hover:bg-[#c75b3a] hover:text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {onApplyCoupon ? (
                      <>Apply Now <ThunderboltFilled /></>
                    ) : copiedCode === coupon.code ? (
                      <>Copied! <CheckCircleFilled className="text-emerald-500" /></>
                    ) : (
                      <>Copy <CopyOutlined /></>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Book on Khoj Card (Customer Retention Benefits) */}
        <div className="p-4 rounded-2xl bg-white border border-[#e8e4d9] space-y-2 text-xs text-slate-600">
          <span className="font-bold text-[#1c1917] flex items-center gap-1.5 text-xs">
            <SafetyCertificateOutlined className="text-emerald-600" /> Why customers save more on Khoj:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="bg-[#faf8f5] p-2.5 rounded-xl border border-amber-900/5">
              <span className="font-bold text-[#1c1917] block">₹0 Convenience Fee</span>
              <span>Zero hidden booking charges or inflated platform markups.</span>
            </div>
            <div className="bg-[#faf8f5] p-2.5 rounded-xl border border-amber-900/5">
              <span className="font-bold text-[#1c1917] block">5% Cashback</span>
              <span>Earn 5% Khoj Coins automatically on every completed service.</span>
            </div>
            <div className="bg-[#faf8f5] p-2.5 rounded-xl border border-amber-900/5">
              <span className="font-bold text-[#1c1917] block">30-Day Guarantee</span>
              <span>Free rework assurance if any issue reoccurs within 30 days.</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
