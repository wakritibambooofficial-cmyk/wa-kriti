const express = require('express');
const { getBanners, getHomepageSections, getCmsPage, getSettings } = require('../controllers/cmsController');

const router = express.Router();

router.get('/banners', getBanners);
router.get('/homepage-sections', getHomepageSections);
router.get('/pages/:slug', getCmsPage);
router.get('/settings', getSettings);

module.exports = router;
