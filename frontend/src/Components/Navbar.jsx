import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) return null;

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/challenges', icon: '🎯', label: 'Challenges' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { path: '/chat', icon: '💬', label: 'Chat' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-gray/95 backdrop-blur-md border-t border-soft-gray z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center
                  py-3 px-4 min-w-[60px]
                  transition-all duration-200
                  ${isActive 
                    ? 'text-gold border-t-2 border-gold' 
                    : 'text-muted-gray hover:text-pure-white'
                  }
                `}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-heading">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
