import React from 'react';
import { Tag, Button } from 'antd';
import { SwapOutlined, CloseOutlined } from '@ant-design/icons';

export default function CompareFloatingBar({
  selectedServices = [],
  onOpenCompareModal,
  onRemoveService,
  onClearAll,
}) {
  if (!selectedServices || selectedServices.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
      <div 
        className="bg-white/95 backdrop-blur-md rounded-2xl border p-3.5 shadow-2xl flex items-center gap-3 text-left border-[#e8e4d9]"
        style={{ boxShadow: '0 20px 40px -15px rgba(28, 25, 23, 0.25)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#c75b3a]/10 flex items-center justify-center text-[#c75b3a] font-bold">
            <SwapOutlined />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1c1917] block leading-none">
              Compare Providers ({selectedServices.length}/3)
            </span>
            <span className="text-[10px] text-slate-400">Side-by-side analysis</span>
          </div>
        </div>

        {/* Selected Provider Badges */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 border-l border-r border-[#e8e4d9]">
          {selectedServices.map((s) => (
            <Tag
              key={s._id}
              closable
              onClose={() => onRemoveService(s._id)}
              className="!rounded-lg !border-none !px-2.5 !py-1 !text-[10px] !font-bold !bg-[#f2efe8] !text-stone-700 flex items-center gap-1"
            >
              {s.name.slice(0, 15)}...
            </Tag>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            onClick={onOpenCompareModal}
            className="!rounded-xl !font-bold !text-xs !px-4 !py-2"
            style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
          >
            Compare Now
          </Button>
          <button
            onClick={onClearAll}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 border-none cursor-pointer flex items-center justify-center text-xs transition-colors"
            title="Clear all selected"
          >
            <CloseOutlined style={{ fontSize: 10 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
