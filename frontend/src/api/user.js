import api from './axios';

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

