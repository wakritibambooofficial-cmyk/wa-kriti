const Banner = require('../models/Banner');
const HomepageSection = require('../models/HomepageSection');
const CMSPage = require('../models/CMSPage');
const WebsiteSettings = require('../models/WebsiteSettings');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/* ----------------------------- Banners ----------------------------- */

/**
 * @route GET /api/v1/cms/banners?placement=hero_slider
 * Public. Only returns currently-active, in-schedule banners.
 */
const getBanners = asyncHandler(async (req, res) => {
  const { placement } = req.query;
  const now = new Date();
  const filter = {
    status: 'active',
    startDate: { $lte: now },
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  };
  if (placement) filter.placement = placement;

  const banners = await Banner.find(filter).sort({ sortOrder: 1 });
  return sendSuccess(res, 200, 'Banners fetched', { banners });
});

/**
 * @route GET /api/v1/admin/cms/banners
 * Admin: returns all banners regardless of status/schedule.
 */
const getAllBannersAdmin = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ placement: 1, sortOrder: 1 });
  return sendSuccess(res, 200, 'Banners fetched', { banners });
});

/**
 * @route POST /api/v1/admin/cms/banners
 * Requires 'image' file.
 */
const createBanner = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Banner image is required');

  const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'banners');
  const banner = await Banner.create({
    ...req.body,
    image: { url: uploaded.url, publicId: uploaded.publicId },
    createdBy: req.user._id,
  });

  return sendSuccess(res, 201, 'Banner created successfully', { banner });
});

/**
 * @route PUT /api/v1/admin/cms/banners/:id
 */
const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw ApiError.notFound('Banner not found');

  Object.assign(banner, req.body);

  if (req.file) {
    if (banner.image?.publicId) await deleteFromCloudinary(banner.image.publicId).catch(() => {});
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'banners');
    banner.image = { url: uploaded.url, publicId: uploaded.publicId };
  }

  await banner.save();
  return sendSuccess(res, 200, 'Banner updated successfully', { banner });
});

/**
 * @route DELETE /api/v1/admin/cms/banners/:id
 */
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw ApiError.notFound('Banner not found');

  if (banner.image?.publicId) await deleteFromCloudinary(banner.image.publicId).catch(() => {});
  await banner.deleteOne();

  return sendSuccess(res, 200, 'Banner deleted successfully');
});

/**
 * @route PATCH /api/v1/admin/cms/banners/reorder
 * Body: { orders: [{ id, sortOrder }] }
 */
const reorderBanners = asyncHandler(async (req, res) => {
  const { orders } = req.body;
  await Promise.all(orders.map(({ id, sortOrder }) => Banner.findByIdAndUpdate(id, { sortOrder })));
  return sendSuccess(res, 200, 'Banner order updated');
});

/* ------------------------- Homepage Sections ------------------------- */

/**
 * @route GET /api/v1/cms/homepage-sections
 * Public. Returns only visible sections.
 */
const getHomepageSections = asyncHandler(async (req, res) => {
  const sections = await HomepageSection.find({ isVisible: true }).sort({ sortOrder: 1 });
  return sendSuccess(res, 200, 'Homepage sections fetched', { sections });
});

/**
 * @route GET /api/v1/admin/cms/homepage-sections
 */
const getAllHomepageSectionsAdmin = asyncHandler(async (req, res) => {
  const sections = await HomepageSection.find().sort({ sortOrder: 1 });
  return sendSuccess(res, 200, 'Homepage sections fetched', { sections });
});

/**
 * @route PUT /api/v1/admin/cms/homepage-sections/:key
 * Upserts a section by its fixed key.
 */
const upsertHomepageSection = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const payload = { ...req.body, updatedBy: req.user._id };

  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'homepage');
    payload.image = { url: uploaded.url, publicId: uploaded.publicId };
  }

  const section = await HomepageSection.findOneAndUpdate({ key }, payload, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  return sendSuccess(res, 200, 'Homepage section updated successfully', { section });
});

/* ----------------------------- CMS Pages ----------------------------- */

/**
 * @route GET /api/v1/cms/pages/:slug
 * Public.
 */
const getCmsPage = asyncHandler(async (req, res) => {
  const page = await CMSPage.findOne({ slug: req.params.slug });
  if (!page) throw ApiError.notFound('Page not found');
  return sendSuccess(res, 200, 'Page fetched', { page });
});


const STATIC_PAGE_SLUGS = [
  'about-us',
  'founder',
  'privacy-policy',
  'refund-policy',
  'shipping-policy',
  'cancellation-policy',
  'terms-and-conditions',
  'accessibility-statement',
  'F&Q'
];

const emptyPageSkeleton = (slug) => ({
  slug,
  title: '',
  content: '',
  heroImage: { url: null, publicId: null },
  metaTitle: '',
  metaDescription: '',
});

/**
 * @route GET /api/v1/admin/cms/pages
 * Admin. Lists all 8 static pages, merging in existing content so the
 * admin can see at a glance which ones are still empty/unpublished.
 */
const getAllCmsPagesAdmin = asyncHandler(async (req, res) => {
  const existing = await CMSPage.find({ slug: { $in: STATIC_PAGE_SLUGS } });
  const bySlug = Object.fromEntries(existing.map((p) => [p.slug, p]));
  const pages = STATIC_PAGE_SLUGS.map((slug) => bySlug[slug] || emptyPageSkeleton(slug));
  return sendSuccess(res, 200, 'Pages fetched', { pages });
});

/**
 * @route GET /api/v1/admin/cms/pages/:slug
 * Admin. Unlike the public getCmsPage, never 404s — returns an empty
 * skeleton if the page hasn't been created yet, so the edit form can
 * still render and Save will upsert it via the existing upsertCmsPage.
 */
const getCmsPageAdmin = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!STATIC_PAGE_SLUGS.includes(slug)) throw ApiError.badRequest('Unknown page slug');
  const page = (await CMSPage.findOne({ slug })) || emptyPageSkeleton(slug);
  return sendSuccess(res, 200, 'Page fetched', { page });
});

/**
 * @route PUT /api/v1/admin/cms/pages/:slug
 * Upserts a static page by its fixed slug.
 */
const upsertCmsPage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const payload = { ...req.body, slug, updatedBy: req.user._id };

  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'cms');
    payload.heroImage = { url: uploaded.url, publicId: uploaded.publicId };
  }

  const page = await CMSPage.findOneAndUpdate({ slug }, payload, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  return sendSuccess(res, 200, 'Page updated successfully', { page });
});

/* -------------------------- Website Settings -------------------------- */

const getOrCreateSettings = async () => {
  let settings = await WebsiteSettings.findOne({ singletonKey: 'main' });
  if (!settings) settings = await WebsiteSettings.create({ singletonKey: 'main' });
  return settings;
};

/**
 * @route GET /api/v1/cms/settings
 * Public — used by navbar/footer/announcement bar.
 */
const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  return sendSuccess(res, 200, 'Settings fetched', { settings });
});

/**
 * @route PUT /api/v1/admin/cms/settings
 */
// const updateSettings = asyncHandler(async (req, res) => {

//   const settings = await getOrCreateSettings();
//   Object.assign(settings, req.body);

//   if (req.files?.logo?.[0]) {
//     const uploaded = await uploadBufferToCloudinary(req.files.logo[0].buffer, 'branding');
//     settings.logo = { url: uploaded.url, publicId: uploaded.publicId };
//   }
//   if (req.files?.favicon?.[0]) {
//     const uploaded = await uploadBufferToCloudinary(req.files.favicon[0].buffer, 'branding');
//     settings.favicon = { url: uploaded.url, publicId: uploaded.publicId };
//   }

//   await settings.save();
//   return sendSuccess(res, 200, 'Settings updated successfully', { settings });
// });

const updateSettings = asyncHandler(async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    // Pull out dotted-key nested fields so they don't get Object.assign'd flat
    const {
      'socialLinks.instagram': instagram,
      'socialLinks.facebook': facebook,
      'socialLinks.youtube': youtube,
      'socialLinks.linkedin': linkedin,
      'socialLinks.pinterest': pinterest,
      'seo.defaultMetaTitle': defaultMetaTitle,
      'seo.defaultMetaDescription': defaultMetaDescription,
      'announcementBar.isEnabled': announcementIsEnabled,
      'announcementBar.messages': announcementMessages,
      'announcementBar.autoRotateSeconds': announcementAutoRotateSeconds,
      ...flatFields
    } = req.body;

    Object.assign(settings, flatFields);

    if (instagram !== undefined)
      settings.socialLinks.instagram = instagram;

    if (facebook !== undefined)
      settings.socialLinks.facebook = facebook;

    if (youtube !== undefined)
      settings.socialLinks.youtube = youtube;

    if (linkedin !== undefined)
      settings.socialLinks.linkedin = linkedin;

    if (pinterest !== undefined)
      settings.socialLinks.pinterest = pinterest;

    if (defaultMetaTitle !== undefined)
      settings.seo.defaultMetaTitle = defaultMetaTitle;

    if (defaultMetaDescription !== undefined)
      settings.seo.defaultMetaDescription = defaultMetaDescription;

    if (announcementIsEnabled !== undefined) {
      settings.announcementBar.isEnabled =
        announcementIsEnabled === 'true';
    }

    if (announcementMessages !== undefined) {
      try {
        settings.announcementBar.messages = JSON.parse(
          announcementMessages
        );
      } catch (err) {
        console.error(
          'Failed to parse announcementBar.messages:',
          announcementMessages
        );
        throw ApiError.badRequest(
          'Invalid announcement messages format'
        );
      }
    }

    if (announcementAutoRotateSeconds !== undefined) {
      settings.announcementBar.autoRotateSeconds =
        announcementAutoRotateSeconds;
    }

    if (req.files?.logo?.[0]) {
      const uploaded = await uploadBufferToCloudinary(
        req.files.logo[0].buffer,
        'branding'
      );

      settings.logo = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }

    if (req.files?.favicon?.[0]) {
      const uploaded = await uploadBufferToCloudinary(
        req.files.favicon[0].buffer,
        'branding'
      );

      settings.favicon = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }

    await settings.save();

    return sendSuccess(res, 200, 'Settings updated successfully', {
      settings,
    });
  } catch (error) {
    console.error('========== UPDATE SETTINGS ERROR ==========');
    console.error('Message:', error.message);
    console.error('Body:', req.body);
    console.error('Files:', req.files);
    console.error('Stack:', error.stack);
    console.error('===========================================');

    throw error;
  }
});



module.exports = {
  getBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  getHomepageSections,
  getAllHomepageSectionsAdmin,
  upsertHomepageSection,
  getCmsPage,
  upsertCmsPage,
  getAllCmsPagesAdmin,   
  getCmsPageAdmin, 
  getSettings,
  updateSettings,
};
