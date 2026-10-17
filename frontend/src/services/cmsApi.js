import api from './api';

export const cmsApi = {
  getBanners: (placement) => api.get('/cms/banners', { params: placement ? { placement } : {} }),
  getHomepageSections: () => api.get('/cms/homepage-sections'),
  getPage: (slug) => api.get(`/cms/pages/${slug}`),
  getSettings: () => api.get('/cms/settings'),
};

export const blogApi = {
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlogBySlug: (slug) => api.get(`/blogs/${slug}`),
  getCategories: () => api.get('/blogs/categories'),
  addComment: (slug, comment) => api.post(`/blogs/${slug}/comments`, { comment }),
};

export const contactApi = {
  submit: (payload) => api.post('/contact', payload),
  subscribeNewsletter: (email) => api.post('/newsletter/subscribe', { email }),
};

export const notificationApi = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export const reviewApi = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  createReview: (productId, payload) => api.post(`/reviews/product/${productId}`, payload),
  toggleHelpful: (id) => api.post(`/reviews/${id}/helpful`),
};

export const questionApi = {
  getProductQuestions: (productId) => api.get(`/questions/product/${productId}`),
  askQuestion: (productId, question) => api.post(`/questions/product/${productId}`, { question }),
};
