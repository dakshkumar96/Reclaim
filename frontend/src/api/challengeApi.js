import api from './axios';

export const getAllChallenges = async () => {
  const response = await api.get('/challenges');
  return response.data;
};

export const getActiveChallenges = async () => {
  const response = await api.get('/challenges/active');
  return response.data;
};

export const startChallenge = async (challengeId) => {
  const response = await api.post('/challenges/start', { challenge_id: challengeId });
  return response.data;
};

export const completeChallenge = async (challengeId) => {
  const response = await api.post('/challenges/complete', { challenge_id: challengeId });
  return response.data;
};

