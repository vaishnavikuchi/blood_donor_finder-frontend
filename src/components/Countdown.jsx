import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  function calculateTimeLeft(target) {
    if (!target) return { expired: true, text: 'N/A' };
    const difference = new Date(target).getTime() - new Date().getTime();

    if (difference <= 0) {
      return { expired: true, text: 'Expired' };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return {
      expired: false,
      text: parts.join(' ') + ' left',
      totalHours: difference / (1000 * 60 * 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
        <Clock className="w-3 h-3" /> Expired
      </span>
    );
  }

  const isUrgent = timeLeft.totalHours < 6;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
        isUrgent
          ? 'text-red-700 bg-red-100 animate-pulse'
          : 'text-slate-600 bg-slate-100'
      }`}
    >
      <Clock className="w-3 h-3" /> {timeLeft.text}
    </span>
  );
};
