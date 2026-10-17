import api from './api';

export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  getRelatedProducts: (slug) => api.get(`/products/${slug}/related`),
};

export const categoryApi = {
  getCategories: (params) => api.get('/categories', { params }),
  getCategoryTree: () => api.get('/categories', { params: { tree: 'true' } }),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
};
 