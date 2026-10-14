import React, { useState, useEffect } from 'react';
import { donorApi } from '../api/donorApi';
import { DonorCard } from '../components/DonorCard';
import { Loader } from '../components/Loader';
import { BLOOD_GROUPS, POPULAR_INDIAN_CITIES, getCompatibleDonorLabels } from '../utils/bloodGroups';
import { Search, MapPin, Users, Heart, RefreshCw } from 'lucide-react';

export const FindDonors = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (city.trim()) params.city = city.trim();
      if (eligibleOnly) params.eligibleOnly = true;

      const data = await donorApi.searchDonors(params);
      setDonors(data);
    } catch (err) {
      console.error('Failed to search donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup, city, eligibleOnly]);

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity === city ? '' : selectedCity);
  };

  const compatibleLabels = bloodGroup ? getCompatibleDonorLabels(bloodGroup) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Find Blood Donors in India
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Search verified voluntary donors by blood type or select your city below.
        </p>
      </div>

      {/* City Quick Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
          Quick City:
        </span>
        <button
          type="button"
          onClick={() => setCity('')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
            city === ''
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Cities
        </button>
        {POPULAR_INDIAN_CITIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => handleCitySelect(c)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              city.toLowerCase() === c.toLowerCase()
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Simple Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Blood Group Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Patient's Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-semibold focus:ring-2 focus:ring-rose-500"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg.value} value={bg.value}>
                  {bg.label} (Patient Needs {bg.label})
                </option>
              ))}
            </select>
          </div>

          {/* City Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              City / Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hyderabad, Bengaluru..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-end">
            <label className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200 w-full transition">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={(e) => setEligibleOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              Available to Donate Now
            </label>
          </div>
        </div>

        {/* Compatibility Hint Banner */}
        {bloodGroup && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-rose-900 font-semibold">
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600 shrink-0" />
              <span>
                Patients with{' '}
                <strong className="text-rose-700 font-black">
                  {BLOOD_GROUPS.find((b) => b.value === bloodGroup)?.label}
                </strong>{' '}
                can safely receive blood from donors of:
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {compatibleLabels.map((lbl) => (
                <span
                  key={lbl}
                  className="px-2 py-0.5 rounded-md bg-white border border-rose-200 font-extrabold text-rose-700 shadow-2xs"
                >
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Donors Grid */}
      {loading ? (
        <Loader message="Searching voluntary donors..." size="lg" />
      ) : donors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Donors Found in this Location</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try choosing "All Cities" or selecting a different blood group to view compatible donors.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      )}
    </div>
  );
};
