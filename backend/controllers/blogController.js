const { Blog, BlogCategory } = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/**
 * @route GET /api/v1/blogs
 * Public. Query: page, limit, category, tag, q
 */
const getBlogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 9);

  const filter = { status: 'published' };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.q) filter.$text = { $search: req.query.q };

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate('category', 'name slug')
      .populate('author', 'firstName lastName')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content -comments'),
    Blog.countDocuments(filter),
  ]);

  return sendSuccess(res, 200, 'Blogs fetched', { blogs }, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

/**
 * @route GET /api/v1/blogs/:slug
 * Public.
 */
const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { viewCount: 1 } },
    { new: true }
  )
    .populate('category', 'name slug')
    .populate('author', 'firstName lastName')
    .populate('comments.user', 'firstName lastName');

  if (!blog) throw ApiError.notFound('Blog post not found');

  const approvedComments = blog.comments.filter((c) => c.status === 'approved');

  return sendSuccess(res, 200, 'Blog fetched', { blog: { ...blog.toObject(), comments: approvedComments } });
});

/**
 * @route POST /api/v1/blogs/:slug/comments
 * Protected.
 */
const addComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) throw ApiError.notFound('Blog post not found');

  blog.comments.push({ user: req.user._id, comment: req.body.comment, status: 'pending' });
  await blog.save();

  return sendSuccess(res, 201, 'Comment submitted. It will appear after moderation.');
});

/**
 * @route GET /api/v1/blogs/categories
 * Public.
 */
const getBlogCategories = asyncHandler(async (req, res) => {
  const categories = await BlogCategory.find().sort({ name: 1 });
  return sendSuccess(res, 200, 'Blog categories fetched', { categories });
});

/* ------------------------------ Admin ------------------------------ */

/**
 * @route POST /api/v1/admin/blogs
 */
const createBlog = asyncHandler(async (req, res) => {
  const payload = { ...req.body, author: req.user._id };

  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'blogs');
    payload.featuredImage = { url: uploaded.url, publicId: uploaded.publicId };
  }
  if (payload.status === 'published') payload.publishedAt = new Date();

  const blog = await Blog.create(payload);
  return sendSuccess(res, 201, 'Blog created successfully', { blog });
});

/**
 * @route GET /api/v1/admin/blogs
 */
const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().populate('category', 'name').sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Blogs fetched', { blogs });
});

/**
 * @route PUT /api/v1/admin/blogs/:id
 */
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw ApiError.notFound('Blog not found');

  const wasPublished = blog.status === 'published';
  Object.assign(blog, req.body);

  if (req.file) {
    if (blog.featuredImage?.publicId) await deleteFromCloudinary(blog.featuredImage.publicId).catch(() => {});
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'blogs');
    blog.featuredImage = { url: uploaded.url, publicId: uploaded.publicId };
  }

  if (!wasPublished && blog.status === 'published') blog.publishedAt = new Date();

  await blog.save();
  return sendSuccess(res, 200, 'Blog updated successfully', { blog });
});

/**
 * @route DELETE /api/v1/admin/blogs/:id
 */
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw ApiError.notFound('Blog not found');

  if (blog.featuredImage?.publicId) await deleteFromCloudinary(blog.featuredImage.publicId).catch(() => {});
  await blog.deleteOne();

  return sendSuccess(res, 200, 'Blog deleted successfully');
});

/**
 * @route PATCH /api/v1/admin/blogs/:id/comments/:commentId
 * Body: { status }
 */
const moderateComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw ApiError.notFound('Blog not found');

  const comment = blog.comments.id(req.params.commentId);
  if (!comment) throw ApiError.notFound('Comment not found');

  comment.status = req.body.status;
  await blog.save();

  return sendSuccess(res, 200, 'Comment moderated', { blog });
});

/**
 * @route POST /api/v1/admin/blogs/categories
 */
const createBlogCategory = asyncHandler(async (req, res) => {
  const category = await BlogCategory.create({ name: req.body.name });
  return sendSuccess(res, 201, 'Blog category created', { category });
});

module.exports = {
  getBlogs,
  getBlogBySlug,
  addComment,
  getBlogCategories,
  createBlog,
  getAllBlogsAdmin,
  updateBlog,
  deleteBlog,
  moderateComment,
  createBlogCategory,
};
