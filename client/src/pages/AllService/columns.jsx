import React from 'react';
import { Tag } from 'antd';
// import tagColor from "../../config/consts";
import { Link } from 'react-router-dom';

const tagColor = [
  '#ffa39e',
  '#ffbb96',
  '#ffd591',
  '#ffe58f',
  '#fffb8f',
  '#eaff8f',
  '#b7eb8f',
  '#87e8de',
  '#91d5ff',
  '#adc6ff',
  '#d3adf7',
  '#ffadd2',
];
const columns = [
  {
    title: 'Service Name',
    dataIndex: 'name',
    render: (text, row) => (
      <Link className='text-orange-500 hover:text-orange-600 font-bold transition-colors' to={`${row.service_id}`}>
        {text}
      </Link>
    ),
  },
  {
    title: 'Category',
    dataIndex: ['typeObj', 'name'],
    render: (text) => <span className="font-semibold text-slate-700">{text}</span>
  },
  {
    title: 'City',
    dataIndex: ['addressObj', 'newCity', 'city'],
  },
  {
    title: 'State',
    dataIndex: ['addressObj', 'newState', 'state'],
  },
  {
    title: 'Tags / Specialties',
    dataIndex: 'tag',
    render: (text) =>
      text.map((prop) => {
        const num = prop.charCodeAt(0) + prop.charCodeAt(prop.length - 1);
        return (
          <Tag 
            className="border-none rounded-full px-3 py-0.5 text-xs font-semibold"
            style={{ color: '#c2410c', backgroundColor: '#ffedd5' }}
          >
            {prop}
          </Tag>
        );
      }),
  },
  {
    title: 'Provider Name',
    dataIndex: ['ownerObj', 'name'],
    render: (data) => <span className="text-slate-600 font-medium">{data || 'Not Specified'}</span>,
  },
  {
    title: 'Contact Phone',
    dataIndex: ['ownerObj', 'phone'],
    render: (data) => <span className="font-mono text-slate-600">{data || 'Not Specified'}</span>,
  },

  {
    title: 'Experience',
    dataIndex: 'experiance',
  },
  {
    title: 'Customers Served',
    dataIndex: 'customers_served',
  },
];

export default columns;
