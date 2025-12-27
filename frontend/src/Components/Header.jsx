import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from './Button';

const Header = () => {
  const { isAuthenticated, username, logout } = useUser();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/dashboard';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-dark-gray/95 backdrop-blur-md border-b border-soft-gray z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <h1 className="text-2xl font-heading font-bold bg-gradient-sunset bg-clip-text text-transparent">
              Reclaim
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-gray hidden sm:inline">
                  Welcome, {username}
                </span>
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
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
