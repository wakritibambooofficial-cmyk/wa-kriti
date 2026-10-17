const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true }, // e.g. 'product.create', 'coupon.delete', 'order.status_update'
    module: { type: String, required: true }, // e.g. 'products', 'orders', 'coupons'
    targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
    description: { type: String, default: '' },
    ip: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ module: 1, action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
