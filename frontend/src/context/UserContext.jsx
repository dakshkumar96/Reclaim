import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, signup as signupAPI } from '../api/auth';
import { getProfile } from '../api/user';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUserId(userData.id);
        setUsername(userData.username);
        setXp(userData.xp || 0);
        setLevel(userData.level || 1);
        setStreak(userData.streak || 0);
        // Refresh user data from API - use storedToken since setToken is async
        refreshUserWithToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginAPI({ username, password });
      const { token: newToken, user_id, username: userUsername, email } = response;

      const userData = {
        id: user_id,
        username: userUsername,
        email: email,
      };

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUserId(user_id);
      setUsername(userUsername);

      // Fetch full profile to get XP, level, streak
      await refreshUser();

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      // Handle network errors
      if (!error.response) {
        if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.message?.includes('ERR_NETWORK')) {
          errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 5000.';
        } else if (error.message) {
          errorMessage = `Network error: ${error.message}`;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please check the backend logs.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await signupAPI(userData);
      const { token: newToken, user_id, username: newUsername } = response;

      const newUser = {
        id: user_id,
        username: newUsername,
        email: userData.email,
      };

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUserId(user_id);
      setUsername(newUsername);

      // Fetch full profile
      await refreshUser();

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed';
      
      // Handle network errors
      if (!error.response) {
        if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.message?.includes('ERR_NETWORK') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 5000.';
        } else if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
          errorMessage = 'Request timed out. The server may be slow or not responding.';
        } else if (error.message) {
          errorMessage = `Network error: ${error.message}`;
        }
      } else if (error.response?.data?.message) {
        // Server returned an error message
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please check the backend logs.';
      } else if (error.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check the backend routes.';
      } else if (error.response?.status) {
        errorMessage = `Error ${error.response.status}: ${error.response.statusText || 'Request failed'}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Log full error for debugging
      console.error('Full signup error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        config: { url: error.config?.url, baseURL: error.config?.baseURL }
      });
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUserId(null);
    setUsername(null);
    setXp(0);
    setLevel(1);
    setStreak(0);
  };

  const refreshUserWithToken = async (tokenToUse) => {
    if (!tokenToUse) return;

    try {
      const response = await getProfile();
      const profile = response.profile;

      if (profile) {
        setXp(profile.xp || 0);
        setLevel(profile.level || 1);
        // Update stored user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.xp = profile.xp;
          userData.level = profile.level;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    await refreshUserWithToken(token);
  };

  const value = {
    userId,
    username,
    xp,
    streak,
    level,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

