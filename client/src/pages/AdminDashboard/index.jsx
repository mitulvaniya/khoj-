import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Button, Table, Badge, Modal, message, Card } from 'antd';
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  CheckCircleOutlined,
  DollarCircleOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import Spinner from '../Spinner';
import API from '../../api';
import { GlobalContext } from '../../Context/GlobalContext';
import { getauth } from '../../utils/auth';

function AdminDashboard() {
  const navigate = useNavigate();
  const { data: globalData } = useContext(GlobalContext);
  const auth = getauth();
  const isLoggedIn = globalData.isLoggedIn || !!auth;
  const user = globalData.user || {};
  const isAdmin = user.email === 'admin@gmail.com' || localStorage.getItem('user_email') === 'admin@gmail.com';

  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([
    { key: '1', name: 'Superb Spark Electricians', owner: 'Rajesh Kumar', category: 'Electrician', city: 'Mumbai', status: 'verified', requests: 124 },
    { key: '2', name: 'Quick Leak Plumbers', owner: 'Amit Sharma', category: 'Plumber', city: 'Delhi', status: 'verified', requests: 89 },
    { key: '3', name: 'Watts Up Electrical Services', owner: 'Sanjay Dutt', category: 'Electrician', city: 'Delhi', status: 'pending', requests: 15 },
    { key: '4', name: 'Elite Home Cleaning Services', owner: 'Sunita Patil', category: 'Cleaning', city: 'Pune', status: 'verified', requests: 43 },
    { key: '5', name: 'CoolBreeze AC Care', owner: 'Vikram Singh', category: 'AC Repair', city: 'Surat', status: 'pending', requests: 8 },
  ]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      message.error('Access Denied: Super Admin privileges required to view Admin Portal.');
      navigate('/khoj-services/allCategories?category=all&state=all&city=&name=');
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const handleApprove = (key, name) => {
    setProviders(prev =>
      prev.map(p => (p.key === key ? { ...p, status: 'verified' } : p))
    );
    message.success(`Approved merchant profile for ${name}!`);
  };

  const handleReject = (key, name) => {
    Modal.confirm({
      title: 'Reject Merchant Application?',
      content: `Are you sure you want to reject ${name}?`,
      okText: 'Reject',
      okType: 'danger',
      onOk: () => {
        setProviders(prev => prev.filter(p => p.key !== key));
        message.info(`Rejected ${name}`);
      },
    });
  };

  const columns = [
    {
      title: 'Business Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <span className="font-bold text-[#1c1917] block">{text}</span>
          <span className="text-xs text-slate-400">Owner: {record.owner}</span>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => <Tag className="!rounded-full !border-none !px-2.5 !py-0.5 !text-[10px] !font-bold !bg-[#f2efe8]">{cat}</Tag>,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st) =>
        st === 'verified' ? (
          <Tag className="!rounded-full !border-none !px-3 !py-0.5 !text-[10px] !font-bold !bg-emerald-50 !text-emerald-600">
            <CheckCircleOutlined className="mr-1" /> Verified
          </Tag>
        ) : (
          <Tag className="!rounded-full !border-none !px-3 !py-0.5 !text-[10px] !font-bold !bg-amber-50 !text-amber-600">
            <ExclamationCircleOutlined className="mr-1" /> Pending Review
          </Tag>
        ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          {record.status === 'pending' && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleApprove(record.key, record.name)}
              className="!rounded-lg !font-bold !text-xs"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
            >
              Approve
            </Button>
          )}
          <Button
            size="small"
            danger
            onClick={() => handleReject(record.key, record.name)}
            className="!rounded-lg !font-semibold !text-xs"
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fadeIn duration-500 text-left">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold mb-6 hover:text-[#c75b3a] transition-colors border-none bg-transparent cursor-pointer"
        style={{ color: 'var(--stone)' }}
      >
        <ArrowLeftOutlined /> Back
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-1" style={{ color: 'var(--terracotta)' }}>
            ● Admin Executive Portal
          </span>
          <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: '#1c1917' }}>
            System Control Panel
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--stone)' }}>
            Overview of platform activity, merchant onboarding verification, and financial metrics.
          </p>
        </div>
        <Tag className="!rounded-full !border-none !px-3 !py-1 !text-xs !font-bold !bg-amber-100 !text-amber-800">
          <SafetyCertificateOutlined className="mr-1" /> Super Admin Access
        </Tag>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border p-5 shadow-2xs" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
          <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--stone)' }}>
            Total System Revenue
          </span>
          <span className="text-2xl font-black" style={{ color: 'var(--terracotta)' }}>
            ₹48,500
          </span>
          <span className="text-[10px] text-emerald-600 block mt-1">+14% this month</span>
        </div>

        <div className="bg-white rounded-2xl border p-5 shadow-2xs" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
          <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--stone)' }}>
            Active Service Providers
          </span>
          <span className="text-2xl font-black text-slate-800">
            {providers.length} Verified
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Across 5 cities</span>
        </div>

        <div className="bg-white rounded-2xl border p-5 shadow-2xs" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
          <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--stone)' }}>
            Pending Merchant Approvals
          </span>
          <span className="text-2xl font-black text-amber-600">
            {providers.filter(p => p.status === 'pending').length} Profiles
          </span>
          <span className="text-[10px] text-amber-600 block mt-1">Action required</span>
        </div>

        <div className="bg-white rounded-2xl border p-5 shadow-2xs" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
          <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--stone)' }}>
            System Health & API Status
          </span>
          <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 mt-2">
            <Badge status="processing" color="#10b981" /> 100% Operational (&lt; 60ms)
          </span>
        </div>
      </div>

      {/* Merchant Management Table */}
      <div className="bg-white rounded-3xl border p-6 shadow-sm" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <ShopOutlined className="mr-2" style={{ color: 'var(--terracotta)' }} /> Merchant Verification Queue
          </h3>
        </div>

        <Table
          columns={columns}
          dataSource={providers}
          pagination={false}
          className="[&_.ant-table-thead_th]:!bg-[#faf8f5] [&_.ant-table-thead_th]:!text-[#5c5650] [&_.ant-table-thead_th]:!font-bold [&_.ant-table-thead_th]:!text-xs [&_.ant-table-thead_th]:!uppercase"
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
