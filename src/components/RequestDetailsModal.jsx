import React, { useState } from 'react';
import { BloodBadge } from './BloodBadge';
import { UrgencyBadge } from './UrgencyBadge';
import { Countdown } from './Countdown';
import { ProgressBar } from './ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { offerApi } from '../api/offerApi';
import { getCompatibleDonorLabels } from '../utils/bloodGroups';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Phone,
  Heart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RequestDetailsModal = ({ request, isOpen, onClose, onOfferSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const compatibleLabels = getCompatibleDonorLabels(request.bloodGroup);
  const isOwner = user && user.id === request.requesterId;
  const isOpenForOffers = request.status === 'OPEN';

  const handleDonateOffer = async () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/requests' } } });
      return;
    }

    if (!user.hasDonorProfile) {
      error('Please create your donor profile first to volunteer.');
      navigate('/donor-dashboard');
      return;
    }

    setSubmitting(true);
    try {
      await offerApi.offerHelp(request.id);
      success('Thank you! Your offer to donate has been sent to the patient’s coordinator.');
      if (onOfferSubmitted) onOfferSubmitted();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit offer to donate.';
      error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Urgency & Status */}
        <div className="flex items-center gap-2 mb-3 pr-10">
          <UrgencyBadge urgency={request.urgency} size="sm" />
          <Countdown targetDate={request.requiredBy} />
        </div>

        {/* Patient Name & Blood Group */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {request.patientName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coordinated by <strong className="text-slate-800">{request.requesterName}</strong>
            </p>
          </div>
          <BloodBadge bloodGroup={request.bloodGroup} size="lg" />
        </div>

        {/* Compatibility Hint */}
        <div className="bg-rose-50 rounded-xl p-3 border border-rose-100 mb-4 text-xs">
          <span className="font-bold text-rose-900 block mb-1">
            Compatible Donors for {request.bloodGroupLabel}:
          </span>
          <div className="flex flex-wrap gap-1">
            {compatibleLabels.map((lbl) => (
              <span
                key={lbl}
                className="px-2 py-0.5 rounded bg-white text-rose-700 font-extrabold border border-rose-200"
              >
                {lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Units Needed / Fulfilled Progress */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
          <ProgressBar
            fulfilled={request.unitsFulfilled}
            needed={request.unitsNeeded}
          />
        </div>

        {/* Hospital, City, Phone info */}
        <div className="space-y-2.5 text-xs text-slate-700 mb-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Hospital: <strong className="text-slate-900">{request.hospital}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>City: <strong className="text-slate-900">{request.city}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Needed by: <strong className="text-slate-900">{new Date(request.requiredBy).toLocaleString()}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Coordinator Phone: <strong className="text-slate-900 font-mono">{request.contactPhone}</strong></span>
          </div>
        </div>

        {/* Note */}
        {request.note && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-slate-700 mb-5">
            <strong className="text-amber-900 block mb-0.5">Note:</strong>
            <p>{request.note}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          {isOwner ? (
            <span className="text-xs text-slate-500 italic">
              This is your request. Manage it under "My Blood Requests".
            </span>
          ) : isOpenForOffers ? (
            <button
              onClick={handleDonateOffer}
              disabled={submitting}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              {submitting ? 'Submitting...' : 'I Can Donate Blood'}
            </button>
          ) : (
            <span className="text-xs text-slate-400">
              This request is {request.status} and no longer accepting donations.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
