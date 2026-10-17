const ProductQuestion = require('../models/ProductQuestion');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { notifyAdmins } = require('../services/notificationService');

/**
 * @route GET /api/v1/questions/product/:productId 
 */
const getProductQuestions = asyncHandler(async (req, res) => {
  const questions = await ProductQuestion.find({ product: req.params.productId, isPublished: true })
    .populate('user', 'firstName lastName')
    .sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Questions fetched', { questions });
});
 
/** 
 * @route POST /api/v1/questions/product/:productId
 */
const askQuestion = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) throw ApiError.notFound('Product not found');

  const question = await ProductQuestion.create({
    product: product._id,
    user: req.user._id,
    question: req.body.question,
  });

  await notifyAdmins({
    type: 'system',
    title: 'New Product Question',
    message: `A customer asked a question about ${product.name}.`,
    link: `/admin/products/${product._id}`,
  });

  return sendSuccess(res, 201, 'Question submitted successfully', { question });
});

/**
 * @route GET /api/v1/admin/questions
 */
const getAllQuestionsAdmin = asyncHandler(async (req, res) => {
  const { answered } = req.query;
  const filter = {};
  if (answered === 'true') filter.answer = { $ne: null };
  if (answered === 'false') filter.answer = null;

  const questions = await ProductQuestion.find(filter)
    .populate('user', 'firstName lastName email')
    .populate('product', 'name slug')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 200, 'Questions fetched', { questions });
});

/**
 * @route PATCH /api/v1/admin/questions/:id/answer
 */
const answerQuestion = asyncHandler(async (req, res) => {
  const question = await ProductQuestion.findById(req.params.id);
  if (!question) throw ApiError.notFound('Question not found');

  question.answer = req.body.answer;
  question.answeredBy = req.user._id;
  question.answeredAt = new Date();
  await question.save();

  return sendSuccess(res, 200, 'Answer posted successfully', { question });
});

/**
 * @route DELETE /api/v1/admin/questions/:id
 */
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await ProductQuestion.findById(req.params.id);
  if (!question) throw ApiError.notFound('Question not found');
  await question.deleteOne();
  return sendSuccess(res, 200, 'Question deleted successfully');
});

module.exports = { getProductQuestions, askQuestion, getAllQuestionsAdmin, answerQuestion, deleteQuestion };
