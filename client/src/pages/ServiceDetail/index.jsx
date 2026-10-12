import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Tag, Button, Input, DatePicker, message, Modal, Steps } from 'antd';
import { InfoCircleOutlined, EnvironmentOutlined, BarChartOutlined, UserOutlined, StarOutlined, ArrowLeftOutlined, CheckCircleOutlined, CompassOutlined, CalendarOutlined, ClockCircleOutlined, FileTextOutlined, CreditCardOutlined } from '@ant-design/icons';
import axios from 'axios';
import Spinner from '../Spinner';
import API from '../../api';
import { GlobalContext } from '../../Context/GlobalContext';
import { getauth } from '../../utils/auth';
import MainDetails from './MainDetails';
import OtherInfo from './OtherInfo';
import Address from './Address';
import OwnerInfo from './OwnerInfo';
import Reviews from './Reviews';
import ServiceRateCard from '../../components/ServiceRateCard';
import CartDrawer from '../../components/CartDrawer';
import { SHARED_MOCK_PROVIDERS, getMockProviderById } from '../../utils/mockProviders';

const { TabPane } = Tabs;

const CATEGORY_IMAGES = {
  electrician: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
  plumber: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop',
  painter: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600&auto=format&fit=crop',
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop',
  carpenter: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop',
  gardener: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop',
  'ac repair': 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop',
  locksmith: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?q=80&w=600&auto=format&fit=crop',
  'pest control': 'https://images.unsplash.com/photo-1587334206502-7b76d54c16a8?q=80&w=600&auto=format&fit=crop',
  appliance: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop',
  'home tutor': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
  beautician: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop',
};

const getCategoryImage = (name) => {
  const key = name?.toLowerCase().trim() || 'cleaning';
  return CATEGORY_IMAGES[key] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
};

// Full mock pool fallback matching AllService mock IDs
const MOCK_DETAIL_POOL = [
  {
    _id: 'mock_elec1', service_id: 'mock_elec1', name: 'Superb Spark Electricians',
    typeObj: { name: 'Electrician' },
    addressObj: { street1: '12, Link Road', street2: 'Andheri West', newCity: { city: 'Mumbai' }, newState: { state: 'Maharashtra' }, newCountry: { country: 'India' }, zipcode: '400053' },
    tag: ['Residential', 'Wiring', 'Emergency', 'Fuse Repairs', 'Safety Testing'],
    ownerObj: { name: 'Rajesh Kumar', email: 'rajesh.electric@gmail.com', phone: '+91 98765 43210', gender: 'Male' },
    experiance: '8', customers_served: '450', rating: 4.9, reviews: 124, price: '₹499/hr',
    description: 'Expert residential and commercial electrical services.'
  },
  {
    _id: 'mock_elec2', service_id: 'mock_elec2', name: 'Watts Up Electrical Services',
    typeObj: { name: 'Electrician' },
    addressObj: { street1: 'B-45, Connaught Place', street2: 'Inner Circle', newCity: { city: 'Delhi' }, newState: { state: 'Delhi' }, newCountry: { country: 'India' }, zipcode: '110001' },
    tag: ['Commercial', 'Short Circuit', 'Maintenance', 'Breaker Checks'],
    ownerObj: { name: 'Sanjay Dutt', email: 'sanjay.watts@yahoo.com', phone: '+91 88822 33441', gender: 'Male' },
    experiance: '6', customers_served: '310', rating: 4.7, reviews: 82, price: '₹449/hr',
    description: 'Fast and reliable electrical troubleshooting for office buildings.'
  },
  {
    _id: 'mock_elec3', name: 'PowerPros Quick Repair',
    typeObj: { name: 'Electrician' },
    addressObj: { street1: '321, 5th Cross', street2: 'Indiranagar', newCity: { city: 'Bangalore' }, newState: { state: 'Karnataka' }, newCountry: { country: 'India' }, zipcode: '560038' },
    tag: ['Smart Home', 'Appliance Install', 'Wiring', 'Automation'],
    ownerObj: { name: 'Vijay Gowda', email: 'vijay.powerpros@outlook.com', phone: '+91 94433 11225', gender: 'Male' },
    experiance: '10', customers_served: '580', rating: 4.8, reviews: 198, price: '₹549/hr',
    description: 'Certified premium electrical specialists.'
  },
  {
    _id: 'mock_plumb1', name: 'Quick Leak Plumbers',
    typeObj: { name: 'Plumber' },
    addressObj: { street1: 'Flat 101, Rajpur Road', street2: 'Civil Lines', newCity: { city: 'Delhi' }, newState: { state: 'Delhi' }, newCountry: { country: 'India' }, zipcode: '110054' },
    tag: ['Leak Repair', 'Fitting', 'Drain Cleaning', 'Tap Fixes'],
    ownerObj: { name: 'Amit Sharma', email: 'amit.plumbing@gmail.com', phone: '+91 87654 32109', gender: 'Male' },
    experiance: '5', customers_served: '280', rating: 4.7, reviews: 89, price: '₹399/hr',
    description: 'Your local leak detection and drainage specialists.'
  },
  {
    _id: 'mock_plumb2', name: 'Flow-Right Plumbing Experts',
    typeObj: { name: 'Plumber' },
    addressObj: { street1: 'Shop 4, Bandra West', street2: 'Linking Road', newCity: { city: 'Mumbai' }, newState: { state: 'Maharashtra' }, newCountry: { country: 'India' }, zipcode: '400050' },
    tag: ['Bathroom Fitting', 'Water Filter', 'Pipes', 'Clogging'],
    ownerObj: { name: 'Dinesh Mane', email: 'dinesh.flowright@gmail.com', phone: '+91 97722 55663', gender: 'Male' },
    experiance: '7', customers_served: '340', rating: 4.8, reviews: 95, price: '₹420/hr',
    description: 'Specializing in bathroom renovations.'
  },
  {
    _id: 'mock_clean1', name: 'Elite Home Cleaning Services',
    typeObj: { name: 'Cleaning' },
    addressObj: { street1: 'Flat 302, Kothrud', street2: 'Paud Road', newCity: { city: 'Pune' }, newState: { state: 'Maharashtra' }, newCountry: { country: 'India' }, zipcode: '411038' },
    tag: ['Deep Cleaning', 'Sanitization', 'Kitchen Cleaning', 'Mopping'],
    ownerObj: { name: 'Sunita Patil', email: 'sunita.eliteclean@gmail.com', phone: '+91 65432 10987', gender: 'Female' },
    experiance: '3', customers_served: '150', rating: 4.6, reviews: 43, price: '₹299/hr',
    description: 'Professional deep house cleaning and sanitization.'
  },
  {
    _id: 'mock_clean2', name: 'Sparkle & Shine Deep Cleaners',
    typeObj: { name: 'Cleaning' },
    addressObj: { street1: 'Building 14, Worli', street2: 'Sea Face Road', newCity: { city: 'Mumbai' }, newState: { state: 'Maharashtra' }, newCountry: { country: 'India' }, zipcode: '400018' },
    tag: ['Sofa Cleaning', 'Bathroom Deep Clean', 'Disinfection', 'Dusting'],
    ownerObj: { name: 'Kiran Rao', email: 'kiran.sparkle@gmail.com', phone: '+91 92233 44556', gender: 'Male' },
    experiance: '5', customers_served: '270', rating: 4.8, reviews: 91, price: '₹349/hr',
    description: 'Steam sanitizing and sofa vacuuming services.'
  }
];

// ─── BOOKING STEP CONSTANTS ─────────────────────
const BOOKING_STEPS = [
  { title: 'Select Slot', icon: <CalendarOutlined /> },
  { title: 'Review Details', icon: <FileTextOutlined /> },
  { title: 'Confirmed', icon: <CheckCircleOutlined /> },
];

function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { data: globalData } = useContext(GlobalContext);
  const auth = getauth();
  const isLoggedIn = globalData.isLoggedIn || !!auth;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Booking multi-step state
  const [bookingStep, setBookingStep] = useState(0); // 0=form, 1=review, 2=confirmed
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');
  const [liveRating, setLiveRating] = useState(null);
  const [liveReviewsCount, setLiveReviewsCount] = useState(null);

  // Multi-item cart & package builder states
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = (serviceItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === serviceItem.id);
      if (existing) {
        return prev.map((i) => (i.id === serviceItem.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...serviceItem, quantity: 1 }];
    });
    message.success(`Added "${serviceItem.title}" to your package!`);
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedFromCart = async (orderPayload) => {
    setCartOpen(false);
    setBookingLoading(true);
    const newBookingId = 'bk_' + Date.now();
    const payload = {
      _id: newBookingId,
      userId: globalData.user?._id || localStorage.getItem('user_id') || 'guest',
      userName: globalData.user?.name || globalData.user?.fullname || 'Guest User',
      userEmail: globalData.user?.email || '',
      userPhone: globalData.user?.number || '',
      serviceId: data._id || data.service_id || serviceId,
      serviceName: data.name,
      serviceCategory: data.typeObj?.name || 'Electrician',
      serviceOwnerName: data.ownerObj?.name || 'Rajesh Kumar',
      serviceOwnerPhone: data.ownerObj?.phone || '+91 98765 43210',
      servicePrice: `₹${orderPayload.finalTotal}`,
      cartItems: orderPayload.cartItems,
      appliedCoupon: orderPayload.appliedCoupon?.code || '',
      couponDiscount: orderPayload.couponDiscount || 0,
      walletDeduction: orderPayload.walletDeduction || 0,
      bookingDate: orderPayload.bookingDate,
      timeSlot: orderPayload.bookingTime,
      notes: orderPayload.bookingNotes || '',
      address: orderPayload.bookingAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(API.createBooking, payload);
    } catch (e) {
      console.log('Local booking fallback active');
    } finally {
      try {
        const existing = JSON.parse(localStorage.getItem('local_bookings') || '[]');
        existing.unshift(payload);
        localStorage.setItem('local_bookings', JSON.stringify(existing));
      } catch (e) {
        console.error(e);
      }
      setConfirmedBookingId(newBookingId);
      setBookingStep(2);
      setShowBookingModal(true);
      setCartItems([]);
      setBookingLoading(false);
      message.success('🎉 Custom package booked successfully with discounts!');
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(API.getServiceById.replace(':serviceId', serviceId))
      .then((response) => {
        if (response.data.success && response.data.data.length > 0) {
          setData(response.data.data[0]);
        } else {
          const fallback = getMockProviderById(serviceId) || MOCK_DETAIL_POOL.find(p => p._id === serviceId) || SHARED_MOCK_PROVIDERS[0];
          if (fallback) setData(fallback);
        }
      })
      .catch((error) => {
        console.log('Using local provider data fallback for:', serviceId);
        const fallback = getMockProviderById(serviceId) || MOCK_DETAIL_POOL.find(p => p._id === serviceId) || SHARED_MOCK_PROVIDERS[0];
        if (fallback) setData(fallback);
      })
      .finally(() => setLoading(false));
  }, [serviceId]);

  // ─── STEP 1: Validate form & proceed to review ─────────
  const handleProceedToReview = () => {
    if (!bookingDate) {
      message.error('Please select a booking date!');
      return;
    }
    if (!bookingTime) {
      message.error('Please select a time slot!');
      return;
    }
    setBookingStep(1);
    setShowBookingModal(true);
  };

  // ─── STEP 2: Confirm booking & POST to API ────────────
  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    const newBookingId = 'bk_' + Date.now();
    const payload = {
      _id: newBookingId,
      userId: globalData.user?._id || localStorage.getItem('user_id') || 'guest_demo',
      userName: globalData.user?.name || globalData.user?.fullname || 'Demo Customer',
      userEmail: globalData.user?.email || 'customer@khoj.app',
      userPhone: globalData.user?.number || '+91 98765 43210',
      serviceId: data._id || data.service_id || serviceId,
      serviceName: data.name,
      serviceCategory: data.typeObj?.name || 'Electrician',
      serviceOwnerName: data.ownerObj?.name || 'Rajesh Kumar',
      serviceOwnerPhone: data.ownerObj?.phone || '+91 98765 43210',
      servicePrice: data.price || '₹499/hr',
      bookingDate: bookingDate ? bookingDate.toISOString() : new Date().toISOString(),
      timeSlot: bookingTime || 'Morning (9 AM - 12 PM)',
      notes: bookingNotes || '',
      address: bookingAddress || 'Local Area, Surat',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const response = await axios.post(API.createBooking, payload);
      if (response.data && response.data.success) {
        setConfirmedBookingId(response.data.data._id || newBookingId);
      } else {
        setConfirmedBookingId(newBookingId);
      }
    } catch (error) {
      console.log('Booking server fallback mode active');
      setConfirmedBookingId(newBookingId);
    } finally {
      // Always store locally so My Bookings page displays the new booking instantly
      try {
        const existing = JSON.parse(localStorage.getItem('local_bookings') || '[]');
        existing.unshift(payload);
        localStorage.setItem('local_bookings', JSON.stringify(existing));
      } catch (e) {
        console.error(e);
      }

      setBookingStep(2);
      message.success('Booking confirmed successfully!');
      setBookingLoading(false);
    }
  };

  // ─── STEP 3: Close modal & reset ──────────────────────
  const handleBookingDone = () => {
    setShowBookingModal(false);
    setBookingStep(0);
    setBookingDate(null);
    setBookingTime('');
    setBookingNotes('');
    setBookingAddress('');
  };

  const handleViewMyBookings = () => {
    setShowBookingModal(false);
    navigate('/khoj-services/myBookings');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn duration-500 text-left">
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold mb-6 hover:text-[#c75b3a] transition-colors border-none bg-transparent cursor-pointer"
        style={{ color: 'var(--stone)' }}
      >
        <ArrowLeftOutlined /> Back to listings
      </button>

      {loading ? (
        <Spinner />
      ) : data ? (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDE: Portfolio, Details & Tabs (65% width) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-8">
            
            {/* Header Hero Cover */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
              <div className="h-48 sm:h-80 w-full relative bg-[#f2efe8]">
                <img 
                  src={getCategoryImage(data.typeObj?.name)} 
                  alt={data.name} 
                  className="w-full h-full object-cover filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 text-left text-white">
                <Tag 
                  className="!border-none !rounded-full !px-2.5 sm:!px-3 !py-0.5 sm:!py-1 !text-[9px] sm:!text-[10px] !font-bold !uppercase !tracking-wider !mb-1.5 sm:!mb-3 shadow-md"
                  style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', color: '#fff' }}
                >
                  {data.typeObj?.name || 'Verified Service'}
                </Tag>
                <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight mt-0.5 sm:mt-1 text-white leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {data.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 sm:mt-4 text-[11px] sm:text-xs font-light text-white/80">
                  <span className="flex items-center gap-1.5"><StarOutlined style={{ color: 'var(--gold)' }} /> <b>{liveRating || data.rating || '4.8'}</b> ({liveReviewsCount || data.reviews || '45'})</span>
                  <span>●</span>
                  <span>📍 {data.addressObj?.newCity?.city || 'Local Area'}</span>
                  <span>●</span>
                  <span className="flex items-center gap-1"><CheckCircleOutlined style={{ color: '#06E07F' }} /> 100% Verified</span>
                </div>
              </div>
            </div>

            {/* Profile Content Tabs */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-8 shadow-sm" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
              <Tabs 
                defaultActiveKey="ratecard"
                className="[&_.ant-tabs-nav]:!mb-8 [&_.ant-tabs-tab-active]:!text-[#c75b3a] [&_.ant-tabs-ink-bar]:!bg-[#c75b3a] [&_.ant-tabs-tab]:hover:!text-[#c75b3a]"
              >
                <TabPane tab={<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#c75b3a]">🛠️ Rate Card & Packages</span>} key="ratecard">
                  <ServiceRateCard 
                    category={data.typeObj?.name} 
                    cartItems={cartItems} 
                    onAddToCart={handleAddToCart} 
                    onUpdateQty={handleUpdateQty} 
                  />
                </TabPane>
                <TabPane tab={<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider"><InfoCircleOutlined /> Details</span>} key="1">
                  <MainDetails data={data} />
                </TabPane>
                <TabPane tab={<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider"><EnvironmentOutlined /> Location</span>} key="2">
                  <Address data={data} />
                </TabPane>
                <TabPane tab={<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider"><BarChartOutlined /> Performance</span>} key="3">
                  <OtherInfo data={data} />
                </TabPane>
                <TabPane tab={<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider"><UserOutlined /> Owner Info</span>} key="4">
                  <OwnerInfo data={data} />
                </TabPane>
                <TabPane tab={<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider"><StarOutlined /> Reviews</span>} key="5">
                  <Reviews 
                    serviceName={data.name} 
                    onRatingUpdate={(newRating, newCount) => {
                      setLiveRating(newRating);
                      setLiveReviewsCount(newCount);
                    }}
                  />
                </TabPane>
              </Tabs>
            </div>
          </div>

          {/* RIGHT SIDE: Booking Widget (35% width) */}
          <div className="w-full lg:w-[35%] sticky top-28 bg-white rounded-3xl border p-6 shadow-md" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
            
            {/* Rates header */}
            <div className="flex items-end justify-between border-b pb-4 mb-6" style={{ borderColor: 'rgba(176,141,87,0.08)' }}>
              <div>
                <span className="text-2xl font-black" style={{ color: 'var(--terracotta)' }}>{data.price || '₹350/hr'}</span>
                <span className="text-xs font-light text-slate-400 block mt-0.5">Transparent rate, no hidden costs</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold block text-[#c75b3a]">Verified Expert</span>
                <span className="text-xs text-slate-400 font-mono">{data.experiance || '5'} Years Experience</span>
              </div>
            </div>

            {/* Custom Package Highlight Banner if items in cart */}
            {cartItems.length > 0 && (
              <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/40 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1c1917]">
                    📦 {cartItems.length} Service{cartItems.length > 1 ? 's' : ''} in Package
                  </span>
                  <span className="text-sm font-black text-[#c75b3a]">
                    ₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  🎉 Save up to ₹150 with KHOJFIRST & Khoj Wallet!
                </span>
                <button
                  onClick={() => setCartOpen(true)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#c75b3a] hover:bg-[#b04f30] border-none cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  View Cart & Apply Discounts ➔
                </button>
              </div>
            )}

            {/* Booking Form */}
            <div className="flex flex-col gap-4 text-left">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>Select Booking Date</label>
                <DatePicker 
                  value={bookingDate}
                  onChange={date => setBookingDate(date)}
                  className="w-full !rounded-xl !border-[#e8e4d9] !py-2.5 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
                  placeholder="Select Date"
                  disabledDate={(current) => current && current.valueOf() < Date.now() - 86400000}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>Select Time Slot</label>
                <select 
                  value={bookingTime}
                  onChange={e => setBookingTime(e.target.value)}
                  className="w-full rounded-xl border border-[#e8e4d9] py-2.5 px-3 hover:border-[#c75b3a]/30 focus:border-[#c75b3a]/50 outline-none transition-all text-sm text-[#1c1917]"
                  style={{ background: '#fff' }}
                >
                  <option value="">Choose time slot</option>
                  <option value="Morning (9 AM - 12 PM)">🌅 Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon (12 PM - 3 PM)">☀️ Afternoon (12 PM - 3 PM)</option>
                  <option value="Evening (3 PM - 6 PM)">🌇 Evening (3 PM - 6 PM)</option>
                  <option value="Night (6 PM - 9 PM)">🌙 Night (6 PM - 9 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>Your Address</label>
                <Input 
                  value={bookingAddress}
                  onChange={e => setBookingAddress(e.target.value)}
                  className="!rounded-xl !border-[#e8e4d9] !py-2.5 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
                  placeholder="Where should the professional visit?"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>Special Instructions</label>
                <Input.TextArea 
                  value={bookingNotes}
                  onChange={e => setBookingNotes(e.target.value)}
                  rows={3}
                  className="!rounded-xl !border-[#e8e4d9] hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
                  placeholder="Describe the task (e.g. kitchen sink leaking...)"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleProceedToReview}
                className="w-full h-12 mt-2 rounded-xl font-bold text-sm text-white bg-[#c75b3a] hover:bg-[#b04f30] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-none shadow-md shadow-[#c75b3a]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Review & Confirm Booking ➔
              </button>

              <div className="text-center mt-3 pt-3 border-t border-[#e8e4d9]/50">
                <span className="text-[10px] leading-relaxed block" style={{ color: 'var(--stone)' }}>
                  🔒 Secure booking. You won't be charged until the work is completed.
                </span>
              </div>
            </div>

            {/* Quick directions link */}
            <div className="mt-4 pt-3 border-t border-[#e8e4d9]/50 flex items-center justify-between text-xs">
              <span style={{ color: 'var(--stone)' }}>Need directions?</span>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${data.lat || 21.1702},${data.lng || 72.8311}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold flex items-center gap-1 hover:text-[#c75b3a] transition-colors"
                style={{ color: 'var(--terracotta)' }}
              >
                Open Google Maps <CompassOutlined />
              </a>
            </div>
          </div>

          {/* ─── MOVIE-TICKET STYLE BOOKING MODAL ─────────────── */}
          <Modal
            open={showBookingModal}
            footer={null}
            onCancel={() => { setShowBookingModal(false); if (bookingStep < 2) setBookingStep(0); }}
            centered
            width={520}
            closable={bookingStep < 2}
            maskClosable={bookingStep < 2}
          >
            <div className="p-4 font-sans">
              {/* Progress Steps */}
              <Steps 
                current={bookingStep} 
                size="small" 
                className="mb-8 [&_.ant-steps-item-finish_.ant-steps-item-icon]:!bg-[#c75b3a] [&_.ant-steps-item-finish_.ant-steps-item-icon]:!border-[#c75b3a] [&_.ant-steps-item-process_.ant-steps-item-icon]:!bg-[#c75b3a] [&_.ant-steps-item-process_.ant-steps-item-icon]:!border-[#c75b3a]"
                items={BOOKING_STEPS.map(s => ({ title: s.title }))}
              />

              {/* STEP 1: Review Summary (movie ticket style) */}
              {bookingStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>Review Your Booking</h2>
                  
                  {/* Ticket Card */}
                  <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(176,141,87,0.2)' }}>
                    {/* Ticket Header */}
                    <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))' }}>
                      <div className="flex items-center justify-between text-white">
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Service Provider</p>
                          <p className="text-lg font-bold">{data.name}</p>
                        </div>
                        <Tag className="!border-none !rounded-full !px-3 !py-0.5 !text-[10px] !font-bold !bg-white/20 !text-white !uppercase">
                          {data.typeObj?.name}
                        </Tag>
                      </div>
                    </div>

                    {/* Ticket Body */}
                    <div className="bg-white px-5 py-5">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--stone)' }}>
                            <CalendarOutlined className="mr-1" /> Date
                          </p>
                          <p className="text-sm font-semibold text-[#1c1917]">{bookingDate?.format('ddd, DD MMM YYYY')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--stone)' }}>
                            <ClockCircleOutlined className="mr-1" /> Time Slot
                          </p>
                          <p className="text-sm font-semibold text-[#1c1917]">{bookingTime}</p>
                        </div>
                      </div>

                      {bookingAddress && (
                        <div className="mb-4">
                          <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--stone)' }}>
                            <EnvironmentOutlined className="mr-1" /> Visit Address
                          </p>
                          <p className="text-sm text-[#1c1917]">{bookingAddress}</p>
                        </div>
                      )}

                      {bookingNotes && (
                        <div className="mb-4">
                          <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--stone)' }}>
                            <FileTextOutlined className="mr-1" /> Special Notes
                          </p>
                          <p className="text-sm text-slate-600">{bookingNotes}</p>
                        </div>
                      )}

                      {/* Dashed separator like a real ticket */}
                      <div className="border-t-2 border-dashed my-4" style={{ borderColor: 'rgba(176,141,87,0.2)' }} />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--stone)' }}>Estimated Rate</p>
                          <p className="text-xl font-black" style={{ color: 'var(--terracotta)' }}>{data.price || '₹350/hr'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--stone)' }}>Status</p>
                          <Tag className="!rounded-full !border-none !text-[10px] !font-bold !bg-amber-50 !text-amber-600 !px-3 !uppercase">Pending Confirmation</Tag>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <Button 
                      onClick={() => { setBookingStep(0); setShowBookingModal(false); }}
                      className="flex-1 !rounded-xl !font-semibold !py-5 !border-[#e8e4d9]"
                    >
                      Edit Details
                    </Button>
                    <Button
                      type="primary"
                      loading={bookingLoading}
                      onClick={handleConfirmBooking}
                      className="flex-1 !rounded-xl !font-bold !py-5"
                      style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: Success Confirmation */}
              {bookingStep === 2 && (
                <div className="text-center py-4">
                  <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06E07F, #00C853)' }}>
                    <CheckCircleOutlined className="text-4xl text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Booking Confirmed!</h2>
                  <p className="text-sm text-slate-500 mb-2">Your booking has been placed successfully.</p>
                  
                  {confirmedBookingId && (
                    <p className="text-xs font-mono bg-[#f2efe8] inline-block px-3 py-1.5 rounded-lg mb-5" style={{ color: 'var(--stone)' }}>
                      Booking ID: {confirmedBookingId.slice(-8).toUpperCase()}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    <b>{data.ownerObj?.name || 'The provider'}</b> will review your request and confirm within 30 minutes. You can track the status from your bookings dashboard.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      type="primary"
                      onClick={() => {
                        setShowBookingModal(false);
                        navigate(`/khoj-services/myBookings?pay=${confirmedBookingId}`);
                      }}
                      className="flex-1 !rounded-xl !font-bold !py-5"
                      style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: 'none' }}
                      icon={<CreditCardOutlined />}
                    >
                      ⚡ Pay Deposit (Razorpay)
                    </Button>
                    <Button
                      onClick={handleViewMyBookings}
                      className="flex-1 !rounded-xl !font-bold !py-5 !border-[#e8e4d9] !bg-[#faf8f5]"
                    >
                      📋 View Bookings
                    </Button>
                    <Button 
                      onClick={handleBookingDone}
                      className="!rounded-xl !font-semibold !py-5 !border-[#e8e4d9]"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Modal>

          {/* ─── FLOATING CART PILL ─── */}
          {cartItems.length > 0 && (
            <div className="fixed bottom-6 right-6 z-[1000]">
              <div 
                onClick={() => setCartOpen(true)}
                className="bg-[#1c1917] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-4 cursor-pointer hover:bg-[#292524] transition-all border border-amber-400/30 hover:scale-105"
                style={{ boxShadow: '0 12px 30px -5px rgba(199, 91, 58, 0.5)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#c75b3a] flex items-center justify-center font-bold text-sm shadow-xs">
                    🛒
                  </span>
                  <div className="text-left">
                    <span className="text-xs font-black block">
                      {cartItems.length} Service{cartItems.length > 1 ? 's' : ''} • ₹{cartItems.reduce((s, i) => s + i.price * i.quantity, 0)}
                    </span>
                    <span className="text-[10px] text-amber-300 font-medium">
                      Coupons & Wallet Available 🪙
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#c75b3a] text-white flex items-center gap-1">
                  Checkout ➔
                </span>
              </div>
            </div>
          )}

          {/* ─── CART DRAWER ─── */}
          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cartItems={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            provider={data}
            onProceedToCheckout={handleProceedFromCart}
          />
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 font-medium">Service provider details not found.</div>
      )}
    </div>
  );
}

export default ServiceDetail;
