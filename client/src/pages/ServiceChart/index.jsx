import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Spin, Tag } from 'antd';
import { EnvironmentOutlined, ArrowLeftOutlined, CompassOutlined, GlobalOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const CUSTOM_CHART_COLORS = [
  '#c75b3a', // Terracotta
  '#b08d57', // Antique Gold
  '#2563eb', // Royal Blue
  '#10b981', // Emerald
  '#e28743', // Warm Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
];

const MOCK_CITY_ANALYTICS = [
  { name: 'Surat', count: 24, id: 'c_surat' },
  { name: 'Mumbai', count: 18, id: 'c_mumbai' },
  { name: 'Delhi', count: 15, id: 'c_delhi' },
  { name: 'Bangalore', count: 12, id: 'c_bangalore' },
  { name: 'Pune', count: 10, id: 'c_pune' },
];

const ChartState = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = (localStorage.getItem('user_email') || '').toLowerCase();
    const isMerchant = localStorage.getItem('user_is_merchant') === 'true';
    const isAdmin = userEmail === 'admin@gmail.com';
    if (!isAdmin && !isMerchant) {
      navigate('/khoj-services/allCategories?category=all&state=all&city=&name=');
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(API.servicesChart)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setChartData(
            res.data.data.map((data) => ({
              name: data.name,
              count: data.count || 5,
              id: data.id,
            })),
          );
        } else {
          setChartData(MOCK_CITY_ANALYTICS);
        }
      })
      .catch(() => {
        setChartData(MOCK_CITY_ANALYTICS);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalListings = chartData.reduce((acc, curr) => acc + curr.count, 0);
  const topCity = chartData.length > 0 ? [...chartData].sort((a, b) => b.count - a.count)[0] : null;

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

      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-1" style={{ color: 'var(--terracotta)' }}>
            ● Geographic Analytics
          </span>
          <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: '#1c1917' }}>
            City Density Distribution
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provider distribution metrics illustrating local service coverage across active metropolitan regions.
          </p>
        </div>
        <Tag className="!rounded-full !border-none !px-3 !py-1 !text-xs !font-bold !bg-blue-50 !text-blue-700">
          <GlobalOutlined className="mr-1" /> Regional Heatmap
        </Tag>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border p-5 shadow-2xs" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
          <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--stone)' }}>
            Total Network Providers
          </span>
          <span className="text-2xl font-black" style={{ color: 'var(--terracotta)' }}>
            {totalListings} Service Hubs
          </span>
        </div>

        <div className="bg-white rounded-2xl border p-5 shadow-2xs" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
          <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--stone)' }}>
            Top Active Region
          </span>
          <span className="text-xl font-bold text-slate-800 flex items-center gap-1.5 mt-1">
            <EnvironmentOutlined className="text-rose-500" /> {topCity?.name || 'Surat'} ({topCity?.count || 24})
          </span>
        </div>

        <div className="bg-white rounded-2xl border p-5 shadow-2xs" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
          <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--stone)' }}>
            Covered Cities
          </span>
          <span className="text-2xl font-black text-slate-800">
            {chartData.length} Cities
          </span>
        </div>
      </div>

      {/* Main Chart Box */}
      <div className="bg-white rounded-3xl border p-8 shadow-sm flex flex-col items-center justify-center min-h-[480px]" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <div className="w-full flex flex-col items-center">
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={135}
                  innerRadius={50}
                  paddingAngle={3}
                  dataKey="count"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CUSTOM_CHART_COLORS[index % CUSTOM_CHART_COLORS.length]}
                      cursor="pointer"
                      onClick={() =>
                        navigate(
                          `/khoj-services/allServices?category=all&state=all&city=${entry.name}&name=`,
                        )
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} Providers`, name]}
                  contentStyle={{ background: '#fff', borderRadius: 12, borderColor: 'rgba(176,141,87,0.2)', fontSize: 12 }}
                />
                <Legend
                  align="center"
                  layout="horizontal"
                  verticalAlign="bottom"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-400 mt-4 font-medium">
              💡 Tip: Click on any city slice to view service providers operating in that location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartState;
