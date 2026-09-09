import React from 'react';
import { Card } from 'antd';

function Address({ data }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200/50 p-6 sm:p-8">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-teal-500"></span>
        Location Details
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col border-b border-slate-100 pb-3'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Street Address 1</span>
          <span className="text-slate-700 font-medium">{data?.addressObj?.street1 || 'N/A'}</span>
        </div>
        <div className='flex flex-col border-b border-slate-100 pb-3'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Street Address 2</span>
          <span className="text-slate-700 font-medium">{data?.addressObj?.street2 || 'N/A'}</span>
        </div>
        <div className='flex flex-col border-b border-slate-100 pb-3'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>City</span>
          <span className="text-slate-700 font-medium">{data?.addressObj?.newCity?.city || 'N/A'}</span>
        </div>
        <div className='flex flex-col border-b border-slate-100 pb-3'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>State</span>
          <span className="text-slate-700 font-medium">{data?.addressObj?.newState?.state || 'N/A'}</span>
        </div>
        <div className='flex flex-col border-b border-slate-100 pb-3'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Country</span>
          <span className="text-slate-700 font-medium">{data?.addressObj?.newCountry?.country || 'N/A'}</span>
        </div>
        <div className='flex flex-col border-b border-slate-100 pb-3'>
          <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>ZipCode / Postal Code</span>
          <span className="text-slate-700 font-medium font-mono">{data?.addressObj?.zipcode || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}

export default Address;
