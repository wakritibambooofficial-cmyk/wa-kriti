const express = require('express');
const {
  createProduct,
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  updateProduct,
  deleteProductImage,
  deleteProduct,
  duplicateProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  bulkUpdateStock,
  bulkUpdatePrice, 
  bulkUpdateStatus,
  bulkDeleteProducts,
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  bulkStockUpdateSchema,
  bulkPriceUpdateSchema,
} = require('../validators/productValidators');
const { memoryUpload } = require('../config/cloudinary');
const auditLog = require('../middlewares/auditLogMiddleware');

const router = express.Router();
const productImages = memoryUpload.array('images', 10);

// Public
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.get('/:slug/related', getRelatedProducts);

// Admin only
router.use(protect, restrictTo('admin'));

router.post(
  '/',
  productImages,
  validateRequest(createProductSchema),
  auditLog('products', () => 'product.create', (req) => `Created product "${req.body.name}"`),
  createProduct
);

router.patch('/bulk/stock', validateRequest(bulkStockUpdateSchema), auditLog('products', () => 'product.bulk_stock_update'), bulkUpdateStock);
router.patch('/bulk/price', validateRequest(bulkPriceUpdateSchema), auditLog('products', () => 'product.bulk_price_update'), bulkUpdatePrice);
router.patch('/bulk/status', auditLog('products', () => 'product.bulk_status_update'), bulkUpdateStatus);
router.delete('/bulk', auditLog('products', () => 'product.bulk_delete'), bulkDeleteProducts);

router.put(
  '/:id',
  productImages,
  validateRequest(updateProductSchema),
  auditLog('products', () => 'product.update', (req) => `Updated product ${req.params.id}`),
  updateProduct
);
router.delete('/:id/images/:imageId', deleteProductImage);
router.delete('/:id', auditLog('products', () => 'product.delete', (req) => `Deleted product ${req.params.id}`), deleteProduct);
router.post('/:id/duplicate', auditLog('products', () => 'product.duplicate'), duplicateProduct);

router.post('/:id/variants', validateRequest(createVariantSchema), addVariant);
router.put('/:id/variants/:variantId', validateRequest(createVariantSchema.partial()), updateVariant);
router.delete('/:id/variants/:variantId', deleteVariant);

module.exports = router;
