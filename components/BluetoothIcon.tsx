import React from 'react';

export const BluetoothIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m7 7 10 10-5 5V2l5 5L7 17" />
  </svg>
);
