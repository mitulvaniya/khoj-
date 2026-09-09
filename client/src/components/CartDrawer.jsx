import React, { useState } from 'react';
import { Drawer, Tag, Input, DatePicker, message, Divider } from 'antd';
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  ThunderboltFilled,
  SafetyCertificateFilled,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleFilled,
  EnvironmentOutlined,
  ArrowRightOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { AVAILABLE_COUPONS } from './WalletModal';

export default function CartDrawer({
  open,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  provider,
  onProceedToCheckout,
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [useWallet, setUseWallet] = useState(true);

  // Booking schedule inputs
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState('Morning (9 AM - 12 PM)');
  const [bookingAddress, setBookingAddress] = useState(
    localStorage.getItem('user_address') || 'Flat 402, Royal Residency, Vesu, Surat'
  );
  const [bookingNotes, setBookingNotes] = useState('');

  // Wallet balance
  const walletBalance = parseInt(localStorage.getItem('khoj_wallet_balance') || '250', 10);

  // Calculate items subtotal
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate coupon discount
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (itemsSubtotal >= appliedCoupon.minOrder) {
      if (appliedCoupon.discountType === 'flat') {
        couponDiscount = appliedCoupon.discountValue;
      } else if (appliedCoupon.discountType === 'percent') {
        const raw = Math.round((itemsSubtotal * appliedCoupon.discountValue) / 100);
        couponDiscount = Math.min(raw, appliedCoupon.maxDiscount || 200);
      }
    }
  }

  // Calculate wallet discount (max 50% of bill after coupon, up to wallet balance)
  const afterCoupon = Math.max(0, itemsSubtotal - couponDiscount);
  const maxWalletAllowed = Math.min(walletBalance, Math.round(afterCoupon * 0.5), 150);
  const walletDeduction = useWallet ? maxWalletAllowed : 0;

  // Taxes (GST 18% on discounted labor)
  const taxableAmount = Math.max(0, afterCoupon - walletDeduction);
  const gstAmount = Math.round(taxableAmount * 0.18);
  const safetyFee = 0; // Waived!

  // Final total
  const finalTotal = Math.max(149, taxableAmount + gstAmount);
  const totalSavings = couponDiscount + walletDeduction + 29; // includes waived safety fee

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (!found) {
      message.error(`Coupon code "${code}" is invalid.`);
      return;
    }
    if (itemsSubtotal < found.minOrder) {
      message.warning(`Minimum order amount of ₹${found.minOrder} required for ${found.code}.`);
      return;
    }
    setAppliedCoupon(found);
    setCouponCode('');
    message.success(`🎉 Coupon ${found.code} applied! Saved ₹${found.discountValue || '20%'}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    message.info('Coupon removed.');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.error('Your cart is empty. Add services to proceed.');
      return;
    }
    if (!bookingDate) {
      message.error('Please select a preferred service visit date.');
      return;
    }
    if (!bookingAddress.trim()) {
      message.error('Please provide your service address.');
      return;
    }

    const orderPayload = {
      cartItems,
      itemsSubtotal,
      appliedCoupon,
      couponDiscount,
      walletDeduction,
      finalTotal,
      totalSavings,
      bookingDate: bookingDate.toISOString(),
      bookingTime,
      bookingAddress,
      bookingNotes,
      provider,
    };

    // Deduct wallet balance if used
    if (walletDeduction > 0) {
      localStorage.setItem('khoj_wallet_balance', (walletBalance - walletDeduction).toString());
    }

    onProceedToCheckout(orderPayload);
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#c75b3a] text-white flex items-center justify-center font-bold text-sm shadow-md">
              <ShoppingCartOutlined />
            </span>
            <div>
              <h3 className="text-base font-black text-[#1c1917] m-0" style={{ fontFamily: "'Outfit', sans-serif" }}>
                My Service Cart
              </h3>
              <span className="text-[11px] text-slate-500 block">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} from {provider?.name || 'Verified Pro'}
              </span>
            </div>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer font-semibold"
            >
              Clear Cart
            </button>
          )}
        </div>
      }
      placement="right"
      width={460}
      open={open}
      onClose={onClose}
      className="[&_.ant-drawer-body]:!p-0 [&_.ant-drawer-header]:!border-[#e8e4d9]"
    >
      <div className="flex flex-col h-full bg-[#fbf9f6] text-left font-sans">
        
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Cart Empty State */}
          {cartItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <ShoppingCartOutlined style={{ fontSize: 48, color: '#c75b3a', opacity: 0.4 }} />
              <h4 className="text-base font-bold text-slate-700 mt-3">Your cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Select items from the service menu to configure your custom service package.
              </p>
            </div>
          ) : (
            <>
              {/* Selected Services List */}
              <div className="bg-white rounded-2xl border border-[#e8e4d9] p-4 shadow-xs space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Selected Service Items
                </span>
                
                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-[#1c1917] mb-0.5">{item.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>₹{item.price} each</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold">{item.warranty || '30-day warranty'}</span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#e8e4d9] rounded-xl bg-[#faf8f5] px-1.5 py-1">
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center rounded-lg text-slate-600 hover:text-[#c75b3a] hover:bg-white border-none cursor-pointer text-xs"
                          >
                            <MinusOutlined style={{ fontSize: 10 }} />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-[#1c1917]">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center rounded-lg text-slate-600 hover:text-[#c75b3a] hover:bg-white border-none cursor-pointer text-xs"
                          >
                            <PlusOutlined style={{ fontSize: 10 }} />
                          </button>
                        </div>
                        <span className="text-xs font-black text-[#1c1917] w-14 text-right">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code & Discounts Section */}
              <div className="bg-white rounded-2xl border border-[#e8e4d9] p-4 shadow-xs space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <GiftOutlined className="text-[#c75b3a]" /> Coupons & Promo Codes
                </span>

                {appliedCoupon ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                        <CheckCircleFilled className="text-emerald-600" /> {appliedCoupon.code} Applied!
                      </div>
                      <span className="text-[11px] text-emerald-700 block">
                        Saved ₹{couponDiscount} on this booking
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-rose-500 font-bold hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter Promo Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="!rounded-xl !text-xs font-mono uppercase"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#c75b3a] hover:bg-[#b04f30] border-none cursor-pointer transition-all"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick 1-Tap Coupon Suggestions */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {AVAILABLE_COUPONS.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => handleApplyCoupon(c.code)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#c75b3a] bg-[#c75b3a]/10 hover:bg-[#c75b3a] hover:text-white border border-[#c75b3a]/20 cursor-pointer transition-all flex items-center gap-1"
                        >
                          <ThunderboltFilled /> {c.code} (Save ₹{c.discountValue || '20%'})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Khoj Wallet Balance Option */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-400/40 p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪙</span>
                    <div>
                      <span className="text-xs font-black text-[#1c1917] block">Use Khoj Wallet Cash</span>
                      <span className="text-[11px] text-slate-600 block">
                        Balance: <b className="text-amber-700">₹{walletBalance}</b> • Save up to ₹{maxWalletAllowed}
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useWallet && maxWalletAllowed > 0}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      disabled={maxWalletAllowed === 0}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c75b3a]"></div>
                  </label>
                </div>
                {useWallet && maxWalletAllowed > 0 && (
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-2">
                    ✓ ₹{walletDeduction} will be deducted from your Khoj Wallet balance.
                  </span>
                )}
              </div>

              {/* Schedule & Address Details */}
              <div className="bg-white rounded-2xl border border-[#e8e4d9] p-4 shadow-xs space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Service Visit Details
                </span>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    <CalendarOutlined className="mr-1" /> Preferred Date
                  </label>
                  <DatePicker
                    value={bookingDate}
                    onChange={(date) => setBookingDate(date)}
                    className="w-full !rounded-xl !text-xs !py-2"
                    placeholder="Select Date"
                    disabledDate={(cur) => cur && cur.valueOf() < Date.now() - 86400000}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    <ClockCircleOutlined className="mr-1" /> Time Slot
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full rounded-xl border border-[#e8e4d9] py-2 px-3 text-xs bg-white outline-none"
                  >
                    <option value="Morning (9 AM - 12 PM)">🌅 Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 3 PM)">☀️ Afternoon (12 PM - 3 PM)</option>
                    <option value="Evening (3 PM - 6 PM)">🌇 Evening (3 PM - 6 PM)</option>
                    <option value="Night (6 PM - 9 PM)">🌙 Night (6 PM - 9 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    <EnvironmentOutlined className="mr-1" /> Visit Address
                  </label>
                  <Input
                    value={bookingAddress}
                    onChange={(e) => setBookingAddress(e.target.value)}
                    placeholder="House/Flat No, Street, Locality"
                    className="!rounded-xl !text-xs !py-2"
                  />
                </div>
              </div>

              {/* Itemized Bill Breakdown (Urban Company Style) */}
              <div className="bg-white rounded-2xl border border-[#e8e4d9] p-4 shadow-xs space-y-2 text-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                  Payment Summary
                </span>

                <div className="flex justify-between text-slate-600">
                  <span>Item Total</span>
                  <span className="font-semibold text-[#1c1917]">₹{itemsSubtotal}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                {walletDeduction > 0 && (
                  <div className="flex justify-between text-amber-700 font-semibold">
                    <span>Khoj Wallet Credits</span>
                    <span>-₹{walletDeduction}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Safety & Equipment Fee</span>
                  <span className="text-emerald-600 font-bold">FREE <s className="text-slate-400 font-normal">₹29</s></span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Taxes & GST (18%)</span>
                  <span>₹{gstAmount}</span>
                </div>

                <div className="border-t border-dashed border-slate-200 my-2 pt-2 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-[#1c1917] block">Total Payable</span>
                    <span className="text-[10px] text-slate-400">Includes all taxes and warranty</span>
                  </div>
                  <span className="text-2xl font-black text-[#c75b3a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    ₹{finalTotal}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircleFilled className="text-emerald-600" /> Yay! You saved ₹{totalSavings} on this booking!
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-[#e8e4d9] shadow-lg">
            <button
              onClick={handleCheckout}
              className="w-full h-12 rounded-xl font-bold text-sm text-white bg-[#c75b3a] hover:bg-[#b04f30] flex items-center justify-between px-5 cursor-pointer transition-all border-none shadow-md shadow-[#c75b3a]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="text-left">
                <span className="text-[10px] uppercase font-normal text-white/80 block">Total: ₹{finalTotal}</span>
                <span className="text-xs font-black text-white">Book & Pay Online</span>
              </div>
              <span className="flex items-center gap-1 text-sm font-black">
                Proceed <ArrowRightOutlined />
              </span>
            </button>
            <span className="text-[10px] text-slate-400 block text-center mt-2">
              🔒 Powered by Razorpay • 100% 30-Day Moneyback Guarantee
            </span>
          </div>
        )}
      </div>
    </Drawer>
  );
}
