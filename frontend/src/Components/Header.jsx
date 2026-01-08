import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from './Button';
import { ArrowUpRight } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, username, logout, level, xp } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
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

  // Navigation links for public header (like Clario style)
  const publicNavLinks = [
    { path: '/', label: 'Home' },
    { path: '#features', label: 'Features' },
    { path: '#how-it-works', label: 'How it works' },
    { path: '/about', label: 'About' },
  ];

  // Navigation links for authenticated users
  const authNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/challenges', label: 'Challenges' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-dark-gray/98 backdrop-blur-xl border-b border-purple/40 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-90 transition-opacity group">
            <h1 className="text-xl sm:text-2xl font-body font-bold text-purple tracking-tight group-hover:scale-105 transition-transform duration-300">
              Reclaim
            </h1>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {(isAuthenticated ? authNavLinks : publicNavLinks).map((link) => {
              // For hash links, handle scroll behavior
              const handleClick = (e) => {
                if (link.path.startsWith('#')) {
                  e.preventDefault();
                  // If we're not on homepage, navigate there first with hash
                  if (location.pathname !== '/') {
                    window.location.href = '/' + link.path;
                  } else {
                    // Already on homepage, just scroll to the section
                    const element = document.querySelector(link.path);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                } else if (link.path === '/' && location.pathname !== '/') {
                  // If clicking Home from another page, navigate to homepage
                  e.preventDefault();
                  navigate('/');
                }
              };

              // Check if link is active
              const isActive = link.path === '/' 
                ? location.pathname === '/' 
                : location.pathname === link.path || location.pathname.startsWith(link.path + '/');

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleClick}
                  className={`text-sm font-body font-semibold transition-all duration-300 relative ${
                    isActive
                      ? 'text-pure-white'
                      : 'text-text-tertiary hover:text-pure-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary rounded-full glow-effect animate-pulse-glow"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons / User Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 sm:gap-3 bg-gradient-to-br from-purple/10 to-purple/5 backdrop-blur-xl border-2 border-purple/30 px-3 sm:px-4 py-2 hover:border-gold/50 hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl smooth-hover"
                >
                  <div className="text-right hidden lg:block">
                    <div className="text-sm font-body font-semibold text-pure-white leading-tight">{username}</div>
                    <div className="text-xs text-text-tertiary leading-tight font-body">Level {level} • {xp} XP</div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-pure-white flex-shrink-0 shadow-xl glow-effect-gold">
                    {username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <svg className="w-4 h-4 text-muted-gray hidden sm:block transition-transform duration-200" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 sm:w-48 bg-dark-gray/95 backdrop-blur-2xl border-2 border-purple/30 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                    <div className="p-4 border-b-2 border-purple/20">
                      <div className="text-sm font-body font-semibold text-pure-white">{username}</div>
                      <div className="text-xs text-text-tertiary font-body">Level {level} • {xp} XP</div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-sm text-text-tertiary hover:text-pure-white hover:bg-purple/10 transition-all duration-300 font-body"
                    >
                    Profile
                    </Link>
                    <Link
                      to="/chat"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-sm text-text-tertiary hover:text-pure-white hover:bg-purple/10 transition-all duration-300 font-body"
                    >
                      AI Coach
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-sm text-text-tertiary hover:text-pure-white hover:bg-purple/10 transition-all duration-300 font-body"
                    >
                      Settings
                    </Link>
                    <div className="border-t-2 border-purple/20 my-1"></div>
                    <Link
                      to="/about"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-sm text-text-tertiary hover:text-pure-white hover:bg-purple/10 transition-all duration-300 font-body"
                    >
                      About
                </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red/10 transition-all duration-300 font-body"
                    >
                  Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <button className="text-sm font-body font-medium text-pure-white hover:text-gold transition-colors duration-300 flex items-center gap-1.5 px-4 py-2.5 rounded-xl">
                    Login
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="text-sm font-body font-semibold bg-gradient-primary text-pure-white px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 shadow-xl glow-effect hover:glow-effect border-2 border-transparent hover:border-gold/50">
                    Sign Up
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
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
