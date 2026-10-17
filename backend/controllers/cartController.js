

// const Cart = require('../models/Cart');
// const Product = require('../models/Product');
// const Coupon = require('../models/Coupon');
// const CouponUsage = require('../models/CouponUsage');
// const Order = require('../models/Order');
// const asyncHandler = require('../utils/asyncHandler');
// const ApiError = require('../utils/ApiError');
// const { sendSuccess } = require('../utils/apiResponse');

// const getOrCreateCart = async (userId) => {
//   let cart = await Cart.findOne({ user: userId });
//   if (!cart) cart = await Cart.create({ user: userId, items: [] });
//   return cart;
// };

// /*
//  * Removes every item that shares the given comboGroupId. Combo/bundle
//  * offers are only valid as a complete set — a partial bundle is not a
//  * discount the store actually intended to give, so removing any member
//  * removes the whole group instead of leaving orphaned discounted/free items
//  * behind.
//  */
// const removeComboGroupItems = (cart, comboGroupId) => {
//   if (!comboGroupId) return;
//   cart.items = cart.items.filter((i) => i.comboGroupId !== comboGroupId);
// };

// /**
//  * @route GET /api/v1/cart
//  */
// const getCart = asyncHandler(async (req, res) => {
//   const cart = await getOrCreateCart(req.user._id);
//   return sendSuccess(res, 200, 'Cart fetched', { cart });
// });

// /**
//  * @route POST /api/v1/cart/items
//  * Body: { productId, variantId, quantity }
//  */
// const addItemToCart = asyncHandler(async (req, res) => {
//   const { productId, variantId = null, quantity = 1 } = req.body;
//   if (!productId) throw ApiError.badRequest('productId is required');

//   const product = await Product.findOne({ _id: productId, status: 'published', deletedAt: null });
//   if (!product) throw ApiError.notFound('Product not found');

//   // FIX: a product with variants must be added via a specific variant —
//   // otherwise price/stock/sku are ambiguous and the cart line would be
//   // priced off the (meaningless) top-level product fields.
//   if (product.hasVariants && product.variants.length > 0 && !variantId) {
//     throw ApiError.badRequest('Please select a variant before adding this product to your cart');
//   }

//   let price = product.price;
//   let mrp = product.comparePrice;
//   let sku = product.sku;
//   let availableStock = product.stockQuantity - product.reservedStock;

//   if (variantId) {
//     const variant = product.variants.id(variantId);
//     if (!variant) throw ApiError.notFound('Variant not found');
//     if (variant.status !== 'active') throw ApiError.conflict('This variant is currently unavailable');
//     price = variant.price;
//     mrp = variant.comparePrice;
//     sku = variant.sku;
//     availableStock = variant.stock;
//   }

//   if (availableStock <= 0) throw ApiError.conflict('This product is out of stock');

//   const cart = await getOrCreateCart(req.user._id);
//   const existing = cart.items.find(
//     (i) =>
//       i.product.toString() === productId &&
//       String(i.variantId) === String(variantId) &&
//       !i.savedForLater &&
//       !i.comboGroupId
//   );

//   // FIX: previously this silently capped the quantity at availableStock
//   // with no way for the caller to know it happened. Now we tell the
//   // frontend explicitly so it can show "Only X available" instead of the
//   // customer wondering why their cart doesn't match what they clicked.
//   let cappedTo = null;

//   if (existing) {
//     const requested = existing.quantity + Number(quantity);
//     if (requested > availableStock) cappedTo = availableStock;
//     existing.quantity = Math.min(availableStock, requested);
//   } else {
//     const requested = Number(quantity);
//     if (requested > availableStock) cappedTo = availableStock;
//     cart.items.push({
//       product: product._id,
//       variantId,
//       name: product.name,
//       image: product.images?.[0]?.url || null,
//       price,
//       mrp,
//       sku,
//       slug: product.slug,
//       quantity: Math.min(availableStock, requested),
//     });
//   }

//   await cart.save();

//   const message =
//     cappedTo !== null
//       ? `Only ${cappedTo} unit(s) available — cart quantity was adjusted`
//       : 'Item added to cart';

//   return sendSuccess(res, 200, message, { cart, stockCapped: cappedTo !== null, availableStock: cappedTo });
// });

// /**
//  * @route PUT /api/v1/cart/items/:itemId
//  * Body: { quantity }
//  */
// const updateCartItem = asyncHandler(async (req, res) => {
//   const { quantity } = req.body;
//   const cart = await getOrCreateCart(req.user._id);
//   const item = cart.items.id(req.params.itemId);
//   if (!item) throw ApiError.notFound('Cart item not found');

//   if (quantity <= 0) {
//     if (item.comboGroupId) {
//       removeComboGroupItems(cart, item.comboGroupId);
//     } else {
//       item.deleteOne();
//     }
//     await cart.save();
//     return sendSuccess(res, 200, 'Cart updated', { cart });
//   }

//   if (item.comboGroupId) {
//     // Bundle/BOGO items must stay in the ratio the offer defines. Letting
//     // one product's quantity change independently would silently change
//     // the effective discount, or leave a free item behind with nothing
//     // backing it. Ask the shopper to remove the whole bundle and re-add it
//     // at the quantity they want instead.
//     throw ApiError.badRequest(
//       "This item is part of a bundle offer and can't be adjusted individually. Remove the bundle and add it again to change the quantity."
//     );
//   }

//   // FIX: this previously set item.quantity = quantity with NO stock check
//   // at all — a customer could type/click their way to a quantity far
//   // beyond what's in stock, and the cart would happily show it until
//   // checkout finally rejected it. Re-validate against live stock here,
//   // the same way addItemToCart does.
//   const product = await Product.findOne({ _id: item.product, status: 'published', deletedAt: null });
//   if (!product) {
//     throw ApiError.conflict('This product is no longer available and was not updated. Please remove it from your cart.');
//   }

//   let availableStock = product.stockQuantity - product.reservedStock;
//   if (item.variantId) {
//     const variant = product.variants.id(item.variantId);
//     if (!variant) {
//       throw ApiError.conflict('This variant is no longer available and was not updated. Please remove it from your cart.');
//     }
//     availableStock = variant.stock;
//   }

//   if (quantity > availableStock) {
//     throw ApiError.conflict(
//       availableStock > 0
//         ? `Only ${availableStock} unit(s) of this item are available`
//         : 'This item is currently out of stock'
//     );
//   }

//   item.quantity = quantity;
//   await cart.save();
//   return sendSuccess(res, 200, 'Cart updated', { cart });
// });

// /**
//  * @route DELETE /api/v1/cart/items/:itemId
//  */
// const removeCartItem = asyncHandler(async (req, res) => {
//   const cart = await getOrCreateCart(req.user._id);
//   const item = cart.items.id(req.params.itemId);
//   if (!item) throw ApiError.notFound('Cart item not found');

//   if (item.comboGroupId) {
//     removeComboGroupItems(cart, item.comboGroupId);
//   } else {
//     item.deleteOne();
//   }

//   await cart.save();
//   return sendSuccess(res, 200, 'Item removed from cart', { cart });
// });

// /**
//  * @route PATCH /api/v1/cart/items/:itemId/save-for-later
//  */
// const toggleSaveForLater = asyncHandler(async (req, res) => {
//   const cart = await getOrCreateCart(req.user._id);
//   const item = cart.items.id(req.params.itemId);
//   if (!item) throw ApiError.notFound('Cart item not found');

//   const nextValue = !item.savedForLater;

//   if (item.comboGroupId) {
//     // Move the whole bundle together so it doesn't end up half in the
//     // active cart and half in Saved For Later.
//     cart.items
//       .filter((i) => i.comboGroupId === item.comboGroupId)
//       .forEach((i) => {
//         i.savedForLater = nextValue;
//       });
//   } else {
//     item.savedForLater = nextValue;
//   }

//   await cart.save();
//   return sendSuccess(res, 200, nextValue ? 'Moved to Save For Later' : 'Moved back to cart', { cart });
// });

// /**
//  * @route DELETE /api/v1/cart
//  */
// const clearCart = asyncHandler(async (req, res) => {
//   const cart = await getOrCreateCart(req.user._id);
//   cart.items = [];
//   cart.coupon = { code: null, discountAmount: 0 };
//   await cart.save();
//   return sendSuccess(res, 200, 'Cart cleared', { cart });
// });

// /**
//  * @route POST /api/v1/cart/merge
//  * Merges a guest (localStorage) cart into the user's DB cart after login.
//  * Body: { items: [{ productId, variantId, quantity }] }
//  * Note: guest carts never contain combo items (combo offers require login),
//  * so no grouping logic is needed here.
//  */
// const mergeGuestCart = asyncHandler(async (req, res) => {
//   const { items = [] } = req.body;
//   const cart = await getOrCreateCart(req.user._id);

//   for (const guestItem of items) {
//     const product = await Product.findOne({ _id: guestItem.productId, status: 'published', deletedAt: null });
//     if (!product) continue;

//     // FIX: same variant-required guard as addItemToCart — a guest cart
//     // built against a product that has since gained mandatory variants
//     // (or was miscategorized client-side) should not silently merge in at
//     // the wrong price.
//     if (product.hasVariants && product.variants.length > 0 && !guestItem.variantId) continue;

//     let price = product.price;
//     let availableStock = product.stockQuantity - product.reservedStock;
//     let sku = product.sku;
//     let mrp = product.comparePrice;

//     if (guestItem.variantId) {
//       const variant = product.variants.id(guestItem.variantId);
//       if (!variant || variant.status !== 'active') continue;
//       price = variant.price;
//       availableStock = variant.stock;
//       sku = variant.sku;
//       mrp = variant.comparePrice;
//     }
//     if (availableStock <= 0) continue;

//     const existing = cart.items.find(
//       (i) =>
//         i.product.toString() === guestItem.productId &&
//         String(i.variantId) === String(guestItem.variantId) &&
//         !i.comboGroupId
//     );
//     if (existing) {
//       existing.quantity = Math.min(availableStock, existing.quantity + Number(guestItem.quantity || 1));
//     } else {
//       cart.items.push({
//         product: product._id,
//         variantId: guestItem.variantId || null,
//         name: product.name,
//         image: product.images?.[0]?.url || null,
//         price,
//         mrp,
//         sku,
//         slug: product.slug,
//         quantity: Math.min(availableStock, Number(guestItem.quantity || 1)),
//       });
//     }
//   }

//   await cart.save();
//   return sendSuccess(res, 200, 'Guest cart merged successfully', { cart });
// });

// /**
//  * @route POST /api/v1/cart/coupon
//  * Body: { code }
//  */
// const applyCoupon = asyncHandler(async (req, res) => {
//   const { code } = req.body;
//   if (!code) throw ApiError.badRequest('Coupon code is required');

//   const coupon = await Coupon.findOne({ code: code.toUpperCase() });
//   if (!coupon || !coupon.isCurrentlyValid()) {
//     throw ApiError.badRequest('This coupon is invalid or has expired');
//   }

//   if (coupon.membershipOnly && req.user.membership === 'basic') {
//     throw ApiError.forbidden('This coupon is exclusive to premium members');
//   }

//   if (coupon.firstOrderOnly) {
//     const hasPriorOrder = await Order.exists({
//       customer: req.user._id,
//       orderStatus: { $ne: 'cancelled' },
//     });
//     if (hasPriorOrder) throw ApiError.forbidden('This coupon is valid for first-time orders only');
//   }

//   const usageCount = await CouponUsage.countDocuments({ coupon: coupon._id, user: req.user._id });
//   if (usageCount >= coupon.perUserLimit) {
//     throw ApiError.conflict('You have already used this coupon the maximum number of times');
//   }

//   const cart = await getOrCreateCart(req.user._id);
//   const activeItems = cart.items.filter((i) => !i.savedForLater);
//   if (!activeItems.length) throw ApiError.badRequest('Your cart is empty');

//   // Combo/bundle/hamper items already carry a promotional price — don't
//   // let a coupon stack a second discount on top of them.
//   const eligibleItems = activeItems.filter((i) => !i.offerType);

//   let eligibleSubtotal;
//   const hasRestriction = coupon.applicableProducts?.length || coupon.applicableCategories?.length;

//   if (hasRestriction) {
//     const productIds = [...new Set(eligibleItems.map((i) => i.product.toString()))];
//     const products = await Product.find({ _id: { $in: productIds } }).select('category');
//     const categoryByProduct = new Map(products.map((p) => [p._id.toString(), p.category?.toString()]));

//     const allowedProductIds = new Set((coupon.applicableProducts || []).map(String));
//     const allowedCategoryIds = new Set((coupon.applicableCategories || []).map(String));

//     eligibleSubtotal = eligibleItems.reduce((sum, i) => {
//       const pid = i.product.toString();
//       const catId = categoryByProduct.get(pid);
//       const isEligible = allowedProductIds.has(pid) || (catId && allowedCategoryIds.has(catId));
//       return isEligible ? sum + i.price * i.quantity : sum;
//     }, 0);

//     if (eligibleSubtotal <= 0) {
//       throw ApiError.badRequest('This coupon does not apply to any items currently in your cart');
//     }
//   } else {
//     eligibleSubtotal = eligibleItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
//   }

//   if (eligibleSubtotal < coupon.minPurchaseAmount) {
//     throw ApiError.badRequest(`Minimum purchase of ₹${coupon.minPurchaseAmount} required for this coupon`);
//   }

//   let discountAmount = 0;
//   if (coupon.type === 'percentage') {
//     discountAmount = (eligibleSubtotal * coupon.value) / 100;
//     if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
//   } else if (coupon.type === 'fixed') {
//     discountAmount = coupon.value;
//   }
//   // free_shipping handled separately at checkout shipping calculation

//   discountAmount = Math.min(discountAmount, eligibleSubtotal);

//   cart.coupon = { code: coupon.code, discountAmount: Math.round(discountAmount) };
//   await cart.save();

//   return sendSuccess(res, 200, 'Coupon applied successfully', { cart });
// });

// /**
//  * @route DELETE /api/v1/cart/coupon
//  */
// const removeCoupon = asyncHandler(async (req, res) => {
//   const cart = await getOrCreateCart(req.user._id);
//   cart.coupon = { code: null, discountAmount: 0 };
//   await cart.save();
//   return sendSuccess(res, 200, 'Coupon removed', { cart });
// });

// module.exports = {
//   getCart,
//   addItemToCart,
//   updateCartItem,
//   removeCartItem,
//   toggleSaveForLater,
//   clearCart,
//   mergeGuestCart,
//   applyCoupon,
//   removeCoupon,
// };


const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

/*
 * Removes every item that shares the given comboGroupId. Combo/bundle
 * offers are only valid as a complete set — a partial bundle is not a
 * discount the store actually intended to give, so removing any member
 * removes the whole group instead of leaving orphaned discounted/free items
 * behind.
 */
const removeComboGroupItems = (cart, comboGroupId) => {
  if (!comboGroupId) return;
  cart.items = cart.items.filter((i) => i.comboGroupId !== comboGroupId);
};

/**
 * @route GET /api/v1/cart
 */
const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  return sendSuccess(res, 200, 'Cart fetched', { cart });
});

/**
 * @route POST /api/v1/cart/items
 * Body: { productId, variantId, quantity }
 */
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, variantId = null, quantity = 1 } = req.body;
  if (!productId) throw ApiError.badRequest('productId is required');

  const product = await Product.findOne({ _id: productId, status: 'published', deletedAt: null });
  if (!product) throw ApiError.notFound('Product not found');

  if (product.hasVariants && product.variants.length > 0 && !variantId) {
    throw ApiError.badRequest('Please select a variant before adding this product to your cart');
  }

  let price = product.price;
  let mrp = product.comparePrice;
  let sku = product.sku;
  let availableStock = product.stockQuantity - product.reservedStock;

  if (variantId) {
    const variant = product.variants.id(variantId);
    if (!variant) throw ApiError.notFound('Variant not found');
    if (variant.status !== 'active') throw ApiError.conflict('This variant is currently unavailable');
    price = variant.price;
    mrp = variant.comparePrice;
    sku = variant.sku;
    availableStock = variant.stock;
  }

  if (availableStock <= 0) throw ApiError.conflict('This product is out of stock');

  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find(
    (i) =>
      i.product.toString() === productId &&
      String(i.variantId) === String(variantId) &&
      !i.savedForLater &&
      !i.comboGroupId
  );

  let cappedTo = null;

  if (existing) {
    const requested = existing.quantity + Number(quantity);
    if (requested > availableStock) cappedTo = availableStock;
    existing.quantity = Math.min(availableStock, requested);
  } else {
    const requested = Number(quantity);
    if (requested > availableStock) cappedTo = availableStock;
    cart.items.push({
      product: product._id,
      variantId,
      name: product.name,
      image: product.images?.[0]?.url || null,
      price,
      mrp,
      sku,
      slug: product.slug,
      quantity: Math.min(availableStock, requested),
    });
  }

  await cart.save();

  const message =
    cappedTo !== null
      ? `Only ${cappedTo} unit(s) available — cart quantity was adjusted`
      : 'Item added to cart';

  return sendSuccess(res, 200, message, { cart, stockCapped: cappedTo !== null, availableStock: cappedTo });
});

/**
 * @route PUT /api/v1/cart/items/:itemId
 * Body: { quantity }
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw ApiError.notFound('Cart item not found');

  if (quantity <= 0) {
    if (item.comboGroupId) {
      removeComboGroupItems(cart, item.comboGroupId);
    } else {
      item.deleteOne();
    }
    await cart.save();
    return sendSuccess(res, 200, 'Cart updated', { cart });
  }

  if (item.comboGroupId) {
    throw ApiError.badRequest(
      "This item is part of a bundle offer and can't be adjusted individually. Remove the bundle and add it again to change the quantity."
    );
  }

  const product = await Product.findOne({ _id: item.product, status: 'published', deletedAt: null });
  if (!product) {
    throw ApiError.conflict('This product is no longer available and was not updated. Please remove it from your cart.');
  }

  let availableStock = product.stockQuantity - product.reservedStock;
  if (item.variantId) {
    const variant = product.variants.id(item.variantId);
    if (!variant) {
      throw ApiError.conflict('This variant is no longer available and was not updated. Please remove it from your cart.');
    }
    availableStock = variant.stock;
  }

  if (quantity > availableStock) {
    throw ApiError.conflict(
      availableStock > 0
        ? `Only ${availableStock} unit(s) of this item are available`
        : 'This item is currently out of stock'
    );
  }

  item.quantity = quantity;
  await cart.save();
  return sendSuccess(res, 200, 'Cart updated', { cart });
});

/**
 * @route DELETE /api/v1/cart/items/:itemId
 */
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw ApiError.notFound('Cart item not found');

  if (item.comboGroupId) {
    removeComboGroupItems(cart, item.comboGroupId);
  } else {
    item.deleteOne();
  }

  await cart.save();
  return sendSuccess(res, 200, 'Item removed from cart', { cart });
});

/**
 * @route PATCH /api/v1/cart/items/:itemId/save-for-later
 */
const toggleSaveForLater = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw ApiError.notFound('Cart item not found');

  const nextValue = !item.savedForLater;

  if (item.comboGroupId) {
    cart.items
      .filter((i) => i.comboGroupId === item.comboGroupId)
      .forEach((i) => {
        i.savedForLater = nextValue;
      });
  } else {
    item.savedForLater = nextValue;
  }

  await cart.save();
  return sendSuccess(res, 200, nextValue ? 'Moved to Save For Later' : 'Moved back to cart', { cart });
});

/**
 * @route DELETE /api/v1/cart
 */
const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  cart.coupon = { code: null, discountAmount: 0 };
  await cart.save();
  return sendSuccess(res, 200, 'Cart cleared', { cart });
});

/**
 * @route POST /api/v1/cart/merge
 * Merges a guest (localStorage) cart into the user's DB cart after login.
 * Body: { items: [{ productId, variantId, quantity }] }
 * Note: guest carts never contain combo items (combo offers require login),
 * so no grouping logic is needed here.
 */
const mergeGuestCart = asyncHandler(async (req, res) => {
  const { items = [] } = req.body;
  const cart = await getOrCreateCart(req.user._id);

  for (const guestItem of items) {
    const product = await Product.findOne({ _id: guestItem.productId, status: 'published', deletedAt: null });
    if (!product) continue;

    if (product.hasVariants && product.variants.length > 0 && !guestItem.variantId) continue;

    let price = product.price;
    let availableStock = product.stockQuantity - product.reservedStock;
    let sku = product.sku;
    let mrp = product.comparePrice;

    if (guestItem.variantId) {
      const variant = product.variants.id(guestItem.variantId);
      if (!variant || variant.status !== 'active') continue;
      price = variant.price;
      availableStock = variant.stock;
      sku = variant.sku;
      mrp = variant.comparePrice;
    }
    if (availableStock <= 0) continue;

    const existing = cart.items.find(
      (i) =>
        i.product.toString() === guestItem.productId &&
        String(i.variantId) === String(guestItem.variantId) &&
        !i.comboGroupId
    );
    if (existing) {
      existing.quantity = Math.min(availableStock, existing.quantity + Number(guestItem.quantity || 1));
    } else {
      cart.items.push({
        product: product._id,
        variantId: guestItem.variantId || null,
        name: product.name,
        image: product.images?.[0]?.url || null,
        price,
        mrp,
        sku,
        slug: product.slug,
        quantity: Math.min(availableStock, Number(guestItem.quantity || 1)),
      });
    }
  }

  await cart.save();
  return sendSuccess(res, 200, 'Guest cart merged successfully', { cart });
});

/**
 * @route POST /api/v1/cart/coupon
 * Body: { code }
 */
const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) throw ApiError.badRequest('Coupon code is required');

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon || !coupon.isCurrentlyValid()) {
    throw ApiError.badRequest('This coupon is invalid or has expired');
  }

  if (coupon.membershipOnly && req.user.membership === 'basic') {
    throw ApiError.forbidden('This coupon is exclusive to premium members');
  }

  if (coupon.firstOrderOnly) {
    const hasPriorOrder = await Order.exists({
      customer: req.user._id,
      orderStatus: { $ne: 'cancelled' },
    });
    if (hasPriorOrder) throw ApiError.forbidden('This coupon is valid for first-time orders only');
  }

  const usageCount = await CouponUsage.countDocuments({ coupon: coupon._id, user: req.user._id });
  if (usageCount >= coupon.perUserLimit) {
    throw ApiError.conflict('You have already used this coupon the maximum number of times');
  }

  const cart = await getOrCreateCart(req.user._id);
  const activeItems = cart.items.filter((i) => !i.savedForLater);
  if (!activeItems.length) throw ApiError.badRequest('Your cart is empty');

  const eligibleItems = activeItems.filter((i) => !i.offerType);

  let eligibleSubtotal;
  const hasRestriction = coupon.applicableProducts?.length || coupon.applicableCategories?.length;

  if (hasRestriction) {
    const productIds = [...new Set(eligibleItems.map((i) => i.product.toString()))];
    const products = await Product.find({ _id: { $in: productIds } }).select('category');
    const categoryByProduct = new Map(products.map((p) => [p._id.toString(), p.category?.toString()]));

    const allowedProductIds = new Set((coupon.applicableProducts || []).map(String));
    const allowedCategoryIds = new Set((coupon.applicableCategories || []).map(String));

    eligibleSubtotal = eligibleItems.reduce((sum, i) => {
      const pid = i.product.toString();
      const catId = categoryByProduct.get(pid);
      const isEligible = allowedProductIds.has(pid) || (catId && allowedCategoryIds.has(catId));
      return isEligible ? sum + i.price * i.quantity : sum;
    }, 0);

    if (eligibleSubtotal <= 0) {
      throw ApiError.badRequest('This coupon does not apply to any items currently in your cart');
    }
  } else {
    eligibleSubtotal = eligibleItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  if (eligibleSubtotal < coupon.minPurchaseAmount) {
    throw ApiError.badRequest(`Minimum purchase of ₹${coupon.minPurchaseAmount} required for this coupon`);
  }

  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = (eligibleSubtotal * coupon.value) / 100;
    if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
  } else if (coupon.type === 'fixed') {
    discountAmount = coupon.value;
  }

  discountAmount = Math.min(discountAmount, eligibleSubtotal);

  cart.coupon = { code: coupon.code, discountAmount: Math.round(discountAmount) };
  await cart.save();

  return sendSuccess(res, 200, 'Coupon applied successfully', { cart });
});

/**
 * @route DELETE /api/v1/cart/coupon
 */
const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.coupon = { code: null, discountAmount: 0 };
  await cart.save();
  return sendSuccess(res, 200, 'Coupon removed', { cart });
});

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  toggleSaveForLater,
  clearCart,
  mergeGuestCart,
  applyCoupon,
  removeCoupon,
};