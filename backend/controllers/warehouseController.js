const { Warehouse, Inventory, InventoryLog } = require('../models/Warehouse');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { triggerStockAlerts } = require('./engagementController');

/**
 * @route POST /api/v1/admin/warehouses
 */
const createWarehouse = asyncHandler(async (req, res) => {
  if (req.body.isPrimary) {
    await Warehouse.updateMany({}, { isPrimary: false });
  }
  const warehouse = await Warehouse.create(req.body);
  return sendSuccess(res, 201, 'Warehouse created successfully', { warehouse });
});

/**
 * @route GET /api/v1/admin/warehouses
 */
const getWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find().sort({ isPrimary: -1, name: 1 });
  return sendSuccess(res, 200, 'Warehouses fetched', { warehouses });
});

/**
 * @route PUT /api/v1/admin/warehouses/:id
 */
const updateWarehouse = asyncHandler(async (req, res) => {
  if (req.body.isPrimary) {
    await Warehouse.updateMany({ _id: { $ne: req.params.id } }, { isPrimary: false });
  }
  const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!warehouse) throw ApiError.notFound('Warehouse not found');
  return sendSuccess(res, 200, 'Warehouse updated successfully', { warehouse });
});

/**
 * @route DELETE /api/v1/admin/warehouses/:id
 */
const deleteWarehouse = asyncHandler(async (req, res) => {
  const hasInventory = await Inventory.exists({ warehouse: req.params.id, quantity: { $gt: 0 } });
  if (hasInventory) throw ApiError.conflict('Cannot delete a warehouse that still holds stock');

  const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
  if (!warehouse) throw ApiError.notFound('Warehouse not found');
  return sendSuccess(res, 200, 'Warehouse deleted successfully');
});

/**
 * @route GET /api/v1/admin/warehouses/inventory/:productId
 * Returns stock distribution for a product across all warehouses.
 */
const getProductInventory = asyncHandler(async (req, res) => {
  const records = await Inventory.find({ product: req.params.productId }).populate('warehouse', 'name code');
  const totalQuantity = records.reduce((sum, r) => sum + r.quantity, 0);
  return sendSuccess(res, 200, 'Inventory fetched', { records, totalQuantity });
});

/**
 * @route POST /api/v1/admin/warehouses/inventory/adjust
 * Body: { productId, variantId, warehouseId, quantityChange, changeType, note }
 * Adjusts stock in a specific warehouse and logs the movement. Also keeps
 * the product's aggregate stockQuantity in sync across all warehouses.
 */
const adjustInventory = asyncHandler(async (req, res) => {
  const { productId, variantId = null, warehouseId, quantityChange, changeType = 'adjustment', note = '' } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  const warehouse = await Warehouse.findById(warehouseId);
  if (!warehouse) throw ApiError.notFound('Warehouse not found');

  let inventory = await Inventory.findOne({ product: productId, variantId, warehouse: warehouseId });
  if (!inventory) {
    inventory = await Inventory.create({ product: productId, variantId, warehouse: warehouseId, quantity: 0 });
  }

  const newQuantity = inventory.quantity + quantityChange;
  if (newQuantity < 0) throw ApiError.badRequest('Resulting stock cannot be negative');

  const wasOutOfStock = inventory.quantity <= 0;
  inventory.quantity = newQuantity;
  await inventory.save();

  await InventoryLog.create({
    product: productId,
    warehouse: warehouseId,
    changeType,
    quantityChange,
    quantityAfter: newQuantity,
    note,
    performedBy: req.user._id,
  });

  // Keep the product's aggregate stockQuantity (used by the shop/cart flows)
  // in sync with the sum across all warehouses.
  const aggregate = await Inventory.aggregate([
    { $match: { product: product._id, variantId: variantId || null } },
    { $group: { _id: null, total: { $sum: '$quantity' } } },
  ]);
  product.stockQuantity = aggregate[0]?.total || 0;
  product.isMultiWarehouseTracked = true;
  await product.save();

  if (wasOutOfStock && newQuantity > 0) {
    await triggerStockAlerts(productId, variantId);
  }

  return sendSuccess(res, 200, 'Inventory adjusted successfully', { inventory, productStockQuantity: product.stockQuantity });
});

/**
 * @route GET /api/v1/admin/warehouses/logs/:productId
 */
const getInventoryLogs = asyncHandler(async (req, res) => {
  const logs = await InventoryLog.find({ product: req.params.productId })
    .populate('warehouse', 'name code')
    .populate('performedBy', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(100);

  return sendSuccess(res, 200, 'Inventory logs fetched', { logs });
});

module.exports = {
  createWarehouse,
  getWarehouses,
  updateWarehouse,
  deleteWarehouse,
  getProductInventory,
  adjustInventory,
  getInventoryLogs,
};
