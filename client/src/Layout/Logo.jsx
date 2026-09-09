import React from 'react';

class Logo extends React.PureComponent {
  render() {
    return (
      <svg
        className='logo-svg hover:scale-110 transition-transform duration-300'
        width='40'
        height='40'
        viewBox='0 0 40 40'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        style={{ cursor: 'pointer' }}
      >
        {/* Soft rounded squircle base */}
        <rect width='40' height='40' rx='10' fill='#f2ede4' />
        {/* Abstract magnifying glass + home shape */}
        <path
          d='M14 20.5L20 14.5L26 20.5'
          stroke='#e2725b'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M16 20.5V26.5C16 27.0523 16.4477 27.5 17 27.5H23C23.5523 27.5 24 27.0523 24 26.5V20.5'
          stroke='#e2725b'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        {/* Sparkling star / discovery dot */}
        <circle cx='20' cy='20.5' r='2' fill='#d97706' />
      </svg>
    );
  }
}

export default Logo;
