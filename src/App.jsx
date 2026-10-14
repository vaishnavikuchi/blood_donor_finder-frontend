import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { FindDonors } from './pages/FindDonors';
import { Requests } from './pages/Requests';
import { DonorDashboard } from './pages/DonorDashboard';
import { Auth } from './pages/Auth';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-rose-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* 5 required pages */}
                <Route path="/" element={<Home />} />
                <Route path="/donors" element={<FindDonors />} />
                <Route path="/requests" element={<Requests />} />
                <Route
                  path="/donor-dashboard"
                  element={
                    <ProtectedRoute>
                      <DonorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/auth" element={<Auth />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">
                  BloodLink — Blood Donor Finder with Emergency Requests
                </p>
                <p>
                  Every drop counts. Connecting generous voluntary donors with patients across hospitals.
                </p>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
