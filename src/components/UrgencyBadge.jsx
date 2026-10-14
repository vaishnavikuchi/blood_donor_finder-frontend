import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

export const UrgencyBadge = ({ urgency, size = 'md' }) => {
  const configs = {
    CRITICAL: {
      label: 'CRITICAL',
      bg: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-600 animate-pulse',
      icon: AlertCircle,
    },
    URGENT: {
      label: 'URGENT',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      icon: Clock,
    },
    NORMAL: {
      label: 'NORMAL',
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      dot: 'bg-sky-500',
      icon: CheckCircle,
    },
  };

  const config = configs[urgency] || configs.NORMAL;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3 py-1.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs ${config.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
