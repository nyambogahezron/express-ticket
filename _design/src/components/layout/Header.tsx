import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if header should be transparent (only on homepage)
  const isHomePage = location.pathname === '/';
  
  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = isHomePage && !isScrolled && !isMobileMenuOpen
    ? 'bg-transparent text-white'
    : 'bg-white text-gray-900 shadow-sm';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Ticket className={`h-6 w-6 ${isHomePage && !isScrolled && !isMobileMenuOpen ? 'text-white' : 'text-primary-600'}`} />
            <span className="font-bold text-xl">TicketR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/events" className="text-sm font-medium hover:text-primary-600 transition-colors">
              Browse Events
            </Link>
            <Link to="/venues" className="text-sm font-medium hover:text-primary-600 transition-colors">
              Venues
            </Link>
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm font-medium hover:text-primary-600">
                  <span>{user?.name}</span>
                  <User className="h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <Link to="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Bookings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium hover:text-primary-600 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-1.5">
                  Sign up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t pb-4 animate-slide-up">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/events"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Events
            </Link>
            <Link
              to="/venues"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Venues
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/bookings"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-4 flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="px-3 py-2 text-center rounded-md text-base font-medium border border-gray-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 text-center rounded-md text-base font-medium bg-primary-600 text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;