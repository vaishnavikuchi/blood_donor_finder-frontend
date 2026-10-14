import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Droplet, User, LogOut, Menu, X, PlusCircle, ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition px-3.5 py-2 rounded-xl flex items-center gap-1.5 ${
      isActive
        ? 'text-rose-600 bg-rose-50 shadow-2xs font-bold'
        : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block text-base font-semibold px-4 py-2.5 rounded-xl transition ${
      isActive
        ? 'text-rose-600 bg-rose-50 font-bold'
        : 'text-slate-700 hover:bg-slate-100 hover:text-rose-600'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-600/20 group-hover:scale-105 transition">
              <Droplet className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition">
                Blood<span className="text-rose-600">Link</span>
              </span>
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                India 🇮🇳
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/donors" className={navLinkClass}>
              Find Donors
            </NavLink>
            <NavLink to="/requests" className={navLinkClass}>
              Blood Requests
            </NavLink>
            <NavLink to="/donor-dashboard" className={navLinkClass}>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
              Donor Dashboard
            </NavLink>
          </nav>

          {/* User Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/donor-dashboard"
                  className="flex items-center gap-2 pl-3 pr-4 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full transition"
                >
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 max-w-[130px] truncate">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition"
              >
                <User className="w-4 h-4" />
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/donors"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Find Donors
          </NavLink>
          <NavLink
            to="/requests"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Blood Requests
          </NavLink>
          <NavLink
            to="/donor-dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Donor Dashboard
          </NavLink>

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-2 text-sm font-medium text-slate-500">
                  Signed in as <strong className="text-slate-900">{user?.name}</strong>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition"
              >
                <User className="w-4 h-4" />
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
