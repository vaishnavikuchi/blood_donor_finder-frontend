import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requestApi } from '../api/requestApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { RequestCard } from '../components/RequestCard';
import { RequestDetailsModal } from '../components/RequestDetailsModal';
import { RequestFormModal } from '../components/RequestFormModal';
import { OffersModal } from '../components/OffersModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loader } from '../components/Loader';
import { BLOOD_GROUPS, POPULAR_INDIAN_CITIES } from '../utils/bloodGroups';
import {
  PlusCircle,
  FolderOpen,
  Users,
  Edit2,
  Trash2,
  MapPin,
} from 'lucide-react';

export const Requests = () => {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => {
    return location.state?.tab === 'my' && isAuthenticated ? 'my' : 'all';
  });

  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [urgency, setUrgency] = useState('');

  const [allRequests, setAllRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [detailsModalRequest, setDetailsModalRequest] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [requestToEdit, setRequestToEdit] = useState(null);
  const [offersModalRequest, setOffersModalRequest] = useState(null);

  const [cancelDialog, setCancelDialog] = useState({
    isOpen: false,
    requestId: null,
    loading: false,
  });

  const loadRequests = async () => {
    setLoading(true);
    try {
      if (activeTab === 'all') {
        const params = { status: 'OPEN' };
        if (bloodGroup) params.bloodGroup = bloodGroup;
        if (city.trim()) params.city = city.trim();
        if (urgency) params.urgency = urgency;

        const data = await requestApi.getRequests(params);
        setAllRequests(data);
      } else {
        if (isAuthenticated) {
          const data = await requestApi.getMyRequests();
          setMyRequests(data);
        }
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [activeTab, bloodGroup, city, urgency]);

  const handleTabChange = (tab) => {
    if (tab === 'my' && !isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/requests', state: { tab: 'my' } } } });
      return;
    }
    setActiveTab(tab);
  };

  const handleNewRequestClick = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/requests' } } });
      return;
    }
    setRequestToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (request) => {
    setRequestToEdit(request);
    setIsFormModalOpen(true);
  };

  const handleCancelClick = (request) => {
    setCancelDialog({
      isOpen: true,
      requestId: request.id,
      loading: false,
    });
  };

  const handleConfirmCancel = async () => {
    setCancelDialog((prev) => ({ ...prev, loading: true }));
    try {
      await requestApi.cancelRequest(cancelDialog.requestId);
      success('Blood request cancelled.');
      setCancelDialog({ isOpen: false, requestId: null, loading: false });
      loadRequests();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to cancel request.');
      setCancelDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Emergency Blood Requests
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Urgent requests from hospitals and family coordinators across India.
          </p>
        </div>

        <button
          onClick={handleNewRequestClick}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md shadow-rose-600/20 transition shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Post Blood Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => handleTabChange('all')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Active Requests
        </button>

        <button
          onClick={() => handleTabChange('my')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'my'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          My Posted Requests {isAuthenticated && myRequests.length > 0 && `(${myRequests.length})`}
        </button>
      </div>

      {/* Simple Filters for All Requests */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:ring-2 focus:ring-rose-500"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg.value} value={bg.value}>
                  {bg.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Hyderabad, Mumbai..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:ring-2 focus:ring-rose-500"
            >
              <option value="">All Urgencies</option>
              <option value="CRITICAL">🔴 Critical Only</option>
              <option value="URGENT">🟠 Urgent Only</option>
              <option value="NORMAL">🔵 Normal Only</option>
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Loader message="Loading requests..." size="lg" />
      ) : activeTab === 'all' ? (
        allRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
            <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Active Requests</h3>
            <p className="text-xs text-slate-400">
              No matching requests right now. You can post a new request above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onSelect={(r) => setDetailsModalRequest(r)}
              />
            ))}
          </div>
        )
      ) : (
        myRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
            <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">You haven't posted any requests</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              If an attender or hospital needs blood for a patient, click below to post a request.
            </p>
            <button
              onClick={handleNewRequestClick}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
            >
              Post Request
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      {req.status}
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      {req.urgency}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {req.patientName} — {req.bloodGroupLabel} ({req.unitsNeeded} units needed, {req.unitsFulfilled} fulfilled)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {req.hospital}, {req.city} • Needed by:{' '}
                    <strong>{new Date(req.requiredBy).toLocaleString()}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setOffersModalRequest(req)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Volunteers & Matches ({req.responseCount || 0})
                  </button>

                  {req.status === 'OPEN' && (
                    <>
                      <button
                        onClick={() => handleEditClick(req)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCancelClick(req)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Details Modal */}
      <RequestDetailsModal
        request={detailsModalRequest}
        isOpen={!!detailsModalRequest}
        onClose={() => setDetailsModalRequest(null)}
        onOfferSubmitted={() => loadRequests()}
      />

      {/* Form Modal */}
      <RequestFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setRequestToEdit(null);
        }}
        requestToEdit={requestToEdit}
        onSaved={() => loadRequests()}
      />

      {/* Offers Modal */}
      <OffersModal
        request={offersModalRequest}
        isOpen={!!offersModalRequest}
        onClose={() => setOffersModalRequest(null)}
        onRequestUpdated={() => loadRequests()}
      />

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={cancelDialog.isOpen}
        title="Cancel Blood Request"
        message="Are you sure you want to cancel this request?"
        confirmText="Yes, Cancel"
        isDestructive={true}
        loading={cancelDialog.loading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelDialog({ isOpen: false, requestId: null, loading: false })}
      />
    </div>
  );
};
