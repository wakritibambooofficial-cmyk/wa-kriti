const Category = require('../models/Category');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');




/**
 * @route POST /api/v1/categories
 * Admin only. Accepts optional 'image' and 'banner' files (multipart).
 */
const createCategory = asyncHandler(async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };

  if (req.files?.image?.[0]) {
    const uploaded = await uploadBufferToCloudinary(req.files.image[0].buffer, 'categories');
    payload.image = { url: uploaded.url, publicId: uploaded.publicId };
  }
  if (req.files?.banner?.[0]) {
    const uploaded = await uploadBufferToCloudinary(req.files.banner[0].buffer, 'categories/banners');
    payload.banner = { url: uploaded.url, publicId: uploaded.publicId };
  }

  const category = await Category.create(payload);
  return sendSuccess(res, 201, 'Category created successfully', { category });
});

/**
 * @route GET /api/v1/categories
 * Public. Supports ?tree=true to return nested parent/child structure,
 * and ?status=active to filter (admin can pass status=all).
 */
const getCategories = asyncHandler(async (req, res) => {
  const { tree, status = 'active', featured } = req.query;

  const filter = { deletedAt: null };
  if (status !== 'all') filter.status = status;
  if (featured === 'true') filter.isFeatured = true;

  if (tree === 'true') {
    const parents = await Category.find({ ...filter, parent: null }).sort({ sortOrder: 1, name: 1 });
    const withChildren = await Promise.all(
      parents.map(async (parent) => {
        const children = await Category.find({ ...filter, parent: parent._id }).sort({ sortOrder: 1, name: 1 });
        return { ...parent.toJSON(), subCategories: children };
      })
    );
    return sendSuccess(res, 200, 'Category tree fetched', { categories: withChildren });
  }

  const categories = await Category.find(filter).populate('parent', 'name slug').sort({ sortOrder: 1, name: 1 });
  return sendSuccess(res, 200, 'Categories fetched', { categories });
});

/**
 * @route GET /api/v1/categories/:slug
 */
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, deletedAt: null }).populate('subCategories');
  if (!category) throw ApiError.notFound('Category not found');

  const productCount = await Product.countDocuments({ category: category._id, status: 'published', deletedAt: null });

  return sendSuccess(res, 200, 'Category fetched', { category, productCount });
});

/**
 * @route PUT /api/v1/categories/:id
 * Admin only.
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');

  Object.assign(category, req.body, { updatedBy: req.user._id });

  if (req.files?.image?.[0]) {
    if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId).catch(() => {});
    const uploaded = await uploadBufferToCloudinary(req.files.image[0].buffer, 'categories');
    category.image = { url: uploaded.url, publicId: uploaded.publicId };
  }
  if (req.files?.banner?.[0]) {
    if (category.banner?.publicId) await deleteFromCloudinary(category.banner.publicId).catch(() => {});
    const uploaded = await uploadBufferToCloudinary(req.files.banner[0].buffer, 'categories/banners');
    category.banner = { url: uploaded.url, publicId: uploaded.publicId };
  }

  await category.save();
  return sendSuccess(res, 200, 'Category updated successfully', { category });
});

/**
 * @route DELETE /api/v1/categories/:id
 * Admin only. Soft delete; blocks deletion if products still reference it.
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');

  const productCount = await Product.countDocuments({ category: category._id, deletedAt: null });
  if (productCount > 0) {
    throw ApiError.conflict(
      `Cannot delete category with ${productCount} active product(s). Reassign or delete them first.`
    );
  }

  const childCount = await Category.countDocuments({ parent: category._id, deletedAt: null });
  if (childCount > 0) {
    throw ApiError.conflict('Cannot delete a category that still has subcategories.');
  }

  category.deletedAt = new Date();
  category.status = 'inactive';
  await category.save();

  return sendSuccess(res, 200, 'Category deleted successfully');
});

/**
 * @route PATCH /api/v1/categories/reorder
 * Admin only. Body: { orders: [{ id, sortOrder }] }
 */
const reorderCategories = asyncHandler(async (req, res) => {
  const { orders } = req.body;
  if (!Array.isArray(orders)) throw ApiError.badRequest('orders must be an array');

  await Promise.all(
    orders.map(({ id, sortOrder }) => Category.findByIdAndUpdate(id, { sortOrder }))
  );

  return sendSuccess(res, 200, 'Category order updated');
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  reorderCategories,
};
