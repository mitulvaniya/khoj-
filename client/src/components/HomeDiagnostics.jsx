import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Button } from 'antd';
import {
  ThunderboltOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  FireOutlined,
  AlertOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

// ─── DIAGNOSTIC KNOWLEDGE BASE ──────────────────────────────────────
const DIAGNOSTIC_DOMAINS = [
  {
    id: 'electrical',
    title: 'Electrical & Power',
    icon: <ThunderboltOutlined className="text-amber-500" />,
    color: '#f59e0b',
    problems: [
      {
        id: 'mcb_trip',
        name: 'MCB Tripping Repeatedly',
        severity: 'Critical Hazard',
        severityColor: '#ef4444',
        cause: 'Short circuit in neutral wire, moisture in junction box, or heavy load overload (>16A).',
        diyTip: 'Turn off the main double-pole isolator switch immediately. Unplug high-load appliances (geyser, heater) before resetting.',
        estTime: '30 - 45 mins',
        fairPrice: '₹199 inspection + ₹200–₹450 repair',
        sparesNeeded: '16A/32A C-Curve MCB, copper winding terminal',
        category: 'Electrician',
        searchQuery: 'MCB Repair',
      },
      {
        id: 'switch_spark',
        name: 'Switchboard Sparking / Burnt Smell',
        severity: 'High Priority',
        severityColor: '#f97316',
        cause: 'Loose terminal screws causing electrical arching, or melted PVC insulation inside socket.',
        diyTip: 'Do not touch the switch with bare hands. Turn off power from the main board and keep children away.',
        estTime: '20 - 30 mins',
        fairPrice: '₹149 inspection + ₹120–₹250 per switchboard',
        sparesNeeded: 'Modular switch/socket plate, anchor screws',
        category: 'Electrician',
        searchQuery: 'Switchboard Sparking',
      },
      {
        id: 'fan_noise',
        name: 'Ceiling Fan Wobbly / Low Speed',
        severity: 'Medium',
        severityColor: '#3b82f6',
        cause: 'Degraded 2.5 mfd starting capacitor, worn out ball bearing, or loose down-rod hook.',
        diyTip: 'Check if blades are bent or accumulated heavy dust. Do not run on high speed if wobbling excessively.',
        estTime: '25 - 40 mins',
        fairPrice: '₹149 inspection + ₹150–₹300 capacitor/bearing',
        sparesNeeded: '2.5 / 3.15 µF capacitor, 6201/6202 bearing',
        category: 'Electrician',
        searchQuery: 'Fan Repair',
      },
      {
        id: 'inverter_fail',
        name: 'Inverter Not Charging / Beeping',
        severity: 'Moderate',
        severityColor: '#8b5cf6',
        cause: 'Sulphated battery terminals, low distilled water level, or blown glass fuse on PCB.',
        diyTip: 'Check if distilled water level float is below red mark. Clean white powder on terminals with warm water.',
        estTime: '30 - 60 mins',
        fairPrice: '₹199 inspection + battery acid/fuse servicing',
        sparesNeeded: 'Distilled water, terminal petroleum jelly, fuse',
        category: 'Electrician',
        searchQuery: 'Inverter Servicing',
      },
    ],
  },
  {
    id: 'plumbing',
    title: 'Plumbing & Water',
    icon: <ToolOutlined className="text-sky-500" />,
    color: '#0284c7',
    problems: [
      {
        id: 'tap_leak',
        name: 'Dripping Tap / Concealed Mixer Leak',
        severity: 'Moderate Resource Waste',
        severityColor: '#0284c7',
        cause: 'Worn out ceramic disc spindle, degraded O-ring rubber washer, or high water pressure scaling.',
        diyTip: 'Turn off the angle cock valve located below the sink or basin to stop continuous water loss until pro arrives.',
        estTime: '20 - 30 mins',
        fairPrice: '₹129 inspection + ₹150–₹350 cartridge replacement',
        sparesNeeded: 'Quarter-turn ceramic spindle, Teflon tape',
        category: 'Plumber',
        searchQuery: 'Tap Leakage',
      },
      {
        id: 'flush_overflow',
        name: 'Flush Tank Continuously Running',
        severity: 'Moderate Waste',
        severityColor: '#0284c7',
        cause: 'Faulty siphon flapper seal, stuck ballcock float valve, or limescale blocking inlet shutoff.',
        diyTip: 'Lift the cistern lid and manually lift the float arm to test if valve cuts off water.',
        estTime: '30 - 45 mins',
        fairPrice: '₹149 inspection + ₹200–₹400 siphon assembly',
        sparesNeeded: 'Single/Dual flush siphon kit, inlet valve',
        category: 'Plumber',
        searchQuery: 'Flush Repair',
      },
      {
        id: 'drain_clog',
        name: 'Clogged Sink / Bathroom Drain',
        severity: 'High Inconvenience',
        severityColor: '#ea580c',
        cause: 'Accumulation of grease, hair strands, and soap scum inside the P-trap or waste pipe.',
        diyTip: 'Avoid pouring toxic acid into PVC pipes as it can melt the joints. Use boiling water with baking soda.',
        estTime: '35 - 50 mins',
        fairPrice: '₹199 inspection + ₹250–₹450 mechanical snaking',
        sparesNeeded: 'Drain snake cable, heavy-duty trap seal',
        category: 'Plumber',
        searchQuery: 'Drain Blockage',
      },
      {
        id: 'shower_pressure',
        name: 'Low Shower Water Pressure',
        severity: 'Low',
        severityColor: '#10b981',
        cause: 'Hard water calcium and lime deposits choking the micro-nozzles in the overhead shower head.',
        diyTip: 'Soak the shower head in warm white vinegar for 2 hours to dissolve calcium crust.',
        estTime: '20 - 30 mins',
        fairPrice: '₹129 inspection + descaling or head replacement',
        sparesNeeded: 'High-pressure shower head, rubber washers',
        category: 'Plumber',
        searchQuery: 'Shower Pressure',
      },
    ],
  },
  {
    id: 'ac_cooling',
    title: 'AC & Climate',
    icon: <FireOutlined className="text-cyan-500" />,
    color: '#06b6d4',
    problems: [
      {
        id: 'ac_no_cool',
        name: 'AC Running but Not Cooling (Warm Air)',
        severity: 'Urgent Comfort Need',
        severityColor: '#06b6d4',
        cause: 'R-32/R-410A refrigerant gas leak, clogged condenser coils, or failed outdoor compressor capacitor.',
        diyTip: 'Check if the remote is set to "Cool" mode (snowflake icon) and temperature is below 24°C. Clean dust filter mesh.',
        estTime: '45 - 60 mins',
        fairPrice: '₹249 inspection + ₹1,200–₹2,400 gas top-up/leak repair',
        sparesNeeded: 'Freon/R32 canister, brazing rod, 45µF dual capacitor',
        category: 'AC Repair',
        searchQuery: 'AC Cooling',
      },
      {
        id: 'ac_water_drop',
        name: 'Water Dripping Indoors from AC Unit',
        severity: 'Moderate',
        severityColor: '#3b82f6',
        cause: 'Choked condensate drain pipe due to slime/algae build-up, or un-leveled indoor wall mounting bracket.',
        diyTip: 'Turn off the AC to prevent water from damaging room wall paint and electrical wiring below.',
        estTime: '30 - 45 mins',
        fairPrice: '₹199 inspection + ₹200–₹350 drain line jet pump flush',
        sparesNeeded: 'Flexible drain pipe, water tray sealant',
        category: 'AC Repair',
        searchQuery: 'AC Water Leakage',
      },
      {
        id: 'ac_smell',
        name: 'Foul / Musty Smell on AC Startup',
        severity: 'Air Quality Risk',
        severityColor: '#8b5cf6',
        cause: 'Fungal mildew and bacterial mould colonies growing on wet evaporator aluminum cooling fins.',
        diyTip: 'Run AC in "Fan Only" mode for 30 minutes to dry up stagnant moisture before technician arrives.',
        estTime: '45 - 60 mins',
        fairPrice: '₹449 complete foam jet indoor deep wash',
        sparesNeeded: 'Anti-bacterial coil cleaner, pressure wash kit',
        category: 'AC Repair',
        searchQuery: 'AC Foam Wash',
      },
    ],
  },
  {
    id: 'carpentry',
    title: 'Carpentry & Doors',
    icon: <ToolOutlined className="text-amber-700" />,
    color: '#b45309',
    problems: [
      {
        id: 'door_lock_jam',
        name: 'Main Door Lock Jammed / Key Sticking',
        severity: 'Security Risk',
        severityColor: '#dc2626',
        cause: 'Misaligned latch strike plate due to door sag, or worn brass pins inside euro mortise cylinder.',
        diyTip: 'Spray a bit of graphite powder or dry silicone lubricant into keyhole. Never force the key to prevent snapping.',
        estTime: '30 - 45 mins',
        fairPrice: '₹149 inspection + ₹150–₹350 alignment/lock cylinder',
        sparesNeeded: 'Mortise cylinder, strike plate screws',
        category: 'Carpenter',
        searchQuery: 'Lock Repair',
      },
      {
        id: 'drawer_hinge',
        name: 'Kitchen Hydraulic Hinge / Channel Broken',
        severity: 'Low',
        severityColor: '#10b981',
        cause: 'Hydraulic oil leakage in soft-close hinge cylinder, or stripped chipboard screw holes.',
        diyTip: 'Support the cabinet door so the weight doesn’t tear the remaining wood screws.',
        estTime: '25 - 40 mins',
        fairPrice: '₹149 inspection + ₹200–₹400 hinge pair replacement',
        sparesNeeded: '0-crank / 8-crank hydraulic hinges, wood dowels',
        category: 'Carpenter',
        searchQuery: 'Hinge Replacement',
      },
    ],
  },
];

export default function HomeDiagnostics() {
  const navigate = useNavigate();
  const [activeDomainId, setActiveDomainId] = useState('electrical');
  const [selectedProblemId, setSelectedProblemId] = useState('mcb_trip');

  const currentDomain = DIAGNOSTIC_DOMAINS.find((d) => d.id === activeDomainId) || DIAGNOSTIC_DOMAINS[0];
  const currentProblem =
    currentDomain.problems.find((p) => p.id === selectedProblemId) || currentDomain.problems[0];

  const handleBookExactIssue = () => {
    navigate(
      `/khoj-services/allServices?category=${encodeURIComponent(currentProblem.category)}&state=all&city=&name=${encodeURIComponent(
        currentProblem.searchQuery
      )}`
    );
  };

  return (
    <div className="w-full font-sans text-left">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>🩺 Khoj Home Problem Diagnostic & Fair Rate Center</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight text-[#1c1917]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            What's Broken in Your Home?
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Don't get overcharged or guess the issue. Select your exact home problem below for instant root cause diagnosis, safety precautions, and transparent city-standard repair rates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-xl text-emerald-800 text-xs font-bold">
          <SafetyCertificateOutlined className="text-base text-emerald-600" />
          <span>Anti-Overcharge Rate Guarantee</span>
        </div>
      </div>

      {/* Main Diagnostic Container */}
      <div className="bg-white rounded-3xl border border-[#e8e4d9] shadow-xl overflow-hidden p-6 sm:p-8">
        {/* Step 1: Category Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[#e8e4d9]/80 mb-6 scrollbar-none">
          {DIAGNOSTIC_DOMAINS.map((domain) => {
            const isActive = domain.id === activeDomainId;
            return (
              <button
                key={domain.id}
                onClick={() => {
                  setActiveDomainId(domain.id);
                  setSelectedProblemId(domain.problems[0].id);
                }}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-md scale-105'
                    : 'bg-[#fbf9f6] text-slate-600 border-[#e8e4d9] hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {domain.icon}
                <span>{domain.title}</span>
              </button>
            );
          })}
        </div>

        {/* Step 2: Specific Symptoms Chips */}
        <div className="mb-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Select Your Specific Symptom:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentDomain.problems.map((problem) => {
              const isSelected = problem.id === currentProblem.id;
              return (
                <div
                  key={problem.id}
                  onClick={() => setSelectedProblemId(problem.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#c75b3a] bg-[#c75b3a]/5 shadow-md -translate-y-0.5'
                      : 'border-[#e8e4d9] bg-[#fcfbfa] hover:border-[#c75b3a]/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className="text-xs font-bold leading-snug"
                      style={{ color: isSelected ? '#c75b3a' : '#1c1917' }}
                    >
                      {problem.name}
                    </span>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c75b3a] flex-shrink-0 animate-pulse mt-1" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
                    <span>Severity</span>
                    <span style={{ color: problem.severityColor }}>{problem.severity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Interactive Live Diagnostic Card */}
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-[#fcfbfa] to-white p-6 sm:p-8 relative overflow-hidden">
          {/* Accent Ribbon */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: 'linear-gradient(90deg, #c75b3a, #b08d57, #10b981)' }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Column 1 & 2: Diagnosis & Safety */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Tag color={currentProblem.severityColor} className="!rounded-full !px-3 !py-0.5 font-bold uppercase text-[10px]">
                  {currentProblem.severity}
                </Tag>
                <Tag color="default" className="!rounded-full !px-3 !py-0.5 font-semibold text-[11px] !border-[#e8e4d9]">
                  <ClockCircleOutlined className="mr-1" /> Avg. Time: {currentProblem.estTime}
                </Tag>
                <span className="text-xs text-slate-400">Verified Pan-India Standard</span>
              </div>

              <div>
                <h3
                  className="text-2xl font-black text-[#1c1917] tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {currentProblem.name}
                </h3>
                <div className="mt-2 text-sm text-slate-700 leading-relaxed flex items-start gap-2">
                  <InfoCircleOutlined className="text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Probable Root Cause: </strong>
                    {currentProblem.cause}
                  </div>
                </div>
              </div>

              {/* Safety Precaution Alert Box */}
              <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 flex items-start gap-3">
                <AlertOutlined className="text-rose-600 text-lg flex-shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 leading-relaxed">
                  <strong className="font-extrabold uppercase tracking-wide block mb-0.5 text-rose-800">
                    Immediate Action to Take Right Now:
                  </strong>
                  {currentProblem.diyTip}
                </div>
              </div>

              {/* Recommended Spares */}
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <span className="font-bold text-slate-800">Technician Spares Required:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                  {currentProblem.sparesNeeded}
                </span>
              </div>
            </div>

            {/* Column 3: Fair Price Benchmark & Quick Book */}
            <div className="bg-white rounded-2xl border border-[#e8e4d9] p-6 shadow-md flex flex-col justify-between h-full">
              <div>
                <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Transparent Rate Benchmark
                </div>
                <div className="text-xl font-black text-emerald-700 tracking-tight">
                  {currentProblem.fairPrice}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                  *Standardized city pricing so technicians cannot charge arbitrary fees.
                </div>

                <div className="my-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-emerald-500" />
                    <span>Background & Aadhaar Verified Pros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-emerald-500" />
                    <span>30-Day Khoj Service Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-emerald-500" />
                    <span>No Advance Payment Required</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookExactIssue}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#c75b3a] hover:bg-[#b04f30] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-none shadow-md shadow-[#c75b3a]/30 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Find {currentProblem.category}s Now</span>
                <ArrowRightOutlined />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
