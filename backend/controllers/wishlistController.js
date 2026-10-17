const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, items: [] });
  return wishlist;
};

/**
 * @route GET /api/v1/wishlist
 */
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  return sendSuccess(res, 200, 'Wishlist fetched', { wishlist });
});

/**
 * @route POST /api/v1/wishlist/items
 * Body: { productId }
 */
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findOne({ _id: productId, status: 'published', deletedAt: null });
  if (!product) throw ApiError.notFound('Product not found');

  const wishlist = await getOrCreateWishlist(req.user._id);
  const exists = wishlist.items.some((i) => i.product.toString() === productId);
  if (exists) return sendSuccess(res, 200, 'Product already in wishlist', { wishlist });

  wishlist.items.push({
    product: product._id,
    name: product.name,
    image: product.images?.[0]?.url || null,
    price: product.price,
    slug: product.slug,
  });

  await wishlist.save();
  return sendSuccess(res, 201, 'Added to wishlist', { wishlist });
});

/**
 * @route DELETE /api/v1/wishlist/items/:productId
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.items = wishlist.items.filter((i) => i.product.toString() !== req.params.productId);
  await wishlist.save();
  return sendSuccess(res, 200, 'Removed from wishlist', { wishlist });
});

/**
 * @route POST /api/v1/wishlist/items/:productId/move-to-cart
 */
const moveToCart = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const item = wishlist.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) throw ApiError.notFound('Item not found in wishlist');

  const product = await Product.findOne({ _id: item.product, status: 'published', deletedAt: null });
  if (!product) throw ApiError.notFound('Product no longer available');

  const cart = (await Cart.findOne({ user: req.user._id })) || (await Cart.create({ user: req.user._id, items: [] }));
  const existingCartItem = cart.items.find((i) => i.product.toString() === product._id.toString() && !i.variantId);

  if (existingCartItem) {
    existingCartItem.quantity += 1;
  } else {
    cart.items.push({
      product: product._id,
      variantId: null,
      name: product.name,
      image: product.images?.[0]?.url || null,
      price: product.price,
      mrp: product.comparePrice,
      sku: product.sku,
      slug: product.slug,
      quantity: 1,
    });
  }
  await cart.save();

  wishlist.items = wishlist.items.filter((i) => i.product.toString() !== req.params.productId);
  await wishlist.save();

  return sendSuccess(res, 200, 'Moved to cart', { cart, wishlist });
});

/**
 * @route POST /api/v1/wishlist/merge
 * Body: { productIds: [] }
 */
const mergeGuestWishlist = asyncHandler(async (req, res) => {
  const { productIds = [] } = req.body;
  const wishlist = await getOrCreateWishlist(req.user._id);

  const products = await Product.find({ _id: { $in: productIds }, status: 'published', deletedAt: null });

  for (const product of products) {
    const exists = wishlist.items.some((i) => i.product.toString() === product._id.toString());
    if (!exists) {
      wishlist.items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || null,
        price: product.price,
        slug: product.slug,
      });
    }
  }

  await wishlist.save();
  return sendSuccess(res, 200, 'Guest wishlist merged successfully', { wishlist });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, moveToCart, mergeGuestWishlist };
