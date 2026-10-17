import api from './api';

export const featureApi = {
  getFeatures: () => api.get('/features'),
};