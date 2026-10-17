import api from './api';

export const videoApi = {
  getVideos: () => api.get('/videos'),
};