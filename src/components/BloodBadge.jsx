import React from 'react';
import { getBloodGroupLabel } from '../utils/bloodGroups';

export const BloodBadge = ({ bloodGroup, size = 'md' }) => {
  const label = getBloodGroupLabel(bloodGroup);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-bold',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-base px-3.5 py-1.5 font-extrabold',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200 shadow-sm ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5"></span>
      {label}
    </span>
  );
};
