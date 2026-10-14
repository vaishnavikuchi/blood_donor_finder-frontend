import React, { useState, useEffect } from 'react';
import { offerApi } from '../api/offerApi';
import { requestApi } from '../api/requestApi';
import { useToast } from './Toast';
import { BloodBadge } from './BloodBadge';
import { ProgressBar } from './ProgressBar';
import { Loader } from './Loader';
import { ConfirmDialog } from './ConfirmDialog';
import {
  X,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Users,
  Sparkles,
} from 'lucide-react';

export const OffersModal = ({ request, isOpen, onClose, onRequestUpdated }) => {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('offers');
  const [offers, setOffers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [includeOtherCities, setIncludeOtherCities] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    offerId: null,
    status: null,
    title: '',
    message: '',
    isDestructive: false,
  });

  const fetchData = async () => {
    if (!request) return;
    setLoading(true);
    try {
      const [offersData, matchesData] = await Promise.all([
        offerApi.getOffersForRequest(request.id),
        requestApi.getMatches(request.id, includeOtherCities),
      ]);
      setOffers(offersData);
      setMatches(matchesData);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load offers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && request) {
      fetchData();
    }
  }, [isOpen, request, includeOtherCities]);

  if (!isOpen || !request) return null;

  const handleStatusChangeClick = (offerId, newStatus) => {
    if (newStatus === 'DONATED') {
      setConfirmDialog({
        isOpen: true,
        offerId,
        status: newStatus,
        title: 'Confirm Completed Donation',
        message:
          'Confirm that this donor has donated blood at the hospital? This will record the donation and increment units fulfilled.',
        isDestructive: false,
      });
    } else if (newStatus === 'REJECTED') {
      setConfirmDialog({
        isOpen: true,
        offerId,
        status: newStatus,
        title: 'Decline Volunteer Offer',
        message: 'Are you sure you want to decline this donor offer?',
        isDestructive: true,
      });
    } else {
      executeStatusUpdate(offerId, newStatus);
    }
  };

  const executeStatusUpdate = async (offerId, newStatus) => {
    try {
      await offerApi.updateOfferStatus(offerId, newStatus);
      success(`Offer updated to ${newStatus}!`);
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      await fetchData();
      if (onRequestUpdated) onRequestUpdated();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update offer status.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 relative max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100 shrink-0">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                Volunteers for Patient
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                {request.patientName} ({request.bloodGroupLabel}) — {request.hospital}
              </h2>
              <div className="mt-2">
                <ProgressBar
                  fulfilled={request.unitsFulfilled}
                  needed={request.unitsNeeded}
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Simple Tabs */}
          <div className="flex items-center justify-between gap-3 my-3 border-b border-slate-100 pb-2 shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('offers')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'offers'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Donors Who Offered ({offers.length})
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'matches'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Available Matches ({matches.length})
              </button>
            </div>

            {activeTab === 'matches' && (
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeOtherCities}
                  onChange={(e) => setIncludeOtherCities(e.target.checked)}
                  className="rounded text-rose-600 w-3.5 h-3.5"
                />
                Include other cities
              </label>
            )}
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto py-2 space-y-3">
            {loading ? (
              <Loader message="Loading..." size="md" />
            ) : activeTab === 'offers' ? (
              offers.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                  <p className="font-semibold text-slate-700">No donor offers yet.</p>
                  <p className="text-slate-400 mt-0.5">
                    Switch to "Available Matches" to call compatible volunteers directly!
                  </p>
                </div>
              ) : (
                offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <BloodBadge bloodGroup={offer.donorBloodGroup} size="sm" />
                        <span className="font-bold text-sm text-slate-900">{offer.donorName}</span>
                        <span className="font-bold text-[10px] uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                          {offer.status}
                        </span>
                      </div>

                      {/* Contact phone revealed for request owner */}
                      <div className="flex flex-wrap items-center gap-3 text-slate-700 mt-1 font-mono font-bold">
                        <span className="flex items-center gap-1 text-rose-700 bg-white px-2 py-1 rounded border border-slate-200">
                          <Phone className="w-3 h-3 text-rose-600" /> {offer.donorPhone}
                        </span>
                        <span className="text-slate-500 font-sans font-normal">
                          {offer.donorCity}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {offer.status === 'OFFERED' && (
                        <>
                          <button
                            onClick={() => handleStatusChangeClick(offer.id, 'CONFIRMED')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChangeClick(offer.id, 'REJECTED')}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold rounded-lg transition"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {offer.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusChangeClick(offer.id, 'DONATED')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Donated
                        </button>
                      )}

                      {offer.status === 'DONATED' && (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          ✓ Donated
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : (
              // Matched Donors
              matches.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="font-semibold text-slate-700">No compatible donors in {request.city}.</p>
                  <p className="text-slate-400 mt-0.5">Check "Include other cities" to expand.</p>
                </div>
              ) : (
                matches.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BloodBadge bloodGroup={m.bloodGroup} size="sm" />
                        <span className="font-bold text-sm text-slate-900">{m.name}</span>
                        {m.isExactMatch && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Exact Match
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{m.city}</span>
                        <span>• Phone: <strong className="font-mono text-slate-800">{m.phone}</strong></span>
                      </div>
                    </div>

                    <a
                      href={`tel:${m.phone}`}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirm"
        isDestructive={confirmDialog.isDestructive}
        onConfirm={() => executeStatusUpdate(confirmDialog.offerId, confirmDialog.status)}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
