import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from './Button';

const Header = () => {
  const { isAuthenticated, username, logout, level, xp } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/challenges', label: 'Challenges' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-dark-gray/95 backdrop-blur-md border-b border-soft-gray z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-heading font-bold bg-gradient-sunset bg-clip-text text-transparent">
              Reclaim
            </h1>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6">
            {navLinks.map((link) => {
              // Show Home to everyone, Dashboard/Challenges/Leaderboard only when authenticated
              if (!isAuthenticated && link.path !== '/') return null;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-gold'
                      : 'text-muted-gray hover:text-pure-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 sm:gap-3 glass-panel px-2 sm:px-4 py-2 hover:border-gold transition-colors rounded-lg"
                >
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-heading font-semibold text-pure-white">{username}</div>
                    <div className="text-xs text-muted-gray">Level {level} • {xp} XP</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-sunset flex items-center justify-center text-sm font-bold text-pure-white flex-shrink-0">
                    {username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <svg className="w-4 h-4 text-muted-gray hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 sm:w-48 glass-panel border-soft-gray rounded-lg shadow-xl overflow-hidden animate-fade-in">
                    <div className="p-3 border-b border-soft-gray">
                      <div className="text-sm font-heading font-semibold text-pure-white">{username}</div>
                      <div className="text-xs text-muted-gray">Level {level} • {xp} XP</div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-sm text-muted-gray hover:text-gold hover:bg-dark-gray/50 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/chat"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-sm text-muted-gray hover:text-gold hover:bg-dark-gray/50 transition-colors"
                    >
                      AI Coach
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-dark-gray/50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
