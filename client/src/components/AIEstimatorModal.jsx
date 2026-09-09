import React, { useState } from 'react';
import { Modal, Select, Radio, Button, Tag, Divider, Spin } from 'antd';
import {
  RobotOutlined,
  ThunderboltOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
  UsergroupAddOutlined,
  ToolOutlined,
  CheckCircleFilled,
  BulbOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const TASK_OPTIONS = {
  Electrician: [
    { label: 'Ceiling Fan Installation & Wiring', hours: 1, partsCost: 200 },
    { label: 'Main Switchboard / MCB Upgrade', hours: 2, partsCost: 650 },
    { label: 'Short Circuit & Fault Finding', hours: 1.5, partsCost: 150 },
    { label: 'Full Room Lighting & LED Fitting', hours: 2.5, partsCost: 400 },
    { label: 'Inverter / Generator Connection', hours: 1.5, partsCost: 350 },
  ],
  Plumber: [
    { label: 'Pipe Leakage Repair & Sealing', hours: 1, partsCost: 150 },
    { label: 'Bathroom Tap & Mixer Installation', hours: 1.5, partsCost: 450 },
    { label: 'Drain Unclogging & Jet Clean', hours: 2, partsCost: 200 },
    { label: 'Water Heater / Geyser Setup', hours: 2, partsCost: 500 },
    { label: 'Water Tank Overhaul & Valves', hours: 3, partsCost: 600 },
  ],
  'AC Repair': [
    { label: 'Full Foam Jet Service & Wash', hours: 1.5, partsCost: 300 },
    { label: 'Gas Refill (R32 / R410 Freon)', hours: 1, partsCost: 1200 },
    { label: 'AC Installation / Dismantling', hours: 2.5, partsCost: 750 },
    { label: 'Compressor PCB Repairs', hours: 2, partsCost: 950 },
  ],
  Cleaning: [
    { label: 'Full 2BHK Deep Home Cleaning', hours: 4, partsCost: 300 },
    { label: 'Sofa & Carpet Shampoo Service', hours: 2, partsCost: 250 },
    { label: 'Bathroom Sanitization & Tile Scrub', hours: 2, partsCost: 200 },
    { label: 'Kitchen Chimney & Degreasing', hours: 2.5, partsCost: 350 },
  ],
};

export default function AIEstimatorModal({ open, onClose, defaultCategory = 'Electrician' }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState(defaultCategory || 'Electrician');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [propertyType, setPropertyType] = useState('apartment');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(null);

  const availableTasks = TASK_OPTIONS[category] || TASK_OPTIONS['Electrician'];

  const handleCalculate = () => {
    if (!selectedTasks || selectedTasks.length === 0) return;

    setCalculating(true);
    setResult(null);

    setTimeout(() => {
      let totalHours = 0;
      let totalParts = 0;

      selectedTasks.forEach((taskLabel) => {
        const found = availableTasks.find((t) => t.label === taskLabel);
        if (found) {
          totalHours += found.hours;
          totalParts += found.partsCost;
        }
      });

      // Property multiplier
      const propertyMultiplier = propertyType === 'villa' ? 1.25 : propertyType === 'commercial' ? 1.4 : 1.0;
      totalHours = Math.round(totalHours * propertyMultiplier * 10) / 10;

      const hourlyRate = category === 'AC Repair' ? 599 : category === 'Plumber' ? 399 : 499;
      const laborCost = Math.round(totalHours * hourlyRate);
      const totalPartsEst = Math.round(totalParts * propertyMultiplier);
      const totalMin = Math.round((laborCost + totalPartsEst) * 0.95);
      const totalMax = Math.round((laborCost + totalPartsEst) * 1.1);

      const techs = totalHours > 3.5 ? 2 : 1;

      setResult({
        hours: totalHours,
        techs,
        laborCost,
        partsCost: totalPartsEst,
        totalMin,
        totalMax,
        hourlyRate,
      });

      setCalculating(false);
    }, 1200);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      className="!rounded-3xl overflow-hidden [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!rounded-3xl [&_.ant-modal-content]:!overflow-hidden"
    >
      {/* Header */}
      <div 
        className="p-6 border-b border-[#e8e4d9] text-left"
        style={{ background: 'linear-gradient(135deg, #1c1917 0%, #2b2623 100%)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-8 rounded-xl bg-[#c75b3a] text-white flex items-center justify-center font-bold text-sm shadow-md">
            <RobotOutlined />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#c75b3a]">
            ● Khoj AI Intelligence Engine
          </span>
        </div>

        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          AI Smart Price & Duration Estimator
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Select your required tasks to get an instant AI prediction of time, cost, and technician requirements.
        </p>
      </div>

      {/* Body */}
      <div className="p-6 text-left bg-[#faf8f5] space-y-5">
        
        {/* Step 1: Select Category */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5 text-slate-500">
            1. Select Trade / Category
          </label>
          <Select
            value={category}
            onChange={(val) => {
              setCategory(val);
              setSelectedTasks([]);
              setResult(null);
            }}
            className="w-full !rounded-xl"
            size="large"
            options={[
              { value: 'Electrician', label: '🔌 Electrician & Wiring' },
              { value: 'Plumber', label: '🚿 Plumber & Water Pipes' },
              { value: 'AC Repair', label: '❄️ AC Servicing & Cooling' },
              { value: 'Cleaning', label: '🧹 Home Deep Cleaning' },
            ]}
          />
        </div>

        {/* Step 2: Select Scope of Work Tasks */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5 text-slate-500">
            2. Select Tasks / Scope of Work (Choose one or more)
          </label>
          <Select
            mode="multiple"
            placeholder="Select task items..."
            value={selectedTasks}
            onChange={(vals) => {
              setSelectedTasks(vals);
              setResult(null);
            }}
            className="w-full !rounded-xl"
            size="large"
            options={availableTasks.map((t) => ({ value: t.label, label: `${t.label} (~${t.hours} hrs)` }))}
          />
        </div>

        {/* Step 3: Select Property Type */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5 text-slate-500">
            3. Property Type
          </label>
          <Radio.Group
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              setResult(null);
            }}
            className="w-full grid grid-cols-3 gap-2"
          >
            <Radio.Button value="apartment" className="!rounded-xl !text-center !py-1 !text-xs !font-bold">
              🏢 Flat / Apartment
            </Radio.Button>
            <Radio.Button value="villa" className="!rounded-xl !text-center !py-1 !text-xs !font-bold">
              🏡 House / Villa
            </Radio.Button>
            <Radio.Button value="commercial" className="!rounded-xl !text-center !py-1 !text-xs !font-bold">
              🏪 Commercial / Office
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* Calculate Action */}
        <button
          onClick={handleCalculate}
          disabled={calculating || selectedTasks.length === 0}
          className={`w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-none shadow-md ${
            selectedTasks.length > 0
              ? 'bg-[#c75b3a] hover:bg-[#b04f30] shadow-[#c75b3a]/25 hover:shadow-lg'
              : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          {calculating ? (
            <span className="flex items-center gap-2">
              <Spin size="small" /> AI Computing Estimates...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ThunderboltOutlined /> Calculate AI Estimate ⚡
            </span>
          )}
        </button>

        {/* AI RESULT DASHBOARD CARD */}
        {result && (
          <div className="bg-white rounded-2xl border p-5 shadow-lg border-[#c75b3a]/30 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircleFilled className="text-emerald-500" /> AI Prediction Breakdown
              </span>
              <Tag className="!rounded-full !bg-amber-100 !text-amber-800 !border-none !text-[10px] !font-bold">
                High Confidence Prediction
              </Tag>
            </div>

            {/* Estimates Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-[#faf8f5] p-3 rounded-xl border border-amber-900/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Est. Work Time
                </span>
                <span className="text-base font-black text-slate-800 flex items-center justify-center gap-1">
                  <ClockCircleOutlined className="text-amber-600" /> {result.hours} Hrs
                </span>
              </div>

              <div className="bg-[#faf8f5] p-3 rounded-xl border border-amber-900/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Technicians
                </span>
                <span className="text-base font-black text-slate-800 flex items-center justify-center gap-1">
                  <UsergroupAddOutlined className="text-blue-600" /> {result.techs} Pro
                </span>
              </div>

              <div className="bg-[#faf8f5] p-3 rounded-xl border border-amber-900/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Material & Spares
                </span>
                <span className="text-base font-black text-slate-800 flex items-center justify-center gap-1">
                  <ToolOutlined className="text-purple-600" /> ₹{result.partsCost}
                </span>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200/60">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block mb-1">
                  Est. Total Budget
                </span>
                <span className="text-base font-black text-emerald-800 flex items-center justify-center gap-1">
                  ₹{result.totalMin} - ₹{result.totalMax}
                </span>
              </div>
            </div>

            {/* Smart AI Tip */}
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-900">
              <BulbOutlined className="text-amber-600 text-base mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold block mb-0.5">Khoj AI Optimization Tip:</span>
                Book during morning slots (9 AM - 12 PM) for fastest technician dispatch and 10% lower visiting charges!
              </div>
            </div>

            <Button
              type="primary"
              onClick={() => {
                onClose();
                navigate(`/khoj-services/allCategories?category=${category}`);
              }}
              className="w-full !rounded-xl !font-bold !py-5 !text-xs shadow-md"
              style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
            >
              Browse & Book Verified {category} Pros
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
