import React from 'react';
import { Card, Tag } from 'antd';
import tagColor from '../../config/consts';

function MainDetails({ data }) {
  return (
    <>
      {data && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200/50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-500"></span>
            Profile Details
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col border-b border-slate-100 pb-3'>
              <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Service Title</span>
              <span className="text-slate-700 font-medium">{data.name}</span>
            </div>
            <div className='flex flex-col border-b border-slate-100 pb-3'>
              <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Category</span>
              <span className="text-slate-700 font-medium">{data.typeObj?.name}</span>
            </div>
            <div className='flex flex-col border-b border-slate-100 pb-3 md:col-span-2'>
              <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1'>Service Description</span>
              <span className="text-slate-600 leading-relaxed text-sm">{data.description || 'No description provided.'}</span>
            </div>
            <div className='flex flex-col border-b border-slate-100 pb-3 md:col-span-2'>
              <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2'>Specialized Tags</span>
              <div className="flex flex-wrap gap-2">
                {data?.tag?.map((prop) => (
                  <Tag 
                    key={prop} 
                    className="border-none rounded-full px-3 py-0.5 text-xs font-semibold"
                    style={{ color: '#0f766e', backgroundColor: '#ccfbf1' }}
                  >
                    {prop}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MainDetails;
