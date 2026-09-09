import React, { useState, useEffect } from 'react';
import { Badge, Popover, Button, Tag, Empty } from 'antd';
import {
  BellOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  KeyOutlined,
  FileProtectOutlined,
  StarFilled,
  WalletFilled,
  CheckOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Welcome Bonus Credited!',
    desc: '₹250 Khoj Credits added to your digital wallet for instant savings.',
    time: 'Just now',
    type: 'wallet',
    read: false,
    link: '/khoj-services/myBookings',
  },
  {
    id: 'notif_2',
    title: 'Doorstep Security Enabled',
    desc: 'Remember to verify your 4-digit PIN before technician commences work.',
    time: '15m ago',
    type: 'security',
    read: false,
    link: '/khoj-services/myBookings',
  },
  {
    id: 'notif_3',
    title: 'Official GST Invoices Available',
    desc: 'You can now view, print, or download GST Tax Invoices for all completed jobs.',
    time: '1h ago',
    type: 'invoice',
    read: false,
    link: '/khoj-services/myBookings',
  },
];

export default function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('khoj_notifications');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch (e) {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  // Sync notifications with active bookings
  useEffect(() => {
    try {
      const bookings = JSON.parse(localStorage.getItem('local_bookings') || '[]');
      const newItems = [];

      bookings.forEach((b) => {
        if (b.status === 'confirmed') {
          const id = 'notif_conf_' + b._id;
          if (!notifications.some((n) => n.id === id)) {
            newItems.push({
              id,
              title: 'Booking Confirmed: ' + b.serviceName,
              desc: 'Provider has accepted your request. Your security PIN is ready.',
              time: 'Recent',
              type: 'booking',
              read: false,
              link: '/khoj-services/myBookings',
            });
          }
        } else if (b.status === 'in_progress') {
          const id = 'notif_prog_' + b._id;
          if (!notifications.some((n) => n.id === id)) {
            newItems.push({
              id,
              title: 'Service In Progress: ' + b.serviceName,
              desc: 'Doorstep PIN verified. Technician is currently executing the job.',
              time: 'Just now',
              type: 'security',
              read: false,
              link: '/khoj-services/myBookings',
            });
          }
        } else if (b.status === 'completed') {
          const id = 'notif_comp_' + b._id;
          if (!notifications.some((n) => n.id === id)) {
            newItems.push({
              id,
              title: 'Service Completed: ' + b.serviceName,
              desc: 'Job is done! Download your Tax Invoice and submit your rating.',
              time: 'Today',
              type: 'review',
              read: false,
              link: '/khoj-services/myBookings',
            });
          }
        }
      });

      if (newItems.length > 0) {
        setNotifications((prev) => {
          const updated = [...newItems, ...prev];
          localStorage.setItem('khoj_notifications', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('khoj_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('khoj_notifications');
  };

  const handleNotificationClick = (n) => {
    const updated = notifications.map((item) =>
      item.id === n.id ? { ...item, read: true } : item
    );
    setNotifications(updated);
    localStorage.setItem('khoj_notifications', JSON.stringify(updated));
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'security':
        return <KeyOutlined className="text-violet-600 text-sm" />;
      case 'invoice':
        return <FileProtectOutlined className="text-amber-600 text-sm" />;
      case 'review':
        return <StarFilled className="text-amber-500 text-sm" />;
      case 'wallet':
        return <WalletFilled className="text-emerald-600 text-sm" />;
      default:
        return <CheckCircleFilled className="text-blue-500 text-sm" />;
    }
  };

  const popoverContent = (
    <div className="w-80 max-w-[90vw] -mx-4 -my-3 font-sans">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellOutlined className="text-amber-400 text-base" />
          <span className="font-bold text-xs tracking-wide">Live Notifications</span>
          {unreadCount > 0 && (
            <Tag className="!border-none !rounded-full !bg-amber-500 !text-stone-900 !text-[10px] !font-black !px-2">
              {unreadCount} NEW
            </Tag>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              title="Mark all read"
              className="text-[10px] text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
            >
              <CheckOutlined /> Mark read
            </button>
            <span className="text-stone-600">|</span>
            <button
              onClick={clearAll}
              title="Clear all"
              className="text-[10px] text-stone-300 hover:text-rose-400 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
            >
              <DeleteOutlined /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 bg-white">
        {notifications.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className="text-xs text-stone-400">No new notifications</span>}
            />
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3 flex items-start gap-3 transition-colors cursor-pointer hover:bg-stone-50 ${
                !n.read ? 'bg-amber-50/40' : 'bg-white'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5 border border-stone-200">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className={`text-xs truncate ${!n.read ? 'font-bold text-stone-900' : 'font-semibold text-stone-700'}`}>
                    {n.title}
                  </span>
                  <span className="text-[10px] text-stone-400 flex-shrink-0 flex items-center gap-1">
                    <ClockCircleFilled style={{ fontSize: 9 }} /> {n.time}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug line-clamp-2 m-0">
                  {n.desc}
                </p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center rounded-b-2xl">
        <Button
          type="link"
          size="small"
          onClick={() => {
            setOpen(false);
            navigate('/khoj-services/myBookings');
          }}
          className="!text-xs !font-bold !text-[#c75b3a] hover:!text-[#b04f30]"
        >
          View All Bookings & Activity →
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayClassName="[&_.ant-popover-inner]:!rounded-2xl [&_.ant-popover-inner]:!p-0 [&_.ant-popover-inner]:!shadow-2xl [&_.ant-popover-inner]:!border [&_.ant-popover-inner]:!border-stone-200"
    >
      <div className="relative cursor-pointer p-2 rounded-full hover:bg-[#f2ede4] transition-colors flex items-center justify-center text-[#5c5650] hover:text-[#1c1917]">
        <Badge
          count={unreadCount}
          size="small"
          offset={[-2, 2]}
          className="[&_.ant-badge-count]:!bg-[#c75b3a] [&_.ant-badge-count]:!font-black [&_.ant-badge-count]:!text-[10px] [&_.ant-badge-count]:!shadow-none"
        >
          <BellOutlined className="text-lg" />
        </Badge>
      </div>
    </Popover>
  );
}
