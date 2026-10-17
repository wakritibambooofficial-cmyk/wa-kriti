const express = require('express');
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const addressRoutes = require('./addressRoutes');
const orderRoutes = require('./orderRoutes');
const adminRoutes = require('./adminRoutes');
const reviewRoutes = require('./reviewRoutes');
const questionRoutes = require('./questionRoutes');
const returnRoutes = require('./returnRoutes');
const notificationRoutes = require('./notificationRoutes');
const cmsRoutes = require('./cmsRoutes');
const blogRoutes = require('./blogRoutes');
const contactRoutes = require('./contactRoutes');
const loyaltyRoutes = require('./loyaltyRoutes');
const membershipRoutes = require('./membershipRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const engagementRoutes = require('./engagementRoutes');
const promotionRoutes = require('./promotionRoutes');
const contentRoutes = require('./contentRoutes');
const verifyRoutes = require('./verifyRoutes');
const featureRoutes = require('./featureRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const videoShowcaseRoutes = require('./videoShowcaseRoutes');
const videoRoutes = require('./videoRoutes');
const router = express.Router();

router.get('/health', (req, res) => { 
  res.status(200).json({ success: true, message: 'Wa-Kriti API is healthy', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/addresses', addressRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/questions', questionRoutes);
router.use('/returns', returnRoutes);
router.use('/notifications', notificationRoutes);
router.use('/cms', cmsRoutes);
router.use('/blogs', blogRoutes);
router.use('/', contactRoutes); // exposes /contact and /newsletter/* at root of API version
router.use('/', loyaltyRoutes); // exposes /wallet and /rewards
router.use('/membership', membershipRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/engagement', engagementRoutes);
router.use('/promotions', promotionRoutes);
router.use('/content', contentRoutes);
router.use('/verify', verifyRoutes);
router.use('/admin', adminRoutes);
router.use('/features', featureRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/video-showcase', videoShowcaseRoutes);
router.use('/videos', videoRoutes);

module.exports = router;
