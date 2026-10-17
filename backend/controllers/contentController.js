const Artisan = require('../models/Artisan');
const Product = require('../models/Product');
const { SustainabilityStat, BambooSpecies, Certificate } = require('../models/Sustainability');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/* -------------------------------- Artisans -------------------------------- */

const DEFAULT_STATS = [
  { key: 'trees_saved', label: 'Trees Saved', value: 12500 },
  { key: 'plastic_reduced_kg', label: 'Plastic Reduced (kg)', value: 3400 },
  { key: 'artisans_supported', label: 'Artisans Supported', value: 180 },
  { key: 'bamboo_planted', label: 'Bamboo Planted', value: 25000 },
  { key: 'carbon_saved_kg', label: 'Carbon Saved (kg)', value: 9800 },
  { key: 'orders_delivered', label: 'Orders Delivered', value: 15000 },
];

const getArtisans = asyncHandler(async (req, res) => {
  const artisans = await Artisan.find({ status: 'active' }).sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Artisans fetched', { artisans });
});

const getArtisanBySlug = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findOne({ slug: req.params.slug, status: 'active' });
  if (!artisan) throw ApiError.notFound('Artisan not found');

  const products = await Product.find({ artisan: artisan._id, status: 'published', deletedAt: null }).select(
    'name slug images price comparePrice ratingsAverage'
  );

  return sendSuccess(res, 200, 'Artisan fetched', { artisan, products });
});

const createArtisan = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'artisans');
    payload.photo = { url: uploaded.url, publicId: uploaded.publicId };
  }
  const artisan = await Artisan.create(payload);
  return sendSuccess(res, 201, 'Artisan created successfully', { artisan });
});

const getAllArtisansAdmin = asyncHandler(async (req, res) => {
  const artisans = await Artisan.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Artisans fetched', { artisans });
});

const updateArtisan = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findById(req.params.id);
  if (!artisan) throw ApiError.notFound('Artisan not found');

  Object.assign(artisan, req.body);
  if (req.file) {
    if (artisan.photo?.publicId) await deleteFromCloudinary(artisan.photo.publicId).catch(() => {});
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'artisans');
    artisan.photo = { url: uploaded.url, publicId: uploaded.publicId };
  }
  await artisan.save();
  return sendSuccess(res, 200, 'Artisan updated successfully', { artisan });
});

const deleteArtisan = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findById(req.params.id);
  if (!artisan) throw ApiError.notFound('Artisan not found');
  if (artisan.photo?.publicId) await deleteFromCloudinary(artisan.photo.publicId).catch(() => {});
  await artisan.deleteOne();
  return sendSuccess(res, 200, 'Artisan deleted successfully');
});

/* ----------------------------- Sustainability ----------------------------- */

const getSustainabilityStats = asyncHandler(async (req, res) => {
  const count = await SustainabilityStat.countDocuments();
  if (count === 0) await SustainabilityStat.insertMany(DEFAULT_STATS);

  const stats = await SustainabilityStat.find();
  return sendSuccess(res, 200, 'Sustainability stats fetched', { stats });
});

const updateSustainabilityStat = asyncHandler(async (req, res) => {
  const stat = await SustainabilityStat.findOneAndUpdate(
    { key: req.params.key },
    { ...req.body, updatedBy: req.user._id },
    { new: true, upsert: true }
  );
  return sendSuccess(res, 200, 'Sustainability stat updated', { stat });
});

/* ----------------------------- Bamboo Species ----------------------------- */

const getBambooSpecies = asyncHandler(async (req, res) => {
  const species = await BambooSpecies.find({ status: 'active' }).sort({ name: 1 });
  return sendSuccess(res, 200, 'Bamboo species fetched', { species });
});

const getBambooSpeciesBySlug = asyncHandler(async (req, res) => {
  const species = await BambooSpecies.findOne({ slug: req.params.slug, status: 'active' });
  if (!species) throw ApiError.notFound('Bamboo species not found');
  return sendSuccess(res, 200, 'Bamboo species fetched', { species });
});

const createBambooSpecies = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'bamboo-species');
    payload.image = { url: uploaded.url, publicId: uploaded.publicId };
  }
  const species = await BambooSpecies.create(payload);
  return sendSuccess(res, 201, 'Bamboo species created successfully', { species });
});

const updateBambooSpecies = asyncHandler(async (req, res) => {
  const species = await BambooSpecies.findById(req.params.id);
  if (!species) throw ApiError.notFound('Bamboo species not found');

  Object.assign(species, req.body);
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'bamboo-species');
    species.image = { url: uploaded.url, publicId: uploaded.publicId };
  }
  await species.save();
  return sendSuccess(res, 200, 'Bamboo species updated successfully', { species });
});

/* ------------------------------- Certificates ------------------------------- */

const getCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ isPublic: true }).sort({ issuedDate: -1 });
  return sendSuccess(res, 200, 'Certificates fetched', { certificates });
});

const createCertificate = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Certificate file is required');
  const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'certificates');

  const certificate = await Certificate.create({
    ...req.body,
    file: { url: uploaded.url, publicId: uploaded.publicId },
  });

  return sendSuccess(res, 201, 'Certificate uploaded successfully', { certificate });
});

const deleteCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) throw ApiError.notFound('Certificate not found');
  await deleteFromCloudinary(certificate.file.publicId).catch(() => {});
  await certificate.deleteOne();
  return sendSuccess(res, 200, 'Certificate deleted successfully');
});



/* ----------------------------- Sustainability (add) ----------------------------- */

const deleteSustainabilityStat = asyncHandler(async (req, res) => {
  const stat = await SustainabilityStat.findOneAndDelete({ key: req.params.key });
  if (!stat) throw ApiError.notFound('Sustainability stat not found');
  return sendSuccess(res, 200, 'Sustainability stat deleted successfully');
});

/* ----------------------------- Bamboo Species (add) ----------------------------- */

const getAllBambooSpeciesAdmin = asyncHandler(async (req, res) => {
  const species = await BambooSpecies.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Bamboo species fetched', { species });
});

const deleteBambooSpecies = asyncHandler(async (req, res) => {
  const species = await BambooSpecies.findById(req.params.id);
  if (!species) throw ApiError.notFound('Bamboo species not found');
  if (species.image?.publicId) await deleteFromCloudinary(species.image.publicId).catch(() => {});
  await species.deleteOne();
  return sendSuccess(res, 200, 'Bamboo species deleted successfully');
});

/* ------------------------------- Certificates (add) ------------------------------- */

const getAllCertificatesAdmin = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find().sort({ issuedDate: -1 });
  return sendSuccess(res, 200, 'Certificates fetched', { certificates });
});

const updateCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) throw ApiError.notFound('Certificate not found');

  Object.assign(certificate, req.body);
  if (req.file) {
    if (certificate.file?.publicId) await deleteFromCloudinary(certificate.file.publicId).catch(() => {});
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'certificates');
    certificate.file = { url: uploaded.url, publicId: uploaded.publicId };
  }
  await certificate.save();
  return sendSuccess(res, 200, 'Certificate updated successfully', { certificate });
});

module.exports = {
  getArtisans, 
  getArtisanBySlug,
  createArtisan,
  getAllArtisansAdmin,
  updateArtisan,
  deleteArtisan,
  getSustainabilityStats,
  updateSustainabilityStat,
  getBambooSpecies,
  getBambooSpeciesBySlug,
  createBambooSpecies,
  updateBambooSpecies,
  getCertificates,
  createCertificate,
  deleteCertificate,
  deleteSustainabilityStat,
  getAllBambooSpeciesAdmin,
  deleteBambooSpecies,
  getAllCertificatesAdmin,
  updateCertificate,
};
