import React from 'react';
import { Modal, Button, Tag, Rate } from 'antd';
import {
  SafetyCertificateOutlined,
  StarFilled,
  CloseOutlined,
  DollarCircleOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  UserOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function CompareModal({
  open,
  onClose,
  services = [],
  onRemoveService,
  onClearAll,
}) {
  const navigate = useNavigate();

  if (!services || services.length === 0) return null;

  const getResponseTime = (service) => {
    if (service.rating >= 4.8) return '⚡ 15 Mins Avg Response';
    if (service.rating >= 4.6) return '⏱️ 30 Mins Avg Response';
    return '⏱️ 45 Mins Avg Response';
  };

  const getWarranty = (service) => {
    if (service.rating >= 4.8) return '🛡️ 30-Day Free Re-service Guarantee';
    if (service.rating >= 4.6) return '🛡️ 15-Day Service Guarantee';
    return '🛡️ 7-Day Guarantee';
  };

  const getEquipment = (service) => {
    if (service.rating >= 4.8) return '🔧 Advanced Diagnostic Equipment & Genuine Spares';
    return '🛠️ Standard Professional Toolset Included';
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={940}
      centered
      className="!rounded-3xl overflow-hidden [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!rounded-3xl [&_.ant-modal-content]:!overflow-hidden"
    >
      <div 
        className="p-6 border-b border-[#e8e4d9] flex items-center justify-between text-left"
        style={{ background: 'linear-gradient(135deg, #fbf9f6 0%, #f4eee2 100%)' }}
      >
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] block mb-1" style={{ color: 'var(--terracotta)' }}>
            ● Side-by-Side Comparison Engine
          </span>
          <h2 className="text-2xl font-black text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Compare Service Providers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate prices, verified ratings, response guarantees, and warranties side by side.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="small"
            onClick={onClearAll}
            className="!rounded-xl !text-xs !font-bold !border-rose-200 !text-rose-600 hover:!bg-rose-50 !px-4"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* COMPARISON MATRIX TABLE */}
      <div className="p-6 overflow-x-auto text-left bg-[#fcfbfa]">
        <div className="min-w-[700px] grid gap-y-3" style={{ gridTemplateColumns: `190px repeat(${services.length}, minmax(210px, 1fr))` }}>
          
          {/* HEADER ROW: PROVIDER CARDS */}
          <div className="p-3 font-bold text-xs uppercase tracking-wider text-slate-400 self-end">
            Service Provider
          </div>
          {services.map((s) => (
            <div 
              key={s._id} 
              className="p-4 relative bg-white rounded-2xl border shadow-sm text-left flex flex-col justify-between" 
              style={{ borderColor: 'rgba(199,91,58,0.2)' }}
            >
              <button
                onClick={() => onRemoveService(s._id)}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 border-none cursor-pointer flex items-center justify-center text-xs transition-colors"
                title="Remove from comparison"
              >
                <CloseOutlined style={{ fontSize: 10 }} />
              </button>

              <div>
                <h4 className="font-extrabold text-base text-[#1c1917] pr-6 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {s.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Tag className="!rounded-full !border-none !px-2.5 !py-0.5 !text-[10px] !font-bold !bg-amber-50 !text-amber-800">
                    {s.typeObj?.name || 'Service'}
                  </Tag>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircleFilled style={{ fontSize: 9 }} /> Verified
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2">Partner: {s.ownerObj?.name || 'Verified Pro'}</p>
            </div>
          ))}

          {/* ROW 1: PRICING */}
          <div className="p-3 text-xs font-bold text-slate-600 flex items-center gap-1.5 self-center">
            <DollarCircleOutlined className="text-[#c75b3a] text-base" /> Hourly Rate
          </div>
          {services.map((s) => (
            <div key={s._id} className="p-4 bg-white rounded-2xl border border-amber-900/10 shadow-2xs">
              <span className="text-xl font-black text-[#c75b3a] block">{s.price || '₹350/hr'}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Standard Booking Deposit: ₹499</span>
            </div>
          ))}

          {/* ROW 2: VERIFIED RATING */}
          <div className="p-3 text-xs font-bold text-slate-600 flex items-center gap-1.5 self-center">
            <StarFilled className="text-amber-500 text-base" /> Customer Rating
          </div>
          {services.map((s) => (
            <div key={s._id} className="p-4 bg-white rounded-2xl border border-amber-900/10 shadow-2xs">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-black text-base text-slate-800">{s.rating || 4.8} ★</span>
                <Rate disabled defaultValue={Math.round(s.rating || 4.8)} className="!text-xs !text-amber-400" />
              </div>
              <span className="text-[10px] text-slate-500 block font-medium">{s.reviews || 45} Verified Reviews</span>
            </div>
          ))}

          {/* ROW 3: RESPONSE TIME */}
          <div className="p-3 text-xs font-bold text-slate-600 flex items-center gap-1.5 self-center">
            <ThunderboltOutlined className="text-amber-600 text-base" /> Response Time
          </div>
          {services.map((s) => (
            <div key={s._id} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 shadow-2xs">
              <span className="text-xs font-bold text-amber-800 block">{getResponseTime(s)}</span>
            </div>
          ))}

          {/* ROW 4: WARRANTY & GUARANTEE */}
          <div className="p-3 text-xs font-bold text-slate-600 flex items-center gap-1.5 self-center">
            <SafetyCertificateOutlined className="text-emerald-600 text-base" /> Warranty Terms
          </div>
          {services.map((s) => (
            <div key={s._id} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 shadow-2xs">
              <span className="text-xs font-bold text-emerald-800 block">{getWarranty(s)}</span>
            </div>
          ))}

          {/* ROW 5: EQUIPMENT & SPARES */}
          <div className="p-3 text-xs font-bold text-slate-600 flex items-center gap-1.5 self-center">
            <ToolOutlined className="text-blue-600 text-base" /> Tools & Equipment
          </div>
          {services.map((s) => (
            <div key={s._id} className="p-4 bg-white rounded-2xl border border-amber-900/10 shadow-2xs">
              <span className="text-xs text-slate-700 leading-relaxed block font-medium">{getEquipment(s)}</span>
            </div>
          ))}

          {/* ROW 6: EXPERIENCE & JOBS */}
          <div className="p-3 text-xs font-bold text-slate-600 flex items-center gap-1.5 self-center">
            <UserOutlined className="text-purple-600 text-base" /> Track Record
          </div>
          {services.map((s) => (
            <div key={s._id} className="p-4 bg-white rounded-2xl border border-amber-900/10 shadow-2xs">
              <span className="text-xs font-bold text-slate-800 block">{s.experiance || '5 Years Exp'}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">{s.customers_served || '250+'} Jobs Completed</span>
            </div>
          ))}

          {/* ROW 7: ACTION BUTTON */}
          <div className="p-3 font-bold text-xs text-slate-400 self-center">
            Action
          </div>
          {services.map((s) => (
            <div key={s._id} className="p-2">
              <Button
                type="primary"
                onClick={() => {
                  onClose();
                  navigate(`/khoj-services/allServices/${s.service_id || s._id}`);
                }}
                className="w-full !rounded-xl !font-bold !py-5 !text-xs shadow-md hover:scale-[1.02] transition-transform"
                style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
              >
                Book This Provider
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
