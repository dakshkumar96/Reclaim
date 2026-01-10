import api from './axios';

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (settings) => {
  const response = await api.put('/settings', settings);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post('/settings/password', passwordData);
  return response.data;
};