

const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { generateSku, categoryCodeFromName } = require('../utils/skuGenerator');

const MAX_IMAGES_PER_PRODUCT = 4;

// Fields an admin is allowed to set directly on the top-level product doc.
// Deliberately excludes: sku, slug, ratingsAverage, ratingsCount, reservedStock,
// qrSerialNumber, deletedAt, createdBy, updatedBy, images, variants
// (those are either system-managed or handled through their own code paths).
const ADMIN_WRITABLE_FIELDS = [
  'name', 'shortDescription', 'longDescription', 'category', 'subCategory',
  'barcode', 'brand', 'price', 'comparePrice', 'costPrice', 'taxPercentage',
  'stockQuantity', 'minStockLevel', 'status',
  'isFeatured', 'isBestSeller', 'isNewArrival', 'isTrending', 'isLimitedEdition',
  'isFestivalProduct', 'isHandmade', 'isEcoFriendly', 'isMadeInIndia', 'isTribalArtisanProduct',
  'weight', 'dimensions', 'material', 'color', 'finish', 'packagingDetails', 'warranty',
  'returnPolicy', 'careInstructions', 'manufacturingProcess', 'estimatedDeliveryDays',
  'shippingCost', 'productOrigin', 'artisan', 'sustainabilityScore', 'tags', 'metaTitle',
  'metaDescription', 'metaKeywords', 'canonicalUrl', 'ogImage', 'searchKeywords',
  'relatedProducts', 'brochureUrl', 'isMultiWarehouseTracked',
];

// Fields allowed on a single variant subdocument via addVariant/updateVariant.
const VARIANT_WRITABLE_FIELDS = [
  'name',
  'sku',
  'price',
  'comparePrice',
  'stock',
  'weight',
  'dimensions',
  'status',
];

const pickFields = (body, allowed) => {
  const out = {};

  allowed.forEach((key) => {
    if (body[key] !== undefined) out[key] = body[key];
  });

  return out;
};

// Some fields arrive as JSON strings over multipart/form-data (FormData can't
// hold nested arrays/objects natively). Parse them back if present.
const parseJsonField = (value, fieldName) => {
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    throw ApiError.badRequest(`Invalid ${fieldName} format`);
  }
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const assertComparePriceValid = (price, comparePrice) => {
  if (
    comparePrice !== undefined &&
    comparePrice !== null &&
    comparePrice !== '' &&
    Number(comparePrice) < Number(price)
  ) {
    throw ApiError.badRequest(
      'Compare price (MRP) cannot be lower than the selling price'
    );
  }
};

/* -------------------------------------------------------------------------- */
/*                         TYPO-TOLERANT SEARCH                               */
/* -------------------------------------------------------------------------- */

/**
 * Calculate Levenshtein edit distance between two words.
 */
const levenshteinDistance = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  // Keep b as the shorter string to reduce memory usage.
  if (a.length < b.length) {
    [a, b] = [b, a];
  }

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];

    for (let j = 1; j <= b.length; j += 1) {
      const insertCost = current[j - 1] + 1;
      const deleteCost = previous[j] + 1;
      const replaceCost = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);

      current[j] = Math.min(insertCost, deleteCost, replaceCost);
    }

    previous = current;
  }

  return previous[b.length];
};

/**
 * Decide how many spelling mistakes we are willing to tolerate.
 */
const getMaxEditDistance = (word) => {
  const length = word.length;

  if (length <= 3) return 0;
  if (length <= 5) return 1;
  if (length <= 8) return 2;

  return 3;
};

/**
 * Extract individual words from product names/tags/search keywords.
 */
const addWordsToDictionary = (dictionary, value) => {
  if (!value) return;

  if (Array.isArray(value)) {
    value.forEach((item) => addWordsToDictionary(dictionary, item));
    return;
  }

  if (typeof value !== 'string') return;

  value
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}-]/gu, ''))
    .filter(Boolean)
    .forEach((word) => dictionary.add(word));
};

/**
 * Find the closest valid product-search word.
 */
const findClosestSearchWord = (word, dictionary) => {
  const normalizedWord = word.toLowerCase().trim();

  if (!normalizedWord || dictionary.has(normalizedWord)) {
    return normalizedWord;
  }

  const maxDistance = getMaxEditDistance(normalizedWord);

  // Very short words are not fuzzy corrected.
  if (maxDistance === 0) {
    return normalizedWord;
  }

  let bestWord = normalizedWord;
  let bestDistance = maxDistance + 1;

  for (const candidate of dictionary) {
    // Skip obviously different word lengths.
    if (Math.abs(candidate.length - normalizedWord.length) > maxDistance) {
      continue;
    }

    const distance = levenshteinDistance(normalizedWord, candidate);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestWord = candidate;

      // Exact match is the best possible result.
      if (distance === 0) break;
    }
  }

  return bestDistance <= maxDistance ? bestWord : normalizedWord;
};

/**
 * Correct spelling mistakes using words that actually exist in the
 * product catalog (names, tags, searchKeywords).
 */
const correctSearchQuery = async (query, baseFilter = {}) => {
  const words = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return query;

  // Remove the existing text search because we only want to use the
  // remaining filters to determine which products are relevant candidates.
  const candidateFilter = { ...baseFilter };
  delete candidateFilter.$text;

  const [names, tags, searchKeywords] = await Promise.all([
    Product.distinct('name', candidateFilter),
    Product.distinct('tags', candidateFilter),
    Product.distinct('searchKeywords', candidateFilter),
  ]);

  const dictionary = new Set();

  names.forEach((name) => addWordsToDictionary(dictionary, name));
  tags.forEach((tag) => addWordsToDictionary(dictionary, tag));
  searchKeywords.forEach((keyword) =>
    addWordsToDictionary(dictionary, keyword)
  );

  if (!dictionary.size) {
    return query;
  }

  const correctedWords = words.map((word) =>
    findClosestSearchWord(word, dictionary)
  );

  return correctedWords.join(' ');
};

/* -------------------------------------------------------------------------- */
/*                              CREATE PRODUCT                                */
/* -------------------------------------------------------------------------- */

/**
 * @route POST /api/v1/products
 * Admin only. Accepts up to MAX_IMAGES_PER_PRODUCT 'images' files (multipart),
 * plus matching 'imageTypes' / 'imageSortOrders' arrays sent by the admin form.
 */
const createProduct = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    throw ApiError.badRequest('Invalid category');
  }

  const sku = await generateSku(categoryCodeFromName(category.name));

  const payload = {
    ...pickFields(req.body, ADMIN_WRITABLE_FIELDS),
    sku,
    createdBy: req.user._id,
  };

  if (payload.tags !== undefined) {
    payload.tags = parseJsonField(payload.tags, 'tags');
  }

  if (payload.dimensions !== undefined) {
    payload.dimensions = parseJsonField(payload.dimensions, 'dimensions');
  }

  if (payload.price !== undefined) {
    assertComparePriceValid(payload.price, payload.comparePrice);
  }

  // Variants arrive as a JSON string (multipart upload) — parse then generate SKUs.
  let variants = req.body.variants;

  if (variants !== undefined) {
    variants = parseJsonField(variants, 'variants');

    if (Array.isArray(variants) && variants.length) {
      payload.variants = await Promise.all(
        variants.map(async (variant) => {
          const clean = pickFields(variant, VARIANT_WRITABLE_FIELDS);

          return {
            ...clean,
            sku: clean.sku?.trim()
              ? clean.sku.trim()
              : await generateSku(categoryCodeFromName('VAR')),
          };
        })
      );

      payload.hasVariants = true;
    }
  }

  if (req.files?.length) {
    if (req.files.length > MAX_IMAGES_PER_PRODUCT) {
      throw ApiError.badRequest(
        `Maximum ${MAX_IMAGES_PER_PRODUCT} images per product`
      );
    }

    const imageTypes = [].concat(req.body.imageTypes || []);
    const imageSortOrders = [].concat(req.body.imageSortOrders || []);

    const uploads = await Promise.all(
      req.files.map((file) =>
        uploadBufferToCloudinary(file.buffer, 'products')
      )
    );

    payload.images = uploads.map((u, idx) => ({
      url: u.url,
      publicId: u.publicId,
      type: imageTypes[idx] || (idx === 0 ? 'primary' : 'gallery'),
      sortOrder:
        imageSortOrders[idx] !== undefined
          ? Number(imageSortOrders[idx])
          : idx,
    }));
  }

  const product = await Product.create(payload);

  return sendSuccess(res, 201, 'Product created successfully', { product });
});

/* -------------------------------------------------------------------------- */
/*                            PRODUCT FILTERS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Builds a Mongoose filter object from shop/query params.
 */
const buildProductFilter = (query) => {
  const {
    category,
    subCategory,
    minPrice,
    maxPrice,
    material,
    color,
    handmade,
    ecoFriendly,
    madeInIndia,
    tribalArtisan,
    bestSeller,
    trending,
    limitedEdition,
    newArrival,
    festival,
    availability,
    minRating,
    status,
    q,
  } = query;

  const filter = {
    deletedAt: null,
  };

  if (!status) {
    filter.status = 'published'; // public shop default
  } else if (status !== 'all') {
    filter.status = status;
  }

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;

  if (material) {
    filter.material = new RegExp(escapeRegex(material), 'i');
  }

  if (color) {
    filter.color = new RegExp(escapeRegex(color), 'i');
  }

  if (handmade === 'true') filter.isHandmade = true;
  if (ecoFriendly === 'true') filter.isEcoFriendly = true;
  if (madeInIndia === 'true') filter.isMadeInIndia = true;
  if (tribalArtisan === 'true') filter.isTribalArtisanProduct = true;
  if (bestSeller === 'true') filter.isBestSeller = true;
  if (trending === 'true') filter.isTrending = true;
  if (limitedEdition === 'true') filter.isLimitedEdition = true;
  if (newArrival === 'true') filter.isNewArrival = true;
  if (festival === 'true') filter.isFestivalProduct = true;

  if (minRating) {
    filter.ratingsAverage = {
      $gte: Number(minRating),
    };
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  if (availability === 'in_stock') {
    filter.stockQuantity = {
      $gt: 0,
    };
  }

  if (availability === 'out_of_stock') {
    filter.stockQuantity = {
      $lte: 0,
    };
  }

  // Normal MongoDB text search.
  if (q) {
    filter.$text = {
      $search: q,
    };
  }

  return filter;
};

const SORT_MAP = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  price_low: { price: 1 },
  price_high: { price: -1 },
  rating: { ratingsAverage: -1 },
  popularity: { ratingsCount: -1 },
  discount: { comparePrice: -1 },
  featured: {
    isFeatured: -1,
    createdAt: -1,
  },
};

/* -------------------------------------------------------------------------- */
/*                              GET PRODUCTS                                  */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /api/v1/products
 * Public shop listing with filters, search, sort, pagination.
 */
const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(
    1,
    parseInt(req.query.page, 10) || 1
  );

  const limit = Math.min(
    100,
    parseInt(req.query.limit, 10) || 20
  );

  const skip = (page - 1) * limit;

  const sort =
    SORT_MAP[req.query.sort] || SORT_MAP.newest;

  /* ---------------------------------------------------------------------- */
  /* STEP 1: Normal search                                                  */
  /* ---------------------------------------------------------------------- */

  let filter = buildProductFilter(req.query);

  let [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  /* ---------------------------------------------------------------------- */
  /* STEP 2: Typo-tolerant fallback                                         */
  /* ---------------------------------------------------------------------- */

  if (req.query.q && total === 0) {
    const originalQuery = req.query.q.trim();

    const correctedQuery = await correctSearchQuery(
      originalQuery,
      filter
    );

    // Only perform the second database search if the query was actually
    // changed by the typo-correction system.
    if (
      correctedQuery &&
      correctedQuery.toLowerCase() !== originalQuery.toLowerCase()
    ) {
      const correctedRequest = {
        ...req.query,
        q: correctedQuery,
        page: 1,
      };

      filter = buildProductFilter(correctedRequest);

      [products, total] = await Promise.all([
        Product.find(filter)
          .populate('category', 'name slug')
          .sort(sort)
          .skip(skip)
          .limit(limit),

        Product.countDocuments(filter),
      ]);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* STEP 3: Send response                                                  */
  /* ---------------------------------------------------------------------- */

  return sendSuccess(
    res,
    200,
    'Products fetched',
    {
      products,
    },
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  );
});

/* -------------------------------------------------------------------------- */
/*                         GET PRODUCT BY SLUG                                */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /api/v1/products/:slug
 * Public product detail page.
 */
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    deletedAt: null,
  })
    .populate('category', 'name slug')
    .populate('subCategory', 'name slug')
    .populate('artisan', 'name village state story photo')
    .populate(
      'relatedProducts',
      'name slug images price comparePrice ratingsAverage'
    );

  if (
    !product ||
    (product.status !== 'published' && req.user?.role !== 'admin')
  ) {
    throw ApiError.notFound('Product not found');
  }

  return sendSuccess(res, 200, 'Product fetched', {
    product,
  });
});

/* -------------------------------------------------------------------------- */
/*                         RELATED PRODUCTS                                   */
/* -------------------------------------------------------------------------- */

/**
 * @route GET /api/v1/products/:slug/related
 * Rule-based related products: same category, overlapping tags, best sellers.
 */
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  const related = await Product.find({
    _id: {
      $ne: product._id,
    },
    status: 'published',
    deletedAt: null,
    $or: [
      {
        category: product.category,
      },
      {
        tags: {
          $in: product.tags,
        },
      },
    ],
  })
    .limit(8)
    .select(
      'name slug images price comparePrice ratingsAverage isBestSeller'
    );

  return sendSuccess(res, 200, 'Related products fetched', {
    products: related,
  });
});

/* -------------------------------------------------------------------------- */
/*                              UPDATE PRODUCT                                */
/* -------------------------------------------------------------------------- */

/**
 * @route PUT /api/v1/products/:id
 * Admin only.
 *
 * Image handling: the admin dashboard sends 4 fixed slots. On every edit it
 * sends `existingImages` — a JSON array of { _id, type, sortOrder } for the
 * images it wants to KEEP — plus any new files in `images` (with matching
 * `imageTypes` / `imageSortOrders`). Anything currently on the product that
 * is NOT listed in `existingImages` is deleted from Cloudinary and dropped.
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // If category is changing, make sure the new one actually exists.
  if (
    req.body.category &&
    String(req.body.category) !== String(product.category)
  ) {
    const category = await Category.findById(req.body.category);

    if (!category) {
      throw ApiError.badRequest('Invalid category');
    }
  }

  const updates = pickFields(
    req.body,
    ADMIN_WRITABLE_FIELDS
  );

  if (updates.tags !== undefined) {
    updates.tags = parseJsonField(updates.tags, 'tags');
  }

  if (updates.dimensions !== undefined) {
    updates.dimensions = parseJsonField(
      updates.dimensions,
      'dimensions'
    );
  }

  const nextPrice =
    updates.price !== undefined
      ? updates.price
      : product.price;

  const nextComparePrice =
    updates.comparePrice !== undefined
      ? updates.comparePrice
      : product.comparePrice;

  assertComparePriceValid(
    nextPrice,
    nextComparePrice
  );

  // Stock changed here directly (not via bulk endpoint) — still can't drop below reserved.
  if (
    updates.stockQuantity !== undefined &&
    Number(updates.stockQuantity) < product.reservedStock
  ) {
    throw ApiError.badRequest(
      `Stock quantity cannot be less than ${product.reservedStock} units currently reserved by pending orders`
    );
  }

  const wasOutOfStock =
    product.stockQuantity - product.reservedStock <= 0;

  if (req.body.variants !== undefined) {
    const parsedVariants = parseJsonField(
      req.body.variants,
      'variants'
    );

    if (Array.isArray(parsedVariants)) {
      // FIX: a variant that already has orders reserved against it (i.e.
      // its live `stock` field reflects reservations subtracted out — see
      // Product.reserveStock, which decrements variants.$.stock directly)
      // could previously be overwritten wholesale from the admin form,
      // including stomping a stock value that had pending reservations
      // baked into it via a stale form snapshot. We don't have a separate
      // "reserved" counter per variant (reservations are subtracted
      // directly from variant.stock), so the safest guard here is: never
      // let an edit silently reintroduce a HIGHER stock number than what's
      // live if the admin's form was loaded before a sale happened —
      // that's a business-process concern (re-fetch before editing), not
      // something we can fully solve server-side without a variant-level
      // reserved counter. What we CAN and DO guard here: never allow
      // negative stock through this path, regardless of client input.
      updates.variants = await Promise.all(
        parsedVariants.map(async (variant) => {
          const clean = pickFields(
            variant,
            VARIANT_WRITABLE_FIELDS
          );

          if (clean.stock !== undefined && Number(clean.stock) < 0) {
            throw ApiError.badRequest('Variant stock cannot be negative');
          }

          return {
            ...clean,
            sku: clean.sku?.trim()
              ? clean.sku.trim()
              : await generateSku(
                  categoryCodeFromName('VAR')
                ),
          };
        })
      );

      updates.hasVariants =
        updates.variants.length > 0;
    }
  }

  // Pull image-related fields off req.body — handled separately below.
  const existingImagesRaw =
    req.body.existingImages;

  const imageTypes = [].concat(
    req.body.imageTypes || []
  );

  const imageSortOrders = [].concat(
    req.body.imageSortOrders || []
  );

  Object.assign(product, updates, {
    updatedBy: req.user._id,
  });

  // Only touch images if the client actually sent slot state.
  if (
    existingImagesRaw !== undefined ||
    req.files?.length
  ) {
    const existingImages =
      existingImagesRaw !== undefined
        ? parseJsonField(
            existingImagesRaw,
            'existingImages'
          )
        : [];

    const newFileCount =
      req.files?.length || 0;

    if (
      (existingImages?.length || 0) +
        newFileCount >
      MAX_IMAGES_PER_PRODUCT
    ) {
      throw ApiError.badRequest(
        `Maximum ${MAX_IMAGES_PER_PRODUCT} images per product`
      );
    }

    const keptIds = new Set(
      (existingImages || []).map((i) =>
        String(i._id)
      )
    );

    const toDelete = product.images.filter(
      (img) =>
        !keptIds.has(String(img._id))
    );

    await Promise.all(
      toDelete.map((img) =>
        deleteFromCloudinary(
          img.publicId
        ).catch(() => {})
      )
    );

    const keptImages = (existingImages || [])
      .map((entry) => {
        const original =
          product.images.id(entry._id);

        if (!original) {
          return null;
        }

        return {
          url: original.url,
          publicId: original.publicId,
          altText: original.altText,
          type: entry.type || original.type,
          sortOrder: entry.sortOrder,
        };
      })
      .filter(Boolean);

    let newImages = [];

    if (newFileCount) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          uploadBufferToCloudinary(
            file.buffer,
            'products'
          )
        )
      );

      newImages = uploads.map((u, idx) => ({
        url: u.url,
        publicId: u.publicId,
        type:
          imageTypes[idx] || 'gallery',
        sortOrder:
          imageSortOrders[idx] !== undefined
            ? Number(imageSortOrders[idx])
            : keptImages.length + idx,
      }));
    }

    product.images = [
      ...keptImages,
      ...newImages,
    ].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
  }

  await product.save();

  if (
    wasOutOfStock &&
    product.stockQuantity -
      product.reservedStock >
      0
  ) {
    const {
      triggerStockAlerts,
    } = require('./engagementController');

    triggerStockAlerts(product._id).catch(
      () => {}
    );
  }

  return sendSuccess(
    res,
    200,
    'Product updated successfully',
    {
      product,
    }
  );
});

/* -------------------------------------------------------------------------- */
/*                         DELETE PRODUCT IMAGE                               */
/* -------------------------------------------------------------------------- */

/**
 * @route DELETE /api/v1/products/:id/images/:imageId
 * Admin only. Removes a single image from a product's gallery.
 */
const deleteProductImage = asyncHandler(
  async (req, res) => {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      throw ApiError.notFound(
        'Product not found'
      );
    }

    const image = product.images.id(
      req.params.imageId
    );

    if (!image) {
      throw ApiError.notFound(
        'Image not found'
      );
    }

    await deleteFromCloudinary(
      image.publicId
    ).catch(() => {});

    image.deleteOne();

    await product.save();

    return sendSuccess(
      res,
      200,
      'Image removed successfully',
      {
        product,
      }
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                            DELETE PRODUCT                                  */
/* -------------------------------------------------------------------------- */

/**
 * @route DELETE /api/v1/products/:id
 * Admin only. Soft delete.
 */
const deleteProduct = asyncHandler(
  async (req, res) => {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      throw ApiError.notFound(
        'Product not found'
      );
    }

    // FIX: previously a product could be soft-deleted while it still had
    // units reserved against pending/unfulfilled orders — archiving it
    // hides it from the shop and admin listings by default, but the
    // reservation would sit there indefinitely with the customer's order
    // now pointing at an archived product. Block the delete instead and
    // tell the admin why.
    if (product.reservedStock > 0) {
      throw ApiError.conflict(
        `This product has ${product.reservedStock} unit(s) reserved by pending orders and cannot be deleted until those orders are fulfilled or cancelled.`
      );
    }

    product.deletedAt = new Date();
    product.status = 'archived';

    await product.save();

    return sendSuccess(
      res,
      200,
      'Product deleted successfully'
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                           DUPLICATE PRODUCT                                */
/* -------------------------------------------------------------------------- */

/**
 * @route POST /api/v1/products/:id/duplicate
 * Admin only.
 */
const duplicateProduct = asyncHandler(
  async (req, res) => {
    const original =
      await Product.findById(
        req.params.id
      ).lean();

    if (!original) {
      throw ApiError.notFound(
        'Product not found'
      );
    }

    const {
      _id,
      slug,
      sku,
      qrSerialNumber,
      createdAt,
      updatedAt,
      ratingsAverage,
      ratingsCount,
      reservedStock,
      images,
      variants,
      ...rest
    } = original;

    const category =
      await Category.findById(
        rest.category
      );

    const newSku =
      await generateSku(
        categoryCodeFromName(
          category?.name || 'GEN'
        )
      );

    // Regenerate variant SKUs (globally unique index) and drop their old _ids.
    // FIX: a duplicated variant must not carry over the original's live
    // `stock` — that stock is physically tied to the original product's
    // units, not a second set of inventory that now exists for the copy.
    // Duplicates start at 0 stock, same as the original's top-level
    // stockQuantity intentionally starting at 0 below.
    const newVariants =
      variants?.length
        ? await Promise.all(
            variants.map(
              async ({
                _id,
                sku: variantSku,
                stock,
                ...variantRest
              }) => ({
                ...variantRest,
                stock: 0,
                sku: await generateSku(
                  categoryCodeFromName(
                    'VAR'
                  )
                ),
              })
            )
          )
        : [];

    const duplicate =
      await Product.create({
        ...rest,
        name: `${rest.name} (Copy)`,
        sku: newSku,
        status: 'draft',
        stockQuantity: 0,
        ratingsAverage: 0,
        ratingsCount: 0,
        reservedStock: 0,

        // Images live on the original product's Cloudinary assets — copying the
        // references would mean deleting an image on either copy deletes it for
        // both. The admin re-uploads images for the duplicate instead.
        images: [],

        variants: newVariants,

        createdBy: req.user._id,
      });

    return sendSuccess(
      res,
      201,
      'Product duplicated successfully',
      {
        product: duplicate,
      }
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                              ADD VARIANT                                   */
/* -------------------------------------------------------------------------- */

/**
 * @route POST /api/v1/products/:id/variants
 * Admin only.
 */
const addVariant = asyncHandler(
  async (req, res) => {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      throw ApiError.notFound(
        'Product not found'
      );
    }

    const clean = pickFields(
      req.body,
      VARIANT_WRITABLE_FIELDS
    );

    const sku = clean.sku?.trim()
      ? clean.sku.trim()
      : await generateSku(
          categoryCodeFromName('VAR')
        );

    product.variants.push({
      ...clean,
      sku,
    });

    product.hasVariants = true;

    await product.save();

    return sendSuccess(
      res,
      201,
      'Variant added successfully',
      {
        product,
      }
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                            UPDATE VARIANT                                  */
/* -------------------------------------------------------------------------- */

/**
 * @route PUT /api/v1/products/:id/variants/:variantId
 * Admin only.
 */
const updateVariant = asyncHandler(
  async (req, res) => {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      throw ApiError.notFound(
        'Product not found'
      );
    }

    const variant =
      product.variants.id(
        req.params.variantId
      );

    if (!variant) {
      throw ApiError.notFound(
        'Variant not found'
      );
    }

    const clean = pickFields(
      req.body,
      VARIANT_WRITABLE_FIELDS
    );

    if (clean.stock !== undefined && Number(clean.stock) < 0) {
      throw ApiError.badRequest('Variant stock cannot be negative');
    }

    Object.assign(
      variant,
      clean
    );

    await product.save();

    return sendSuccess(
      res,
      200,
      'Variant updated successfully',
      {
        product,
      }
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                            DELETE VARIANT                                  */
/* -------------------------------------------------------------------------- */

/**
 * @route DELETE /api/v1/products/:id/variants/:variantId
 * Admin only.
 */
const deleteVariant = asyncHandler(
  async (req, res) => {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      throw ApiError.notFound(
        'Product not found'
      );
    }

    const variant =
      product.variants.id(
        req.params.variantId
      );

    if (!variant) {
      throw ApiError.notFound(
        'Variant not found'
      );
    }

    variant.deleteOne();

    product.hasVariants =
      product.variants.length > 0;

    await product.save();

    return sendSuccess(
      res,
      200,
      'Variant deleted successfully',
      {
        product,
      }
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                         BULK STOCK UPDATE                                 */
/* -------------------------------------------------------------------------- */

/**
 * @route PATCH /api/v1/products/bulk/stock
 * Admin only. Body: { updates: [{ productId, stockQuantity }] }
 *
 * FIX: previously this read the product's reservedStock via findById, then
 * — in a completely separate operation — wrote the new stockQuantity via
 * findByIdAndUpdate. Between those two calls, a customer's checkout could
 * reserve additional stock, and this write would go through anyway using
 * the now-stale reservedStock value it checked against — potentially
 * setting stockQuantity below what's actually reserved. Now routed through
 * Product.setStockQuantitySafe, which performs the check-and-write as one
 * atomic operation.
 */
const bulkUpdateStock = asyncHandler(
  async (req, res) => {
    const { updates } = req.body;

    if (
      !Array.isArray(updates) ||
      !updates.length
    ) {
      throw ApiError.badRequest(
        'updates is required'
      );
    }

    const {
      triggerStockAlerts,
    } = require('./engagementController');

    const results = await Promise.all(
      updates.map(
        async ({
          productId,
          stockQuantity,
        }) => {
          const qty =
            Number(stockQuantity);

          if (
            !Number.isFinite(qty) ||
            qty < 0
          ) {
            return {
              productId,
              updated: false,
              reason:
                'Invalid stock quantity',
            };
          }

          const before =
            await Product.findById(
              productId
            ).select(
              'stockQuantity reservedStock'
            );

          if (!before) {
            return {
              productId,
              updated: false,
              reason:
                'Product not found',
            };
          }

          const updated =
            await Product.setStockQuantitySafe(
              productId,
              qty
            );

          if (!updated) {
            const current =
              await Product.findById(
                productId
              ).select('reservedStock');

            return {
              productId,
              updated: false,
              reason: `Below reserved stock (${current?.reservedStock ?? '?'} reserved)`,
            };
          }

          const wasOutOfStock =
            before.stockQuantity -
              before.reservedStock <=
            0;

          const nowInStock =
            qty -
              updated.reservedStock >
            0;

          if (
            wasOutOfStock &&
            nowInStock
          ) {
            triggerStockAlerts(
              productId
            ).catch(() => {});
          }

          return {
            productId,
            updated: true,
          };
        }
      )
    );

    const failed =
      results.filter(
        (r) => !r.updated
      );

    return sendSuccess(
      res,
      200,
      `Stock updated for ${
        results.length -
        failed.length
      }/${results.length} product(s)`,
      {
        failed,
      }
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                         BULK PRICE UPDATE                                 */
/* -------------------------------------------------------------------------- */

/**
 * @route PATCH /api/v1/products/bulk/price
 * Admin only. Either sets an absolute price or applies a percentage change.
 */
const bulkUpdatePrice = asyncHandler(
  async (req, res) => {
    const {
      productIds,
      price,
      percentageChange,
    } = req.body;

    if (
      !Array.isArray(productIds) ||
      !productIds.length
    ) {
      throw ApiError.badRequest(
        'productIds is required'
      );
    }

    if (price !== undefined) {
      if (Number(price) < 0) {
        throw ApiError.badRequest(
          'Price cannot be negative'
        );
      }

      await Product.updateMany(
        {
          _id: {
            $in: productIds,
          },
        },
        {
          price,
        },
        {
          runValidators: true,
        }
      );
    } else if (
      percentageChange !==
      undefined
    ) {
      const products =
        await Product.find({
          _id: {
            $in: productIds,
          },
        }).select('price');

      await Promise.all(
        products.map((p) => {
          const newPrice =
            Math.max(
              0,
              Math.round(
                p.price *
                  (1 +
                    percentageChange /
                      100)
              )
            );

          return Product.findByIdAndUpdate(
            p._id,
            {
              price: newPrice,
            },
            {
              runValidators: true,
            }
          );
        })
      );
    } else {
      throw ApiError.badRequest(
        'Provide either price or percentageChange'
      );
    }

    return sendSuccess(
      res,
      200,
      `Price updated for ${productIds.length} product(s)`
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                         BULK STATUS UPDATE                                */
/* -------------------------------------------------------------------------- */

/**
 * @route PATCH /api/v1/products/bulk/status
 * Admin only. Body: { productIds, status }
 */
const bulkUpdateStatus = asyncHandler(
  async (req, res) => {
    const {
      productIds,
      status,
    } = req.body;

    if (
      !Array.isArray(productIds) ||
      !productIds.length
    ) {
      throw ApiError.badRequest(
        'productIds is required'
      );
    }

    if (
      ![
        'published',
        'draft',
        'hidden',
        'archived',
      ].includes(status)
    ) {
      throw ApiError.badRequest(
        'Invalid status'
      );
    }

    await Product.updateMany(
      {
        _id: {
          $in: productIds,
        },
      },
      {
        status,
      }
    );

    return sendSuccess(
      res,
      200,
      `${productIds.length} product(s) updated to "${status}"`
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                         BULK DELETE PRODUCTS                              */
/* -------------------------------------------------------------------------- */

/**
 * @route DELETE /api/v1/products/bulk
 * Admin only. Soft-deletes multiple products. Body: { productIds }
 *
 * FIX: same reservedStock guard as the single-product delete — silently
 * bulk-archiving products that still have pending-order stock reserved
 * against them would orphan those orders' fulfillment.
 */
const bulkDeleteProducts = asyncHandler(
  async (req, res) => {
    const { productIds } = req.body;

    if (
      !Array.isArray(productIds) ||
      !productIds.length
    ) {
      throw ApiError.badRequest(
        'productIds is required'
      );
    }

    const blocked = await Product.find({
      _id: { $in: productIds },
      reservedStock: { $gt: 0 },
    }).select('name reservedStock');

    const blockedIds = blocked.map((p) => String(p._id));
    const deletableIds = productIds.filter((id) => !blockedIds.includes(String(id)));

    if (deletableIds.length) {
      await Product.updateMany(
        {
          _id: {
            $in: deletableIds,
          },
        },
        {
          deletedAt: new Date(),
          status: 'archived',
        }
      );
    }

    const message = blocked.length
      ? `${deletableIds.length} product(s) deleted. ${blocked.length} skipped (still have units reserved by pending orders): ${blocked.map((p) => p.name).join(', ')}.`
      : `${deletableIds.length} product(s) deleted`;

    return sendSuccess(
      res,
      200,
      message,
      { skipped: blocked.map((p) => ({ id: p._id, name: p.name, reservedStock: p.reservedStock })) }
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                                EXPORTS                                     */
/* -------------------------------------------------------------------------- */

module.exports = {
  createProduct,
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  updateProduct,
  deleteProductImage,
  deleteProduct,
  duplicateProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  bulkUpdateStock,
  bulkUpdatePrice,
  bulkUpdateStatus,
  bulkDeleteProducts,
};