import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Avatar } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  IdcardOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { GlobalContext } from '../../Context/GlobalContext';

export default function Profile() {
  const navigate = useNavigate();
  const { data, dispatch } = useContext(GlobalContext);
  const user = data.user || {};

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fadeIn duration-500 text-left">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold mb-6 hover:text-[#c75b3a] transition-colors border-none bg-transparent cursor-pointer"
        style={{ color: 'var(--stone)' }}
      >
        <ArrowLeftOutlined /> Back
      </button>

      {/* Main Profile Card with Elegant Framing */}
      <div 
        className="bg-white rounded-3xl border overflow-hidden"
        style={{ 
          borderColor: 'rgba(176, 141, 87, 0.18)',
          boxShadow: '0 20px 40px -15px rgba(28, 25, 23, 0.07)'
        }}
      >
        {/* Warm Terracotta Banner */}
        <div 
          className="h-44 w-full relative overflow-hidden" 
          style={{ 
            background: 'linear-gradient(135deg, #c75b3a 0%, #d47657 60%, #b08d57 100%)' 
          }}
        >
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 left-12 w-48 h-48 rounded-full bg-black/10 blur-xl" />
        </div>

        {/* Profile Details Body */}
        <div className="px-6 sm:px-10 pb-10 relative">
          
          {/* Avatar & Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 -mt-16 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative">
                <Avatar
                  size={110}
                  src="../images/team_01.jpg"
                  icon={<UserOutlined />}
                  className="!border-4 !border-white !shadow-xl"
                  style={{ background: '#f2efe8' }}
                />
                <div className="absolute bottom-1 right-1 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-xs shadow-md">
                  <CheckCircleFilled style={{ fontSize: 11 }} />
                </div>
              </div>

              <div className="mb-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {user.name || user.fullname || 'Mitul Vaniya'}
                  </h1>
                </div>
                <p className="text-xs font-medium mt-1 flex items-center justify-center sm:justify-start gap-1.5" style={{ color: 'var(--stone)' }}>
                  <MailOutlined className="text-[#c75b3a]" /> {user.email || 'user@khoj.com'}
                </p>
              </div>
            </div>

            {/* Account Badges */}
            <div className="flex items-center justify-center gap-2">
              <Tag 
                className="!rounded-full !border-none !px-4 !py-1.5 !text-xs !font-extrabold !uppercase !tracking-wider"
                style={{ background: 'rgba(199,91,58,0.12)', color: '#c75b3a' }}
              >
                <SafetyCertificateOutlined className="mr-1" />
                {data.isMerchant ? 'Merchant Partner' : 'Customer Account'}
              </Tag>
              {user.email === 'admin@gmail.com' && (
                <Tag className="!rounded-full !border-none !px-4 !py-1.5 !text-xs !font-bold !bg-amber-100 !text-amber-800">
                  Administrator
                </Tag>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-5 rounded-2xl border" style={{ background: '#faf8f5', borderColor: 'rgba(176,141,87,0.14)' }}>
            <div className="p-2 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--stone)' }}>
                Account Verification
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center justify-center sm:justify-start gap-1.5">
                <CheckCircleOutlined /> Active & Verified Profile
              </span>
            </div>

            <div className="p-2 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-[#e8e4d9]">
              <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--stone)' }}>
                Role Classification
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#1c1917] block">
                {data.isMerchant ? 'Service Provider Partner' : 'Standard Verified Client'}
              </span>
            </div>

            <div className="p-2 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-[#e8e4d9]">
              <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--stone)' }}>
                Platform Membership
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#1c1917] flex items-center justify-center sm:justify-start gap-1.5">
                <ClockCircleOutlined className="text-[#b08d57]" /> Member Since 2026
              </span>
            </div>
          </div>

          {/* Personal Credentials Section */}
          <div className="mb-8">
            <h3 className="text-xs font-extrabold uppercase tracking-wider mb-4 flex items-center gap-2 text-[#1c1917]">
              <IdcardOutlined style={{ color: '#c75b3a' }} /> Personal Credentials & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Email */}
              <div className="p-4 rounded-2xl border bg-white hover:border-[#c75b3a]/40 transition-all duration-300 flex items-center gap-3.5" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#c75b3a] bg-[#c75b3a]/10 flex-shrink-0 text-base">
                  <MailOutlined />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--stone)' }}>
                    Email Address
                  </span>
                  <span className="text-sm font-bold text-[#1c1917]">
                    {user.email || 'user@khoj.com'}
                  </span>
                </div>
              </div>

              {/* Card 2: Phone */}
              <div className="p-4 rounded-2xl border bg-white hover:border-[#c75b3a]/40 transition-all duration-300 flex items-center gap-3.5" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#c75b3a] bg-[#c75b3a]/10 flex-shrink-0 text-base">
                  <PhoneOutlined />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--stone)' }}>
                    Phone Line
                  </span>
                  <span className="text-sm font-bold text-[#1c1917]">
                    {user.phone || '+91 98765 43210'}
                  </span>
                </div>
              </div>

              {/* Card 3: City */}
              <div className="p-4 rounded-2xl border bg-white hover:border-[#c75b3a]/40 transition-all duration-300 flex items-center gap-3.5" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#c75b3a] bg-[#c75b3a]/10 flex-shrink-0 text-base">
                  <EnvironmentOutlined />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--stone)' }}>
                    City / Region
                  </span>
                  <span className="text-sm font-bold text-[#1c1917]">
                    Surat, Gujarat
                  </span>
                </div>
              </div>

              {/* Card 4: Country */}
              <div className="p-4 rounded-2xl border bg-white hover:border-[#c75b3a]/40 transition-all duration-300 flex items-center gap-3.5" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#c75b3a] bg-[#c75b3a]/10 flex-shrink-0 text-base">
                  <GlobalOutlined />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--stone)' }}>
                    Country
                  </span>
                  <span className="text-sm font-bold text-[#1c1917]">
                    India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* HIGH-QUALITY PROPORTIONAL BUTTON ROW */}
          <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(176,141,87,0.12)' }}>
            <button
              onClick={() => navigate('/khoj-services/myBookings')}
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-none shadow-md shadow-[#c75b3a]/25 hover:shadow-lg hover:shadow-[#c75b3a]/35 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: '#c75b3a' }}
            >
              <CalendarOutlined className="text-base" /> View My Bookings & Invoices
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate('/khoj-services/setting')}
                className="flex-1 sm:flex-none h-11 px-5 rounded-xl font-bold text-xs sm:text-sm text-[#1c1917] bg-white border border-[#e8e4d9] hover:border-[#c75b3a]/50 hover:bg-[#faf8f5] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              >
                <SettingOutlined className="text-stone-500 text-base" /> Account Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none h-11 px-5 rounded-xl font-bold text-xs sm:text-sm text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              >
                <LogoutOutlined className="text-base" /> Logout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
