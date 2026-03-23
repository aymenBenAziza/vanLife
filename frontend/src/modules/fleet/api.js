import { apiClient } from '../../services/api/client.js';

export const getVehiclesRequest = async () => {
  const { data } = await apiClient.get('/fleet/vehicles');
  return data;
};

export const createVehicleRequest = async (payload) => {
  const { data } = await apiClient.post('/fleet/vehicles', payload);
  return data;
};

export const updateVehicleRequest = async (vehicleId, payload) => {
  const { data } = await apiClient.patch(`/fleet/vehicles/${vehicleId}`, payload);
  return data;
};

export const deleteVehicleRequest = async (vehicleId) => {
  await apiClient.delete(`/fleet/vehicles/${vehicleId}`);
};

export const getVehicleDocumentsRequest = async () => {
  const { data } = await apiClient.get('/fleet/documents');
  return data;
};

export const createVehicleDocumentRequest = async (payload) => {
  const { data } = await apiClient.post('/fleet/documents', payload);
  return data;
};

export const updateVehicleDocumentRequest = async (documentId, payload) => {
  const { data } = await apiClient.patch(`/fleet/documents/${documentId}`, payload);
  return data;
};

export const deleteVehicleDocumentRequest = async (documentId) => {
  await apiClient.delete(`/fleet/documents/${documentId}`);
};
