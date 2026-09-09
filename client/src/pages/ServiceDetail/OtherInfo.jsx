import React from 'react';
import { Card, Row } from 'antd';

function OtherInfo({ data }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200/50 p-6 sm:p-8">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-teal-500"></span>
        Operational Statistics
      </h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center'>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider mb-2">EXPERIENCE</span>
          <span className="text-3xl font-extrabold text-slate-800">{data?.experiance || 'N/A'}</span>
          <span className="text-xs text-slate-400 block mt-1">Years active</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider mb-2">CLIENTS SERVED</span>
          <span className="text-3xl font-extrabold text-slate-800">{data?.customers_served || '0'}+</span>
          <span className="text-xs text-slate-400 block mt-1">Satisfied users</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider mb-2">RATING</span>
          <span className="text-xl font-bold text-teal-600 block mt-1">⭐️ ⭐️ ⭐️ ⭐️</span>
          <span className="text-xs text-slate-400 block mt-1">Verified reviews</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider mb-2">FEEDBACK</span>
          <span className="text-sm font-bold text-slate-700 block mt-2">"Best in area"</span>
          <span className="text-xs text-slate-400 block mt-1">Top comment</span>
        </div>
      </div>
    </div>
  );
}

export default OtherInfo;
