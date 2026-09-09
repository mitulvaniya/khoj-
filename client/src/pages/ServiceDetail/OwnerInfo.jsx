import React from 'react';
import { Card, Row } from 'antd';

function OwnerInfo({ data }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200/50 p-6 sm:p-8">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-teal-500"></span>
        Owner Profile Information
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col border-b border-slate-100 pb-3'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Provider Name</span>
          <span className="text-slate-700 font-medium">{data?.ownerObj?.name || 'N/A'}</span>
        </div>
        <div className='flex flex-col border-b border-slate-100 pb-3'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Email Address</span>
          <span className="text-slate-700 font-medium">{data?.ownerObj?.email || 'N/A'}</span>
        </div>
        <div className='flex flex-col border-b border-slate-100 pb-3'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Phone Line</span>
          <span className="text-slate-700 font-medium font-mono">{data?.ownerObj?.phone || 'N/A'}</span>
        </div>
        <div className='flex flex-col border-b border-slate-100 pb-3'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Gender</span>
          <span className="text-slate-700 font-medium">{data?.ownerObj?.gender || 'N/A'}</span>
        </div>
        <div className='flex flex-col border-b border-slate-100 pb-3 md:col-span-2'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Merchant Address</span>
          <span className="text-slate-600 text-sm">
            {[
              data?.ownerObj?.addressObj?.street1,
              data?.ownerObj?.addressObj?.street2,
              data?.ownerObj?.addressObj?.newCity?.city,
              data?.ownerObj?.addressObj?.newState?.state,
              data?.ownerObj?.addressObj?.newCountry?.country
            ].filter(Boolean).join(', ') || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OwnerInfo;
