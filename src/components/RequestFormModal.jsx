import React, { useState, useEffect } from 'react';
import { requestApi } from '../api/requestApi';
import { useToast } from './Toast';
import { BLOOD_GROUPS, POPULAR_INDIAN_CITIES } from '../utils/bloodGroups';
import { X } from 'lucide-react';

export const RequestFormModal = ({ isOpen, onClose, requestToEdit, onSaved }) => {
  const { success, error } = useToast();
  const isEditing = !!requestToEdit;

  const getInitialForm = () => {
    if (requestToEdit) {
      let reqByFormatted = '';
      if (requestToEdit.requiredBy) {
        const dt = new Date(requestToEdit.requiredBy);
        reqByFormatted = dt.toISOString().slice(0, 16);
      }
      return {
        patientName: requestToEdit.patientName || '',
        bloodGroup: requestToEdit.bloodGroup || 'A_POS',
        unitsNeeded: requestToEdit.unitsNeeded || 1,
        hospital: requestToEdit.hospital || '',
        city: requestToEdit.city || 'Hyderabad',
        urgency: requestToEdit.urgency || 'URGENT',
        requiredBy: reqByFormatted,
        contactPhone: requestToEdit.contactPhone || '',
        note: requestToEdit.note || '',
      };
    }

    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const tzOffset = tomorrow.getTimezoneOffset() * 60000;
    const localTomorrow = new Date(tomorrow.getTime() - tzOffset).toISOString().slice(0, 16);

    return {
      patientName: '',
      bloodGroup: 'A_POS',
      unitsNeeded: 1,
      hospital: '',
      city: 'Hyderabad',
      urgency: 'URGENT',
      requiredBy: localTomorrow,
      contactPhone: '',
      note: '',
    };
  };

  const [formData, setFormData] = useState(getInitialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(getInitialForm());
    setErrors({});
  }, [requestToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.patientName.trim()) errs.patientName = 'Patient name is required';
    if (!formData.hospital.trim()) errs.hospital = 'Hospital name is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.contactPhone.trim()) errs.contactPhone = 'Contact phone number is required';
    if (!formData.requiredBy) errs.requiredBy = 'Date & time required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'unitsNeeded' ? parseInt(value) || 1 : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditing) {
        await requestApi.updateRequest(requestToEdit.id, formData);
        success('Blood request updated successfully!');
      } else {
        await requestApi.createRequest(formData);
        success('Blood request created! Donors in your city will see it.');
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black text-slate-900 mb-1">
          {isEditing ? 'Edit Request' : 'Post Blood Request'}
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Enter patient details to notify eligible blood donors.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Patient Name *
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="e.g. Ramesh Kulkarni"
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.patientName ? 'border-red-500' : 'border-slate-200'
              } text-sm focus:ring-2 focus:ring-rose-500`}
            />
            {errors.patientName && (
              <p className="text-xs text-red-500 mt-1">{errors.patientName}</p>
            )}
          </div>

          {/* Blood Group and Units */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Blood Group *
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-bold focus:ring-2 focus:ring-rose-500"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg.value} value={bg.value}>
                    {bg.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Units Needed (1-10) *
              </label>
              <input
                type="number"
                name="unitsNeeded"
                min="1"
                max="10"
                value={formData.unitsNeeded}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Hospital and City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hospital Name *
              </label>
              <input
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                placeholder="e.g. Apollo Hospital, Jubilee Hills"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.hospital ? 'border-red-500' : 'border-slate-200'
                } text-sm focus:ring-2 focus:ring-rose-500`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Hyderabad"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.city ? 'border-red-500' : 'border-slate-200'
                } text-sm focus:ring-2 focus:ring-rose-500`}
              />
            </div>
          </div>

          {/* Urgency and Required By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Urgency Level *
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-semibold focus:ring-2 focus:ring-rose-500"
              >
                <option value="CRITICAL">🔴 Critical (Immediate / ICU)</option>
                <option value="URGENT">🟠 Urgent (Within 24-48 hrs)</option>
                <option value="NORMAL">🔵 Normal (Planned surgery)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Needed By *
              </label>
              <input
                type="datetime-local"
                name="requiredBy"
                value={formData.requiredBy}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact / Attender Phone Number *
            </label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.contactPhone ? 'border-red-500' : 'border-slate-200'
              } text-sm font-mono focus:ring-2 focus:ring-rose-500`}
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Note (Optional)
            </label>
            <textarea
              name="note"
              rows="2"
              value={formData.note}
              onChange={handleChange}
              placeholder="e.g. Please reach Blood Bank 2nd floor, contact Dr. Rao"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition"
            >
              {submitting ? 'Submitting...' : isEditing ? 'Save Changes' : 'Post Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
