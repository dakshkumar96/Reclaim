import api from './axios';

export const getAllBadges = async () => {
  const response = await api.get('/badges');
  return response.data;
};

export const getUserBadges = async () => {
  const response = await api.get('/badges/user');
  return response.data;
};

