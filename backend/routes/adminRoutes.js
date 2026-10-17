const express = require('express');
const {
  getAllOrders,
  updateOrderStatus,
  issueRefund,
  adminCancelOrder,
  getOrderStats,
} = require('../controllers/adminOrderController');
const {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
} = require('../controllers/couponController');
const {
  getAllReviewsAdmin,
  moderateReview,
  replyToReview,
  adminDeleteReview,
} = require('../controllers/reviewController');
const {
  getAllQuestionsAdmin,
  answerQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { getAllReturnRequests, updateReturnRequest } = require('../controllers/returnController');
const { getAllCustomers, getCustomerById, toggleBlockCustomer } = require('../controllers/adminCustomerController');
const { adminCreditWallet, adminAdjustRewards } = require('../controllers/loyaltyController');
const { updateMembershipTier } = require('../controllers/membershipController');
const { getAllSubscriptionsAdmin } = require('../controllers/subscriptionController');
const {
  createComboOffer,
  getAllComboOffersAdmin,
  updateComboOffer,
  deleteComboOffer,
  createHamperTemplate,
  updateHamperTemplate,
} = require('../controllers/promotionController');
const {
  createWarehouse, 
  getWarehouses,
  updateWarehouse,
  deleteWarehouse,
  getProductInventory,
  adjustInventory,
  getInventoryLogs,
} = require('../controllers/warehouseController');
const { getAuditLogs } = require('../controllers/auditLogController');
const { exportBackup, importBackup, listBackupCollections } = require('../controllers/backupController');
const { exportProductsCsv, importProductsCsv } = require('../controllers/productImportExportController');
const { generateProductQr } = require('../controllers/qrController');
const {
  createArtisan,
  getAllArtisansAdmin,
  updateArtisan,
  deleteArtisan,
  updateSustainabilityStat,
  createBambooSpecies,
  updateBambooSpecies,
  createCertificate,
  deleteCertificate,
  getSustainabilityStats,
  deleteSustainabilityStat, 
  getAllBambooSpeciesAdmin,  
   deleteBambooSpecies,  
    getAllCertificatesAdmin,
     updateCertificate,  
} = require('../controllers/contentController');
const {
  creditWalletSchema,
  adjustRewardsSchema,
  updateMembershipTierSchema,
} = require('../validators/loyaltyValidators');
const {
  comboOfferSchema,
  updateComboOfferSchema,
  hamperTemplateSchema,
  warehouseSchema,
  adjustInventorySchema,
} = require('../validators/growthValidators');
const {
  artisanSchema,
  updateArtisanSchema,
  sustainabilityStatSchema,
  bambooSpeciesSchema,
  updateBambooSpeciesSchema,
  certificateSchema,
} = require('../validators/contentValidators');
const {
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  getAllHomepageSectionsAdmin,
  upsertHomepageSection,
  upsertCmsPage,
   getAllCmsPagesAdmin,   // ← add
  getCmsPageAdmin,
  updateSettings,
} = require('../controllers/cmsController');
const {
  createBlog,
  getAllBlogsAdmin,
  updateBlog,
  deleteBlog,
  moderateComment,
  createBlogCategory,
} = require('../controllers/blogController');
const {
  getAllContactQueries,
  replyToContactQuery,
  updateContactStatus,
  getSubscribers,
  deleteSubscriber,
  sendNewsletterToSubscribers
} = require('../controllers/contactController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { updateOrderStatusSchema, refundSchema } = require('../validators/orderValidators');
const { createCouponSchema, updateCouponSchema } = require('../validators/couponValidators');
const {
  moderateReviewSchema,
  replyReviewSchema,
  answerQuestionSchema,
  updateReturnRequestSchema,
} = require('../validators/engagementValidators');
const {
  bannerSchema,
  updateBannerSchema,
  homepageSectionSchema,
  cmsPageSchema,
  websiteSettingsSchema,
  blogSchema,
  updateBlogSchema,
} = require('../validators/cmsValidators');
const { memoryUpload } = require('../config/cloudinary');
const auditLog = require('../middlewares/auditLogMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin'));

// Orders
router.get('/orders/stats', getOrderStats);
router.get('/orders', getAllOrders);
router.patch(
  '/orders/:id/status',
  validateRequest(updateOrderStatusSchema),
  auditLog('orders', (req) => `order.status_update:${req.body.status}`),
  updateOrderStatus
);
router.post('/orders/:id/refund', validateRequest(refundSchema), auditLog('orders', () => 'order.refund'), issueRefund);
router.post('/orders/:id/cancel', auditLog('orders', () => 'order.cancel'), adminCancelOrder);

// Coupons
router.post('/coupons', validateRequest(createCouponSchema), auditLog('coupons', () => 'coupon.create', (req) => `Created coupon "${req.body.code}"`), createCoupon);
router.get('/coupons', getCoupons);
router.get('/coupons/:id', getCouponById);
router.put('/coupons/:id', validateRequest(updateCouponSchema), auditLog('coupons', () => 'coupon.update'), updateCoupon);
router.patch('/coupons/:id/toggle', auditLog('coupons', () => 'coupon.toggle'), toggleCouponStatus);
router.delete('/coupons/:id', auditLog('coupons', () => 'coupon.delete'), deleteCoupon);

// Reviews
router.get('/reviews', getAllReviewsAdmin);
router.patch('/reviews/:id/status', validateRequest(moderateReviewSchema), moderateReview);
router.post('/reviews/:id/reply', validateRequest(replyReviewSchema), replyToReview);
router.delete('/reviews/:id', adminDeleteReview);

// Q&A
router.get('/questions', getAllQuestionsAdmin);
router.patch('/questions/:id/answer', validateRequest(answerQuestionSchema), answerQuestion);
router.delete('/questions/:id', deleteQuestion);

// Returns / Exchanges
router.get('/returns', getAllReturnRequests);
router.patch('/returns/:id', validateRequest(updateReturnRequestSchema), updateReturnRequest);

// CMS — Banners
router.get('/cms/banners', getAllBannersAdmin);
router.post('/cms/banners', memoryUpload.single('image'), validateRequest(bannerSchema), createBanner);
router.patch('/cms/banners/reorder', reorderBanners);
router.put('/cms/banners/:id', memoryUpload.single('image'), validateRequest(updateBannerSchema), updateBanner);
router.delete('/cms/banners/:id', deleteBanner);

// CMS — Homepage Sections
router.get('/cms/homepage-sections', getAllHomepageSectionsAdmin);
router.put(
  '/cms/homepage-sections/:key',
  memoryUpload.single('image'),
  validateRequest(homepageSectionSchema),
  upsertHomepageSection
);

// CMS — Static Pages
router.put('/cms/pages/:slug', memoryUpload.single('heroImage'), validateRequest(cmsPageSchema), upsertCmsPage);

// CMS — Website Settings
router.put(
  '/cms/settings',
  memoryUpload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]),
  validateRequest(websiteSettingsSchema),
  updateSettings
);

// Blog
router.get('/blogs', getAllBlogsAdmin);
router.post('/blogs', memoryUpload.single('featuredImage'), validateRequest(blogSchema), createBlog);
router.put('/blogs/:id', memoryUpload.single('featuredImage'), validateRequest(updateBlogSchema), updateBlog);
router.delete('/blogs/:id', deleteBlog);
router.patch('/blogs/:id/comments/:commentId', moderateComment);
router.post('/blogs/categories', createBlogCategory);

// Contact Queries
router.get('/contact', getAllContactQueries);
router.patch('/contact/:id/reply', replyToContactQuery);
router.patch('/contact/:id/status', updateContactStatus);

// Customers
router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerById);
router.patch('/customers/:id/block', auditLog('customers', () => 'customer.toggle_block'), toggleBlockCustomer);

// Newsletter
router.get('/newsletter/subscribers', getSubscribers);
router.delete('/newsletter/subscribers/:id', deleteSubscriber);

// Wallet & Reward Points
router.post('/wallet/:userId/credit', validateRequest(creditWalletSchema), adminCreditWallet);
router.post('/rewards/:userId/adjust', validateRequest(adjustRewardsSchema), adminAdjustRewards);

// Membership
router.put('/membership/tiers/:tier', validateRequest(updateMembershipTierSchema), updateMembershipTier);

// Subscriptions
router.get('/subscriptions', getAllSubscriptionsAdmin);

// Promotions — Combo Offers & Hampers
router.post('/promotions/combo-offers', memoryUpload.single('image'), validateRequest(comboOfferSchema), createComboOffer);
router.get('/promotions/combo-offers', getAllComboOffersAdmin);
router.put('/promotions/combo-offers/:id', memoryUpload.single('image'), validateRequest(updateComboOfferSchema), updateComboOffer);
router.delete('/promotions/combo-offers/:id', deleteComboOffer);
router.post('/promotions/hamper-templates', validateRequest(hamperTemplateSchema), createHamperTemplate);
router.put('/promotions/hamper-templates/:id', validateRequest(hamperTemplateSchema.partial()), updateHamperTemplate);

// Multi-Warehouse Inventory
router.post('/warehouses', validateRequest(warehouseSchema), createWarehouse);
router.get('/warehouses', getWarehouses);
router.put('/warehouses/:id', validateRequest(warehouseSchema.partial()), updateWarehouse);
router.delete('/warehouses/:id', deleteWarehouse);
router.get('/warehouses/inventory/:productId', getProductInventory);
router.post('/warehouses/inventory/adjust', validateRequest(adjustInventorySchema), adjustInventory);
router.get('/warehouses/logs/:productId', getInventoryLogs);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// Database Backup & Restore
router.get('/backups/collections', listBackupCollections);
router.get('/backups/export', exportBackup);
router.post('/backups/restore', memoryUpload.single('backup'), importBackup);

// Product Import / Export (CSV)
router.get('/products-io/export', exportProductsCsv);
router.post('/products-io/import', memoryUpload.single('file'), importProductsCsv);

// QR Product Authentication
router.post('/products/:id/generate-qr', generateProductQr);

// Content — Artisans
router.post('/artisans', memoryUpload.single('photo'), validateRequest(artisanSchema), createArtisan);
router.get('/artisans', getAllArtisansAdmin);
router.put('/artisans/:id', memoryUpload.single('photo') , validateRequest(updateArtisanSchema), updateArtisan);
router.delete('/artisans/:id', deleteArtisan);

// // Content — Sustainability
// router.put('/sustainability-stats/:key', validateRequest(sustainabilityStatSchema), updateSustainabilityStat);

// // Content — Bamboo Species
// router.post('/bamboo-species', memoryUpload.single('image'), validateRequest(bambooSpeciesSchema), createBambooSpecies);
// router.put('/bamboo-species/:id', memoryUpload.single('image'), validateRequest(updateBambooSpeciesSchema), updateBambooSpecies);

// // Content — Certificates
// router.post('/certificates', memoryUpload.single('file'), validateRequest(certificateSchema), createCertificate);
// router.delete('/certificates/:id', deleteCertificate);


// Content — Sustainability
router.get('/sustainability-stats', getSustainabilityStats);
router.put('/sustainability-stats/:key', validateRequest(sustainabilityStatSchema), updateSustainabilityStat);
router.delete('/sustainability-stats/:key', deleteSustainabilityStat);

// Content — Bamboo Species
router.get('/bamboo-species', getAllBambooSpeciesAdmin);
router.post('/bamboo-species', memoryUpload.single('image'), validateRequest(bambooSpeciesSchema), createBambooSpecies);
router.put('/bamboo-species/:id', memoryUpload.single('image'), validateRequest(updateBambooSpeciesSchema), updateBambooSpecies);
router.delete('/bamboo-species/:id', deleteBambooSpecies);

// Content — Certificates
router.get('/certificates', getAllCertificatesAdmin);
router.post('/certificates', memoryUpload.single('file'), validateRequest(certificateSchema), createCertificate);
router.put('/certificates/:id', memoryUpload.single('file'), validateRequest(certificateSchema.partial()), updateCertificate);
router.delete('/certificates/:id', deleteCertificate);

// CMS — Static Pages
router.get('/cms/pages', getAllCmsPagesAdmin);              // ← add
router.get('/cms/pages/:slug', getCmsPageAdmin);             // ← add
router.put('/cms/pages/:slug', memoryUpload.single('heroImage'), validateRequest(cmsPageSchema), upsertCmsPage);

router.post(
  '/newsletter/send',
  sendNewsletterToSubscribers
);

module.exports = router;
