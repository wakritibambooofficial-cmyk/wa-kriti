


// const crypto = require('crypto');
// const Order = require('../models/Order');
// const Cart = require('../models/Cart');
// const Address = require('../models/Address');
// const Product = require('../models/Product');
// const User = require('../models/User');
// const CouponUsage = require('../models/CouponUsage');
// const Coupon = require('../models/Coupon');
// const PaymentLog = require('../models/PaymentLog');
// const { ComboOffer } = require('../models/Promotions');
// const razorpay = require('../config/razorpay');
// const asyncHandler = require('../utils/asyncHandler');
// const ApiError = require('../utils/ApiError');
// const { sendSuccess } = require('../utils/apiResponse');
// const { generateInvoicePdf } = require('../utils/invoiceGenerator');
// const { sendOrderStatusEmail, sendLowStockAlertEmail } = require('../services/emailService');
// const { notifyUser, notifyAdmins } = require('../services/notificationService');
// const logger = require('../utils/logger');

// const FREE_SHIPPING_THRESHOLD = 999;
// const FLAT_SHIPPING_COST = 79;
// const TAX_RATE = 0; // GST handling can be enabled per-product via taxPercentage; kept simple here
// const REWARD_POINT_VALUE = 0.5; // ₹ value of 1 reward point when redeemed

// /**
//  * Re-derives every combo/bundle/hamper group in the cart against its live
//  * offer document and strips out any group that no longer checks out:
//  *   - the offer was deactivated, deleted, or fell outside its schedule
//  *   - a bundle_discount group is missing a product or has mismatched
//  *     per-product quantities (i.e. someone removed/added one product
//  *     without the rest — see cartController for how this is normally
//  *     prevented, this is the server-side backstop for direct API calls)
//  *   - a buy_x_get_y group's free item quantity doesn't match the eligible
//  *     item's quantity at the offer's ratio, or the free item isn't ₹0
//  *
//  * Mutates cart.items in place and returns the names of any removed items
//  * so the caller can surface a clear message. Does NOT save the cart —
//  * callers decide when to persist.
//  */
// const revalidateCombos = async (cart) => {
//   const activeItems = cart.items.filter((i) => !i.savedForLater);
//   const groupIds = [...new Set(activeItems.filter((i) => i.comboGroupId).map((i) => i.comboGroupId))];
//   if (!groupIds.length) return [];

//   const removedItemNames = [];

//   for (const groupId of groupIds) {
//     const groupItems = activeItems.filter((i) => i.comboGroupId === groupId);
//     const offerType = groupItems[0].offerType;
//     const offerRefId = groupItems[0].offerRef;

//     let valid = true;

//     if (offerType === 'bundle_discount' || offerType === 'buy_x_get_y') {
//       const offer = offerRefId
//         ? await ComboOffer.findById(offerRefId).populate('products eligibleProduct freeProduct')
//         : null;

//       const now = new Date();
//       const offerLive =
//         !!offer &&
//         offer.status === 'active' &&
//         offer.startDate <= now &&
//         (!offer.endDate || offer.endDate >= now);

//       if (!offerLive) {
//         valid = false;
//       } else if (offerType === 'bundle_discount') {
//         const expectedIds = offer.products.map((p) => p._id.toString()).sort();
//         const groupIds2 = groupItems.map((i) => i.product.toString()).sort();
//         const quantities = groupItems.map((i) => i.quantity);
//         const sameSet = JSON.stringify(expectedIds) === JSON.stringify(groupIds2);
//         const sameQty = quantities.every((q) => q === quantities[0]);
//         valid = sameSet && sameQty && groupItems.length === offer.products.length;
//       } else {
//         const eligibleItem = groupItems.find((i) => i.comboRole === 'eligible');
//         const freeItem = groupItems.find((i) => i.comboRole === 'free');
//         const expectedFreeId = (offer.freeProduct || offer.eligibleProduct)._id.toString();

//         valid =
//           !!eligibleItem &&
//           !!freeItem &&
//           eligibleItem.product.toString() === offer.eligibleProduct._id.toString() &&
//           freeItem.product.toString() === expectedFreeId &&
//           freeItem.price === 0 &&
//           offer.buyQuantity > 0 &&
//           eligibleItem.quantity % offer.buyQuantity === 0 &&
//           freeItem.quantity === (eligibleItem.quantity / offer.buyQuantity) * offer.getQuantity;
//       }
//     }
//     // offerType === 'hamper' is a single bespoke line item — nothing to
//     // cross-check beyond it simply existing, which it does by definition.

//     if (!valid) {
//       groupItems.forEach((i) => removedItemNames.push(i.name));
//       cart.items = cart.items.filter((i) => i.comboGroupId !== groupId);
//     }
//   }

//   return removedItemNames;
// };

// /**
//  * Re-derives the applied coupon's discount from the CURRENT cart contents
//  * and the coupon's CURRENT rules, instead of trusting cart.coupon.discountAmount
//  * (which is only ever set at the moment "Apply" was clicked and never
//  * revisited). Catches: cart shrinking below minPurchaseAmount after a
//  * coupon was applied, the coupon being deactivated/expired/used up in the
//  * meantime, and the applicableProducts/applicableCategories/firstOrderOnly
//  * restrictions that must hold at checkout, not just at apply-time.
//  *
//  * Mutates cart.coupon in place. Returns a user-facing note if the coupon
//  * was removed, or null if it's still valid (in which case the discount
//  * amount has been refreshed).
//  */
// const revalidateCoupon = async (cart, user) => {
//   if (!cart.coupon?.code) return null;

//   const dropCoupon = (reason) => {
//     cart.coupon = { code: null, discountAmount: 0 };
//     return reason;
//   };

//   const coupon = await Coupon.findOne({ code: cart.coupon.code });
//   if (!coupon || !coupon.isCurrentlyValid()) {
//     return dropCoupon('Your coupon is no longer valid and was removed from your cart.');
//   }

//   if (coupon.membershipOnly && user.membership === 'basic') {
//     return dropCoupon('Your coupon requires premium membership and was removed from your cart.');
//   }

//   if (coupon.firstOrderOnly) {
//     const hasPriorOrder = await Order.exists({ customer: user._id, orderStatus: { $ne: 'cancelled' } });
//     if (hasPriorOrder) return dropCoupon('Your coupon is for first-time orders only and was removed from your cart.');
//   }

//   const usageCount = await CouponUsage.countDocuments({ coupon: coupon._id, user: user._id });
//   if (usageCount >= coupon.perUserLimit) {
//     return dropCoupon('You have already used this coupon and it was removed from your cart.');
//   }

//   const activeItems = cart.items.filter((i) => !i.savedForLater);
//   const eligibleItems = activeItems.filter((i) => !i.offerType);

//   let eligibleSubtotal;
//   if (coupon.applicableProducts?.length || coupon.applicableCategories?.length) {
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
//   } else {
//     eligibleSubtotal = eligibleItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
//   }

//   if (eligibleSubtotal < coupon.minPurchaseAmount) {
//     return dropCoupon(
//       `Your cart no longer meets the ₹${coupon.minPurchaseAmount} minimum required for your coupon, so it was removed.`
//     );
//   }

//   let discountAmount = 0;
//   if (coupon.type === 'percentage') {
//     discountAmount = (eligibleSubtotal * coupon.value) / 100;
//     if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
//   } else if (coupon.type === 'fixed') {
//     discountAmount = coupon.value;
//   }
//   discountAmount = Math.min(discountAmount, eligibleSubtotal);

//   cart.coupon.discountAmount = Math.round(discountAmount);
//   return null;
// };

// /**
//  * Checks every active cart item against the live Product/variant: stock
//  * availability (as before) plus PRICE. Previously a cart item's price was
//  * frozen the moment it was added and never re-checked, so a product price
//  * change after add-to-cart had no effect on what the customer paid.
//  * Combo/bundle/free items are intentionally off-catalogue priced and are
//  * left untouched here — see revalidateCombos for their own integrity check.
//  *
//  * Mutates item prices in place for plain items where they've drifted.
//  * Returns { unavailable: string[], priceChanged: string[] }.
//  */
// const revalidateStockAndPricing = async (cart) => {
//   const activeItems = cart.items.filter((i) => !i.savedForLater);
//   const unavailable = [];
//   const priceChanged = [];

//   for (const item of activeItems) {
//     const product = await Product.findById(item.product);
//     if (!product || product.status !== 'published' || product.deletedAt) {
//       unavailable.push(`${item.name} is no longer available`);
//       continue;
//     }

//     let available = product.stockQuantity - product.reservedStock;
//     let livePrice = product.price;

//     if (item.variantId) {
//       const variant = product.variants.id(item.variantId);
//       if (!variant) {
//         unavailable.push(`A variant of ${item.name} is no longer available`);
//         continue;
//       }
//       available = variant.stock;
//       livePrice = variant.price;
//     }

//     if (available < item.quantity) {
//       unavailable.push(`Only ${available} unit(s) of ${item.name} available`);
//       continue;
//     }

//     if (!item.offerType && item.price !== livePrice) {
//       item.price = livePrice;
//       item.mrp = item.variantId ? item.mrp : product.comparePrice ?? item.mrp;
//       priceChanged.push(item.name);
//     }
//   }

//   return { unavailable, priceChanged };
// };

// /**
//  * Recomputes cart totals server-side (never trusts client-submitted totals).
//  * Assumes the cart has already been through revalidateCombos /
//  * revalidateCoupon / revalidateStockAndPricing.
//  * @param {object} cart
//  * @param {number} redeemPoints optional reward points the customer wants to redeem
//  * @param {number} availablePoints the customer's current reward point balance
//  */
// const computeOrderTotals = (cart, redeemPoints = 0, availablePoints = 0) => {
//   const activeItems = cart.items.filter((i) => !i.savedForLater);
//   if (!activeItems.length) throw ApiError.badRequest('Your cart is empty');

//   const subtotal = activeItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
//   const discount = cart.coupon?.discountAmount || 0;
//   const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
//   const taxableAmount = Math.max(0, subtotal - discount);
//   const tax = Math.round(taxableAmount * TAX_RATE);

//   const pointsToRedeem = Math.max(0, Math.min(redeemPoints, availablePoints));
//   const maxRedeemableValue = Math.max(0, taxableAmount + tax + shippingCost);
//   let rewardPointsDiscount = Math.round(pointsToRedeem * REWARD_POINT_VALUE);
//   rewardPointsDiscount = Math.min(rewardPointsDiscount, maxRedeemableValue);
//   const actualPointsRedeemed = Math.round(rewardPointsDiscount / REWARD_POINT_VALUE);

//   const grandTotal = Math.max(0, taxableAmount + tax + shippingCost - rewardPointsDiscount);

//   return {
//     activeItems,
//     subtotal,
//     discount,
//     shippingCost,
//     tax,
//     grandTotal,
//     rewardPointsDiscount,
//     rewardPointsRedeemed: actualPointsRedeemed,
//   };
// };

// /**
//  * FIX: previously this used raw, unguarded Product.updateOne({ $inc: ... })
//  * calls, which can never fail — meaning reservedStock / variant stock
//  * could be driven negative under concurrent order cancellations or
//  * repeated webhook retries (e.g. Razorpay retrying a failed-payment
//  * webhook). Now routed through Product.releaseStock, which floors at 0
//  * atomically and is safe to call more than once for the same order.
//  */
// const releaseReservedStock = async (order) => {
//   for (const item of order.items) {
//     // eslint-disable-next-line no-await-in-loop
//     await Product.releaseStock(item.product, item.variantId, item.quantity).catch((e) =>
//       logger.error(`Failed to release stock for order ${order.orderNumber}, item ${item.product}: ${e.message}`)
//     );
//   }
// };

// /**
//  * Shared post-payment success logic: clears cart, records coupon usage,
//  * sends notifications/emails, checks for low-stock alerting.
//  */
// const finalizeSuccessfulOrder = async (order, user) => {
//   await Cart.findOneAndUpdate({ user: order.customer }, { items: [], coupon: { code: null, discountAmount: 0 } });

//   if (order.couponCode) {
//     const coupon = await Coupon.findOne({ code: order.couponCode });
//     if (coupon) {
//       coupon.usageCount += 1;
//       await coupon.save();
//       await CouponUsage.create({
//         coupon: coupon._id,
//         user: order.customer,
//         order: order._id,
//         discountAmount: order.discount,
//       });
//     }
//   }

//   // Redeem reward points used at checkout (if any)
//   // if (order.rewardPointsRedeemed > 0) {
//   //   const { applyRewardTransaction } = require('./loyaltyController');
//   //   await applyRewardTransaction(order.customer, {
//   //     type: 'redeemed',
//   //     points: order.rewardPointsRedeemed,
//   //     reason: 'redemption',
//   //     description: `Redeemed on order ${order.orderNumber}`,
//   //     order: order._id,
//   //   }).catch((e) => logger.error(`Reward redemption failed: ${e.message}`));
//   // }

//   if (order.rewardPointsRedeemed > 0) {
//     const result = await User.findOneAndUpdate(
//       { _id: order.customer, rewardPoints: { $gte: order.rewardPointsRedeemed } },
//       { $inc: { rewardPoints: -order.rewardPointsRedeemed } },
//       { new: true }
//     );
//     if (!result) {
//       // Balance changed out from under us between checkout and now (should
//       // be rare — computeOrderTotals already capped against the live
//       // balance moments earlier). Don't fail the order over it; just log
//       // it for follow-up, since the order and payment are already final.
//       logger.error(
//         `Reward point deduction skipped for order ${order.orderNumber}: user ${order.customer} no longer had ${order.rewardPointsRedeemed} points`
//       );
//     }
//   }

//   // Update lifetime spend and recalculate membership tier
//   const customer = await User.findById(order.customer);
//   if (customer) {
//     customer.lifetimeSpend = (customer.lifetimeSpend || 0) + order.grandTotal;
//     await customer.save();
//     const { recalculateMembership, processReferralReward } = require('./membershipController');
//     await recalculateMembership(order.customer).catch((e) => logger.error(`Membership recalculation failed: ${e.message}`));
//     await processReferralReward(order.customer).catch((e) => logger.error(`Referral reward failed: ${e.message}`));
//   }

//   await notifyUser(order.customer, {
//     type: 'order',
//     title: 'Order Placed',
//     message: `Your order ${order.orderNumber} has been placed successfully.`,
//     link: `/dashboard/orders/${order._id}`,
//   });

//   await notifyAdmins({
//     type: 'order',
//     title: 'New Order Received',
//     message: `Order ${order.orderNumber} was placed for ₹${order.grandTotal}.`,
//     link: `/admin/orders/${order._id}`,
//   });

//   if (user?.email) {
//     sendOrderStatusEmail(user.email, {
//       firstName: user.firstName,
//       orderNumber: order.orderNumber,
//       status: 'placed',
//     }).catch((e) => logger.error(e.message));
//   }

//   for (const item of order.items) {
//     // eslint-disable-next-line no-await-in-loop
//     const product = await Product.findById(item.product);
//     if (product && product.stockQuantity - product.reservedStock <= product.minStockLevel) {
//       notifyAdmins({
//         type: 'restock',
//         title: 'Low Stock Alert',
//         message: `${product.name} is running low on stock.`,
//         link: `/admin/products/${product._id}`,
//       }).catch(() => {});
//       if (process.env.ADMIN_EMAILS) {
//         sendLowStockAlertEmail(process.env.ADMIN_EMAILS.split(',')[0].trim(), {
//           productName: product.name,
//           sku: product.sku,
//           availableStock: product.stockQuantity - product.reservedStock,
//         }).catch((e) => logger.error(e.message));
//       }
//     }
//   }
// };

// /**
//  * Attempts to atomically reserve stock for every item in `orderItems`.
//  * Stops at the first item that can't be reserved (insufficient live
//  * stock), and rolls back everything reserved so far in this attempt
//  * before returning. This is what actually prevents overselling under
//  * concurrent checkouts — see Product.reserveStock for why this is safe
//  * without a multi-document transaction.
//  *
//  * @returns {Promise<string|null>} the name of the item that failed, or
//  *   null if every item was reserved successfully.
//  */
// const reserveStockForOrderItems = async (orderItems) => {
//   const reserved = [];

//   for (const item of orderItems) {
//     // eslint-disable-next-line no-await-in-loop
//     const ok = await Product.reserveStock(item.product, item.variantId, item.quantity);
//     if (!ok) {
//       // Roll back everything reserved so far in this attempt.
//       for (const done of reserved) {
//         // eslint-disable-next-line no-await-in-loop
//         await Product.releaseStock(done.product, done.variantId, done.quantity).catch((e) =>
//           logger.error(`Failed to roll back stock reservation: ${e.message}`)
//         );
//       }
//       return item.name;
//     }
//     reserved.push(item);
//   }

//   return null;
// };

// /**
//  * @route POST /api/v1/orders/checkout
//  * Body: { shippingAddressId, billingAddressId, paymentMethod, notes, giftWrap, giftMessage }
//  * Creates a pending Order + a Razorpay order for the frontend to open checkout with.
//  */
// const initiateCheckout = asyncHandler(async (req, res) => {
//   const {
//     shippingAddressId,
//     billingAddressId,
//     paymentMethod = 'razorpay',
//     notes = '',
//     giftWrap = false,
//     giftMessage = '',
//     redeemPoints = 0,
//   } = req.body;

//   const cart = await Cart.findOne({ user: req.user._id });
//   if (!cart || !cart.items.length) throw ApiError.badRequest('Your cart is empty');

//   const shippingAddress = await Address.findOne({ _id: shippingAddressId, user: req.user._id });
//   if (!shippingAddress) throw ApiError.badRequest('Invalid shipping address');
//   const billingAddress = billingAddressId
//     ? await Address.findOne({ _id: billingAddressId, user: req.user._id })
//     : shippingAddress;

//   // --- Server-side revalidation pass -------------------------------------
//   // Never trust the cart document blindly at checkout: it may have been
//   // built up over a long session, or hit directly via the API bypassing
//   // the cart routes' own safeguards. Re-derive everything that affects
//   // money from the database, collect any problems, and — if there are
//   // any — persist the corrected cart and stop so the customer can review
//   // it before paying, instead of silently charging a different amount.
//   const issues = [];

//   const removedComboItems = await revalidateCombos(cart);
//   if (removedComboItems.length) {
//     issues.push(
//       `These bundle offers are no longer valid and were removed from your cart: ${removedComboItems.join(', ')}.`
//     );
//   }

//   const couponNote = await revalidateCoupon(cart, req.user);
//   if (couponNote) issues.push(couponNote);

//   const { unavailable, priceChanged } = await revalidateStockAndPricing(cart);
//   issues.push(...unavailable);
//   if (priceChanged.length) {
//     issues.push(`The price of the following item(s) changed since you added them: ${priceChanged.join(', ')}.`);
//   }

//   if (issues.length) {
//     await cart.save();
//     throw ApiError.conflict(`Your cart needed to be updated before checkout. ${issues.join(' ')} Please review your cart and try again.`);
//   }
//   // -------------------------------------------------------------------------

//   const { activeItems, subtotal, discount, shippingCost, tax, grandTotal, rewardPointsDiscount, rewardPointsRedeemed } =
//     computeOrderTotals(cart, redeemPoints, req.user.rewardPoints);

//   // FIX: check wallet balance BEFORE reserving any stock — no reason to
//   // lock inventory for an order that can't possibly be paid for.
//   if (paymentMethod === 'wallet' && req.user.walletBalance < grandTotal) {
//     throw ApiError.badRequest('Insufficient wallet balance for this order');
//   }

//   const orderItems = activeItems.map((i) => ({
//     product: i.product,
//     variantId: i.variantId,
//     name: i.name,
//     image: i.image,
//     sku: i.sku,
//     price: i.price,
//     quantity: i.quantity,
//     subtotal: i.price * i.quantity,
//   }));

//   const addressSnapshot = (addr) => ({
//     fullName: addr.fullName,
//     phone: addr.phone,
//     addressLine1: addr.addressLine1,
//     addressLine2: addr.addressLine2,
//     landmark: addr.landmark,
//     city: addr.city,
//     state: addr.state,
//     country: addr.country,
//     pincode: addr.pincode,
//   });

//   // FIX: stock is now reserved atomically, per item, BEFORE the order
//   // document is created — and rolled back automatically if any single
//   // item can't be reserved (e.g. someone else bought the last unit a
//   // moment ago). Previously stock was reserved with two unguarded $inc
//   // calls AFTER the order already existed, which meant (a) concurrent
//   // checkouts could both "succeed" and oversell the same unit, and
//   // (b) a partial failure mid-loop could leave an order on record with
//   // stock it never actually locked.
//   const failedItemName = await reserveStockForOrderItems(orderItems);
//   if (failedItemName) {
//     throw ApiError.conflict(
//       `Sorry, "${failedItemName}" just went out of stock before we could confirm your order. Please review your cart and try again.`
//     );
//   }

//   let order;
//   try {
//     order = await Order.create({
//       customer: req.user._id,
//       items: orderItems,
//       shippingAddress: addressSnapshot(shippingAddress),
//       billingAddress: addressSnapshot(billingAddress),
//       subtotal,
//       discount,
//       couponCode: cart.coupon?.code || null,
//       rewardPointsRedeemed,
//       rewardPointsDiscount,
//       tax,
//       shippingCost,
//       grandTotal,
//       paymentMethod,
//       paymentStatus: 'pending',
//       orderStatus: 'placed',
//       timeline: [{ status: 'placed', description: 'Order placed by customer' }],
//       notes,
//       giftWrap,
//       giftMessage,
//     });
//   } catch (err) {
//     // Order document failed to save (validation error, DB hiccup, etc.) —
//     // release the stock we just reserved instead of leaving it locked
//     // against an order that doesn't exist.
//     for (const item of orderItems) {
//       // eslint-disable-next-line no-await-in-loop
//       await Product.releaseStock(item.product, item.variantId, item.quantity).catch(() => {});
//     }
//     throw err;
//   }

//   if (paymentMethod === 'cod' || paymentMethod === 'wallet') {
//     if (paymentMethod === 'wallet') {
//       try {
//         const { applyWalletTransaction } = require('./loyaltyController');
//         await applyWalletTransaction(req.user._id, {
//           type: 'debit',
//           amount: grandTotal,
//           reason: 'order_payment',
//           description: `Payment for order ${order.orderNumber}`,
//           order: order._id,
//         });
//         order.paymentStatus = 'paid';
//         await order.save();
//       } catch (err) {
//         // Wallet debit failed after the order and stock reservation were
//         // already created (e.g. a concurrent request drained the wallet
//         // between our earlier balance check and now). Release the stock
//         // and mark the order as failed instead of leaving a "placed"
//         // order with no successful payment behind it.
//         order.paymentStatus = 'failed';
//         order.orderStatus = 'cancelled';
//         order.cancelReason = 'Wallet payment failed';
//         order.cancelledAt = new Date();
//         order.timeline.push({ status: 'cancelled', description: 'Wallet payment failed at checkout' });
//         await order.save();
//         await releaseReservedStock(order);
//         throw ApiError.badRequest('Wallet payment failed. Please try again.');
//       }
//     }
//     await finalizeSuccessfulOrder(order, req.user);
//     return sendSuccess(
//       res,
//       201,
//       `Order placed successfully (${paymentMethod === 'wallet' ? 'Paid via Wallet' : 'Cash on Delivery'})`,
//       { order }
//     );
//   }

//   try {
//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(grandTotal * 100), // paise
//       currency: 'INR',
//       receipt: order.orderNumber,
//       notes: { orderId: order._id.toString() },
//     });

//     order.razorpayOrderId = razorpayOrder.id;
//     await order.save();

//     await PaymentLog.create({
//       order: order._id,
//       user: req.user._id,
//       razorpayOrderId: razorpayOrder.id,
//       amount: grandTotal,
//       status: 'created',
//     });

//     return sendSuccess(res, 201, 'Checkout initiated', {
//       order,
//       razorpay: {
//         orderId: razorpayOrder.id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         keyId: process.env.RAZORPAY_KEY_ID,
//       },
//     });
//   } catch (err) {
//     // FIX: if the Razorpay order creation call itself fails (network
//     // issue, bad credentials, Razorpay outage), the order was already
//     // created and stock already reserved with no way for the customer to
//     // ever complete or retry payment against it. Release the stock and
//     // fail the order cleanly instead of leaving inventory locked forever.
//     order.paymentStatus = 'failed';
//     order.orderStatus = 'cancelled';
//     order.cancelReason = 'Payment gateway order creation failed';
//     order.cancelledAt = new Date();
//     order.timeline.push({ status: 'cancelled', description: 'Failed to initiate payment gateway order' });
//     await order.save();
//     await releaseReservedStock(order);
//     logger.error(`Razorpay order creation failed for ${order.orderNumber}: ${err.message}`);
//     throw ApiError.internal('Could not initiate payment. Please try again.');
//   }
// });

// /**
//  * @route POST /api/v1/orders/verify-payment
//  * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
//  */
// const verifyPayment = asyncHandler(async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//   if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//     throw ApiError.badRequest('Missing Razorpay payment details');
//   }

//   const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, customer: req.user._id });
//   if (!order) throw ApiError.notFound('Order not found for this payment');

//   // FIX: verifying an already-verified order (e.g. the frontend retries
//   // this call, or the user double-submits) must be a harmless no-op, not
//   // re-run finalizeSuccessfulOrder a second time — which would re-credit
//   // reward points, re-increment coupon usage, and re-send notifications.
//   if (order.paymentStatus === 'paid') {
//     return sendSuccess(res, 200, 'Payment already verified. Order confirmed!', { order });
//   }

//   const expectedSignature = crypto
//     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//     .digest('hex');

//   const isValid = expectedSignature === razorpay_signature;

//   await PaymentLog.create({
//     order: order._id,
//     user: req.user._id,
//     razorpayOrderId: razorpay_order_id,
//     razorpayPaymentId: razorpay_payment_id,
//     razorpaySignature: razorpay_signature,
//     amount: order.grandTotal,
//     status: isValid ? 'captured' : 'failed',
//     errorReason: isValid ? null : 'Signature verification failed',
//   });

//   if (!isValid) {
//     order.paymentStatus = 'failed';
//     await order.save();
//     throw ApiError.badRequest('Payment verification failed. Please try again or contact support.');
//   }

//   order.paymentStatus = 'paid';
//   order.razorpayPaymentId = razorpay_payment_id;
//   order.razorpaySignature = razorpay_signature;
//   order.orderStatus = 'confirmed';
//   order.timeline.push({ status: 'confirmed', description: 'Payment verified successfully' });
//   await order.save();

//   await finalizeSuccessfulOrder(order, req.user);

//   return sendSuccess(res, 200, 'Payment verified successfully. Order confirmed!', { order });
// });

// /**
//  * @route POST /api/v1/orders/payment-failed
//  * Called by the frontend when Razorpay checkout reports a failure, so we
//  * can release reserved stock instead of leaving it locked indefinitely.
//  */
// const handlePaymentFailure = asyncHandler(async (req, res) => {
//   const { razorpay_order_id, error } = req.body;
//   const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, customer: req.user._id });
//   if (!order) throw ApiError.notFound('Order not found');

//   // FIX: if payment already succeeded (e.g. a delayed/duplicate failure
//   // callback arrives after verify-payment already ran), don't cancel a
//   // paid order or double-release its stock.
//   if (order.paymentStatus === 'paid') {
//     return sendSuccess(res, 200, 'Payment failure recorded');
//   }

//   order.paymentStatus = 'failed';
//   order.timeline.push({ status: 'placed', description: `Payment failed: ${error?.description || 'Unknown error'}` });
//   await order.save();

//   await releaseReservedStock(order);

//   await PaymentLog.create({
//     order: order._id,
//     user: req.user._id,
//     razorpayOrderId: razorpay_order_id,
//     amount: order.grandTotal,
//     status: 'failed',
//     errorReason: error?.description || 'Payment failed',
//   });

//   return sendSuccess(res, 200, 'Payment failure recorded');
// });

// /**
//  * @route GET /api/v1/orders/my
//  */
// const getMyOrders = asyncHandler(async (req, res) => {
//   const page = Math.max(1, parseInt(req.query.page, 10) || 1);
//   const limit = Math.min(50, parseInt(req.query.limit, 10) || 10);
//   const filter = { customer: req.user._id };
//   if (req.query.status) filter.orderStatus = req.query.status;

//   const [orders, total] = await Promise.all([
//     Order.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit),
//     Order.countDocuments(filter),
//   ]);

//   return sendSuccess(res, 200, 'Orders fetched', { orders }, { page, limit, total, totalPages: Math.ceil(total / limit) });
// });

// /**
//  * @route GET /api/v1/orders/:id
//  */
// const getOrderById = asyncHandler(async (req, res) => {
//   const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, customer: req.user._id };
//   const order = await Order.findOne(filter).populate('customer', 'firstName lastName email phone');
//   if (!order) throw ApiError.notFound('Order not found');
//   return sendSuccess(res, 200, 'Order fetched', { order });
// });

// /**
//  * @route GET /api/v1/orders/:id/invoice
//  * Streams a generated PDF invoice.
//  */
// const downloadInvoice = asyncHandler(async (req, res) => {
//   const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, customer: req.user._id };
//   const order = await Order.findOne(filter).populate('customer', 'firstName lastName email');
//   if (!order) throw ApiError.notFound('Order not found');

//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
//   generateInvoicePdf(res, order);
// });

// /**
//  * @route POST /api/v1/orders/:id/cancel
//  * Body: { reason }
//  */
// const cancelOrder = asyncHandler(async (req, res) => {
//   const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
//   if (!order) throw ApiError.notFound('Order not found');

//   if (['delivered', 'cancelled', 'refunded'].includes(order.orderStatus)) {
//     throw ApiError.conflict(`Order cannot be cancelled once it is ${order.orderStatus}`);
//   }

//   order.orderStatus = 'cancelled';
//   order.cancelReason = req.body.reason || 'Cancelled by customer';
//   order.cancelledAt = new Date();
//   order.timeline.push({ status: 'cancelled', description: order.cancelReason });
//   await order.save();

//   await releaseReservedStock(order);

//   if (order.paymentStatus === 'paid') {
//     order.paymentStatus = 'refunded'; // actual Razorpay refund API call happens in the admin refund flow
//     order.timeline.push({ status: 'refunded', description: 'Refund initiated for cancelled order' });
//     await order.save();
//   }

//   await notifyUser(order.customer, {
//     type: 'order',
//     title: 'Order Cancelled',
//     message: `Your order ${order.orderNumber} has been cancelled.`,
//     link: `/dashboard/orders/${order._id}`,
//   });

//   return sendSuccess(res, 200, 'Order cancelled successfully', { order });
// });

// module.exports = {
//   initiateCheckout,
//   verifyPayment,
//   handlePaymentFailure,
//   getMyOrders,
//   getOrderById,
//   downloadInvoice,
//   cancelOrder,
//   releaseReservedStock,
//   finalizeSuccessfulOrder,
// };


const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const Product = require('../models/Product');
const User = require('../models/User');
const CouponUsage = require('../models/CouponUsage');
const Coupon = require('../models/Coupon');
const PaymentLog = require('../models/PaymentLog');
const { ComboOffer } = require('../models/Promotions');
const razorpay = require('../config/razorpay');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { generateInvoicePdf } = require('../utils/invoiceGenerator');
const { sendOrderStatusEmail, sendLowStockAlertEmail } = require('../services/emailService');
const { notifyUser, notifyAdmins } = require('../services/notificationService');
const logger = require('../utils/logger');

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_COST = 79;
const TAX_RATE = 0; // GST handling can be enabled per-product via taxPercentage; kept simple here
const REWARD_POINT_VALUE = 0.5; // ₹ value of 1 reward point when redeemed

/**
 * Re-derives every combo/bundle/hamper group in the cart against its live
 * offer document and strips out any group that no longer checks out:
 *   - the offer was deactivated, deleted, or fell outside its schedule
 *   - a bundle_discount group is missing a product or has mismatched
 *     per-product quantities (i.e. someone removed/added one product
 *     without the rest — see cartController for how this is normally
 *     prevented, this is the server-side backstop for direct API calls)
 *   - a buy_x_get_y group's free item quantity doesn't match the eligible
 *     item's quantity at the offer's ratio, or the free item isn't ₹0
 *
 * Mutates cart.items in place and returns the names of any removed items
 * so the caller can surface a clear message. Does NOT save the cart —
 * callers decide when to persist.
 */
const revalidateCombos = async (cart) => {
  const activeItems = cart.items.filter((i) => !i.savedForLater);
  const groupIds = [...new Set(activeItems.filter((i) => i.comboGroupId).map((i) => i.comboGroupId))];
  if (!groupIds.length) return [];

  const removedItemNames = [];

  for (const groupId of groupIds) {
    const groupItems = activeItems.filter((i) => i.comboGroupId === groupId);
    const offerType = groupItems[0].offerType;
    const offerRefId = groupItems[0].offerRef;

    let valid = true;

    if (offerType === 'bundle_discount' || offerType === 'buy_x_get_y') {
      const offer = offerRefId
        ? await ComboOffer.findById(offerRefId).populate('products eligibleProduct freeProduct')
        : null;

      const now = new Date();
      const offerLive =
        !!offer &&
        offer.status === 'active' &&
        offer.startDate <= now &&
        (!offer.endDate || offer.endDate >= now);

      if (!offerLive) {
        valid = false;
      } else if (offerType === 'bundle_discount') {
        const expectedIds = offer.products.map((p) => p._id.toString()).sort();
        const groupIds2 = groupItems.map((i) => i.product.toString()).sort();
        const quantities = groupItems.map((i) => i.quantity);
        const sameSet = JSON.stringify(expectedIds) === JSON.stringify(groupIds2);
        const sameQty = quantities.every((q) => q === quantities[0]);
        valid = sameSet && sameQty && groupItems.length === offer.products.length;
      } else {
        const eligibleItem = groupItems.find((i) => i.comboRole === 'eligible');
        const freeItem = groupItems.find((i) => i.comboRole === 'free');
        const expectedFreeId = (offer.freeProduct || offer.eligibleProduct)._id.toString();

        valid =
          !!eligibleItem &&
          !!freeItem &&
          eligibleItem.product.toString() === offer.eligibleProduct._id.toString() &&
          freeItem.product.toString() === expectedFreeId &&
          freeItem.price === 0 &&
          offer.buyQuantity > 0 &&
          eligibleItem.quantity % offer.buyQuantity === 0 &&
          freeItem.quantity === (eligibleItem.quantity / offer.buyQuantity) * offer.getQuantity;
      }
    }
    // offerType === 'hamper' is a single bespoke line item — nothing to
    // cross-check beyond it simply existing, which it does by definition.

    if (!valid) {
      groupItems.forEach((i) => removedItemNames.push(i.name));
      cart.items = cart.items.filter((i) => i.comboGroupId !== groupId);
    }
  }

  return removedItemNames;
};

/**
 * Re-derives the applied coupon's discount from the CURRENT cart contents
 * and the coupon's CURRENT rules, instead of trusting cart.coupon.discountAmount
 * (which is only ever set at the moment "Apply" was clicked and never
 * revisited). Catches: cart shrinking below minPurchaseAmount after a
 * coupon was applied, the coupon being deactivated/expired/used up in the
 * meantime, and the applicableProducts/applicableCategories/firstOrderOnly
 * restrictions that must hold at checkout, not just at apply-time.
 *
 * Mutates cart.coupon in place. Returns a user-facing note if the coupon
 * was removed, or null if it's still valid (in which case the discount
 * amount has been refreshed).
 */
const revalidateCoupon = async (cart, user) => {
  if (!cart.coupon?.code) return null;

  const dropCoupon = (reason) => {
    cart.coupon = { code: null, discountAmount: 0 };
    return reason;
  };

  const coupon = await Coupon.findOne({ code: cart.coupon.code });
  if (!coupon || !coupon.isCurrentlyValid()) {
    return dropCoupon('Your coupon is no longer valid and was removed from your cart.');
  }

  if (coupon.membershipOnly && user.membership === 'basic') {
    return dropCoupon('Your coupon requires premium membership and was removed from your cart.');
  }

  if (coupon.firstOrderOnly) {
    const hasPriorOrder = await Order.exists({ customer: user._id, orderStatus: { $ne: 'cancelled' } });
    if (hasPriorOrder) return dropCoupon('Your coupon is for first-time orders only and was removed from your cart.');
  }

  const usageCount = await CouponUsage.countDocuments({ coupon: coupon._id, user: user._id });
  if (usageCount >= coupon.perUserLimit) {
    return dropCoupon('You have already used this coupon and it was removed from your cart.');
  }

  const activeItems = cart.items.filter((i) => !i.savedForLater);
  const eligibleItems = activeItems.filter((i) => !i.offerType);

  let eligibleSubtotal;
  if (coupon.applicableProducts?.length || coupon.applicableCategories?.length) {
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
  } else {
    eligibleSubtotal = eligibleItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  if (eligibleSubtotal < coupon.minPurchaseAmount) {
    return dropCoupon(
      `Your cart no longer meets the ₹${coupon.minPurchaseAmount} minimum required for your coupon, so it was removed.`
    );
  }

  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = (eligibleSubtotal * coupon.value) / 100;
    if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
  } else if (coupon.type === 'fixed') {
    discountAmount = coupon.value;
  }
  discountAmount = Math.min(discountAmount, eligibleSubtotal);

  cart.coupon.discountAmount = Math.round(discountAmount);
  return null;
};

/**
 * Checks every active cart item against the live Product/variant: stock
 * availability (as before) plus PRICE. Previously a cart item's price was
 * frozen the moment it was added and never re-checked, so a product price
 * change after add-to-cart had no effect on what the customer paid.
 * Combo/bundle/free items are intentionally off-catalogue priced and are
 * left untouched here — see revalidateCombos for their own integrity check.
 *
 * Mutates item prices in place for plain items where they've drifted.
 * Returns { unavailable: string[], priceChanged: string[] }.
 */
const revalidateStockAndPricing = async (cart) => {
  const activeItems = cart.items.filter((i) => !i.savedForLater);
  const unavailable = [];
  const priceChanged = [];

  for (const item of activeItems) {
    const product = await Product.findById(item.product);
    if (!product || product.status !== 'published' || product.deletedAt) {
      unavailable.push(`${item.name} is no longer available`);
      continue;
    }

    let available = product.stockQuantity - product.reservedStock;
    let livePrice = product.price;

    if (item.variantId) {
      const variant = product.variants.id(item.variantId);
      if (!variant) {
        unavailable.push(`A variant of ${item.name} is no longer available`);
        continue;
      }
      available = variant.stock;
      livePrice = variant.price;
    }

    if (available < item.quantity) {
      unavailable.push(`Only ${available} unit(s) of ${item.name} available`);
      continue;
    }

    if (!item.offerType && item.price !== livePrice) {
      item.price = livePrice;
      item.mrp = item.variantId ? item.mrp : product.comparePrice ?? item.mrp;
      priceChanged.push(item.name);
    }
  }

  return { unavailable, priceChanged };
};

/**
 * Recomputes cart totals server-side (never trusts client-submitted totals).
 * Assumes the cart has already been through revalidateCombos /
 * revalidateCoupon / revalidateStockAndPricing.
 * @param {object} cart
 * @param {number} redeemPoints optional reward points the customer wants to redeem
 * @param {number} availablePoints the customer's current reward point balance
 */
const computeOrderTotals = (cart, redeemPoints = 0, availablePoints = 0) => {
  const activeItems = cart.items.filter((i) => !i.savedForLater);
  if (!activeItems.length) throw ApiError.badRequest('Your cart is empty');

  const subtotal = activeItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = cart.coupon?.discountAmount || 0;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * TAX_RATE);

  const pointsToRedeem = Math.max(0, Math.min(redeemPoints, availablePoints));
  const maxRedeemableValue = Math.max(0, taxableAmount + tax + shippingCost);
  let rewardPointsDiscount = Math.round(pointsToRedeem * REWARD_POINT_VALUE);
  rewardPointsDiscount = Math.min(rewardPointsDiscount, maxRedeemableValue);
  const actualPointsRedeemed = Math.round(rewardPointsDiscount / REWARD_POINT_VALUE);

  const grandTotal = Math.max(0, taxableAmount + tax + shippingCost - rewardPointsDiscount);

  return {
    activeItems,
    subtotal,
    discount,
    shippingCost,
    tax,
    grandTotal,
    rewardPointsDiscount,
    rewardPointsRedeemed: actualPointsRedeemed,
  };
};

/**
 * FIX: previously this used raw, unguarded Product.updateOne({ $inc: ... })
 * calls, which can never fail — meaning reservedStock / variant stock
 * could be driven negative under concurrent order cancellations or
 * repeated webhook retries (e.g. Razorpay retrying a failed-payment
 * webhook). Now routed through Product.releaseStock, which floors at 0
 * atomically and is safe to call more than once for the same order.
 */
const releaseReservedStock = async (order) => {
  for (const item of order.items) {
    // eslint-disable-next-line no-await-in-loop
    await Product.releaseStock(item.product, item.variantId, item.quantity).catch((e) =>
      logger.error(`Failed to release stock for order ${order.orderNumber}, item ${item.product}: ${e.message}`)
    );
  }
};

/**
 * Shared post-payment success logic: clears cart, records coupon usage,
 * sends notifications/emails, checks for low-stock alerting.
 *
 * options.clearCart (default true): pass false when finalizing later than
 * checkout time (e.g. admin confirming a UPI payment hours afterwards) so
 * a NEW cart the customer built in the meantime isn't wiped.
 */
const finalizeSuccessfulOrder = async (order, user, { clearCart = true } = {}) => {
  if (clearCart) {
    await Cart.findOneAndUpdate({ user: order.customer }, { items: [], coupon: { code: null, discountAmount: 0 } });
  }

  if (order.couponCode) {
    const coupon = await Coupon.findOne({ code: order.couponCode });
    if (coupon) {
      coupon.usageCount += 1;
      await coupon.save();
      await CouponUsage.create({
        coupon: coupon._id,
        user: order.customer,
        order: order._id,
        discountAmount: order.discount,
      });
    }
  }

  if (order.rewardPointsRedeemed > 0) {
    const result = await User.findOneAndUpdate(
      { _id: order.customer, rewardPoints: { $gte: order.rewardPointsRedeemed } },
      { $inc: { rewardPoints: -order.rewardPointsRedeemed } },
      { new: true }
    );
    if (!result) {
      // Balance changed out from under us between checkout and now (should
      // be rare — computeOrderTotals already capped against the live
      // balance moments earlier). Don't fail the order over it; just log
      // it for follow-up, since the order and payment are already final.
      logger.error(
        `Reward point deduction skipped for order ${order.orderNumber}: user ${order.customer} no longer had ${order.rewardPointsRedeemed} points`
      );
    }
  }

  // Update lifetime spend and recalculate membership tier
  const customer = await User.findById(order.customer);
  if (customer) {
    customer.lifetimeSpend = (customer.lifetimeSpend || 0) + order.grandTotal;
    await customer.save();
    const { recalculateMembership, processReferralReward } = require('./membershipController');
    await recalculateMembership(order.customer).catch((e) => logger.error(`Membership recalculation failed: ${e.message}`));
    await processReferralReward(order.customer).catch((e) => logger.error(`Referral reward failed: ${e.message}`));
  }

  await notifyUser(order.customer, {
    type: 'order',
    title: 'Order Placed',
    message: `Your order ${order.orderNumber} has been placed successfully.`,
    link: `/dashboard/orders/${order._id}`,
  });

  await notifyAdmins({
    type: 'order',
    title: 'New Order Received',
    message: `Order ${order.orderNumber} was placed for ₹${order.grandTotal}.`,
    link: `/admin/orders/${order._id}`,
  });

  if (user?.email) {
    sendOrderStatusEmail(user.email, {
      firstName: user.firstName,
      orderNumber: order.orderNumber,
      status: 'placed',
    }).catch((e) => logger.error(e.message));
  }

  for (const item of order.items) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findById(item.product);
    if (product && product.stockQuantity - product.reservedStock <= product.minStockLevel) {
      notifyAdmins({
        type: 'restock',
        title: 'Low Stock Alert',
        message: `${product.name} is running low on stock.`,
        link: `/admin/products/${product._id}`,
      }).catch(() => {});
      if (process.env.ADMIN_EMAILS) {
        sendLowStockAlertEmail(process.env.ADMIN_EMAILS.split(',')[0].trim(), {
          productName: product.name,
          sku: product.sku,
          availableStock: product.stockQuantity - product.reservedStock,
        }).catch((e) => logger.error(e.message));
      }
    }
  }
};

/**
 * Attempts to atomically reserve stock for every item in `orderItems`.
 * Stops at the first item that can't be reserved (insufficient live
 * stock), and rolls back everything reserved so far in this attempt
 * before returning. This is what actually prevents overselling under
 * concurrent checkouts — see Product.reserveStock for why this is safe
 * without a multi-document transaction.
 *
 * @returns {Promise<string|null>} the name of the item that failed, or
 *   null if every item was reserved successfully.
 */
const reserveStockForOrderItems = async (orderItems) => {
  const reserved = [];

  for (const item of orderItems) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await Product.reserveStock(item.product, item.variantId, item.quantity);
    if (!ok) {
      // Roll back everything reserved so far in this attempt.
      for (const done of reserved) {
        // eslint-disable-next-line no-await-in-loop
        await Product.releaseStock(done.product, done.variantId, done.quantity).catch((e) =>
          logger.error(`Failed to roll back stock reservation: ${e.message}`)
        );
      }
      return item.name;
    }
    reserved.push(item);
  }

  return null;
};

/**
 * @route POST /api/v1/orders/checkout
 * Body: { shippingAddressId, billingAddressId, paymentMethod, notes, giftWrap, giftMessage }
 * Creates a pending Order. For razorpay it also creates a Razorpay order;
 * for upi_qr it returns the order so the frontend can show a dynamic QR.
 */
const initiateCheckout = asyncHandler(async (req, res) => {
  const {
    shippingAddressId,
    billingAddressId,
    paymentMethod = 'razorpay',
    notes = '',
    giftWrap = false,
    giftMessage = '',
    redeemPoints = 0,
  } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || !cart.items.length) throw ApiError.badRequest('Your cart is empty');

  const shippingAddress = await Address.findOne({ _id: shippingAddressId, user: req.user._id });
  if (!shippingAddress) throw ApiError.badRequest('Invalid shipping address');
  const billingAddress = billingAddressId
    ? await Address.findOne({ _id: billingAddressId, user: req.user._id })
    : shippingAddress;

  // --- Server-side revalidation pass -------------------------------------
  const issues = [];

  const removedComboItems = await revalidateCombos(cart);
  if (removedComboItems.length) {
    issues.push(
      `These bundle offers are no longer valid and were removed from your cart: ${removedComboItems.join(', ')}.`
    );
  }

  const couponNote = await revalidateCoupon(cart, req.user);
  if (couponNote) issues.push(couponNote);

  const { unavailable, priceChanged } = await revalidateStockAndPricing(cart);
  issues.push(...unavailable);
  if (priceChanged.length) {
    issues.push(`The price of the following item(s) changed since you added them: ${priceChanged.join(', ')}.`);
  }

  if (issues.length) {
    await cart.save();
    throw ApiError.conflict(`Your cart needed to be updated before checkout. ${issues.join(' ')} Please review your cart and try again.`);
  }
  // -------------------------------------------------------------------------

  const { activeItems, subtotal, discount, shippingCost, tax, grandTotal, rewardPointsDiscount, rewardPointsRedeemed } =
    computeOrderTotals(cart, redeemPoints, req.user.rewardPoints);

  // Check wallet balance BEFORE reserving any stock.
  if (paymentMethod === 'wallet' && req.user.walletBalance < grandTotal) {
    throw ApiError.badRequest('Insufficient wallet balance for this order');
  }

  const orderItems = activeItems.map((i) => ({
    product: i.product,
    variantId: i.variantId,
    name: i.name,
    image: i.image,
    sku: i.sku,
    price: i.price,
    quantity: i.quantity,
    subtotal: i.price * i.quantity,
  }));

  const addressSnapshot = (addr) => ({
    fullName: addr.fullName,
    phone: addr.phone,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2,
    landmark: addr.landmark,
    city: addr.city,
    state: addr.state,
    country: addr.country,
    pincode: addr.pincode,
  });

  const failedItemName = await reserveStockForOrderItems(orderItems);
  if (failedItemName) {
    throw ApiError.conflict(
      `Sorry, "${failedItemName}" just went out of stock before we could confirm your order. Please review your cart and try again.`
    );
  }

  let order;
  try {
    order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      shippingAddress: addressSnapshot(shippingAddress),
      billingAddress: addressSnapshot(billingAddress),
      subtotal,
      discount,
      couponCode: cart.coupon?.code || null,
      rewardPointsRedeemed,
      rewardPointsDiscount,
      tax,
      shippingCost,
      grandTotal,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'placed',
      timeline: [{ status: 'placed', description: 'Order placed by customer' }],
      notes,
      giftWrap,
      giftMessage,
    });
  } catch (err) {
    for (const item of orderItems) {
      // eslint-disable-next-line no-await-in-loop
      await Product.releaseStock(item.product, item.variantId, item.quantity).catch(() => {});
    }
    throw err;
  }

  // ---------------- UPI QR (manual verification) ----------------
  if (paymentMethod === 'upi_qr') {
    order.paymentStatus = 'processing'; // = awaiting manual UPI verification
    order.timeline.push({ status: 'placed', description: 'Awaiting UPI payment verification' });
    await order.save();

    // Clear the cart now so the same items can't be checked out twice.
    // Coupon usage, reward points, lifetime spend etc. are applied when
    // the admin confirms the payment (see markOrderPaid).
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: { code: null, discountAmount: 0 } });

    await notifyAdmins({
      type: 'order',
      title: 'UPI Payment Pending',
      message: `Order ${order.orderNumber} (₹${order.grandTotal}) is awaiting UPI payment verification.`,
      link: `/admin/orders/${order._id}`,
    }).catch(() => {});

    return sendSuccess(res, 201, 'Order created. Awaiting payment verification', { order });
  }

  if (paymentMethod === 'cod' || paymentMethod === 'wallet') {
    if (paymentMethod === 'wallet') {
      try {
        const { applyWalletTransaction } = require('./loyaltyController');
        await applyWalletTransaction(req.user._id, {
          type: 'debit',
          amount: grandTotal,
          reason: 'order_payment',
          description: `Payment for order ${order.orderNumber}`,
          order: order._id,
        });
        order.paymentStatus = 'paid';
        await order.save();
      } catch (err) {
        order.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
        order.cancelReason = 'Wallet payment failed';
        order.cancelledAt = new Date();
        order.timeline.push({ status: 'cancelled', description: 'Wallet payment failed at checkout' });
        await order.save();
        await releaseReservedStock(order);
        throw ApiError.badRequest('Wallet payment failed. Please try again.');
      }
    }
    await finalizeSuccessfulOrder(order, req.user);
    return sendSuccess(
      res,
      201,
      `Order placed successfully (${paymentMethod === 'wallet' ? 'Paid via Wallet' : 'Cash on Delivery'})`,
      { order }
    );
  }

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(grandTotal * 100), // paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId: order._id.toString() },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    await PaymentLog.create({
      order: order._id,
      user: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount: grandTotal,
      status: 'created',
    });

    return sendSuccess(res, 201, 'Checkout initiated', {
      order,
      razorpay: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    order.paymentStatus = 'failed';
    order.orderStatus = 'cancelled';
    order.cancelReason = 'Payment gateway order creation failed';
    order.cancelledAt = new Date();
    order.timeline.push({ status: 'cancelled', description: 'Failed to initiate payment gateway order' });
    await order.save();
    await releaseReservedStock(order);
    logger.error(`Razorpay order creation failed for ${order.orderNumber}: ${err.message}`);
    throw ApiError.internal('Could not initiate payment. Please try again.');
  }
});

/**
 * @route POST /api/v1/orders/verify-payment
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw ApiError.badRequest('Missing Razorpay payment details');
  }

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, customer: req.user._id });
  if (!order) throw ApiError.notFound('Order not found for this payment');

  if (order.paymentStatus === 'paid') {
    return sendSuccess(res, 200, 'Payment already verified. Order confirmed!', { order });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isValid = expectedSignature === razorpay_signature;

  await PaymentLog.create({
    order: order._id,
    user: req.user._id,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    amount: order.grandTotal,
    status: isValid ? 'captured' : 'failed',
    errorReason: isValid ? null : 'Signature verification failed',
  });

  if (!isValid) {
    order.paymentStatus = 'failed';
    await order.save();
    throw ApiError.badRequest('Payment verification failed. Please try again or contact support.');
  }

  order.paymentStatus = 'paid';
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  order.orderStatus = 'confirmed';
  order.timeline.push({ status: 'confirmed', description: 'Payment verified successfully' });
  await order.save();

  await finalizeSuccessfulOrder(order, req.user);

  return sendSuccess(res, 200, 'Payment verified successfully. Order confirmed!', { order });
});

/**
 * @route POST /api/v1/orders/payment-failed
 * Called by the frontend when Razorpay checkout reports a failure, so we
 * can release reserved stock instead of leaving it locked indefinitely.
 */
const handlePaymentFailure = asyncHandler(async (req, res) => {
  const { razorpay_order_id, error } = req.body;
  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, customer: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');

  if (order.paymentStatus === 'paid') {
    return sendSuccess(res, 200, 'Payment failure recorded');
  }

  order.paymentStatus = 'failed';
  order.timeline.push({ status: 'placed', description: `Payment failed: ${error?.description || 'Unknown error'}` });
  await order.save();

  await releaseReservedStock(order);

  await PaymentLog.create({
    order: order._id,
    user: req.user._id,
    razorpayOrderId: razorpay_order_id,
    amount: order.grandTotal,
    status: 'failed',
    errorReason: error?.description || 'Payment failed',
  });

  return sendSuccess(res, 200, 'Payment failure recorded');
});

/**
 * @route PATCH /api/v1/orders/:id/mark-paid   (admin only)
 * Confirms a manual UPI QR payment after the admin has verified the money
 * actually arrived (WhatsApp screenshot + bank/UPI app).
 * The atomic findOneAndUpdate guarantees only one click can ever win, so
 * finalizeSuccessfulOrder (coupon usage, points, notifications) runs once.
 */
const markOrderPaid = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') throw ApiError.forbidden('Admin access required');

  const order = await Order.findOneAndUpdate(
    {
      _id: req.params.id,
      paymentMethod: 'upi_qr',
      paymentStatus: 'processing',
      orderStatus: { $nin: ['cancelled', 'refunded'] },
    },
    {
      $set: {
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        paidAt: new Date(),
        paymentVerifiedBy: req.user._id,
      },
      $push: {
        timeline: { status: 'confirmed', description: 'UPI payment verified by admin', updatedBy: req.user._id },
      },
    },
    { new: true }
  );
  if (!order) throw ApiError.conflict('Order not found, not a UPI order, or already verified/cancelled');

  const customer = await User.findById(order.customer);
  await finalizeSuccessfulOrder(order, customer, { clearCart: false });

  return sendSuccess(res, 200, 'Payment verified. Order confirmed.', { order });
});

/**
 * @route GET /api/v1/orders/my
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 10);
  const filter = { customer: req.user._id };
  if (req.query.status) filter.orderStatus = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return sendSuccess(res, 200, 'Orders fetched', { orders }, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

/**
 * @route GET /api/v1/orders/:id
 */
const getOrderById = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, customer: req.user._id };
  const order = await Order.findOne(filter).populate('customer', 'firstName lastName email phone');
  if (!order) throw ApiError.notFound('Order not found');
  return sendSuccess(res, 200, 'Order fetched', { order });
});

/**
 * @route GET /api/v1/orders/:id/invoice
 * Streams a generated PDF invoice.
 */
const downloadInvoice = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, customer: req.user._id };
  const order = await Order.findOne(filter).populate('customer', 'firstName lastName email');
  if (!order) throw ApiError.notFound('Order not found');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
  generateInvoicePdf(res, order);
});

/**
 * @route POST /api/v1/orders/:id/cancel
 * Body: { reason }
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');

  if (['delivered', 'cancelled', 'refunded'].includes(order.orderStatus)) {
    throw ApiError.conflict(`Order cannot be cancelled once it is ${order.orderStatus}`);
  }

  order.orderStatus = 'cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by customer';
  order.cancelledAt = new Date();
  order.timeline.push({ status: 'cancelled', description: order.cancelReason });
  await order.save();

  await releaseReservedStock(order);

  // Unpaid UPI order cancelled before the admin verified any payment
  if (order.paymentMethod === 'upi_qr' && order.paymentStatus === 'processing') {
    order.paymentStatus = 'cancelled';
    await order.save();
  }

  if (order.paymentStatus === 'paid') {
    order.paymentStatus = 'refunded'; // actual refund (Razorpay API / manual UPI refund) happens in the admin refund flow
    order.timeline.push({ status: 'refunded', description: 'Refund initiated for cancelled order' });
    await order.save();
  }

  await notifyUser(order.customer, {
    type: 'order',
    title: 'Order Cancelled',
    message: `Your order ${order.orderNumber} has been cancelled.`,
    link: `/dashboard/orders/${order._id}`,
  });

  return sendSuccess(res, 200, 'Order cancelled successfully', { order });
});

module.exports = {
  initiateCheckout,
  verifyPayment,
  handlePaymentFailure,
  markOrderPaid,
  getMyOrders,
  getOrderById,
  downloadInvoice,
  cancelOrder,
  releaseReservedStock,
  finalizeSuccessfulOrder,
};