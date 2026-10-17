
const crypto = require('crypto');
const { ComboOffer, HamperTemplate } = require('../models/Promotions');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/* ------------------------------ Combo Offers ------------------------------ */

/**
 * @route GET /api/v1/promotions/combo-offers
 * Public. Only currently active/in-schedule offers.
 */
const getComboOffers = asyncHandler(async (req, res) => {
  const now = new Date();
  const offers = await ComboOffer.find({
    status: 'active',
    startDate: { $lte: now },
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  })
    .populate('products', 'name slug images price')
    .populate('eligibleProduct', 'name slug images price')
    .populate('freeProduct', 'name slug images price');

  return sendSuccess(res, 200, 'Combo offers fetched', { offers });
});

/**
 * @route POST /api/v1/promotions/combo-offers/:id/add-to-cart
 * Protected. Adds every product in a bundle_discount combo to the cart at
 * the bundle price (proportionally discounted across items), or applies the
 * free item for a buy_x_get_y offer.
 *
 * Every item added by a single combo offer is tagged with a shared
 * `comboGroupId` + `offerRef`. This is what lets the cart/checkout layers
 * enforce that a bundle can only exist in the cart as a complete, correctly
 * priced set — see cartController (cascade remove/save-for-later, blocked
 * partial quantity edits) and orderController (checkout-time revalidation).
 */
const addComboToCart = asyncHandler(async (req, res) => {
  const offer = await ComboOffer.findById(req.params.id).populate('products eligibleProduct freeProduct');
  if (!offer || offer.status !== 'active') throw ApiError.notFound('Offer not found or no longer active');

  const now = new Date();
  if (offer.startDate > now || (offer.endDate && offer.endDate < now)) {
    throw ApiError.badRequest('This offer is not currently available');
  }

  const cart = (await Cart.findOne({ user: req.user._id })) || (await Cart.create({ user: req.user._id, items: [] }));

  // If this exact offer is already sitting in the cart (and not saved for
  // later), reuse its group and increment quantities in lock-step, rather
  // than creating a second, disconnected group for the same offer.
  const existingGroupId = cart.items.find(
    (i) => i.offerRef && i.offerRef.toString() === offer._id.toString() && !i.savedForLater
  )?.comboGroupId;

  const comboGroupId = existingGroupId || crypto.randomUUID();

  if (offer.promotionType === 'bundle_discount') {
    const originalTotal = offer.products.reduce((sum, p) => sum + p.price, 0);
    const bundlePrice = offer.bundlePrice || originalTotal;

    offer.products.forEach((product) => {
      const proportionalPrice = Math.round((product.price / originalTotal) * bundlePrice);
      const existing = cart.items.find(
        (i) => i.comboGroupId === comboGroupId && i.product.toString() === product._id.toString() && !i.variantId
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push({
          product: product._id,
          variantId: null,
          name: product.name,
          image: product.images?.[0]?.url || null,
          price: proportionalPrice,
          mrp: product.price,
          sku: product.sku,
          slug: product.slug,
          quantity: 1,
          comboGroupId,
          offerType: 'bundle_discount',
          offerRef: offer._id,
          comboRole: 'bundle_member',
        });
      }
    });
  } else if (offer.promotionType === 'buy_x_get_y') {
    const eligible = offer.eligibleProduct;
    const free = offer.freeProduct || offer.eligibleProduct;

    const existingEligible = cart.items.find((i) => i.comboGroupId === comboGroupId && i.comboRole === 'eligible');
    const existingFree = cart.items.find((i) => i.comboGroupId === comboGroupId && i.comboRole === 'free');

    if (existingEligible && existingFree) {
      existingEligible.quantity += offer.buyQuantity;
      existingFree.quantity += offer.getQuantity;
    } else {
      cart.items.push({
        product: eligible._id,
        variantId: null,
        name: eligible.name,
        image: eligible.images?.[0]?.url || null,
        price: eligible.price,
        mrp: eligible.price,
        sku: eligible.sku,
        slug: eligible.slug,
        quantity: offer.buyQuantity,
        comboGroupId,
        offerType: 'buy_x_get_y',
        offerRef: offer._id,
        comboRole: 'eligible',
      });
      cart.items.push({
        product: free._id,
        variantId: null,
        name: `${free.name} (Free Gift)`,
        image: free.images?.[0]?.url || null,
        price: 0,
        mrp: free.price,
        sku: free.sku,
        slug: free.slug,
        quantity: offer.getQuantity,
        comboGroupId,
        offerType: 'buy_x_get_y',
        offerRef: offer._id,
        comboRole: 'free',
        isFreeItem: true,
      });
    }
  } else {
    throw ApiError.badRequest('Unsupported offer type');
  }

  await cart.save();
  return sendSuccess(res, 200, 'Offer added to cart', { cart });
});

/**
 * @route POST /api/v1/admin/promotions/combo-offers
 */
const createComboOffer = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'promotions');
    payload.image = { url: uploaded.url, publicId: uploaded.publicId };
  }
  const offer = await ComboOffer.create(payload);
  return sendSuccess(res, 201, 'Combo offer created successfully', { offer });
});

/**
 * @route GET /api/v1/admin/promotions/combo-offers
 */
const getAllComboOffersAdmin = asyncHandler(async (req, res) => {
  const offers = await ComboOffer.find().populate('products eligibleProduct freeProduct', 'name').sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Combo offers fetched', { offers });
});

/**
 * @route PUT /api/v1/admin/promotions/combo-offers/:id
 */
const updateComboOffer = asyncHandler(async (req, res) => {
  const offer = await ComboOffer.findById(req.params.id);
  if (!offer) throw ApiError.notFound('Offer not found');

  Object.assign(offer, req.body);
  if (req.file) {
    if (offer.image?.publicId) await deleteFromCloudinary(offer.image.publicId).catch(() => {});
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'promotions');
    offer.image = { url: uploaded.url, publicId: uploaded.publicId };
  }
  await offer.save();
  return sendSuccess(res, 200, 'Combo offer updated successfully', { offer });
});

/**
 * @route DELETE /api/v1/admin/promotions/combo-offers/:id
 */
const deleteComboOffer = asyncHandler(async (req, res) => {
  const offer = await ComboOffer.findById(req.params.id);
  if (!offer) throw ApiError.notFound('Offer not found');
  if (offer.image?.publicId) await deleteFromCloudinary(offer.image.publicId).catch(() => {});
  await offer.deleteOne();
  return sendSuccess(res, 200, 'Combo offer deleted successfully');
});

/* --------------------------- Gift Hamper Builder --------------------------- */

/**
 * @route GET /api/v1/promotions/hamper-templates
 * Public.
 */
const getHamperTemplates = asyncHandler(async (req, res) => {
  const templates = await HamperTemplate.find({ status: 'active' }).populate(
    'availableProducts',
    'name slug images price'
  );
  return sendSuccess(res, 200, 'Hamper templates fetched', { templates });
});

/**
 * @route POST /api/v1/promotions/hamper-templates/:id/build
 * Protected. Body: { basketIndex, productIds: [], greetingCard }
 * Prices and adds the custom hamper to the cart as a single bespoke line item.
 */
const buildHamper = asyncHandler(async (req, res) => {
  const template = await HamperTemplate.findById(req.params.id).populate('availableProducts');
  if (!template) throw ApiError.notFound('Hamper template not found');

  const { basketIndex = 0, productIds = [], greetingCard = '' } = req.body;
  if (!productIds.length) throw ApiError.badRequest('Select at least one product for your hamper');
  if (productIds.length > template.maxItems) {
    throw ApiError.badRequest(`You can select a maximum of ${template.maxItems} items`);
  }

  const basket = template.basketOptions[basketIndex];
  if (!basket) throw ApiError.badRequest('Invalid basket selection');

  const selectedProducts = template.availableProducts.filter((p) => productIds.includes(p._id.toString()));
  if (selectedProducts.length !== productIds.length) {
    throw ApiError.badRequest('One or more selected products are not available for hampers');
  }

  const itemsTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const totalPrice = itemsTotal + basket.price + template.packagingCost;

  const cart = (await Cart.findOne({ user: req.user._id })) || (await Cart.create({ user: req.user._id, items: [] }));

  cart.items.push({
    product: selectedProducts[0]._id, // reference product for cart schema compliance
    variantId: null,
    name: `Custom Gift Hamper (${basket.name}) — ${selectedProducts.map((p) => p.name).join(', ')}${
      greetingCard ? ` + Card: "${greetingCard}"` : ''
    }`,
    image: basket.image?.url || selectedProducts[0].images?.[0]?.url || null,
    price: totalPrice,
    mrp: totalPrice,
    sku: `HAMPER-${template._id.toString().slice(-6).toUpperCase()}`,
    slug: null,
    quantity: 1,
    comboGroupId: crypto.randomUUID(),
    offerType: 'hamper',
    offerRef: template._id,
    comboRole: 'bundle_member',
  });

  await cart.save();
  return sendSuccess(res, 200, 'Gift hamper added to cart', {
    cart,
    breakdown: { itemsTotal, basketPrice: basket.price, packagingCost: template.packagingCost, totalPrice },
  });
});

/**
 * @route POST /api/v1/admin/promotions/hamper-templates
 */
const createHamperTemplate = asyncHandler(async (req, res) => {
  const template = await HamperTemplate.create(req.body);
  return sendSuccess(res, 201, 'Hamper template created successfully', { template });
});

/**
 * @route PUT /api/v1/admin/promotions/hamper-templates/:id
 */
const updateHamperTemplate = asyncHandler(async (req, res) => {
  const template = await HamperTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!template) throw ApiError.notFound('Hamper template not found');
  return sendSuccess(res, 200, 'Hamper template updated successfully', { template });
});

const getAllHamperTemplatesAdmin = asyncHandler(async (req, res) => {
  const templates = await HamperTemplate.find()
    .populate('availableProducts', 'name')
    .sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Hamper templates fetched', { templates });
});

const deleteHamperTemplate = asyncHandler(async (req, res) => {
  const template = await HamperTemplate.findById(req.params.id);
  if (!template) throw ApiError.notFound('Hamper template not found');
  await template.deleteOne();
  return sendSuccess(res, 200, 'Hamper template deleted successfully');
});

module.exports = {
  getComboOffers,
  addComboToCart, 
  createComboOffer,
  getAllComboOffersAdmin,
  updateComboOffer,
  deleteComboOffer,
  getHamperTemplates,
  buildHamper,
  createHamperTemplate,
  updateHamperTemplate,
  getAllHamperTemplatesAdmin,
  deleteHamperTemplate,
};