import React, { useState, useEffect, useRef } from 'react';
import { Modal, Tag, Progress, notification } from 'antd';
import {
  PhoneOutlined,
  MessageOutlined,
  SafetyCertificateFilled,
  EnvironmentOutlined,
  ThunderboltFilled,
  CheckCircleFilled,
  CompassOutlined,
  AlertOutlined,
} from '@ant-design/icons';

export default function LiveTrackerModal({ open, onClose, booking, onOpenChat }) {
  const [etaMinutes, setEtaMinutes] = useState(14);
  const [distanceKm, setDistanceKm] = useState(1.8);
  const [speedKmh, setSpeedKmh] = useState(32);
  const [step, setStep] = useState(2); // 0=Assigned, 1=Packing tools, 2=On the way, 3=Arrived
  const canvasRef = useRef(null);

  // Doorstep Security PIN based on booking ID
  const securityOtp = booking?._id
    ? (Math.abs(booking._id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 17) % 9000 + 1000).toString()
    : '4892';

  const proName = booking?.serviceOwnerName || 'Rameshwar Sharma';
  const proCategory = booking?.serviceCategory || booking?.serviceName || 'Home Technician';
  const proPhone = booking?.serviceOwnerPhone || '+91 98765 43210';

  // Live countdown and simulation loop
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setEtaMinutes((prev) => {
        if (prev <= 1) return 1;
        return prev - 1;
      });
      setDistanceKm((prev) => {
        if (prev <= 0.2) return 0.2;
        return parseFloat((prev - 0.12).toFixed(1));
      });
      setSpeedKmh(Math.floor(26 + Math.random() * 12));
    }, 4500);

    return () => clearInterval(interval);
  }, [open]);

  // Animated GPS Canvas Radar
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let progress = 0.25;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw map grid lines
      ctx.strokeStyle = 'rgba(232, 228, 217, 0.45)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Coordinates
      const startX = 60;
      const startY = h - 60;
      const endX = w - 70;
      const endY = 70;

      // Draw street route path
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(startX + 80, startY - 20, endX - 120, startY - 40, endX - 80, endY + 60);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#c75b3a';
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Calculate current technician position along path
      progress += 0.003;
      if (progress > 0.88) progress = 0.88;
      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress - Math.sin(progress * Math.PI) * 40;

      // Pulsing radar ripple around technician
      const pulseRadius = (Date.now() / 40) % 35;
      ctx.beginPath();
      ctx.arc(currentX, currentY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(16, 185, 129, ${Math.max(0, 1 - pulseRadius / 35)})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Home Destination Pin
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(endX, endY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏠', endX, endY + 4);

      // Home Pin Label
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('Your Home', endX, endY + 22);

      // Technician Moving Marker
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.fillText('🛵', currentX, currentY + 4);

      // Tech Pin Label
      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`${proName.split(' ')[0]} (${speedKmh} km/h)`, currentX, currentY - 18);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [open, speedKmh, proName]);

  const handleSos = () => {
    notification.warning({
      message: 'Khoj Safety Priority Alert Dispatched',
      description: `Support team and local emergency response notified for booking #${booking?._id}. A safety supervisor will call you within 60 seconds.`,
      duration: 6,
    });
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width={600}
      className="!rounded-3xl overflow-hidden font-sans"
    >
      <div className="text-left -m-6 p-6 bg-[#fbf9f6]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e8e4d9]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Live GPS Dispatch Active
              </span>
            </div>
            <h3
              className="text-2xl font-black text-[#1c1917] tracking-tight mt-0.5"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Technician On The Way
            </h3>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Arrival</div>
            <div className="text-2xl font-black text-[#c75b3a]">{etaMinutes} mins</div>
          </div>
        </div>

        {/* Live GPS Radar Screen */}
        <div className="relative my-4 rounded-2xl border border-[#e8e4d9] bg-white overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={550}
            height={220}
            className="w-full h-[220px] block"
          />

          {/* Floating Live Telemetry Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-sm flex items-center gap-2">
            <CompassOutlined className="text-emerald-600 animate-spin" />
            <span>
              Distance: <strong>{distanceKm} km</strong> &bull; Speed: <strong>{speedKmh} km/h</strong>
            </span>
          </div>

          <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1.5">
            <span>● GPS Signal Locked</span>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="mb-5 bg-white p-4 rounded-2xl border border-[#e8e4d9]">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircleFilled /> Confirmed
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircleFilled /> Pro Assigned
            </span>
            <span className="flex items-center gap-1 text-[#c75b3a] animate-pulse">
              <ThunderboltFilled /> En Route ({etaMinutes}m)
            </span>
            <span className="text-slate-400">Doorstep OTP</span>
          </div>
          <Progress percent={75} showInfo={false} strokeColor="#c75b3a" size="small" />
        </div>

        {/* Technician Profile Card & Doorstep PIN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {/* Tech Details */}
          <div className="sm:col-span-2 bg-white p-4 rounded-2xl border border-[#e8e4d9] flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl font-black text-amber-800 flex-shrink-0 border border-amber-200">
              👨‍🔧
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-[#1c1917]">{proName}</span>
                <SafetyCertificateFilled className="text-emerald-500 text-xs" />
              </div>
              <div className="text-xs text-slate-500">{proCategory} &bull; 4.9 ★ (420+ jobs)</div>
              <div className="mt-1 flex flex-wrap gap-1">
                <Tag color="green" className="!text-[9px] !px-1.5 !py-0 !m-0 font-semibold !rounded-md">
                  Police Verified
                </Tag>
                <Tag color="blue" className="!text-[9px] !px-1.5 !py-0 !m-0 font-semibold !rounded-md">
                  Aadhaar KYC
                </Tag>
                <Tag color="orange" className="!text-[9px] !px-1.5 !py-0 !m-0 font-semibold !rounded-md">
                  Hero Splendor
                </Tag>
              </div>
            </div>
          </div>

          {/* Doorstep Security PIN Box */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3.5 rounded-2xl border border-amber-200/80 flex flex-col justify-center text-center">
            <div className="text-[10px] uppercase font-extrabold tracking-wider text-amber-800">
              Doorstep Start PIN
            </div>
            <div className="text-2xl font-black tracking-widest text-[#1c1917] my-0.5">
              {securityOtp}
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">
              Share with pro only when they arrive.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href={`tel:${proPhone}`}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors no-underline shadow-sm"
          >
            <PhoneOutlined /> Call Pro
          </a>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenChat) onOpenChat(booking);
            }}
            className="py-2.5 px-3 rounded-xl bg-white border border-[#e8e4d9] text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <MessageOutlined className="text-[#c75b3a]" /> In-App Chat
          </button>

          <button
            type="button"
            onClick={handleSos}
            className="py-2.5 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <AlertOutlined /> Safety SOS
          </button>
        </div>
      </div>
    </Modal>
  );
}
