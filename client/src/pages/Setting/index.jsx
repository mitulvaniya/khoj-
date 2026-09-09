import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Tabs, Switch, notification } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { GlobalContext } from '../../Context/GlobalContext';

const { TabPane } = Tabs;

export default function Setting() {
  const navigate = useNavigate();
  const { data, dispatch } = useContext(GlobalContext);
  const user = data.user || {};

  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullname: user.fullname || user.name || '',
    email: user.email || '',
    number: user.number || '',
    city: user.city || 'Surat',
    state: user.state || 'Gujarat',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    bookingAlerts: true,
    emailReceipts: true,
    promotionalOffers: false,
  });

  const handleProfileSave = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: 'SET_USER',
        payload: { ...user, ...profileForm },
      });
      notification.success({
        message: 'Settings Saved',
        description: 'Your account profile credentials have been updated successfully.',
      });
      setLoading(false);
    }, 600);
  };

  const handlePasswordSave = () => {
    if (!passwordForm.oldPassword) {
      notification.error({ message: 'Validation Error', description: 'Please enter your current password.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      notification.error({ message: 'Validation Error', description: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notification.error({ message: 'Validation Error', description: 'New passwords do not match.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      notification.success({
        message: 'Password Updated',
        description: 'Your account password has been updated successfully.',
      });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-fadeIn duration-500 text-left">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold mb-6 hover:text-[#c75b3a] transition-colors border-none bg-transparent cursor-pointer"
        style={{ color: 'var(--stone)' }}
      >
        <ArrowLeftOutlined /> Back
      </button>

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl border p-8 sm:p-10 shadow-sm" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
        
        {/* Header */}
        <div className="mb-8 border-b pb-6" style={{ borderColor: 'rgba(176,141,87,0.08)' }}>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: '#1c1917' }}>
            Account Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, security options, and notification preferences.
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs
          defaultActiveKey="1"
          className="[&_.ant-tabs-nav]:!mb-8 [&_.ant-tabs-tab-active]:!text-[#c75b3a] [&_.ant-tabs-ink-bar]:!bg-[#c75b3a]"
        >
          {/* TAB 1: PROFILE INFORMATION */}
          <TabPane tab={<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider"><UserOutlined /> Personal Details</span>} key="1">
            <Form layout="vertical" onFinish={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                    Full Name
                  </label>
                  <Input
                    value={profileForm.fullname}
                    onChange={(e) => setProfileForm({ ...profileForm, fullname: e.target.value })}
                    className="!rounded-xl !border-[#e8e4d9] !py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                    Email Address
                  </label>
                  <Input
                    value={profileForm.email}
                    disabled
                    className="!rounded-xl !border-[#e8e4d9] !py-2.5 !bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                    Phone Number
                  </label>
                  <Input
                    value={profileForm.number}
                    onChange={(e) => setProfileForm({ ...profileForm, number: e.target.value })}
                    className="!rounded-xl !border-[#e8e4d9] !py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                    City / Region
                  </label>
                  <Input
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="!rounded-xl !border-[#e8e4d9] !py-2.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-4 rounded-xl font-bold text-sm text-white bg-[#c75b3a] hover:bg-[#b04f30] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-none shadow-md shadow-[#c75b3a]/25 hover:shadow-lg"
              >
                <SaveOutlined /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </Form>
          </TabPane>

          {/* TAB 2: SECURITY & PASSWORD */}
          <TabPane tab={<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider"><LockOutlined /> Security</span>} key="2">
            <Form layout="vertical" onFinish={handlePasswordSave} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                  Current Password
                </label>
                <Input.Password
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="!rounded-xl !border-[#e8e4d9] !py-2.5"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                  New Password
                </label>
                <Input.Password
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="!rounded-xl !border-[#e8e4d9] !py-2.5"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                  Confirm New Password
                </label>
                <Input.Password
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-type new password"
                  className="!rounded-xl !border-[#e8e4d9] !py-2.5"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-4 rounded-xl font-bold text-sm text-white bg-[#c75b3a] hover:bg-[#b04f30] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-none shadow-md shadow-[#c75b3a]/25 hover:shadow-lg"
              >
                <LockOutlined /> {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </Form>
          </TabPane>

          {/* TAB 3: NOTIFICATION PREFERENCES */}
          <TabPane tab={<span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider"><BellOutlined /> Notifications</span>} key="3">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl border" style={{ borderColor: 'rgba(176,141,87,0.12)', background: '#faf8f5' }}>
                <div>
                  <h4 className="text-sm font-bold text-[#1c1917]">Booking Updates & Alerts</h4>
                  <p className="text-xs text-slate-400">Receive SMS / Email notifications when your booking status changes.</p>
                </div>
                <Switch
                  checked={notifications.bookingAlerts}
                  onChange={(val) => setNotifications({ ...notifications, bookingAlerts: val })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border" style={{ borderColor: 'rgba(176,141,87,0.12)', background: '#faf8f5' }}>
                <div>
                  <h4 className="text-sm font-bold text-[#1c1917]">Email Receipts</h4>
                  <p className="text-xs text-slate-400">Get automatic digital receipts after completed service visits.</p>
                </div>
                <Switch
                  checked={notifications.emailReceipts}
                  onChange={(val) => setNotifications({ ...notifications, emailReceipts: val })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border" style={{ borderColor: 'rgba(176,141,87,0.12)', background: '#faf8f5' }}>
                <div>
                  <h4 className="text-sm font-bold text-[#1c1917]">Special Offers & Deals</h4>
                  <p className="text-xs text-slate-400">Receive periodic discount vouchers for local trades & services.</p>
                </div>
                <Switch
                  checked={notifications.promotionalOffers}
                  onChange={(val) => setNotifications({ ...notifications, promotionalOffers: val })}
                />
              </div>

              <button
                onClick={() => notification.success({ message: 'Preferences Saved', description: 'Notification settings updated.' })}
                className="w-full h-11 mt-4 rounded-xl font-bold text-sm text-white bg-[#c75b3a] hover:bg-[#b04f30] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-none shadow-md shadow-[#c75b3a]/25 hover:shadow-lg"
              >
                Save Preferences
              </button>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
