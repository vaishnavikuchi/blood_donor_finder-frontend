import React from 'react';
import { BloodBadge } from './BloodBadge';
import { MapPin, Phone, CheckCircle, Clock } from 'lucide-react';

export const DonorCard = ({ donor }) => {
  const isEligible = donor.eligible;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between hover:border-rose-300">
      <div>
        {/* Header: Name and Blood Group */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900 leading-tight">
              {donor.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="font-medium text-slate-700">{donor.city}</span>
              {donor.age && <span>• {donor.age} yrs</span>}
              {donor.weightKg && <span>• {donor.weightKg} kg</span>}
            </div>
          </div>
          <BloodBadge bloodGroup={donor.bloodGroup} size="md" />
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          {isEligible ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Ready to Donate
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {donor.daysUntilEligible > 0
                ? `Eligible in ${donor.daysUntilEligible} days`
                : 'Currently Unavailable'}
            </span>
          )}
        </div>

        {/* Last Donation */}
        <div className="text-xs text-slate-600 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-slate-400">Last Donation:</span>
          <span className="font-semibold text-slate-800">
            {donor.lastDonationDate ? donor.lastDonationDate : 'Never Donated'}
          </span>
        </div>
      </div>

      {/* Masked Contact */}
      <div className="mt-4 pt-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Phone className="w-3.5 h-3.5 text-rose-600" />
          <span>{donor.phone}</span>
        </div>
        <span className="text-[11px] text-slate-400">
          {donor.available ? 'Active Volunteer' : 'Inactive'}
        </span>
      </div>
    </div>
  );
};
