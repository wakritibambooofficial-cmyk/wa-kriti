const express = require('express');
const {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  reorderCategories,
} = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createCategorySchema, updateCategorySchema } = require('../validators/productValidators');
const { memoryUpload } = require('../config/cloudinary');
const auditLog = require('../middlewares/auditLogMiddleware');

const router = express.Router();

const categoryImageFields = memoryUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]);

// Public
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin only
router.use(protect, restrictTo('admin'));
router.post(
  '/',
  categoryImageFields,
  validateRequest(createCategorySchema),
  auditLog('categories', () => 'category.create', (req) => `Created category "${req.body.name}"`),
  createCategory
);
router.patch('/reorder', reorderCategories);
router.put(
  '/:id',
  categoryImageFields,
  validateRequest(updateCategorySchema),
  auditLog('categories', () => 'category.update'),
  updateCategory
);
router.delete('/:id', auditLog('categories', () => 'category.delete'), deleteCategory);

module.exports = router;
