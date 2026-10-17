import api from './api';

export const videoShowcaseApi = {
  getVideoShowcases: () => api.get('/video-showcase'),
};

export const adminVideoShowcaseApi = {
  getAll: () => api.get('/video-showcase/admin'),
  create: (payload) => api.post('/video-showcase/admin', payload),
  update: (id, payload) => api.put(`/video-showcase/admin/${id}`, payload),
  delete: (id) => api.delete(`/video-showcase/admin/${id}`),
};