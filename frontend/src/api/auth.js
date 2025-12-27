import api from './axios';

export const signup = async (userData) => {
  const response = await api.post('/signup', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

