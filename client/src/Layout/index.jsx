import React, { useContext, useEffect, useState } from 'react';
import { Menu, Dropdown, Input, Drawer } from 'antd';
import {
  DotChartOutlined,
  RadarChartOutlined,
  ProfileOutlined,
  LogoutOutlined,
  SettingOutlined,
  SearchOutlined,
  LoginOutlined,
  UserAddOutlined,
  CalendarOutlined,
  ShopOutlined,
  DashboardOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Avatar from 'antd/lib/avatar/avatar';
import axios from 'axios';
import Logo from './Logo';
import { GlobalContext } from '../Context/GlobalContext';
import API from '../api';
import { getauth } from '../utils/auth';
import AIEstimatorModal from '../components/AIEstimatorModal';
import WalletModal from '../components/WalletModal';
import NotificationBell from '../components/NotificationBell';
import HelpSupportModal from '../components/HelpSupportModal';
import { CustomerServiceOutlined } from '@ant-design/icons';

function Index({ children }) {
  const { dispatch, data } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [navSearch, setNavSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const auth = getauth();
  const isLoggedIn = data.isLoggedIn || !!auth;

  /* Scroll detection for navbar background */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Fetch global data once */
  useEffect(() => {
    axios.get(API.categories)
      .then(res => { if (res.data.success) dispatch({ type: 'SET_CATEGORIES', payload: res.data.data }); })
      .catch(console.error);
    axios.get(API.states)
      .then(res => { if (res.data.success) dispatch({ type: 'SET_STATES', payload: res.data.data }); })
      .catch(console.error);
  }, [dispatch]);

  const handleNavSearch = () => {
    if (navSearch.trim()) {
      navigate(`/khoj-services/allServices?category=all&state=all&city=&name=${navSearch.trim()}`);
    }
  };

  /* ─── Role Resolution ──────────────── */
  const user = data.user || {};
  const userEmail = (user.email || localStorage.getItem('user_email') || '').toLowerCase();
  const isAdmin = userEmail === 'admin@gmail.com';
  const isMerchant = !!(user.isMerchant || data.isMerchant || localStorage.getItem('user_is_merchant') === 'true');

  /* ─── Dropdown menus ──────────────── */
  const categoriesMenu = (
    <Menu className="!bg-[#fcfbfa] !border-[#e8e4d9] rounded-xl p-1.5 !shadow-xl">
      <Menu.Item key='c1' icon={<ProfileOutlined className="text-[#c75b3a]" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
        <Link to='/khoj-services/allCategories?category=all&state=all&city=&name=' className="!text-[#5c5650] hover:!text-[#1c1917]">All Categories</Link>
      </Menu.Item>
      {isAdmin && (
        <Menu.Item key='c2' icon={<SettingOutlined className="text-[#b08d57]" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
          <Link to='/khoj-services/addCategory' className="!text-[#5c5650] hover:!text-[#1c1917]">Add New Category</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  /* Analytics Menu — ONLY shown to Admin or Merchants */
  const chartsMenu = (
    <Menu className="!bg-[#fcfbfa] !border-[#e8e4d9] rounded-xl p-1.5 !shadow-xl">
      {isAdmin && (
        <Menu.Item key='a1' icon={<RadarChartOutlined className="text-[#c75b3a]" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
          <Link to='/khoj-services/charts/categories' className="!text-[#5c5650] hover:!text-[#1c1917]">Category Demographics</Link>
        </Menu.Item>
      )}
      <Menu.Item key='a2' icon={<DotChartOutlined className="text-[#b08d57]" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
        <Link to='/khoj-services/charts/services' className="!text-[#5c5650] hover:!text-[#1c1917]">
          {isAdmin ? 'Service Analytics' : 'My Service Metrics'}
        </Link>
      </Menu.Item>
    </Menu>
  );

  /* User Profile Menu with Role Badging */
  const userProfileMenu = (
    <Menu className="!bg-[#fcfbfa] !border-[#e8e4d9] rounded-xl p-1.5 !shadow-xl min-w-[210px]">
      {/* Role Pill Header */}
      <div className="px-3 py-2 border-b border-[#e8e4d9]/70 mb-1">
        <div className="text-xs font-bold text-[#1c1917] truncate">{user.name || userEmail.split('@')[0] || 'My Account'}</div>
        <div className="text-[10px] uppercase font-bold tracking-wider mt-0.5" style={{ color: isAdmin ? '#b08d57' : isMerchant ? '#10b981' : '#c75b3a' }}>
          {isAdmin ? '⚡ Administrator' : isMerchant ? '🛠️ Verified Merchant' : '👤 Customer Account'}
        </div>
      </div>

      {/* Customer Options */}
      {!isMerchant && (
        <Menu.Item key='u0' icon={<CalendarOutlined className="text-[#c75b3a]" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
          <Link to='/khoj-services/myBookings' className="!text-[#5c5650] hover:!text-[#1c1917]">My Bookings</Link>
        </Menu.Item>
      )}

      {/* Merchant Specific Options */}
      {isMerchant && (
        <>
          <Menu.Item key='m1' icon={<ShopOutlined className="text-emerald-600" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
            <Link to='/khoj-services/addService' className="!text-[#5c5650] hover:!text-[#1c1917]">Add New Service</Link>
          </Menu.Item>
          <Menu.Item key='m2' icon={<CalendarOutlined className="text-emerald-600" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
            <Link to='/khoj-services/myBookings' className="!text-[#5c5650] hover:!text-[#1c1917]">Client Bookings</Link>
          </Menu.Item>
          <Menu.Item key='m3' icon={<DotChartOutlined className="text-emerald-600" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
            <Link to='/khoj-services/charts/services' className="!text-[#5c5650] hover:!text-[#1c1917]">Service Analytics</Link>
          </Menu.Item>
        </>
      )}

      {/* Admin Specific Options */}
      {isAdmin && (
        <>
          <Menu.Item key='u4' icon={<DashboardOutlined className="text-amber-600" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
            <Link to='/khoj-services/admin' className="!text-[#5c5650] hover:!text-[#1c1917]">Admin Portal</Link>
          </Menu.Item>
          <Menu.Item key='u5' icon={<SettingOutlined className="text-amber-600" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
            <Link to='/khoj-services/addCategory' className="!text-[#5c5650] hover:!text-[#1c1917]">Manage Categories</Link>
          </Menu.Item>
          <Menu.Item key='u6' icon={<RadarChartOutlined className="text-amber-600" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
            <Link to='/khoj-services/charts/categories' className="!text-[#5c5650] hover:!text-[#1c1917]">Platform Charts</Link>
          </Menu.Item>
        </>
      )}

      <Menu.Divider className="!bg-[#e8e4d9]" />

      <Menu.Item key='u1' icon={<ProfileOutlined className="text-[#c75b3a]" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
        <Link to='/khoj-services/profile' className="!text-[#5c5650] hover:!text-[#1c1917]">Profile</Link>
      </Menu.Item>
      <Menu.Item key='u2' icon={<SettingOutlined className="text-[#b08d57]" />} className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]">
        <Link to='/khoj-services/setting' className="!text-[#5c5650] hover:!text-[#1c1917]">Settings</Link>
      </Menu.Item>
      <Menu.Item
        key='u_help'
        icon={<CustomerServiceOutlined className="text-emerald-600" />}
        onClick={() => setHelpModalOpen(true)}
        className="hover:!bg-[#f2ede4] rounded-lg !text-[#5c5650]"
      >
        <span className="!text-[#5c5650] hover:!text-[#1c1917]">Help & Dispute Desk</span>
      </Menu.Item>

      <Menu.Divider className="!bg-[#e8e4d9]" />
      <Menu.Item
        key='u3'
        icon={<LogoutOutlined className="text-rose-500" />}
        onClick={() => dispatch({ type: 'LOGOUT' })}
        className="hover:!bg-rose-500/10 rounded-lg !text-[#5c5650]"
      >
        <Link to='/login' className="!text-[#5c5650] hover:!text-rose-600">Logout</Link>
      </Menu.Item>
    </Menu>
  );

  const isHome = pathname === '/khoj-services/' || pathname === '/khoj-services' || pathname === '/';

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const walletBalance = parseInt(localStorage.getItem('khoj_wallet_balance') || '250', 10);

  return (
    <div className="min-h-screen font-sans text-[#1c1917] flex flex-col" style={{ background: '#fbf9f6' }}>
      {/* Mounted AI Estimator Modal */}
      <AIEstimatorModal open={aiModalOpen} onClose={() => setAiModalOpen(false)} />
      {/* Mounted Wallet & Discounts Modal */}
      <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      {/* Mounted Help & Dispute Resolution Modal */}
      <HelpSupportModal open={helpModalOpen} onClose={() => setHelpModalOpen(false)} />

      {/* ─── ELITE NAVBAR — Centered Layout ─────────────── */}
      <header
        className="sticky top-0 z-[100] px-3 sm:px-6 py-2.5 sm:py-3 border-b transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(248, 245, 240, 0.95)' : 'rgba(248, 245, 240, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: scrolled ? 'rgba(176, 141, 87, 0.15)' : 'transparent',
        }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* ─── Left: Brand & Core Navigation ─── */}
          <div className="flex items-center gap-3 sm:gap-7 flex-shrink-0">
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-[#c75b3a] hover:bg-stone-200/50 transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
              aria-label="Open Navigation Menu"
            >
              <MenuOutlined style={{ fontSize: 18 }} />
            </button>

            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <Logo />
              <span
                className="text-lg sm:text-xl font-black tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #c75b3a, #b08d57)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                KHOJ
              </span>
            </Link>

            {/* Clean Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/khoj-services/allServices?category=all&state=all&city=&name="
                className={`text-[13px] font-semibold transition-colors hover:text-[#c75b3a] ${
                  pathname.includes('allServices') ? 'text-[#c75b3a] font-bold' : 'text-stone-600'
                }`}
              >
                Find Services
              </Link>

              {/* Categories Dropdown */}
              <Dropdown overlay={categoriesMenu} trigger={['hover']}>
                <span className="text-[13px] font-semibold text-stone-600 hover:text-[#c75b3a] transition-colors cursor-pointer flex items-center gap-1">
                  Categories
                  <svg width="8" height="5" viewBox="0 0 10 6" fill="none" className="opacity-40">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Dropdown>

              {/* AI Estimator */}
              <span
                onClick={() => setAiModalOpen(true)}
                className="text-[13px] font-semibold text-stone-600 hover:text-[#c75b3a] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                🤖 AI Estimator
              </span>

              {/* Home Diagnostics */}
              <Link
                to="/#home-diagnostics"
                onClick={() => {
                  const el = document.getElementById('home-diagnostics');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[13px] font-semibold text-stone-600 hover:text-[#c75b3a] transition-colors cursor-pointer"
              >
                Issue Doctor
              </Link>

              {/* Role-Based Analytics (Admin / Merchant only) */}
              {(isAdmin || isMerchant) && (
                <Dropdown overlay={chartsMenu} trigger={['hover']}>
                  <span className="text-[13px] font-semibold text-stone-600 hover:text-[#c75b3a] transition-colors cursor-pointer flex items-center gap-1">
                    {isAdmin ? '📊 Analytics' : '📊 Performance'}
                    <svg width="8" height="5" viewBox="0 0 10 6" fill="none" className="opacity-40">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Dropdown>
              )}
            </nav>
          </div>

          {/* ─── Center: Prominent Search Bar (Desktop) ─── */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNavSearch();
              }}
              className="w-full"
            >
              <Input
                placeholder="Search services (e.g. AC Repair, Cleaning)..."
                value={navSearch}
                onChange={(e) => {
                  const val = e.target.value;
                  setNavSearch(val);
                  if (pathname.includes('allServices')) {
                    navigate(`/khoj-services/allServices?category=all&state=all&city=&name=${val.trim()}`, { replace: true });
                  }
                }}
                onPressEnter={handleNavSearch}
                prefix={
                  <SearchOutlined
                    onClick={handleNavSearch}
                    className="cursor-pointer text-stone-400 hover:text-[#c75b3a] transition-colors mr-1"
                    style={{ fontSize: 13 }}
                  />
                }
                className="!rounded-full !bg-[#f2efe8]/90 !border-[#e8e4d9] !text-xs !py-1.5 !px-3.5 placeholder:!text-stone-400 hover:!border-[#c75b3a]/40 focus:!border-[#c75b3a] !transition-all shadow-xs"
              />
            </form>
          </div>

          {/* ─── Right: Actions, Utilities & Profile ─── */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Merchant Quick Action */}
            {isMerchant && (
              <Link
                to="/khoj-services/addService"
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full transition-all shadow-xs"
              >
                ➕ List Service
              </Link>
            )}

            {/* Admin Quick Action */}
            {isAdmin && (
              <Link
                to="/khoj-services/admin"
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-full transition-all shadow-xs"
              >
                ⚡ Admin
              </Link>
            )}

            {/* Customer Bookings Quick Link */}
            {isLoggedIn && !isMerchant && !isAdmin && (
              <Link
                to="/khoj-services/myBookings"
                className="text-xs font-bold text-stone-700 hover:text-[#c75b3a] px-2 py-1 transition-colors hidden sm:flex items-center gap-1.5"
              >
                <CalendarOutlined /> Bookings
              </Link>
            )}

            {/* Customer Wallet Quick Pill */}
            {!isMerchant && (
              <button
                type="button"
                onClick={() => setWalletModalOpen(true)}
                className="text-[11px] sm:text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200/80 border border-amber-300/80 px-2 sm:px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                title="Khoj Digital Wallet"
              >
                🪙 ₹{walletBalance}
              </button>
            )}

            {/* Real-Time Live Notification Center */}
            <NotificationBell />

            {/* Quick Help Desk Trigger */}
            <button
              type="button"
              onClick={() => setHelpModalOpen(true)}
              className="hidden xl:flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-[#c75b3a] px-2 py-1 bg-transparent border-none cursor-pointer transition-colors"
              title="24x7 Help Desk & Safety SOS"
            >
              <CustomerServiceOutlined className="text-[#c75b3a]" />
              <span>Help</span>
            </button>

            {/* User Profile Dropdown or Login/Register */}
            {isLoggedIn ? (
              <Dropdown overlay={userProfileMenu} trigger={['click']}>
                <div className="flex items-center gap-1 sm:gap-2 cursor-pointer group px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full transition-all hover:bg-[#f2ede4] border border-stone-300/60 bg-white/70 shadow-xs">
                  <Avatar size={24} src='../images/team_01.jpg' className="!border !border-[#c75b3a]/30" />
                  <span className="hidden sm:inline text-xs font-bold text-stone-700 group-hover:text-stone-900 transition-colors">
                    {user.name || userEmail.split('@')[0] || 'Account'}
                  </span>
                  <svg width="8" height="5" viewBox="0 0 10 6" fill="none" className="opacity-40">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Dropdown>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all hover:bg-[#f2ede4] border border-stone-200 text-stone-700"
                >
                  <LoginOutlined style={{ fontSize: 11 }} />
                  Login
                </Link>
                <Link
                  to="/registration"
                  className="flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all hover:opacity-90 text-white shadow-xs"
                  style={{ background: 'linear-gradient(135deg, #c75b3a, #b08d57)' }}
                >
                  <UserAddOutlined style={{ fontSize: 11 }} />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── MOBILE NAVIGATION DRAWER ─────────────────── */}
      <Drawer
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-black text-lg text-[#c75b3a]">KHOJ</span>
            </div>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 border-none bg-transparent cursor-pointer"
            >
              <CloseOutlined />
            </button>
          </div>
        }
        placement="left"
        closable={false}
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        bodyStyle={{ padding: '16px', background: '#fbf9f6' }}
        headerStyle={{ background: '#f8f5f0', borderBottom: '1px solid #e8e4d9' }}
        width={300}
      >
        <div className="flex flex-col gap-5 text-left font-sans">
          {/* Mobile Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNavSearch();
              setMobileDrawerOpen(false);
            }}
            className="w-full"
          >
            <Input
              placeholder="Search services..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              prefix={<SearchOutlined className="text-stone-400 mr-1" />}
              className="!rounded-xl !bg-white !border-[#e8e4d9] !text-sm !py-2"
            />
          </form>

          {/* User Status Bar in Mobile Menu */}
          {isLoggedIn ? (
            <div className="p-3 rounded-2xl bg-white border border-[#e8e4d9] shadow-2xs">
              <div className="flex items-center gap-2.5">
                <Avatar size={36} src='../images/team_01.jpg' className="border border-[#c75b3a]/40" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-stone-900 truncate">
                    {user.name || userEmail.split('@')[0] || 'My Account'}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#c75b3a]">
                    {isAdmin ? '⚡ Administrator' : isMerchant ? '🛠️ Verified Merchant' : '👤 Customer'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 text-center py-2 text-xs font-bold rounded-xl bg-white border border-[#e8e4d9] text-stone-700 shadow-2xs"
              >
                Login
              </Link>
              <Link
                to="/registration"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 text-center py-2 text-xs font-bold rounded-xl text-white shadow-2xs"
                style={{ background: 'linear-gradient(135deg, #c75b3a, #b08d57)' }}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Quick Links Navigation */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 px-1">Discover</span>
            
            <Link
              to="/khoj-services/allServices?category=all&state=all&city=&name="
              onClick={() => setMobileDrawerOpen(false)}
              className="px-3 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-stone-200/50 hover:text-[#c75b3a] transition-colors flex items-center gap-2.5 text-sm"
            >
              🔍 Find All Services
            </Link>

            <Link
              to="/khoj-services/allCategories?category=all&state=all&city=&name="
              onClick={() => setMobileDrawerOpen(false)}
              className="px-3 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-stone-200/50 hover:text-[#c75b3a] transition-colors flex items-center gap-2.5 text-sm"
            >
              📂 Browse Categories
            </Link>

            <button
              onClick={() => {
                setMobileDrawerOpen(false);
                setAiModalOpen(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-stone-200/50 hover:text-[#c75b3a] transition-colors flex items-center gap-2.5 text-sm border-none bg-transparent cursor-pointer"
            >
              🤖 AI Cost Estimator
            </button>

            <Link
              to="/#home-diagnostics"
              onClick={() => {
                setMobileDrawerOpen(false);
                const el = document.getElementById('home-diagnostics');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-stone-200/50 hover:text-[#c75b3a] transition-colors flex items-center gap-2.5 text-sm"
            >
              🩺 Issue Doctor (Diagnostics)
            </Link>
          </div>

          {/* Account / Action Links */}
          <div className="flex flex-col gap-1 pt-3 border-t border-[#e8e4d9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 px-1">Account & Services</span>

            {isLoggedIn && !isMerchant && (
              <Link
                to="/khoj-services/myBookings"
                onClick={() => setMobileDrawerOpen(false)}
                className="px-3 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-stone-200/50 hover:text-[#c75b3a] transition-colors flex items-center gap-2.5 text-sm"
              >
                📅 My Bookings
              </Link>
            )}

            {!isMerchant && (
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setWalletModalOpen(true);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-stone-200/50 hover:text-[#c75b3a] transition-colors flex items-center gap-2.5 text-sm border-none bg-transparent cursor-pointer"
              >
                🪙 Wallet Balance: ₹{walletBalance}
              </button>
            )}

            {isMerchant && (
              <>
                <Link
                  to="/khoj-services/addService"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="px-3 py-2.5 rounded-xl font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-2.5 text-sm"
                >
                  ➕ Add New Service
                </Link>
                <Link
                  to="/khoj-services/myBookings"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="px-3 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-stone-200/50 hover:text-[#c75b3a] transition-colors flex items-center gap-2.5 text-sm"
                >
                  📋 Client Bookings
                </Link>
                <Link
                  to="/khoj-services/charts/services"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="px-3 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-stone-200/50 hover:text-[#c75b3a] transition-colors flex items-center gap-2.5 text-sm"
                >
                  📊 Service Analytics
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/khoj-services/admin"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="px-3 py-2.5 rounded-xl font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center gap-2.5 text-sm"
                >
                  ⚡ Admin Portal
                </Link>
                <Link
                  to="/khoj-services/addCategory"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="px-3 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-stone-200/50 hover:text-[#c75b3a] transition-colors flex items-center gap-2.5 text-sm"
                >
                  ⚙️ Manage Categories
                </Link>
              </>
            )}

            <button
              onClick={() => {
                setMobileDrawerOpen(false);
                setHelpModalOpen(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-stone-700 hover:bg-stone-200/50 hover:text-[#c75b3a] transition-colors flex items-center gap-2.5 text-sm border-none bg-transparent cursor-pointer"
            >
              🆘 24x7 Help Desk & Safety SOS
            </button>

            {isLoggedIn && (
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  dispatch({ type: 'LOGOUT' });
                  navigate('/login');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 text-sm border-none bg-transparent cursor-pointer mt-2"
              >
                🚪 Logout
              </button>
            )}
          </div>
        </div>
      </Drawer>

      {/* ─── Main Content ───────────────────────────── */}
      {isHome ? (
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
      ) : (
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 overflow-x-hidden">{children}</main>
      )}

      {/* ─── Footer ─────────────────────────────────── */}
      <footer className="text-center py-8 border-t text-sm space-y-2" style={{ background: '#f2efe8', borderColor: 'rgba(176, 141, 87, 0.12)', color: '#8c7866' }}>
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-semibold text-stone-600">
          <Link to="/" className="hover:text-[#c75b3a] transition-colors">Home</Link>
          <span>•</span>
          <Link to="/khoj-services/allCategories?category=all&state=all&city=&name=" className="hover:text-[#c75b3a] transition-colors">Categories</Link>
          <span>•</span>
          <Link to="/khoj-services/allServices?category=all&state=all&city=&name=" className="hover:text-[#c75b3a] transition-colors">All Services</Link>
          <span>•</span>
          <button type="button" onClick={() => setHelpModalOpen(true)} className="hover:text-[#c75b3a] bg-transparent border-none cursor-pointer p-0 font-semibold text-xs text-stone-600 transition-colors">
            24x7 Help Desk & Safety SOS
          </button>
        </div>
        <p className="font-medium text-xs">Khoj &copy; {new Date().getFullYear()} — Hyperlocal Home Service Discovery Platform (B.Tech Major Project)</p>
      </footer>
    </div>
  );
}

export default Index;
