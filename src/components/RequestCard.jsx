import React from 'react';
import { BloodBadge } from './BloodBadge';
import { UrgencyBadge } from './UrgencyBadge';
import { Countdown } from './Countdown';
import { ProgressBar } from './ProgressBar';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

export const RequestCard = ({
  request,
  onSelect,
  isOwner = false,
  onViewOffers,
}) => {
  return (
    <div
      onClick={() => onSelect && onSelect(request)}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group hover:border-rose-400"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <UrgencyBadge urgency={request.urgency} size="sm" />
          <BloodBadge bloodGroup={request.bloodGroup} size="sm" />
        </div>

        {/* Patient & Hospital */}
        <div className="mb-3">
          <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-rose-600 transition leading-snug">
            {request.patientName}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium truncate">{request.hospital}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{request.city}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="my-3 py-2 border-t border-b border-slate-100">
          <ProgressBar
            fulfilled={request.unitsFulfilled}
            needed={request.unitsNeeded}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 flex items-center justify-between text-xs">
        <Countdown targetDate={request.requiredBy} />

        <div className="flex items-center gap-2">
          {isOwner && onViewOffers ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewOffers(request);
              }}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition"
            >
              View Offers ({request.responseCount || 0})
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 font-bold text-rose-600 group-hover:translate-x-1 transition">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
