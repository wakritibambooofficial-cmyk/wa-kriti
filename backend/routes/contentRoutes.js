const express = require('express');
const {
  getArtisans,
  getArtisanBySlug,
  getSustainabilityStats,
  getBambooSpecies,
  getBambooSpeciesBySlug,
  getCertificates,
} = require('../controllers/contentController');

const router = express.Router();

router.get('/artisans', getArtisans);
router.get('/artisans/:slug', getArtisanBySlug);
router.get('/sustainability-stats', getSustainabilityStats);
router.get('/bamboo-species', getBambooSpecies);
router.get('/bamboo-species/:slug', getBambooSpeciesBySlug);
router.get('/certificates', getCertificates);

module.exports = router;
