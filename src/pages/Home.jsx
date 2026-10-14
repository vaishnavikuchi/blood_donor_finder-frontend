import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsApi } from '../api/statsApi';
import { requestApi } from '../api/requestApi';
import { RequestCard } from '../components/RequestCard';
import { RequestDetailsModal } from '../components/RequestDetailsModal';
import { Loader } from '../components/Loader';
import {
  Users,
  HeartHandshake,
  Droplet,
  CheckCircle2,
  ArrowRight,
  Heart,
  PhoneCall,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const Home = () => {
  const [stats, setStats] = useState(null);
  const [criticalRequests, setCriticalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const loadData = async () => {
    try {
      const [statsData, requestsData] = await Promise.all([
        statsApi.getStats(),
        requestApi.getRequests({ urgency: 'CRITICAL', status: 'OPEN' }),
      ]);
      setStats(statsData);
      setCriticalRequests(requestsData.slice(0, 3));
    } catch (err) {
      console.error('Failed to load home page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const chartData = stats?.donorsByBloodGroup
    ? Object.entries(stats.donorsByBloodGroup).map(([group, count]) => ({
        bloodGroup: group,
        donors: count,
      }))
    : [];

  const barColors = ['#e11d48', '#f43f5e', '#be123c', '#fb7185', '#fda4af', '#e11d48', '#be123c', '#9f1239'];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-rose-50/70 via-white to-white py-14 sm:py-20 border-b border-rose-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-5">
            🇮🇳 India's Emergency Blood Network
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Find Blood Donors in Minutes Across{' '}
            <span className="text-rose-600">Your City</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified voluntary blood donors across Hyderabad, Bengaluru, Mumbai, Delhi, and other major cities during hospital emergencies.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/donors"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/25 transition flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Find a Donor
            </Link>

            <Link
              to="/requests"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base border border-slate-300 shadow-xs transition flex items-center justify-center gap-2"
            >
              <Droplet className="w-5 h-5 text-rose-600" />
              Post Blood Request
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Stat Cards from /api/stats */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">
                {stats ? stats.totalDonors : '...'}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
                Registered Donors
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Droplet className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">
                {stats ? stats.openRequests : '...'}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
                Active Requests
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">
                {stats ? stats.fulfilledRequests : '...'}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
                Fulfilled Requests
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">
                {stats ? stats.totalUnitsDonated : '...'}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
                Units Donated
              </span>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Donors by Blood Group
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Voluntary donors ready for emergency response across Indian cities
              </p>
            </div>
            <Link
              to="/donors"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              Browse all donors <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-60 sm:h-64 w-full">
            {loading ? (
              <Loader message="Loading data..." size="md" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="bloodGroup" tickLine={false} stroke="#94a3b8" />
                  <YAxis allowDecimals={false} tickLine={false} stroke="#94a3b8" />
                  <Tooltip
                    cursor={{ fill: '#fff1f2' }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      border: '1px solid #fecdd3',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#be123c' }}
                  />
                  <Bar dataKey="donors" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-slate-400 py-12 text-sm">No donor data available</p>
            )}
          </div>
        </section>

        {/* Latest Critical Requests Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <h2 className="text-xl font-bold text-slate-900">
                Urgent Blood Needs in Hospitals
              </h2>
            </div>
            <Link
              to="/requests"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              View all requests <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <Loader message="Fetching requests..." size="md" />
          ) : criticalRequests.length === 0 ? (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
              <h3 className="font-bold text-emerald-900">No Critical Requests Pending</h3>
              <p className="text-xs text-emerald-700 mt-1">
                All patient requests are currently attended to.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {criticalRequests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onSelect={(r) => setSelectedRequest(r)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onOfferSubmitted={() => loadData()}
      />
    </div>
  );
};
