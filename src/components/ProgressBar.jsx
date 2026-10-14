import React from 'react';

export const ProgressBar = ({ fulfilled = 0, needed = 1, showLabel = true }) => {
  const percentage = Math.min(100, Math.round((fulfilled / needed) * 100));
  const isFulfilled = fulfilled >= needed;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          <span>
            Units: <strong className="text-slate-900">{fulfilled}</strong> / {needed}
          </span>
          <span className={isFulfilled ? 'text-emerald-600 font-bold' : 'text-rose-600 font-semibold'}>
            {percentage}% fulfilled
          </span>
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            isFulfilled ? 'bg-emerald-500' : 'bg-rose-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
