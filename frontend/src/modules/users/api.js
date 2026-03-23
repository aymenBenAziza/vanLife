import { apiClient } from '../../services/api/client.js';

export const signupRequest = async (payload) => {
  const { data } = await apiClient.post('/auth/signup', payload);
  return data;
};

export const loginRequest = async (payload) => {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
};

export const refreshSessionRequest = async () => {
  const { data } = await apiClient.post('/auth/refresh');
  return data;
};

export const logoutRequest = async () => {
  await apiClient.post('/auth/logout');
};

export const getProfileRequest = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};

export const updateProfileRequest = async (payload) => {
  const { data } = await apiClient.patch('/auth/me', payload);
  return data;
};
