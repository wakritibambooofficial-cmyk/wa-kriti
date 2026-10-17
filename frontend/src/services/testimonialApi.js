import api from './api';

export const testimonialApi = {
  // Public
  getTestimonials: () => api.get('/testimonials'),

  // Customer
  getMyTestimonials: () => api.get('/testimonials/mine'),
  submitTestimonial: (payload) => api.post('/testimonials', payload),
  updateTestimonial: (id, payload) => api.put(`/testimonials/${id}`, payload),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

  // Admin
  getAllTestimonialsAdmin: (status) =>
    api.get('/testimonials/admin/all', { params: status ? { status } : {} }),
  approveTestimonial: (id) => api.patch(`/testimonials/admin/${id}/approve`),
  rejectTestimonial: (id) => api.patch(`/testimonials/admin/${id}/reject`),
  createTestimonialAdmin: (payload) => api.post('/testimonials/admin', payload),
  deleteTestimonialAdmin: (id) => api.delete(`/testimonials/admin/${id}`),
};