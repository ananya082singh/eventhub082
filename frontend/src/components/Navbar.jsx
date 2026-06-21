import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold gradient-text group-hover:opacity-80 transition-opacity">
              EventHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-surface-300 hover:text-white transition-colors text-sm font-medium"
            >
              Events
            </Link>

            {isAuthenticated && (
              <Link
                to="/bookings"
                className="text-surface-300 hover:text-white transition-colors text-sm font-medium"
              >
                My Bookings
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-surface-400">
                  Hi, <span className="text-primary-400 font-medium">{user?.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-surface-400 hover:text-red-400 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm text-surface-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !py-2 !px-4 text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-surface-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-surface-700/50 mt-2 pt-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-surface-300 hover:text-white transition-colors text-sm font-medium py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>

              {isAuthenticated && (
                <Link
                  to="/bookings"
                  className="text-surface-300 hover:text-white transition-colors text-sm font-medium py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <span className="text-sm text-surface-400 py-1">
                    Signed in as <span className="text-primary-400 font-medium">{user?.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium py-1 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-surface-300 hover:text-white transition-colors text-sm font-medium py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-surface-300 hover:text-white transition-colors text-sm font-medium py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
