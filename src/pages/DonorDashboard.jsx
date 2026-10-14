import React, { useState, useEffect } from 'react';
import { donorApi } from '../api/donorApi';
import { offerApi } from '../api/offerApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { BloodBadge } from '../components/BloodBadge';
import { Loader } from '../components/Loader';
import { BLOOD_GROUPS, POPULAR_INDIAN_CITIES } from '../utils/bloodGroups';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  MapPin,
  Heart,
} from 'lucide-react';

export const DonorDashboard = () => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    bloodGroup: 'O_POS',
    city: 'Hyderabad',
    dateOfBirth: '',
    weightKg: 65,
    lastDonationDate: '',
    available: true,
  });
  const [formErrors, setFormErrors] = useState({});

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      try {
        const profileData = await donorApi.getMyProfile();
        setProfile(profileData);
        setHasProfile(true);
        setFormData({
          bloodGroup: profileData.bloodGroup,
          city: profileData.city,
          dateOfBirth: profileData.dateOfBirth,
          weightKg: profileData.weightKg,
          lastDonationDate: profileData.lastDonationDate || '',
          available: profileData.available,
        });
      } catch (err) {
        setHasProfile(false);
      }

      try {
        const offersData = await offerApi.getMyOffers();
        setMyOffers(offersData);
      } catch (err) {
        console.error('Failed to load my offers:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleAvailability = async () => {
    try {
      const updated = await donorApi.toggleAvailability();
      setProfile(updated);
      setFormData((prev) => ({ ...prev, available: updated.available }));
      success(
        updated.available
          ? 'You are now marked as AVAILABLE for emergencies.'
          : 'You are now marked as UNAVAILABLE.'
      );
    } catch (err) {
      error(err.response?.data?.message || 'Failed to toggle availability.');
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const diffYears = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (diffYears < 18 || diffYears > 65) {
        errs.dateOfBirth = 'Must be between 18 and 65 years old';
      }
    }
    if (!formData.weightKg || formData.weightKg < 50) {
      errs.weightKg = 'Weight must be at least 50 kg to donate';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        lastDonationDate: formData.lastDonationDate ? formData.lastDonationDate : null,
      };

      if (hasProfile) {
        const updated = await donorApi.updateProfile(payload);
        setProfile(updated);
        success('Donor profile updated!');
      } else {
        const created = await donorApi.createProfile(payload);
        setProfile(created);
        setHasProfile(true);
        success('Donor profile registered! Thank you for volunteering.');
        await refreshUser();
      }
      await loadDashboardData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Loading dashboard..." size="lg" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Donor Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your donor profile, view eligibility status, and track your volunteer offers.
        </p>
      </div>

      {/* Status Card & Availability */}
      {hasProfile && profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Eligibility Card */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Medical Eligibility
                </span>
                <BloodBadge bloodGroup={profile.bloodGroup} size="md" />
              </div>

              {profile.eligible ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-900">
                      Eligible to Donate Blood
                    </h3>
                    <p className="text-xs text-emerald-700">
                      You meet all medical criteria (age 18-65, weight 50+ kg, cooldown clear).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-900">
                      {profile.daysUntilEligible > 0
                        ? `Next Eligible in ${profile.daysUntilEligible} days`
                        : 'Currently Ineligible'}
                    </h3>
                    <p className="text-xs text-amber-700">
                      {profile.reason || 'Donation cooldown period active.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Last Donated</span>
                <strong className="text-slate-800">{profile.lastDonationDate || 'Never'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Weight</span>
                <strong className="text-slate-800">{profile.weightKg} kg</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Location</span>
                <strong className="text-slate-800">{profile.city}</strong>
              </div>
            </div>
          </div>

          {/* Quick Availability Toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Emergency Readiness
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Volunteer Status
              </h3>
              <p className="text-xs text-slate-500">
                Turn off if you are traveling, unwell, or temporarily unable to donate.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleAvailability}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 mt-4 ${
                profile.available
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              {profile.available ? 'Status: Active & Available' : 'Status: Paused'}
            </button>
          </div>
        </div>
      )}

      {/* Simple Profile Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl">
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          {hasProfile ? 'Edit Profile' : 'Register as a Blood Donor'}
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Provide your details to help patients locate compatible blood in emergencies.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Blood Group *
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg.value} value={bg.value}>
                    {bg.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Hyderabad"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date of Birth (18-65 yrs) *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
              {formErrors.dateOfBirth && (
                <p className="text-red-500 mt-0.5">{formErrors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Weight in kg (50+ kg) *
              </label>
              <input
                type="number"
                min="30"
                max="300"
                value={formData.weightKg}
                onChange={(e) =>
                  setFormData({ ...formData, weightKg: parseInt(e.target.value) || 50 })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Last Donation Date (Leave empty if never donated)
            </label>
            <input
              type="date"
              value={formData.lastDonationDate}
              onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition mt-2"
          >
            {saving ? 'Saving...' : hasProfile ? 'Update Profile' : 'Register Profile'}
          </button>
        </form>
      </div>

      {/* My Offers Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-1">My Volunteer Offers</h2>
        <p className="text-xs text-slate-500 mb-4">
          Emergency requests you offered to help with.
        </p>

        {myOffers.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            You haven't volunteered for any requests yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {myOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{offer.patientName}</span>
                    <span className="font-bold text-[10px] uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                      {offer.status}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    {offer.hospital}, {offer.requestCity}
                  </div>
                </div>

                <div className="font-mono text-slate-700 font-bold">
                  {offer.requestContactPhone}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
